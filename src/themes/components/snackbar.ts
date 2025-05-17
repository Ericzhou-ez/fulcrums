import { alpha } from "@mui/material";

export const MuiSnackbar = {
   defaultProps: {
      autoHideDuration: 3000,
   },
   styleOverrides: {
      root: ({ theme }: { theme: any }) => ({
         zIndex: theme.zIndex.tooltip + 1,
      }),
   },
};

export const MuiSnackbarContent = {
   styleOverrides: {
      root: ({ theme }: { theme: any }) => ({
         backgroundColor: theme.palette.background.default,
         color: theme.palette.text.primary,
         boxShadow: theme.shadows[6],
         borderRadius: theme.shape.borderRadius * 2,
         padding: theme.spacing(2, 2.5),
         fontWeight: 500,
         animation: "fadein 200ms ease-in-out",
         "@keyframes fadein": {
            "0%": { opacity: 0, transform: "translateY(8px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
         },
      }),
      action: ({ theme }: { theme: any }) => ({
         color: alpha(theme.palette.primary.contrastText, 0.7),
         "&:hover": {
            color: theme.palette.primary.contrastText,
         },
      }),
      message: {
         lineHeight: 1.4,
      },
   },
};
