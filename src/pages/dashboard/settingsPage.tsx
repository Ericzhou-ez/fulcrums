import { IconButton } from "@mui/material";
import "../../styles/settings.css";
import { X as XIcon } from "phosphor-react";
import { Box } from "@mui/material";


interface SettingsPageProps {
   setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
   isSettingsOpen: boolean;
   isDark: boolean;
}

export const SettingsPage = ({isSettingsOpen, setIsSettingsOpen, isDark}: SettingsPageProps) => {
   return (
      <Box
         className="settings"
         sx={{ bgcolor: isDark ? "#665d4e" : "rgb(235, 228, 217)" }}
      >
         <IconButton
            className="close-settings"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
         >
            <XIcon size={20} />
         </IconButton>
      </Box>
   );
};
