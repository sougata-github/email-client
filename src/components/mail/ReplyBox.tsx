"use client";

import { useThreads } from "@/hooks/use-threads";
import EmailEditor from "./editor/EmailEditor";
import { api, RouterOutputs } from "@/trpc/react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

type Props = {};

const Component = ({
  replyDetails,
}: {
  replyDetails: RouterOutputs["account"]["getReplyDetails"];
}) => {
  const { threadId } = useThreads();

  const [subject, setSubject] = useState(
    replyDetails.subject.startsWith("Re")
      ? replyDetails.subject
      : `Re: ${replyDetails.subject}`,
  );

  const [toValues, setToValues] = useState<{ label: string; value: string }[]>(
    replyDetails.to.map((to) => ({ label: to.address, value: to.address })),
  );

  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    replyDetails.cc.map((cc) => ({ label: cc.address, value: cc.address })),
  );

  useEffect(() => {
    if (!threadId || !replyDetails) return;

    if (!replyDetails.subject.startsWith("Re:")) {
      setSubject(`Re: ${replyDetails.subject}`);
    }

    setToValues(
      replyDetails.to.map((to) => ({ label: to.address, value: to.address })),
    );
    setCcValues(
      replyDetails.cc.map((cc) => ({ label: cc.address, value: cc.address })),
    );
  }, [threadId, replyDetails]);

  const handleSend = async (value: string) => {
    console.log(value);
  };

  return (
    <EmailEditor
      subject={subject}
      setSubject={setSubject}
      toValues={toValues}
      setToValues={setToValues}
      ccValues={ccValues}
      setCcValues={setCcValues}
      to={replyDetails.to.map((to) => to.address)}
      isSending={false}
      handleSend={handleSend}
      defaultToolbarExpanded={false}
    />
  );
};

const ReplyBox = (props: Props) => {
  const { threadId, accountId } = useThreads();

  const { data: replyDetails } = api.account.getReplyDetails.useQuery({
    threadId: threadId ?? "",
    accountId,
  });

  if (!replyDetails)
    return (
      <div className="mb-4 mt-4 flex w-full items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    );

  return <Component replyDetails={replyDetails} />;
};

export default ReplyBox;
