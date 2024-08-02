'use server'

import { NextResponse, NextRequest } from 'next/server'
import { getUser } from '@/app/login/actions'
import { kv } from '@vercel/kv'
import { ResultCode } from '@/lib/utils'

export async function GET(req: NextRequest) {
    const userEmail = req.nextUrl.searchParams.get('email')
    const userSessionKey = req.nextUrl.searchParams.get('session_key')
    
    if (userEmail && userSessionKey) {
        const existingUser = await getUser(userEmail)

        if (existingUser) {
            const allSessionKeys = filterSessionKeys(existingUser.session_keys, userSessionKey);

            await updateUserStatus(existingUser.email, allSessionKeys)
        }
    } 

    if (req.method === 'GET') {
        return NextResponse.json({ success: true })
    } else {
        return new NextResponse(ResultCode.NotAuthorized, { status: 401 })
    }
}

function filterSessionKeys(sessionKeys: string[] | undefined, sessionKeyToRemove: string): string[] {
    return sessionKeys ? sessionKeys.filter((key) => key !== sessionKeyToRemove) : [];
}

async function updateUserStatus(email: string, sessions: string[]) {
    const userStatusAndSessionKeys = {
      status: false,
      session_keys: sessions,
      status_checked_timestamp: new Date()
    }
  
    await kv.hmset(`user:${email}`, userStatusAndSessionKeys)
  }
