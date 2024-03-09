import { useState, useEffect, useLayoutEffect } from 'react';
import { USER_ID_KEY } from '~/core/constants';

export default function useThreadId(value = '') {
  const [threadId, setThreadId] = useState(value);

  // Synchronize initially
  useLayoutEffect(() => {
    const localStorage = window.localStorage;
    const threadId = localStorage.getItem(USER_ID_KEY) ?? '';
    setThreadId(threadId);
  }, []);

  // Synchronize on change
  useEffect(() => {
    window.localStorage.setItem(USER_ID_KEY, threadId);
  }, [threadId]);

  return [threadId, setThreadId] as const;
}
