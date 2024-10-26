"use client";

import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { Button } from "./button";

const LinkAccountButton = () => {
  const handleClick = async () => {
    const authUrl = await getAurinkoAuthUrl("Google");
    window.location.href = authUrl;
  };

  return <Button onClick={handleClick}>Link Account</Button>;
};

export default LinkAccountButton;
