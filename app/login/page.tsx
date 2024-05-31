import { auth } from '@/auth'
import LoginForm from '@/components/login-form'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = (await auth()) as Session

  console.log('session', session)
  // if (session) {
  //   redirect('/')
  // }

  return (
    <main className="flex flex-col p-4">
      <LoginForm />
    </main>
  )
}
