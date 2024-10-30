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
    "gravity-mail",
    "inbox",
  );

  const { data: inboxThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "inbox",
  });

  const { data: draftThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "inbox",
  });

  const { data: sentThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "inbox",
  });

  if (!inboxThreads || !draftThreads || !sentThreads) {
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
