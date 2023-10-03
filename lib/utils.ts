import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SavedHistory } from '@/data/savedHistory';

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
