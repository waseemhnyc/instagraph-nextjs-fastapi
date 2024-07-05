'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { Chat, Session, User } from '../lib/types'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

async function getSession(): Promise<Session | null> {
  try {
    return await auth() as Session
  } catch {
    return null
  }
}

export async function getChatsHistory() {
  const session = await getSession()
  if (!session?.user?.id) return { error: 'Unauthorized' }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1, { rev: true })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()
    return results as Chat[]
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return []
  }
}

export async function getUser() {
  const session = await getSession()
  if (!session?.user?.id) return { error: 'Unauthorized' }

  const user_email = session.user.email

  try {
    return await kv.hgetall<User>(`user:${user_email}`)
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function saveChat(chat: Chat) {
  const session = await getSession()
  if (!session?.user?.id) return { error: 'Unauthorized' }

  const user = await getUser()
  if (!user) return

  try {
    const pipeline = kv.pipeline()
    pipeline.hmset(`chat:${chat.id}`, chat)
    pipeline.zadd(`user:chat:${chat.userId}`, { score: Date.now(), member: `chat:${chat.id}` })
    await pipeline.exec()
  } catch (error) {
    console.error('Error saving chat:', error)
  }
}

export async function getChats(userId?: string | null) {
  if (!userId) return []

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, { rev: true })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()
    return results as Chat[]
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export async function clearChats() {
  const session = await getSession()
  if (!session?.user?.id) return { error: 'Unauthorized' }

  try {
    const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
    if (!chats.length) return redirect('/')

    const pipeline = kv.pipeline()

    for (const chat of chats) {
      pipeline.del(chat)
      pipeline.zrem(`user:chat:${session.user.id}`, chat)
    }

    await pipeline.exec()
    revalidatePath('/')
    return redirect('/')
  } catch (error) {
    console.error('Error clearing chats:', error)
    return { error: 'Failed to clear chats' }
  }
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  try {
    const uid = String(await kv.hget(`chat:${id}`, 'userId'))

    if (uid !== session.user.id) return { error: 'Unauthorized' }

    await kv.del(`chat:${id}`)
    await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

    revalidatePath('/')
  } catch (error) {
    console.error('Error removing chat:', error)
    return { error: 'Failed to remove chat' }
  }
}
