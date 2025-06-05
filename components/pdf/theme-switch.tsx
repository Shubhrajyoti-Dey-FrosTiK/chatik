import { Moon, Sun } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  toggleMode: () => void;
  darkMode: boolean;
}

function ThemeSwitch(props: Props) {
  const { toggleMode, darkMode } = props;

  return (
    <Button
      size="icon"
      className={`${darkMode ? "bg-zinc-300" : "bg-zinc-100"}`}
      onClick={toggleMode}
    >
      {darkMode ? <Sun size={15} /> : <Moon size={15} />}
    </Button>
  );
}

export default ThemeSwitch;
