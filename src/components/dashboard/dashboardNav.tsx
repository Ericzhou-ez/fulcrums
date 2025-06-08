import * as React from "react";
import {
   Box,
   Stack,
   Typography,
   IconButton,
   useTheme,
   Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
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
   MagnifyingGlass,
   CodesandboxLogo,
   ShoppingBagOpen,
   Table,
} from "phosphor-react";
import Logo from "../../assets/images/logo.svg";
import { useUIStateContext } from "../../contexts/UIStateContextProvider";
import { useThemeContext } from "../../contexts/themeContextProvider";

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
   CodesandboxLogo,
   ShoppingBagOpen,
   Table,
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
      key: "add-product",
      title: "新增",
      icon: "Plus",
      items: [],
      href: "/dashboard/add-product",
   },
   {
      key: "group-sourcing",
      title: "产品",
      icon: "CodesandboxLogo",
      items: [
         { key: "sourcing-saved", title: "已保存", href: "/dashboard/saved" },
         { key: "sourcing-recent", title: "最近", href: "/dashboard/recent" },
      ],
   },
   {
      key: "client-management",
      title: "客户",
      icon: "Users",
      items: [],
      href: "/dashboard/clients",
   },
   {
      key: "supplier-management",
      title: "供应商",
      icon: "ShoppingBagOpen",
      items: [],
      href: "/dashboard/suppliers",
   },
   {
      key: "purchasing-order",
      title: "订单",
      icon: "Table",
      items: [],
      href: "/dashboard/purchasing-order",
   },
   {
      key: "quotation",
      title: "报价",
      icon: "NotePencil",
      items: [],
      href: "/dashboard/quotation",
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
         {
            key: "customs-volume",
            title: "装运体积",
            href: "/dashboard/customs/volume",
         },
         {
            key: "customs-declaration",
            title: "申报",
            href: "/dashboard/customs/declaration",
         },
      ],
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
   setNavOpen: (open: boolean) => void;
}

export default function SideNav({ navOpen, setNavOpen }: SideNavProps) {
   const theme = useTheme();
   const isDark = theme.palette.mode === "dark";
   const { navStyle } = useUIStateContext();
   const { isPhoneUp } = useThemeContext();

   const textColor = isDark ? theme.palette.grey[100] : theme.palette.grey[800];
   const location = useLocation();

   let bgColor: string;
   switch (navStyle) {
      case "evident":
         bgColor = "#121621";
         break;
      case "blend-in":
         bgColor = isDark ? "#121212" : "#fff";
         break;
      case "discrete":
      default:
         bgColor = isDark ? theme.palette.grey[900] : theme.palette.grey[50];
   }

   if (!navOpen) return null;

   return (
      <Box
         className="dashboard-side-nav"
         sx={{
            width: isPhoneUp ? 240 : "80vw",
            maxWidth: "400px",
            height: "100dvh",
            position: "fixed",
            top: 0,
            left: 0,
            overflowY: "auto",
            backgroundColor: bgColor,
            borderRight: `1px solid ${
               isDark ? theme.palette.grey[800] : theme.palette.grey[300]
            }`,
            display: "flex",
            flexDirection: "column",
            p: 2,
            zIndex: 1400,
            boxShadow: "0 0 10px rgba(0,0,0,0.03)",
            color: navStyle === "evident" ? "#fff" : textColor,
         }}
      >
         <Box
            sx={{
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               mb: 4,
               mt: 1.5,
            }}
         >
            <MuiLink
               component={RouterLink}
               to="/dashboard"
               sx={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  alignItems: "center",
                  p: 0,
               }}
            >
               <Box
                  component="img"
                  src={Logo}
                  alt="Logo"
                  width={40}
                  height={40}
                  sx={{ verticalAlign: "middle", flexShrink: 0 }}
               />
               <Typography
                  component="span"
                  variant="h5"
                  fontWeight="bold"
                  sx={{ verticalAlign: "middle", flexShrink: 0 }}
               >
                  Fulcrums
               </Typography>
            </MuiLink>

            <IconButton onClick={() => setNavOpen(false)}>
               <CaretDoubleLeft
                  size={20}
                  color={navStyle === "evident" || isDark ? "#fff" : "#000"}
               />
            </IconButton>
         </Box>

         <Box component="nav" sx={{ flex: 1 }}>
            <Stack
               component="ul"
               spacing={1.4}
               sx={{ listStyle: "none", p: 0, m: 0 }}
            >
               {navItems.map((group) => (
                  <NavGroup
                     key={group.key}
                     group={group}
                     currentPath={location.pathname}
                  />
               ))}
            </Stack>
         </Box>
      </Box>
   );
}

interface NavGroupProps {
   group: NavGroupType;
   currentPath: string;
}

function NavGroup({ group, currentPath }: NavGroupProps) {
   const theme = useTheme();
   const { title, icon, items = [], href } = group;
   const IconComp = icon && iconMap[icon];
   const isDirectLink = Boolean(href && items.length === 0);

   const shouldBeOpen = items.some((it) => it.href === currentPath);
   const [open, setOpen] = React.useState<boolean>(shouldBeOpen);
   React.useEffect(() => {
      setOpen(shouldBeOpen);
   }, [shouldBeOpen]);

   const isGroupActive = href === currentPath;

   return (
      <Box component="li">
         <LinkBox href={isDirectLink ? href : undefined}>
            <Box
               onClick={() => !isDirectLink && setOpen((o) => !o)}
               sx={{
                  p: "6px 16px",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: isDirectLink ? "pointer" : "default",
                  backgroundColor: isGroupActive ? "#f57c31" : "transparent",
                  color: isGroupActive ? "#fff" : "inherit",
                  "&:hover": {
                     backgroundColor: isGroupActive
                        ? "#f27527"
                        : theme.palette.action.hover,
                  },
               }}
            >
               {IconComp && <IconComp size={20} />}
               <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {title}
               </Typography>
               {!isDirectLink && (
                  <Box sx={{ ml: "auto" }}>
                     {open ? <CaretDown size={16} /> : <CaretRight size={16} />}
                  </Box>
               )}
            </Box>
         </LinkBox>

         {open && items.length > 0 && (
            <Box sx={{ pl: 3, mt: 1, display: "flex" }}>
               <Box
                  sx={{
                     borderLeft: `2px solid ${theme.palette.divider}`,
                     pl: 2.5,
                  }}
               >
                  <Stack
                     component="ul"
                     spacing={0.5}
                     sx={{ listStyle: "none", p: 0, m: 0 }}
                  >
                     {items.map((sub) => (
                        <NavSubItem
                           key={sub.key}
                           sub={sub}
                           currentPath={currentPath}
                        />
                     ))}
                  </Stack>
               </Box>
            </Box>
         )}
      </Box>
   );
}

interface NavSubItemProps {
   sub: NavSubItem;
   currentPath: string;
}

function NavSubItem({ sub, currentPath }: NavSubItemProps) {
   const theme = useTheme();
   const isActive = sub.href === currentPath;

   return (
      <Box component="li">
         <LinkBox href={sub.href} external={sub.external}>
            <Box
               sx={{
                  p: "8px 12px",
                  width: "125px",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",

                  backgroundColor: isActive ? "#f57c31" : "transparent",
                  color: isActive ? "white" : "inherit",
                  "&:hover": {
                     backgroundColor: isActive
                        ? "#f27527"
                        : theme.palette.action.hover,
                  },
               }}
            >
               <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {sub.title}
               </Typography>
               {sub.external && (
                  <ArrowSquareOut size={16} style={{ marginLeft: "auto" }} />
               )}
            </Box>
         </LinkBox>
      </Box>
   );
}
