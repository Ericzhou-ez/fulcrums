// @ts-ignore

import React, { useState } from "react";
import "@theme-toggles/react/css/Classic.css";
import "../../styles/footer.css";
import HomeLight from "../../assets/icons/home-light.svg";
import HomeDark from "../../assets/icons/home-dark.svg";
import RecentLight from "../../assets/icons/recent-light.svg";
import RecentDark from "../../assets/icons/recent-dark.svg";
import HeartLight from "../../assets/icons/heart-light.svg";
import HeartDark from "../../assets/icons/heart-dark.svg";
import Logo from "../../assets/images/logo.svg";
import {
   Box,
   Typography,
   Divider,
   Container,
   Grid,
   Stack,
   Link,
   IconButton,
   useTheme,
   useMediaQuery,
   Tooltip,
} from "@mui/material";
import ThemeSwitch from "../core/themeSwitch";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
   CaretDown,
   CaretUp,
   List,
   ShieldCheck,
   PhoneIncoming,
} from "phosphor-react";
import { blueGrey } from "@mui/material/colors";
import { useThemeContext } from "../../contexts/themeContextProvider";

const groups = [
   {
      key: "menu",
      title: "菜单",
      items: [
         { key: "home", title: "主页", href: "/" },
         { key: "dashboard", title: "概览", href: "/dashboard" },
         { key: "product", title: "产品管理", href: "/products" },
         { key: "quotation", title: "报价管理", href: "/quotations" },
         { key: "customs", title: "报关管理", href: "/customs" },
      ],
   },
   {
      key: "legal",
      title: "法律",
      items: [
         { key: "terms", title: "条款", href: "/terms" },
         { key: "privacy", title: "隐私", href: "/privacy" },
         { key: "cookies", title: "Cookie 政策", href: "/cookies" },
         {
            key: "contact",
            title: "联系我们",
            external: false,
            href: "/contact",
         },
      ],
   },
   {
      key: "social",
      title: "社交",
      items: [
         {
            key: "email",
            title: "邮件",
            external: true,
            href: "mailto:zhoueric882@gmail.com",
         },
         {
            key: "instagram",
            title: "Instagram",
            external: true,
            href: "https://www.instagram.com/eric_zh0u/",
         },
         {
            key: "linkedin",
            title: "LinkedIn",
            external: true,
            href: "https://www.linkedin.com/in/eric-zhou-ez/",
         },
         {
            key: "github",
            title: "GitHub",
            external: true,
            href: "https://github.com/Ericzhou-ez",
         },
      ],
   },
];

const Footer = () => {
   const mode = useTheme();
   const theme = mode.palette.mode;
   const isDark = theme === "dark";
   const {toggleTheme} = useThemeContext();
   const year = new Date().getFullYear();
   const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
      {}
   );
   const muiTheme = useTheme();
   const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

   const toggleSection = (key: string) => {
      setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
   };

   return (
      <footer
         className="footer-container"
         style={{ position: "relative", paddingBottom: "25px" }}
      >
         <div className="footer">
            <div className="footer-divider"></div>

            <div className="footer-bottom">
               <div className="footer-logo">
                  <a href="/">
                     <Tooltip title="home">
                        <h6>Fulcrums</h6>
                     </Tooltip>
                  </a>
               </div>

               <div className="icon-container">
                  <RouterLink to="/dashboard">
                     <Tooltip title="总览">
                        <img src={isDark ? HomeDark : HomeLight} alt="Home" />
                     </Tooltip>
                  </RouterLink>
                  <RouterLink to="/recent">
                     <Tooltip title="最近">
                        <img
                           src={isDark ? RecentDark : RecentLight}
                           alt="Recent"
                        />
                     </Tooltip>
                  </RouterLink>
                  <RouterLink to="/saved">
                     <Tooltip title="已保存">
                        <img
                           src={isDark ? HeartDark : HeartLight}
                           alt="Saved"
                        />
                     </Tooltip>
                  </RouterLink>
               </div>
            </div>
         </div>

         <Box
            sx={{
               borderTop: "1px solid var(--mui-palette-divider)",
               p: 0,
               pt: { sm: 0, xs: 2 },
            }}
         >
            <Container maxWidth={false} disableGutters>
               <Grid container spacing={{ sx: 2, sm: 3 }}>
                  <Grid
                     item
                     xs={12}
                     sm={3}
                     sx={{
                        textAlign: "left",
                        display: { xs: "none", sm: "flex" },
                     }}
                  >
                     <Stack
                        spacing={1}
                        alignItems={{ xs: "center", sm: "flex-start" }}
                     >
                        <img
                           style={{ height: "60px", width: "60px" }}
                           src={Logo}
                           alt="logo"
                        />
                        <Typography variant="caption">
                           Powered by BATI-MAT DISTRIBUTION LIMITED.
                           <br />© {year} Fulcrums, Eric Zhou.
                        </Typography>
                     </Stack>
                  </Grid>

                  {groups.map((section) => (
                     <Grid
                        item
                        key={section.key}
                        xs={12}
                        sm={3}
                        sx={{ textAlign: "left" }}
                     >
                        <div
                           onClick={() => toggleSection(section.key)}
                           style={{
                              display: isMobile ? "flex" : "none",
                              justifyContent: "space-between",
                              alignItems: "center",
                              cursor: "pointer",
                              borderBottom:
                                 "2px solid var(--background-secondary-color)",
                              marginBottom: "8px",
                              paddingBottom: "3px",
                           }}
                        >
                           <Typography
                              color="text.secondary"
                              fontWeight="800"
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: "4px",
                              }}
                           >
                              {section.title}
                           </Typography>
                           <IconButton
                              size="small"
                              style={{ transition: "all 0.3s ease-in-out" }}
                           >
                              {openSections[section.key] ? (
                                 <CaretUp size={16} />
                              ) : (
                                 <CaretDown size={16} />
                              )}
                           </IconButton>
                        </div>

                        <Stack
                           component="ul"
                           spacing={0.5}
                           sx={{
                              listStyle: "none",
                              display: {
                                 xs: openSections[section.key]
                                    ? "block"
                                    : "none",
                                 sm: "flex",
                              },
                           }}
                           style={{
                              paddingLeft: "0px",
                           }}
                        >
                           <Typography
                              fontWeight="600"
                              sx={{
                                 display: {
                                    xs: "none",
                                    sm: "inline-block",
                                    fontSize: "1.1rem",
                                    marginBottom: "8px !important",
                                 },
                              }}
                           >
                              {section.title}
                           </Typography>
                           {section.items.map((item) => (
                              <NavItem {...item} key={item.key} />
                           ))}
                        </Stack>
                     </Grid>
                  ))}

                  <Grid
                     item
                     justifyContent="center"
                     xs={12}
                     sm={3}
                     sx={{
                        textAlign: "center",
                        display: { xs: "flex", sm: "none" },
                     }}
                  >
                     <Stack
                        spacing={1}
                        alignItems={{ xs: "center", sm: "flex-start" }}
                     >
                        <img
                           style={{ height: "60px", width: "60px" }}
                           src={Logo}
                           alt="logo"
                        />
                        <Typography color="text.secondary" variant="caption">
                           Powered by BATI-MAT DISTRIBUTION LIMITED.
                           <br />© {year} Eric Zhou.
                        </Typography>
                     </Stack>
                  </Grid>
               </Grid>

               <Divider sx={{ my: 3 }} />

               <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
               >
                  <Typography color="text.secondary" variant="caption">
                     All Rights Reserved.
                  </Typography>
                  <div className="theme-btn-container">
                     <ThemeSwitch
                        currentTheme={theme}
                        handleToggleTheme={toggleTheme}
                     />
                  </div>
               </Stack>
            </Container>
         </Box>
      </footer>
   );
};

interface NavItemProps {
   href?: string;
   external?: boolean;
   title: string;
}

function NavItem({ href, external, title }: NavItemProps) {
   const navigate = useNavigate();

   return (
      <Stack
         direction="row"
         sx={{
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
         }}
      >
         {external ? (
            <Link
               component="a"
               href={href}
               target="_blank"
               rel="noopener noreferrer"
               sx={{
                  fontSize: {
                     xs: "0.8rem !important",
                     sm: "0.9rem !important",
                     color: "var(--text-secondary-color) !important",
                  },
                  textDecoration: "none",
                  display: "inline-block",
                  "&:hover": {
                     textDecoration: "underline !important",
                     color: "#db772a !important",
                  },
                  cursor: "pointer !important",
               }}
            >
               {title}
            </Link>
         ) : (
            <Link
               component={RouterLink}
               to={href || ""}
               sx={{
                  fontSize: {
                     xs: "0.8rem !important",
                     sm: "0.9rem !important",
                     color: "var(--text-secondary-color) !important",
                  },
                  textDecoration: "none",
                  display: "inline-block",
                  "&:hover": {
                     textDecoration: "underline !important",
                     color: "#db772a !important",
                  },
                  cursor: "pointer !important",
               }}
               onClick={(e) => {
                  if (href) {
                     e.preventDefault();
                     navigate(href);
                     window.scrollTo({ top: 0, behavior: "smooth" });
                  }
               }}
            >
               {title}
            </Link>
         )}
      </Stack>
   );
}

export default Footer;
