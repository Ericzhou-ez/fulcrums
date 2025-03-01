import React, { useState, useEffect } from "react";
import {
   Avatar,
   Box,
   Divider,
   Menu,
   MenuItem,
   Typography,
   useTheme,
} from "@mui/material";
import {
   User,
   SignOut,
   Info,
   BookOpen,
   Terminal,
   Keyhole,
   Gauge,
} from "phosphor-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

interface ProfileModalProps {
   isOpen: boolean;
   anchorEl: HTMLElement | null;
   onClose: () => void;
   isSettingsOpen: boolean;
   setIsSettingsOpen: any;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
   isOpen,
   anchorEl,
   onClose,
   isSettingsOpen,
   setIsSettingsOpen,
}) => {
   const theme = useTheme();
   const auth = getAuth();
const [user, setUser] = useState<any>(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
      });
      return () => unsubscribe();
   }, [auth]);

   const handleSignOut = async () => {
      await signOut(auth);
      onClose();
   };

   return (
      <Menu
         anchorEl={anchorEl}
         open={isOpen}
         onClose={onClose}
         PaperProps={{
            sx: {
               mt: 0.5,
               borderRadius: 3.5,
               boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
               width: "200px",
               backgroundColor: theme.palette.background.paper,
            },
         }}
      >
         {/* Profile Header */}
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               px: 2,
               py: 1,
               gap: 1.5,
            }}
         >
            <Avatar
               src={user?.photoURL || ""}
               sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
               }}
            >
               {!user?.photoURL && <User size={22} color="white" />}
            </Avatar>

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
               <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{
                     color: theme.palette.text.primary,
                     whiteSpace: "nowrap",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     maxWidth: "130px",
                  }}
               >
                  {user?.displayName || "未登录用户"}
               </Typography>
               {user?.email && (
                  <Typography
                     variant="body2"
                     sx={{
                        color: theme.palette.text.secondary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "130px",
                     }}
                  >
                     {user.email}
                  </Typography>
               )}
            </Box>
         </Box>

         <Divider />

         <a href="/dashboard/settings">
            <MenuItem
               sx={{
                  py: 1.2,
                  "&:hover": {
                     bgcolor: theme.palette.action.hover,
                     borderRadius: 3,
                     transition: "background 0.2s ease",
                  },
               }}
            >
               <Info size={18} style={{ marginRight: 8 }} />
               设置
            </MenuItem>
         </a>

         <a href="/dashboard">
            <MenuItem
               sx={{
                  py: 1.2,
                  "&:hover": {
                     bgcolor: theme.palette.action.hover,
                     borderRadius: 2,
                     transition: "background 0.2s ease",
                  },
               }}
            >
               <Gauge size={18} style={{ marginRight: 8 }} />
               仪表
            </MenuItem>
         </a>
         <a href="/documentation">
            <MenuItem
               sx={{
                  py: 1.2,
                  "&:hover": {
                     bgcolor: theme.palette.action.hover,
                     borderRadius: 2,
                     transition: "background 0.2s ease",
                  },
               }}
            >
               <BookOpen size={18} style={{ marginRight: 8 }} />
               指南
            </MenuItem>
         </a>
         <a href="/help">
            <MenuItem
               sx={{
                  py: 1.2,
                  "&:hover": {
                     bgcolor: theme.palette.action.hover,
                     borderRadius: 2,
                     transition: "background 0.2s ease",
                  },
               }}
            >
               <User size={18} style={{ marginRight: 8 }} />
               帮助
            </MenuItem>
         </a>

         <Divider />

         {/* Sign Out */}
         <MenuItem
            onClick={handleSignOut}
            sx={{
               py: 1.2,
               color: theme.palette.error.main,
               fontWeight: 600,
               borderRadius: 2,
            }}
         >
            <SignOut size={18} style={{ marginRight: 8 }} />
            退出
         </MenuItem>
      </Menu>
   );
};
