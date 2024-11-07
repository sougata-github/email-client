"use client";

import { api } from "@/trpc/react";
import Avatar from "react-avatar";
import Select from "react-select";
import { useThreads } from "@/hooks/use-threads";
import { useState } from "react";

type Props = {
  placeholder: string;
  label: string;
  onChange: (values: { label: string; value: string }[]) => void;
  value: { label: string; value: string }[];
};

const TagInput = ({ placeholder, label, onChange, value }: Props) => {
  const { accountId } = useThreads();

  const { data: suggestions } = api.account.getSuggestions.useQuery({
    accountId,
  });

  const [inputValue, setInputValue] = useState<string>("");

  const options = suggestions?.map((suggestion) => ({
    label: (
      <span className="flex items-center gap-2">
        <Avatar
          name={suggestion.address}
          size="25"
          round={true}
          textSizeRatio={2}
        />
        {suggestion.address}
      </span>
    ),
    value: suggestion.address,
  }));

  return (
    <div className="flex items-center rounded-md border">
      <span className="ml-3 text-sm text-gray-500">{label}</span>
      <Select
        value={value}
        onInputChange={setInputValue}
        //@ts-ignore
        onChange={onChange}
        placeholder={placeholder}
        isMulti
        //@ts-ignore
        options={
          inputValue
            ? options?.concat({
                //@ts-ignore
                label: inputValue,
                value: inputValue,
              })
            : options
        }
        className="w-4 flex-1"
        classNames={{
          control: () => {
            return "!border-none !outline-none !ring-0 !shadow-none focus:border-none focus:outline-none focus:ring-0 focus:shadow-none dark:bg-transparent text-sm";
          },
          multiValue: () => {
            return "dark:bg-gray-700";
          },
          multiValueLabel: () => {
            return "dark:text-white dark:bg-gray-700 rounded-md ";
          },
          menuList: () => {
            return "dark:bg-black text-sm";
          },
        }}
        classNamePrefix="select"
      />
    </div>
  );
};

export default TagInput;
