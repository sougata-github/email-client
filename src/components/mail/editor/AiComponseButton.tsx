"use client";

import { generateEmail } from "@/actions/generateReply";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useThreads } from "@/hooks/use-threads";
import { turndown } from "@/lib/turndown";
import { readStreamableValue } from "ai/rsc";
import { BotIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  isComponsing: boolean;
  onGenerate: (token: string) => void;
};

const AiComponseButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { threads, threadId, account } = useThreads();

  const thread = threads?.find((thread) => thread.id === threadId);

  const aiGenerate = async () => {
    let context = "";

    if (!props.isComponsing) {
      for (const email of thread?.emails ?? []) {
        const content = `Subject: ${email.subject}
          From: ${email.from}
          Sent: ${new Date(email.sentAt).toLocaleString()}
          Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}`;

        context += content;
      }
    }

    context += ` My name is ${account?.name} and my email is ${account?.emailAddress}`;

    const { output } = await generateEmail(context, prompt);

    for await (const token of readStreamableValue(output)) {
      if (token) {
        console.log(token);
        props.onGenerate(token);
      }
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
            <BotIcon className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Smart Compose</DialogTitle>
            <DialogDescription>
              AI will help compose your email.
            </DialogDescription>
            <div className="h-2" />
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt"
            />
            <div className="h-2" />

            <Button
              onClick={() => {
                aiGenerate();
                setOpen(false);
                setPrompt("");
              }}
            >
              Generate
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AiComponseButton;
