import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUser } from '@/app/authorize/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { kv } from '@vercel/kv'
import { cookies } from 'next/headers'
import { ResultCode } from '@/lib/utils'

export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}

export async function middleware(request: NextRequest) {
  const session = (await auth()) as Session
  const currentSessionKeyInCookies = cookies().get('session_key')?.value

  if (shouldCheckUserStatus(request, session, currentSessionKeyInCookies)){
    const currentUser = await getUser(session.user.email)

    if (!currentUser){
      return new NextResponse(ResultCode.NotAuthorized, { status: 401 })
    }

    try {
      const externalServiceUrl = `${process.env.MY_RAILS_APP_URL}/chat/check_user_status?email=${currentUser.email}&session_key=${currentSessionKeyInCookies}`

      const response = await fetch(externalServiceUrl)

      const data = await response.json()
      const isValidCookies = currentUser.session_keys.includes(currentSessionKeyInCookies)

      await updateUserStatus(currentUser.email, data.status)

      if(isInvalidUserStatus(data.status, isValidCookies)) {
        return redirectToLogOut(request)
      }

      return NextResponse.next()
    } catch (error) {
      console.error('Error fetching external data:', error)
      return new NextResponse(ResultCode.InternalServerError, { status: 500 })
    }
  }
}

function shouldCheckUserStatus(request: NextRequest, session: Session, sessionKey: string | undefined): boolean {
  return (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/chat')) &&
         session?.user &&
         sessionKey !== undefined
}

async function updateUserStatus(email: string, status: boolean) {
  const userStatus = {
    status: status,
    status_checked_timestamp: new Date()
  };

  await kv.hmset(`user:${email}`, userStatus)
}

function isInvalidUserStatus(status: boolean, isValidCookies: boolean): boolean {
  return !status || !isValidCookies
}

function redirectToLogOut(request: NextRequest): NextResponse {
  const url = new URL('/authorize', request.nextUrl.origin)
  url.searchParams.set('action', 'log_out')
  return NextResponse.redirect(url)
}
