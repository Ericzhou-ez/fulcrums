export const MuiInputBase = {
   styleOverrides: {
      root: {
         borderRadius: "12px !important",
         "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary-light-color) !important",
         },
      },
      sizeSmall: {
         "--Input-fontSize": "0.9rem",
      },
   },
};
