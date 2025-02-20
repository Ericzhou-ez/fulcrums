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

interface FooterProps {
   theme: string;
   handleToggleTheme: () => void;
}

const groups = [
   {
      key: "menu",
      title: "Menu",
      icon: <List size={16} />,
      items: [
         { key: "home", title: "Home", href: "/" },
         { key: "signin", title: "Login", href: "/signin" },
         { key: "recent", title: "Recent", href: "/recent" },
         { key: "saved", title: "Saved", href: "/saved" },
      ],
   },
   {
      key: "legal",
      title: "Legal",
      icon: <ShieldCheck size={16} />,
      items: [
         { key: "terms", title: "Terms", href: "/terms" },
         { key: "privacy", title: "Privacy", href: "/privacy" },
         {
            key: "contact",
            title: "Contact",
            external: true,
            href: "mailto:zhoueric882@gmail.com",
         },
      ],
   },
   {
      key: "social",
      title: "Socials",
      icon: <PhoneIncoming size={16} />,
      items: [
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

const Footer: React.FC<FooterProps> = ({ theme, handleToggleTheme }) => {
   const isDark = theme === "dark";
   const year = new Date().getFullYear();
   const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
      {}
   );

   const toggleSection = (key: string) => {
      setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
   };

   return (
      <footer>
         <div className="footer">
            <div className="footer-divider"></div>

            <div className="footer-bottom">
               <div className="footer-logo">
                  <h6>Fulcrum</h6>
               </div>

               <div className="icon-container">
                  <RouterLink to="/dashboard">
                     <img src={isDark ? HomeDark : HomeLight} alt="Home" />
                  </RouterLink>
                  <RouterLink to="/recent">
                     <img
                        src={isDark ? RecentDark : RecentLight}
                        alt="Recent"
                     />
                  </RouterLink>
                  <RouterLink to="/saved">
                     <img src={isDark ? HeartDark : HeartLight} alt="Saved" />
                  </RouterLink>
               </div>
            </div>
         </div>

         <Box
            component="footer"
            sx={{
               borderTop: "1px solid var(--mui-palette-divider)",
               pb: 4,
               pt: { sm: 0, xs: 2 },
            }}
         >
            <Container maxWidth={false}>
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
                        <Typography color="text.secondary" variant="caption">
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
                        <Box
                           sx={{
                              display: { xs: "flex", sm: "none" },
                              justifyContent: "space-between",
                              alignItems: "center",
                              cursor: "pointer",
                              borderBottom:
                                 "1px solid var(--mui-palette-divider)",
                              mb: 1,
                           }}
                           onClick={() => toggleSection(section.key)}
                        >
                           <Typography
                              color="text.secondary"
                              fontWeight="700"
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: "4px",
                              }}
                           >
                              {section.icon}
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
                        </Box>

                        <Stack
                           component="ul"
                           spacing={0.8}
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
                              paddingLeft: "22px",
                           }}
                        >
                           <Typography
                              fontWeight="600"
                              sx={{
                                 display: { xs: "none", sm: "inline-block" },
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
                     <ThemeSwitch handleToggleTheme={handleToggleTheme} />
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
         <Link
            {...(href
               ? external
                  ? {
                       component: "a" as "a",
                       href,
                       target: "_blank",
                       rel: "noopener noreferrer",
                    }
                  : { component: RouterLink as typeof RouterLink, to: href }
               : {})}
            color="text.secondary"
            sx={{
               fontSize: { xs: "0.8rem !important", sm: "0.9rem !important" },
               textDecoration: "none",
               display: "inline-block",
               "&:hover": { textDecoration: "underline !important" },
               cursor: "pointer !important",
            }}
            onClick={(e) => {
               if (!external && href) {
                  e.preventDefault();
                  navigate(href);
                  window.scrollTo({ top: 0, behavior: "smooth" });
               }
            }}
         >
            {title}
         </Link>
      </Stack>
   );
}

export default Footer;
