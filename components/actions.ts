'use server';

import { signOut } from '@/auth' // Замените на фактический путь

export async function handleSignOut() {
  await signOut();
}