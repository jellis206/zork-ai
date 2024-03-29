import { useState, useEffect, useLayoutEffect } from 'react';
import { THREAD_ID_KEY } from '~/core/constants';
import ZorkEngine from '~/services/zork-engine';

export default function useThreadId(value = '') {
  const [threadId, setThreadId] = useState(value);
  const [zorkEngine] = useState(new ZorkEngine());

  const initThreadId = async (threadId?: string) => {
    if (!threadId) {
      threadId = await zorkEngine.startNewThread();
      localStorage.setItem(THREAD_ID_KEY, threadId);
    }
    setThreadId(threadId);
  };

  // Synchronize initially
  useLayoutEffect(() => {
    const localStorage = window.localStorage;
    const threadId = localStorage.getItem(THREAD_ID_KEY) ?? '';
    initThreadId(threadId);
  });

  // Synchronize on change
  useEffect(() => {
    window.localStorage.setItem(THREAD_ID_KEY, threadId);
  }, [threadId]);

  return [threadId, setThreadId] as const;
}
