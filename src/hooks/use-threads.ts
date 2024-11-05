"use client";

import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import { atom, useAtom } from "jotai";

export const threadIdAtom = atom<string | null>(null);

export function useThreads() {
  const { data: accounts } = api.account.getAccounts.useQuery();

  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage("gravity-mail-tab", "inbox");
  const [done] = useLocalStorage("gravity-mail-done", false);

  const [threadId, setThreadId] = useAtom(threadIdAtom);

  const {
    data: threads,
    isFetching,
    refetch,
  } = api.account.getThreads.useQuery(
    {
      accountId,
      tab,
      done,
    },
    {
      enabled: !!accountId && !!tab,
      placeholderData: (e) => e,
    },
  );

  return {
    threads,
    isFetching,
    refetch,
    accountId,
    threadId,
    setThreadId,
    account: accounts?.find((acc) => acc.id === accountId),
  };
}
