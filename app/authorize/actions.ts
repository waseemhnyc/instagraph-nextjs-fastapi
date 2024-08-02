'use server'

import { signIn } from '@/auth'
import { User } from '@/lib/types'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { kv } from '@vercel/kv'
import { ResultCode, getStringFromBuffer } from '@/lib/utils'
import { signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

interface AuthenticateParams {
  email: string
  password: string
  status: boolean
  session_key: string
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function signOutUser() {
  const baseUrl = process.env.MY_RAILS_APP_URL
  const url = `${baseUrl}/`

  await signOut({ redirect: false })
  await cookies().set('session_key', '')
  redirect(url)  
}

export async function getUser(email: string) {
  const user = await kv.hgetall<User>(`user:${email}`)
  return user
}

export async function createUser(
  email: string,
  hashedPassword: string,
  salt: string,
  status: boolean,
  session_keys: string[]
) {
  const existingUser = await getUser(email)

  if (existingUser) {
    return {
      type: 'error',
      resultCode: ResultCode.UserAlreadyExists
    }
  } else {
    const user = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      salt,
      status,
      session_keys,
      status_checked_timestamp: new Date()
    }

    await kv.hmset(`user:${email}`, user)

    return { type: 'success', resultCode: ResultCode.UserCreated}
  }
}

export async function authenticate(
  _prevState: Result | undefined,
  { email, password, status, session_key }: AuthenticateParams
): Promise<Result | undefined> {
  const parsedCredentials = z
    .object({ email: z.string().email(), password: z.string().min(6) }).safeParse({ email, password })
    
  if (!parsedCredentials.success) { return { type: 'error', resultCode: ResultCode.InvalidCredentials } }

  try {
    await signIn('credentials', {
      redirect: false,
      email: parsedCredentials.data.email,
      password: parsedCredentials.data.password
    })
    const existingUser = await getUser(email)

    if (existingUser) {
      existingUser.session_keys.push(session_key);

      const updatedField = {
        status: status,
        session_keys: existingUser.session_keys,
        status_checked_timestamp: new Date()
      }

      await kv.hmset(`user:${email}`, updatedField)
      await cookies().set('session_key', session_key)

      return { type: 'success', resultCode: ResultCode.UserLoggedIn}
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { type: 'error', resultCode: ResultCode.InvalidCredentials }
        default:
          return { type: 'error', resultCode: ResultCode.UnknownError}
      }
    }
  }
}

export async function signup(
_prevState: Result | undefined,
  { email, password, status, session_key }: AuthenticateParams
): Promise<Result | undefined> {

  const parsedCredentials = z
    .object({ email: z.string().email(), password: z.string().min(6) }).safeParse({ email, password })

  if (!parsedCredentials.success) { return { type: 'error', resultCode: ResultCode.InvalidCredentials } }

  const salt = crypto.randomUUID()
  const encoder = new TextEncoder()
  const saltedPassword = encoder.encode(password + salt)
  const hashedPasswordBuffer = await crypto.subtle.digest('SHA-256', saltedPassword)
  const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

  try {
    const result = await createUser(email, hashedPassword, salt, status, [session_key])
    if (result.resultCode === ResultCode.UserCreated) {
      await signIn('credentials', { email, password, redirect: false })
      await cookies().set('session_key', session_key)
    }

    return result
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { type: 'error', resultCode: ResultCode.InvalidCredentials }
        default:
          return { type: 'error', resultCode: ResultCode.UnknownError }
      }
    } else { return {  type: 'error', resultCode: ResultCode.UnknownError } }
  }
}
