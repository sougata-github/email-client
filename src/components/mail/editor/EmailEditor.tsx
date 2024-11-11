"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import { useEffect, useState } from "react";
import EditorMenuBar from "./EditorMenuBar";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import TagInput from "./TagInput";
import { Input } from "../../ui/input";
import AiComponseButton from "./AiComponseButton";
import { generate } from "@/actions/automcomplete";
import { readStreamableValue } from "ai/rsc";

type Props = {
  subject: string;
  setSubject: (value: string) => void;

  toValues: { label: string; value: string }[];
  setToValues: (value: { label: string; value: string }[]) => void;

  ccValues: { label: string; value: string }[];
  setCcValues: (value: { label: string; value: string }[]) => void;

  to: string[];

  isSending: boolean;
  handleSend: (value: string) => void;

  defaultToolbarExpanded: boolean;
};

const EmailEditor = ({
  toValues,
  ccValues,
  setCcValues,
  to,
  setToValues,
  subject,
  setSubject,
  isSending,
  handleSend,
  defaultToolbarExpanded,
}: Props) => {
  const [value, setValue] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(defaultToolbarExpanded);
  const [token, setToken] = useState<string>("");

  const aiGenerate = async (value: string) => {
    const { output } = await generate(value);

    for await (const token of readStreamableValue(output)) {
      if (token) {
        setToken(token);
      }
    }
  };

  //autocomplete on ctrl+j.
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "CTRL-j": () => {
          aiGenerate(this.editor.getText());
          return true;
        },
        "Meta-j": () => {
          aiGenerate(this.editor.getText());
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  const onGenerate = (token: string) => {
    editor?.commands?.insertContent(token);
  };

  useEffect(() => {
    editor?.commands.insertContent(token);
  }, [editor, token]);

  if (!editor) return null;

  return (
    <div>
      <div className="flex border-b p-4 py-2">
        <EditorMenuBar editor={editor} />
      </div>

      <div className="space-y-2 p-4 pb-0">
        {expanded && (
          <>
            <TagInput
              label="to"
              onChange={setToValues}
              placeholder="Add Recipients"
              value={toValues}
            />
            <TagInput
              label="cc"
              onChange={setCcValues}
              placeholder="Add Recipients"
              value={ccValues}
            />
            <Input
              id="subject"
              value={subject}
              placeholder="subject"
              onChange={(e) => setSubject(e.target.value)}
              className="placeholder:text-sm"
            />
          </>
        )}

        <div className="flex items-center gap-2">
          <div
            className="cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-medium text-green-600">Draft </span>
            <span>to {to.join(", ")}</span>
          </div>
        </div>
        <AiComponseButton
          isComponsing={defaultToolbarExpanded}
          onGenerate={onGenerate}
        />
      </div>

      <div className="prose w-full p-4">
        <EditorContent editor={editor} value={value} />
      </div>

      <Separator />

      <div className="flex w-full flex-col items-start justify-between gap-4 px-4 py-3 lg:flex-row lg:items-center lg:gap-0">
        <span className="text-sm">
          Tip: Press{" "}
          <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
            CMD + J
          </kbd>{" "}
          for AI autocomplete.
        </span>
        <Button
          className="w-full lg:w-fit"
          onClick={async () => {
            editor?.commands?.clearContent();
            handleSend(value);
          }}
          disabled={isSending}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default EmailEditor;
