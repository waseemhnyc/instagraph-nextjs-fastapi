import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SavedHistory } from '@/data/savedHistory';
import { Session } from '@/lib/types'
import { auth } from '@/auth'
import { Chat } from './types'
import { kv } from '@vercel/kv'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to save search history
export function saveSearchHistory(savedHistory: SavedHistory[] = []) {
  // Check if localStorage is defined
  if (typeof localStorage !== 'undefined') {
    // Convert the search history array into a JSON string
    const savedHistoryJSON = JSON.stringify(savedHistory);

    // Save the JSON string in localStorage
    localStorage.setItem('savedHistory', savedHistoryJSON);
  }
}

export async function saveChat(chat: Chat) {
  const session = (await auth()) as Session

  if (session && session.user) {
    const pipeline = kv.pipeline();
    pipeline.hmset(`chat:${chat.id}`, chat);
    pipeline.zadd(`user:chat:${chat.userId}`, {
      score: Date.now(),
      member: `chat:${chat.id}`
    });
    await pipeline.exec();
  } else {
    return;
  }
  

  console.log('session in saveSearchHistoryForUser', session)
  // console.log('saveSearchHistoryForUser', savedHistory[0])
}

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN',
  NotAuthorized = 'NOT_AUTHORIZED',
  InternalServerError = 'INTERNAL_SERVER_ERROR'
}

// Function to load search history
export function loadSearchHistory() {
  // Check if localStorage is defined
  if (typeof localStorage !== 'undefined') {
    // Get the JSON string from localStorage
    const savedHistoryJSON = localStorage.getItem('savedHistory');

    // If there is no search history saved, return an empty array
    if (!savedHistoryJSON) {
      return [];
    }

    // Convert the JSON string back into an array and return it
    return JSON.parse(savedHistoryJSON);
  }
  // If localStorage is not defined, return an empty array
  else {
    return [];
  }
}

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

export const getMessageFromCode = (resultCode: string) => {
  switch (resultCode) {
    case ResultCode.InvalidCredentials:
      return 'Invalid credentials!'
    case ResultCode.InvalidSubmission:
      return 'Invalid submission, please try again!'
    case ResultCode.UserAlreadyExists:
      return 'User already exists, please log in!'
    case ResultCode.UserCreated:
      return 'User created, welcome!'
    case ResultCode.UnknownError:
      return 'Something went wrong, please try again!'
    case ResultCode.UserLoggedIn:
      return 'Logged in!'
  }
}
