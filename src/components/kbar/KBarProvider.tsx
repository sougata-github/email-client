"use client";

import {
  Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  Priority,
} from "kbar";
import RenderResults from "./RenderResults";
import { useLocalStorage } from "usehooks-ts";
import { useThemeSwitching } from "@/hooks/use-theme-switching";
import { useAccountSwitching } from "@/hooks/use-account-switching";

export const ActualComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useThemeSwitching();
  useAccountSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hidden fixed inset-0 z-[999] bg-black/40 !p-0 backdrop-blur-sm dark:bg-black/60">
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg bg-white text-foreground shadow-lg dark:border dark:border-gray-500 dark:bg-gray-800 dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800">
              <div className="border-x-0 dark:border-gray-700">
                <KBarSearch className="w-full border-none bg-white px-6 py-4 text-sm outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 dark:bg-gray-800" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};

export default function KBar({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useLocalStorage("gravity-mail-tab", "inbox");

  // const [done, setDone] = useLocalStorage("gravity-mail-done", false);

  const actions: Action[] = [
    {
      id: "inboxAction",
      name: "Inbox",
      shortcut: ["g", "i"],
      section: "Navigation",
      subtitle: "View your inbox",
      perform: () => {
        setTab("inbox");
      },
    },
    {
      id: "draftAction",
      name: "Drafts",
      shortcut: ["g", "d"],
      keywords: "drafts",
      priority: Priority.HIGH,
      section: "Navigation",
      subtitle: "View your drafts",
      perform: () => {
        setTab("draft");
      },
    },
    {
      id: "sentAction",
      name: "Sent",
      shortcut: ["g", "s"],
      section: "Navigation",
      subtitle: "View Sent",
      perform: () => {
        setTab("sent");
      },
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <ActualComponent>{children}</ActualComponent>
    </KBarProvider>
  );
}
