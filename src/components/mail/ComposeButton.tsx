"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pencil } from "lucide-react";
import EmailEditor from "./editor/EmailEditor";
import { useState } from "react";

const ComposeButton = () => {
  const [toValues, setToValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [subject, setSubject] = useState<string>("");

  const handleSend = async (value: string) => {
    console.log(value, "value");
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="group relative rounded-md border border-black/10 p-2 shadow transition-all hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
          <Pencil className="size-[16px]" />
          <div className="absolute bottom-1 left-11 z-40 rounded-sm bg-black/5 p-2 text-black opacity-0 transition-all group-hover:opacity-100 dark:bg-white/20 dark:text-white">
            <p className="text-xs font-medium">Compose</p>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Compose Email</DrawerTitle>
        </DrawerHeader>
        <EmailEditor
          toValues={toValues}
          setToValues={setToValues}
          ccValues={ccValues}
          setCcValues={setCcValues}
          subject={subject}
          setSubject={setSubject}
          handleSend={handleSend}
          isSending={false}
          to={toValues.map((to) => to.value)}
          defaultToolbarExpanded={true}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default ComposeButton;
