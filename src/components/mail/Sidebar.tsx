"use client";

import { useLocalStorage } from "usehooks-ts";
import { File, Inbox, Loader, Send } from "lucide-react";
import Nav from "./Nav";
import { api } from "@/trpc/react";

type Props = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: Props) => {
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<"inbox" | "draft" | "sent">(
    "gravity-mail-tab",
    "inbox",
  );

  const { data: inboxThreads, isLoading: isInboxLoading } =
    api.account.getNumThreads.useQuery(
      { accountId, tab: "inbox" },
      { enabled: Boolean(accountId) },
    );

  const { data: draftThreads, isLoading: isDraftLoading } =
    api.account.getNumThreads.useQuery(
      { accountId, tab: "draft" },
      { enabled: Boolean(accountId) },
    );

  const { data: sentThreads, isLoading: isSentLoading } =
    api.account.getNumThreads.useQuery(
      { accountId, tab: "sent" },
      { enabled: Boolean(accountId) },
    );

  if (isInboxLoading || isDraftLoading || isSentLoading) {
    return (
      <div className="mt-4 flex w-full items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <Nav
      isCollapsed={isCollapsed}
      links={[
        {
          title: "Inbox",
          label: inboxThreads?.toString(),
          icon: Inbox,
          variant: tab === "inbox" ? "default" : "ghost",
        },
        {
          title: "Draft",
          label: draftThreads?.toString(),
          icon: File,
          variant: tab === "draft" ? "default" : "ghost",
        },
        {
          title: "Sent",
          label: sentThreads?.toString(),
          icon: Send,
          variant: tab === "sent" ? "default" : "ghost",
        },
      ]}
    />
  );
};

export default Sidebar;
