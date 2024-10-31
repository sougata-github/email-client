"use client";

import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Loader, Plus } from "lucide-react";
import { getAurinkoAuthUrl } from "@/lib/aurinko";

type Props = {
  isCollapsed: boolean;
};

const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data, isLoading } = api.account.getAccounts.useQuery();

  const [accountId, setAccountId] = useLocalStorage(
    "accountId",
    "select an account",
  );

  if (!data)
    return (
      <div className="flex w-full items-center justify-center">
        <Loader className="size-4 animate-spin" />
      </div>
    );

  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex items-center justify-center gap-2 font-medium [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",

          isCollapsed &&
            "flex size-9 shrink-0 items-center p-0 [&>span]:w-auto [&_svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span
            className={cn({
              hidden: !isCollapsed,
            })}
          >
            {data.find((account) => account.id === accountId)?.emailAddress[0]}
          </span>
          <span className={cn({ hidden: isCollapsed, "ml-2": true })}>
            {data.find((account) => account.id === accountId)?.emailAddress}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {data.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.emailAddress}
          </SelectItem>
        ))}

        <div
          className="relative mt-2 flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-50 focus:bg-accent"
          onClick={async () => {
            const authUrl = await getAurinkoAuthUrl("Google");
            window.location.href = authUrl;
          }}
        >
          <Plus className="mr-1 size-4" />
          Add Account
        </div>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;
