// src/theme/components/MuiButton.ts
import { Components, Theme, alpha } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";

function getTextVariantStyles(
   theme: Theme,
   color: "primary" | "secondary" | "success" | "warning" | "info" | "error"
) {
   return {
      "&:hover": {
         backgroundColor: alpha(theme.palette[color].main, 0.08),
      },
      "&:active": {
         backgroundColor: alpha(theme.palette[color].main, 0.16),
      },
   };
}

function getOutlinedVariantStyles(
   theme: Theme,
   color: "primary" | "secondary" | "success" | "warning" | "info" | "error"
) {
   let borderColor = theme.palette[color].main;
   if (color === "secondary") {
      borderColor =
         theme.palette.mode === "dark"
            ? theme.palette.secondary.dark
            : theme.palette.secondary.light;
   }

   return {
      boxShadow: theme.shadows[1],
      borderColor,
      "&:hover": {
         borderColor,
         backgroundColor: alpha(borderColor, 0.04),
      },
      "&:active": {
         backgroundColor: alpha(borderColor, 0.08),
      },
   };
}

function getContainedVariantStyles(
   theme: Theme,
   color: "primary" | "secondary" | "success" | "warning" | "info" | "error"
) {
   const main = theme.palette[color].main;
   const dark = theme.palette[color].dark;

   return {
      backgroundColor: dark,
      backgroundImage: `linear-gradient(180deg, ${main} 0%, ${dark} 100%)`,
      boxShadow: [
         theme.shadows[1],
         `inset 0px 0px 0px 1px ${dark}`,
         "inset 0px 2px 0px 0px rgba(255, 255, 255, 0.16)",
      ].join(", "),
      overflow: "hidden",

      "&:hover": {
         boxShadow: [
            theme.shadows[3],
            `inset 0px 0px 0px 1px ${dark}`,
            "inset 0px 2px 0px 0px rgba(255, 255, 255, 0.16)",
            "inset 0px 6px 10px 0px rgba(255, 255, 255, 0.10)",
         ].join(", "),
         opacity: 1,
      },
      "&:active": {
         backgroundImage: `linear-gradient(180deg, ${dark} 0%, ${dark} 100%)`,
      },
      "&:focus-visible": {
         boxShadow: theme.shadows[3],
         outlineOffset: "1px",
      },
      [`&.${buttonClasses.disabled}`]: {
         backgroundImage: "none",
         "&::before": { boxShadow: "none" },
      },
   };
}

export const MuiButton: Partial<Components<Theme>["MuiButton"]> = {
   defaultProps: {
      disableRipple: true,
   },
   styleOverrides: {
      root: {
         borderRadius: "18px",
         minHeight: "var(--Button-minHeight)", 
         minWidth: "unset",
         textTransform: "none",
         "&:focus-visible": {
            outline: "2px solid", 
            outlineColor: (theme: Theme) => theme.palette.primary.main,
         },
      },
      text: {
         backgroundColor: "transparent",
      },

      textPrimary: ({ theme }) => getTextVariantStyles(theme, "primary"),
      textSecondary: ({ theme }) => getTextVariantStyles(theme, "secondary"),
      textSuccess: ({ theme }) => getTextVariantStyles(theme, "success"),
      textInfo: ({ theme }) => getTextVariantStyles(theme, "info"),
      textWarning: ({ theme }) => getTextVariantStyles(theme, "warning"),
      textError: ({ theme }) => getTextVariantStyles(theme, "error"),

      outlinedPrimary: ({ theme }) =>
         getOutlinedVariantStyles(theme, "primary"),
      outlinedSecondary: ({ theme }) =>
         getOutlinedVariantStyles(theme, "secondary"),
      outlinedSuccess: ({ theme }) =>
         getOutlinedVariantStyles(theme, "success"),
      outlinedInfo: ({ theme }) => getOutlinedVariantStyles(theme, "info"),
      outlinedWarning: ({ theme }) =>
         getOutlinedVariantStyles(theme, "warning"),
      outlinedError: ({ theme }) => getOutlinedVariantStyles(theme, "error"),

      contained: {
      },
      containedPrimary: ({ theme }) =>
         getContainedVariantStyles(theme, "primary"),
      containedSecondary: ({ theme }) =>
         getContainedVariantStyles(theme, "secondary"),
      containedSuccess: ({ theme }) =>
         getContainedVariantStyles(theme, "success"),
      containedInfo: ({ theme }) => getContainedVariantStyles(theme, "info"),
      containedWarning: ({ theme }) =>
         getContainedVariantStyles(theme, "warning"),
      containedError: ({ theme }) => getContainedVariantStyles(theme, "error"),

      sizeSmall: {
         "--Button-minHeight": "32px",
         fontSize: "0.8125rem",
         lineHeight: "24px",
      },
      sizeMedium: {
         "--Button-minHeight": "40px",
         fontSize: "0.875rem",
         lineHeight: "28px",
      },
      sizeLarge: {
         "--Button-minHeight": "48px",
         fontSize: "0.9375rem",
         lineHeight: "32px",
      },
   },
};
