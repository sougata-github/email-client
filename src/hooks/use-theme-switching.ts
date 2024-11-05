import { useRegisterActions } from "kbar";
import { useTheme } from "next-themes";

export function useThemeSwitching() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const themeAction = [
    {
      id: "toggleTheme",
      name: "Toggle Theme",
      shortcut: ["t", "t"],
      section: "Theme",
      perform: toggleTheme,
    },
  ];

  useRegisterActions(themeAction, [theme]);
}
