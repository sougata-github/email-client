"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <SunIcon className="size-[1.2rem] rotate-0 scale-0 transition-all dark:-rotate-90 dark:scale-100" />
      <MoonIcon className="absolute size-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-0" />
    </Button>
  );
};

export default ThemeToggle;
