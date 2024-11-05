"use client";

import { useThreads } from "@/hooks/use-threads";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import Avatar from "react-avatar";
import { Letter } from "react-letter";

type Props = {
  email: RouterOutputs["account"]["getThreads"][0]["emails"][0];
};

const EmailDisplay = ({ email }: Props) => {
  const { account } = useThreads();

  const isMe = account?.emailAddress === email.from.address;

  return (
    <div
      className={cn(
        "cursor-pointer rounded-md border p-4",
        isMe && "border-l-4 border-l-gray-900",
      )}
    >
      <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
          {!isMe && (
            <Avatar
              name={email.from.name ?? email.from.address}
              email={email.from.address}
              size="35"
              textSizeRatio={2}
              round={true}
            />
          )}
          <span className="text-sm font-medium">
            {isMe ? "Me" : email.from.address}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(email.sentAt ?? new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>

      <div className="h-4"></div>

      <Letter
        html={email?.body ?? ""}
        className="letter-content rounded-md bg-white text-xs text-black"
      />
    </div>
  );
};

export default EmailDisplay;
