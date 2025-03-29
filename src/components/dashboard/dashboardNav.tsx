import * as React from "react";
import {
   Box,
   Stack,
   Typography,
   Link as MuiLink,
   useTheme,
   IconButton,
   Link,
   useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
   CaretDown,
   CaretRight,
   ArrowSquareOut,
   House,
   Plus,
   BookmarkSimple,
   ClockCounterClockwise,
   Users,
   NotePencil,
   PaperPlaneTilt,
   ArchiveBox,
   Cube,
   FileArrowUp,
   CaretDoubleLeft,
   MagnifyingGlass
} from "phosphor-react";
import Logo from "../../assets/images/logo.svg";

const iconMap: Record<string, React.ComponentType<any>> = {
   House,
   Plus,
   BookmarkSimple,
   ClockCounterClockwise,
   Users,
   NotePencil,
   PaperPlaneTilt,
   ArchiveBox,
   Cube,
   FileArrowUp,
   CaretDoubleLeft,
   MagnifyingGlass,
};

interface NavSubItem {
   key: string;
   title: string;
   href?: string;
   external?: boolean;
}

interface NavGroupType {
   key: string;
   title: string;
   icon?: string;
   items: NavSubItem[];
   href?: string;
}

const navItems: NavGroupType[] = [
   {
      key: "group-overview",
      title: "总览",
      icon: "House",
      items: [],
      href: "/dashboard",
   },
   {
      key: "search-database",
      title: "搜索",
      icon: "MagnifyingGlass",
      items: [],
      href: "/dashboard/search",
   },
   {
      key: "group-sourcing",
      title: "采购",
      icon: "Plus",
      items: [
         {
            key: "sourcing-add",
            title: "新增",
            href: "/dashboard/add-product",
         },
         { key: "sourcing-saved", title: "已保存", href: "/dashboard/saved" },
         { key: "sourcing-recent", title: "最近", href: "/dashboard/recent" },
      ],
      href: "",
   },
   {
      key: "group-quotation",
      title: "报价",
      icon: "NotePencil",
      items: [
         {
            key: "quotation-internal",
            title: "内部报价",
            href: "/dashboard/quotation/internal",
         },
         {
            key: "quotation-external",
            title: "客户报价",
            href: "/dashboard/quotation/external",
         },
      ],
      href: "",
   },
   {
      key: "group-customs",
      title: "报关",
      icon: "ArchiveBox",
      items: [
         {
            key: "customs-packing",
            title: "打包清单",
            href: "/dashboard/customs/packing",
         },
         { key: "customs-volume", title: "装运体积", href: "/customs/volume" },
         {
            key: "customs-declaration",
            title: "申报",
            href: "/dashboard/customs/declaration",
         },
      ],
      href: "",
   },
];

function LinkBox({
   href,
   external,
   children,
   ...rest
}: React.PropsWithChildren<{
   href?: string;
   external?: boolean;
   [key: string]: any;
}>) {
   if (external && href) {
      return (
         <Box
            component="a"
            href={href}
            target="_blank"
            rel="noreferrer"
            {...rest}
         >
            {children}
         </Box>
      );
   }
   if (href) {
      return (
         <Box component={RouterLink} to={href} {...rest}>
            {children}
         </Box>
      );
   }
   return (
      <Box component="div" {...rest}>
         {children}
      </Box>
   );
}

interface SideNavProps {
   navOpen: boolean;
   setNavOpen: any;
}

export default function SideNav({ navOpen, setNavOpen }: SideNavProps) {
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";
   const bgColor = isDark ? theme.palette.grey[900] : theme.palette.grey[50];
   const textColor = isDark ? theme.palette.grey[100] : theme.palette.grey[800];

   return (
      <div
         style={
            navOpen
               ? { transition: "all 0.2s ease-in-out" }
               : { display: "none" }
         }
         className="dashboard-side-nav"
      >
         <Box
            sx={{
               width: 240,
               height: "100vh",
               position: "fixed",
               top: 0,
               left: 0,
               overflowY: "auto",
               backgroundColor: bgColor,
               color: textColor,
               borderRight: `1px solid ${
                  isDark ? theme.palette.grey[800] : theme.palette.grey[300]
               }`,
               display: "flex",
               flexDirection: "column",
               p: 2,
               zIndex: 1400,
               boxShadow: "0 0 10px rgba(0, 0, 0, 0.03)",
            }}
         >
            <Box
               sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
               }}
            >
               <Link href="/dashboard" style={{ cursor: "pointer" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                     <img src={Logo} alt="Logo" />
                     <Typography variant="h6" fontWeight="bold">
                        Fulcrums
                     </Typography>
                  </Box>
               </Link>
               <IconButton onClick={() => setNavOpen(!navOpen)}>
                  <CaretDoubleLeft size={20} />
               </IconButton>
            </Box>

            <Box component="nav" sx={{ flex: 1 }}>
               <Stack
                  component="ul"
                  spacing={2}
                  sx={{ listStyle: "none", p: 0, m: 0 }}
               >
                  {navItems.map((group) => (
                     <NavGroup group={group} key={group.key} />
                  ))}
               </Stack>
            </Box>
         </Box>
      </div>
   );
}

function NavGroup({ group }: { group: NavGroupType }) {
   const [open, setOpen] = React.useState(false);
   const { title, icon, items, href } = group;
   const IconComp = icon && iconMap[icon] ? iconMap[icon] : null;
   const isDirectLink = href && items.length === 0;

   const handleToggle = () => {
      if (!isDirectLink) setOpen(!open);
   };

   return (
      <Box component="li">
         <Link {...(isDirectLink ? { href } : {})}>
            <Box
               onClick={handleToggle}
               sx={{
                  p: "6px 16px",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": (theme: any) => ({
                     backgroundColor: theme.palette.action.hover,
                  }),
               }}
            >
               {IconComp && <IconComp size={20} weight="regular" />}
               <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {title}
               </Typography>
               <Box
                  sx={{ marginLeft: "auto" }}
                  style={isDirectLink ? { display: "none" } : {}}
               >
                  {open ? <CaretDown size={16} /> : <CaretRight size={16} />}
               </Box>
            </Box>
         </Link>
         {open && (
            <Box
               sx={{
                  pl: 3,
                  mt: 1,
                  display: "flex",
               }}
            >
               <Box
                  sx={{
                     borderLeft: (theme) =>
                        `2px solid ${theme.palette.divider}`,
                     pl: 2.5, 
                  }}
               >
                  <Stack
                     component="ul"
                     spacing={1.5}
                     sx={{ listStyle: "none", m: 0, p: 0 }}
                  >
                     {items.map((sub) => (
                        <NavSubItem sub={sub} key={sub.key} />
                     ))}
                  </Stack>
               </Box>
            </Box>
         )}
      </Box>
   );
}

function NavSubItem({
   sub,
}: {
   sub: { key: string; title: string; href?: string; external?: boolean };
}) {
   return (
      <Box component="li">
         <LinkBox
            href={sub.href}
            external={sub.external}
            style={{ cursor: "pointer" }}
            sx={{
               p: "10px 16px",
               borderRadius: 1,
               display: "flex",
               alignItems: "center",
               textDecoration: "none",
               color: "inherit",
               "&:hover": (theme: any) => ({
                  backgroundColor: theme.palette.action.hover,
               }),
            }}
         >
            <Typography variant="body2" sx={{ fontWeight: 500, cursor: "pointer" }}>
               {sub.title}
            </Typography>
            {sub.external && (
               <ArrowSquareOut size={16} style={{ marginLeft: "auto" }} />
            )}
         </LinkBox>
      </Box>
   );
}
