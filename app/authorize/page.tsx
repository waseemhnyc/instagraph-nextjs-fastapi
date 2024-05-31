"use client"

import { authenticate } from '@/app/authorize/actions'
import { signup } from '@/app/authorize/actions'
import { getUser } from '@/app/login/actions'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { signOutUser } from '@/app/authorize/actions'

interface JwtPayload {
  email: string,
  password: string,
  status: boolean,
  session_key: string,
  action: string
}

export default function AuthorizePage() {
  const searchParams = useSearchParams();  
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token');
    const action = searchParams.get('action');
    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY

    if (token && secretKey) {
      handleToken(token, secretKey, router);
    } else if (action === 'log_out') {
      handleLogout();
    }
  }, [router, searchParams])

async function checkUser(email: string) {
  const user = await getUser(email)
  return user
}
}

const handleToken = async (token: string, secretKey: string, router: any) => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload

    if (decoded.email && decoded.password && decoded.status && decoded.session_key) {
      const user = await getUser(decoded.email)

      if (user) {
        await authenticate(undefined, { email: decoded.email, password: decoded.password, status: decoded.status, session_key: decoded.session_key })
      } else {
        await signup(undefined, { email: decoded.email, password: decoded.password, status: decoded.status, session_key: decoded.session_key })
      }

      router.push('/')
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    toast.error('Invalid token')
  }
}

const handleLogout = async () => {
  try {
    await signOutUser();
  } catch (error) {
    console.error('Error during logout:', error)
    toast.error('Invalid action')
  }
}
