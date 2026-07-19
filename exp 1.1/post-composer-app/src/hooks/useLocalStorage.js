import { useState, useEffect } from 'react';

/**
 * Custom hook to sync state with localStorage.
 * @param {string} key - The localStorage key.
 * @param {*} initialValue - The fallback value if key does not exist.
 * @returns {[*, Function]} - State value and setter function.
 */
export function useLocalStorage(key, initialValue) {
  // Retrieve initial state from local storage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep state updated in local storage when key or value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
