"use client";

import { useThreads } from "@/hooks/use-threads";
import { Archive, ArchiveX, Clock, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import EmailDisplay from "./EmailDisplay";

const ThreadDisplay = () => {
  const { threadId, threads } = useThreads();

  const thread = threads?.find((thread) => thread.id === threadId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled={!thread}>
            <Archive className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!thread}>
            <ArchiveX className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!thread}>
            <Trash2 className="size-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="ml-2 h-6" />

        <Button variant="ghost" size="icon" disabled={!thread} className="ml-2">
          <Clock className="size-4" />
        </Button>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" disabled={!thread}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute Thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

      {thread ? (
        <>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex flex-col items-start p-4 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-4 text-sm lg:w-[60%] lg:flex-row lg:items-center">
                <Avatar>
                  <AvatarImage alt="avatar" />
                  <AvatarFallback className="font-medium">
                    {thread.emails[0]?.from?.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="grid gap-1">
                  <div className="font-semibold">
                    {thread.emails[0]?.from.name}

                    <div className="line-clamp-1 text-xs">
                      {thread.emails[0]?.subject}
                    </div>
                    <div className="line-clamp-1 text-xs">
                      <span className="font-medium">Reply To:</span>
                      {thread.emails[0]?.from?.address}
                    </div>
                  </div>
                </div>
              </div>

              {thread.emails[0]?.sentAt && (
                <div className="mt-2 text-xs text-muted-foreground lg:ml-auto lg:mt-0">
                  {format(new Date(thread.emails[0]?.sentAt), "PP | pp")}
                </div>
              )}
            </div>
            <Separator className="h-[0.2px]" />
            <div className="flex max-h-[calc(100vh-500px)] flex-col overflow-y-auto">
              <div className="flex flex-col gap-4 overflow-y-auto p-6">
                {thread.emails?.map((email) => (
                  <EmailDisplay key={email.id} email={email} />
                ))}
              </div>
            </div>
            <div className="flex-1" />
            <Separator className="mt-auto" />
            Reply Box
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
};

export default ThreadDisplay;
