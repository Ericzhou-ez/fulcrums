import { useEffect, useState } from "react";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import CommandPalette from "./command";
import { Navigate, useNavigate } from "react-router";
import { useThemeContext } from "../../contexts/themeContextProvider";

export default function GlobalKeyListener() {
   const { setNavOpen, navOpen } = useUIStateContext();

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.metaKey && e.key.toLowerCase() === "s" && e.shiftKey) {
            e.preventDefault();

            setNavOpen(!navOpen);
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [navOpen]);

   return null;
}

export function GlobalCommandListener() {
   const [isCommandOpen, setIsCommandOpen] = useState(false);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (
            (e.metaKey || e.ctrlKey) &&
            e.key.toLowerCase() === "k"
         ) {
            setIsCommandOpen((prev) => !prev);
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, []);

   return (
      <>
         {isCommandOpen && <CommandPalette />}

         {isCommandOpen && (
            <div
               className="command-overlay"
               onClick={() => setIsCommandOpen(false)}
            ></div>
         )}
      </>
   );
}

export function GlobalProfileListener() {
   const navigate = useNavigate();

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.metaKey && e.key.toLowerCase() === "p" && e.shiftKey) {
            e.preventDefault();

            navigate("/dashboard/settings");
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, []);

   return null;
}

export function GlobalHomeListener() {
   const navigate = useNavigate();

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key.toLowerCase() === "h" && e.shiftKey) {
            e.preventDefault();

            navigate("/dashboard");
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, []);

   return null;
}

export function GlobalThemeListener() {
   const { toggleTheme, isDark } = useThemeContext();

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape" && e.shiftKey) {
            e.preventDefault();

            toggleTheme(isDark ? "light" : "dark");
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [isDark]);

   return null;
}