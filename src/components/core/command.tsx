import React, { useState } from "react";
import {
   Paper,
   TextField,
   List,
   ListSubheader,
   ListItem,
   ListItemIcon,
   ListItemText,
   Divider,
   Typography,
   Box,
   InputAdornment,
} from "@mui/material";
import {
   Calculator,
   CalendarBlank,
   CreditCard,
   Gear,
   Smiley,
   User,
   MagnifyingGlass,
   Heart,
   Keyboard,
   Sidebar,
   House,
   Clock,
   FileText,
   Phone,
   PhoneCall,
   Swap,
} from "phosphor-react";
import "../../styles/command.css";
import Home from "../../pages/marketing/home";

interface CommandItemData {
   label: string;
   icon: React.ReactNode;
   shortcut?: string;
   disabled?: boolean;
   link?: string;
}

interface CommandGroupData {
   heading: string;
   items: CommandItemData[];
}

const commandGroups: CommandGroupData[] = [
   {
      heading: "建议",
      items: [
         {
            label: "最近产品",
            icon: <Clock size={20} weight="duotone" />,
            link: "https://fulcrums.ca/dashboard/recent",
         },
         {
            label: "报价",
            icon: <Calculator size={20} weight="duotone" />,
         },
         {
            label: "报关",
            icon: <CalendarBlank size={20} weight="duotone" />,
         },
      ],
   },
   {
      heading: "快捷键",
      items: [
         {
            label: "更换外观",
            icon: <Swap size={20} weight="duotone" />,
            link: "",
            shortcut: "⇧esc",
         },
         {
            label: "总览",
            icon: <House size={20} weight="duotone" />,
            shortcut: "⇧H",
            link: "https://fulcrums.ca/dashboard",
         },
         {
            label: "输入命令盘",
            icon: <Keyboard size={20} weight="duotone" />,
            shortcut: "⌘K",
            link: "",
         },
         {
            label: "侧边栏",
            icon: <Sidebar size={20} weight="duotone" />,
            shortcut: "⌘⇧S",
            link: "",
         },
         {
            label: "系统设置",
            icon: <Gear size={20} weight="duotone" />,
            shortcut: "⌘⇧P",
            link: "https://fulcrums.ca/dashboard/settings",
         },
      ],
   },
   {
      heading: "产品管理",
      items: [
         {
            label: "收藏产品",
            icon: <Heart size={20} weight="duotone" />,
            link: "https://fulcrums.ca/dashboard/saved",
         },
         {
            label: "最近产品",
            icon: <Clock size={20} weight="duotone" />,
            link: "https://fulcrums.ca/dashboard/recent",
         },
         {
            label: "搜索产品",
            icon: <MagnifyingGlass size={20} weight="duotone" />,
            link: "https://fulcrums.ca/dashboard/search",
         },
      ],
   },
   {
      heading: "报价管理",
      items: [
         {
            label: "内部报价",
            icon: <Heart size={20} weight="duotone" />,
            link: "https://fulcrums.ca/quotation/internal",
         },
         {
            label: "客户报价",
            icon: <Clock size={20} weight="duotone" />,
            link: "https://fulcrums.ca/quotation/external",
         },
      ],
   },
   {
      heading: "报关",
      items: [
         {
            label: "报关",
            icon: <Heart size={20} weight="duotone" />,
            link: "https://fulcrums.ca/dashboard/saved",
         },
      ],
   },
   {
      heading: "帮助",
      items: [
         {
            label: "更换外观",
            icon: <Swap size={20} weight="duotone" />,
            link: "",
            shortcut: "⇧T",
         },
         {
            label: "联系Fulcrums",
            icon: <PhoneCall size={20} weight="duotone" />,
            link: "https://fulcrums.ca/contact",
         },
         {
            label: "使用说明",
            icon: <FileText size={20} weight="duotone" />,
            link: "https://fulcrums.ca/documentation",
         },
      ],
   },
];

interface ConditionalLinkProps {
   link?: string;
   children: React.ReactNode;
}

function ConditionalLink({ link, children }: ConditionalLinkProps) {
   if (link && link.trim() !== "") {
      return (
         <a
            href={link}
            style={{
               textDecoration: "none",
               color: "inherit",
               display: "block",
            }}
            rel="noopener noreferrer"
         >
            {children}
         </a>
      );
   }
   return <>{children}</>;
}

export default function CommandPalette() {
   const [search, setSearch] = useState("");
   const filteredGroups = commandGroups
      .map((group) => ({
         ...group,
         items: group.items.filter((item) => item.label.includes(search)),
      }))
      .filter((group) => group.items.length > 0);

   return (
      <Paper
         className="command"
         sx={{
            width: { xs: "90%", sm: 450 },
            maxHeight: "500px",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
               display: "none",
            },
         }}
      >
         <TextField
            fullWidth
            placeholder="输入命令或搜索..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
               position: "sticky",
               zIndex: 2100,
               opacity: 1,
               bgcolor: "var(--background-color)",
               top: 0,
               my: 1,
               "& .MuiOutlinedInput-notchedOutline": {
                  borderLeft: "none",
                  borderTop: "none",
                  borderRight: "none",
                  borderRadius: 0,
               },
            }}
            InputProps={{
               startAdornment: (
                  <InputAdornment position="start">
                     <MagnifyingGlass size={20} />
                  </InputAdornment>
               ),
            }}
         />
         <List>
            {filteredGroups.length === 0 ? (
               <Typography variant="body2" align="center">
                  没有找到结果。
               </Typography>
            ) : (
               filteredGroups.map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                     <ListSubheader
                        disableSticky
                        sx={{
                           fontWeight: "bold",
                           fontSize: "1.2rem",
                           lineHeight: 2,
                           mb: 0.8,
                        }}
                     >
                        {group.heading}
                     </ListSubheader>
                     <Box sx={{ mb: 2 }}>
                        {group.items.map((item, itemIndex) => (
                           <ConditionalLink key={itemIndex} link={item.link}>
                              <ListItem
                                 button
                                 sx={{
                                    borderRadius: "12px",
                                 }}
                              >
                                 <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                                    {item.icon}
                                 </ListItemIcon>
                                 <ListItemText primary={item.label} />
                                 {item.shortcut && (
                                    <Typography
                                       variant="caption"
                                       sx={{ ml: 1 }}
                                    >
                                       {item.shortcut}
                                    </Typography>
                                 )}
                              </ListItem>
                           </ConditionalLink>
                        ))}
                     </Box>
                     {groupIndex < filteredGroups.length - 1 && (
                        <Divider sx={{ my: 2 }} />
                     )}
                  </React.Fragment>
               ))
            )}
         </List>
      </Paper>
   );
}
