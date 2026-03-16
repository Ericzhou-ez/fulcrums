/**
 * Theme overrides for MUI X Date Pickers (input field + calendar popper).
 * Requires "@mui/x-date-pickers/themeAugmentation" to be imported in the theme.
 */
export const MuiPickersOutlinedInput = {
   styleOverrides: {
      root: {
         borderRadius: "12px",
      },
      notchedOutline: {
         borderRadius: "12px",
      },
   },
};

export const MuiPickerPopper = {
   styleOverrides: {
      paper: {
         borderRadius: "12px",
         padding: 0,
      },
   },
};
