"use client";

import { useThreads } from "@/hooks/use-threads";
import { format, formatDistanceToNow } from "date-fns";
import { Loader } from "lucide-react";
import React, { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { Badge } from "../ui/badge";

function getBadgeVariantFromLabel(
  label: string,
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  return "secondary";
}

const ThreadList = () => {
  const { threads, threadId, setThreadId } = useThreads();

  if (!threads) {
    return (
      <div className="mt-4 flex w-full items-center justify-start p-4 pt-0">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }

  //group threads by date: threads with same date
  const groupedThreads = threads?.reduce(
    (acc, thread) => {
      const date = format(thread.emails[0]?.sentAt ?? new Date(), "yyyy-MM-dd");

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(thread);

      return acc;
    },
    {} as Record<string, typeof threads>,
  );

  return (
    <div className="max-h-[calc(100vh-120px)] max-w-full overflow-y-auto">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => (
          <React.Fragment key={date}>
            <div className="mt-4 text-xs font-medium text-muted-foreground first:mt-0">
              {date}
            </div>

            <div>
              {threads.map((thread) => (
                <button
                  onClick={() => setThreadId(thread.id)}
                  key={thread.id}
                  className={cn(
                    "relative line-clamp-1 flex w-full flex-col items-start gap-2 rounded-lg border p-2 text-left text-sm transition-all",

                    threadId === thread.id && "bg-accent",
                  )}
                >
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">
                          {thread.emails.at(-1)?.from.name}
                        </div>
                      </div>

                      <div className={cn("ml-auto text-xs")}>
                        {formatDistanceToNow(
                          thread.emails.at(-1)?.sentAt ?? new Date(),
                          { addSuffix: true },
                        )}
                      </div>
                    </div>
                    <div className="truncate text-xs font-semibold text-black/60 dark:text-white/50">
                      {thread.subject}
                    </div>
                  </div>

                  <div
                    className="line-clamp-2 text-xs text-muted-foreground dark:text-white/80"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        thread.emails.at(-1)?.bodySnippet ?? "",
                        {
                          USE_PROFILES: { html: true },
                        },
                      ),
                    }}
                  />

                  {thread.emails[0]?.sysLabels.length && (
                    <div className="mt-1 flex items-center gap-2">
                      {thread.emails[0].sysLabels.map((label) => (
                        <Badge
                          key={label}
                          variant={getBadgeVariantFromLabel(label)}
                          className="border border-black/10 dark:border dark:border-white/10"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ThreadList;
