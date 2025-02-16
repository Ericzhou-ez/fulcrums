import React, { useEffect } from "react";
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
} from "@mui/material";
import ThemeSwitch from "../core/themeSwitch";
import { Link as RouterLink } from "react-router-dom";

interface FooterProps {
   theme: string;
   handleToggleTheme: () => void;
}

const groups = [
   {
      key: "menu",
      title: "Menu",
      items: [
         {
            key: "Home",
            title: "Home",
            href: "/",
         },
         {
            key: "dashboard",
            title: "Dashboard",
            href: "/dashboard",
         },
         {
            key: "signin",
            title: "Login",
            href: "/signin",
         },
      ],
   },
   {
      key: "legal",
      title: "Legal",
      items: [
         {
            key: "terms-and-conditions",
            title: "Terms & Conditions",
            href: "/err",
         },
         { key: "privacy-policy", title: "Privacy Policy", href: "/err" },
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

   return (
      <footer>
         <div className="footer">
            <div className="footer-divider"></div>

            <div className="footer-bottom">
               <div className="footer-logo">
                  <img src={Logo} alt="logo" />
                  <h6>BM-Assist</h6>
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
               pb: 6,
               pt: { md: 15, xs: 6 },
            }}
         >
            <Container
               maxWidth="lg"
               sx={{
                  justifyContent: { xs: "center", md: "left" },
               }}
            >
               <Grid
                  container
                  spacing={3}
                  justifyContent={{ xs: "center", md: "flex-start" }}
               >
                  <Grid
                     item
                     md={3}
                     sm={4}
                     xs={12}
                     sx={{
                        order: { xs: 4, md: 1 },
                        textAlign: { xs: "center", md: "left" },
                     }}
                  >
                     <Stack
                        spacing={1}
                        alignItems={{ xs: "center", md: "flex-start" }}
                     >
                        <img
                           style={{ height: "100px", width: "100px" }}
                           src={Logo}
                           alt="logo"
                        />
                        <Typography color="text.secondary" variant="caption">
                           © {year} BATI-MAT DISTRIBUTION LIMITED. <br /> ©{" "}
                           {year} Eric Zhou.
                        </Typography>
                     </Stack>
                  </Grid>

                  {groups.map((section, index) => (
                     <Grid
                        item
                        key={section.key}
                        md={3}
                        sm={4}
                        xs={12}
                        sx={{
                           order: { md: index + 2, xs: index + 1 },
                           textAlign: { xs: "center", md: "left" },
                        }}
                     >
                        <Typography
                           color="text.secondary"
                           variant="overline"
                           fontWeight="600"
                           fontSize="1rem"
                        >
                           {section.title}
                        </Typography>
                        <Stack
                           component="ul"
                           spacing={1}
                           sx={{
                              listStyle: "none",
                              m: 0,
                              p: 0,
                              alignItems: { xs: "center", md: "flex-start" },
                           }}
                        >
                           {section.items.map((item) => (
                              <NavItem {...item} key={item.key} />
                           ))}
                        </Stack>
                     </Grid>
                  ))}
               </Grid>

               <Divider sx={{ my: 6 }} />

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
   return (
      <Stack
         direction="row"
         sx={{ alignItems: "center", justifyContent: "flex-start", gap: 1 }}
      >
         <Box
            sx={{
               bgcolor: "var(--secondary-color)",
               height: "5px",
               width: "15px",
            }}
         />
         <Link
            {...(href
               ? external
                  ? {
                       component: "a",
                       href,
                       target: "_blank",
                       rel: "noopener noreferrer",
                    }
                  : { component: RouterLink, to: href }
               : {})}
            color="text.primary"
            variant="subtitle2"
            sx={{
               textDecoration: "none",
               display: "inline-block",
               "&:hover": {
                  textDecoration: "underline !important",
               },
               cursor: "pointer !important",
            }}
         >
            {title}
         </Link>
      </Stack>
   );
}

export default Footer;
