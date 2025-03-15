export const MuiAutocomplete = {
   defaultProps: {
      noOptionsText: "无结果 :(",
   },
   styleOverrides: {
      root: {
         "& .MuiOutlinedInput-root": {
            padding: "16.5px 14px !important",

            "& .MuiAutocomplete-input": {
               padding: 0,
            },
         },
      },
      paper: {
         border: "1px solid var(--mui-palette-divider)",
         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
         marginTop: 6,
         maxHeight: "200px",
         overflow: "scroll",
         borderRadius: "12px !important",
      },
      listbox: {
         padding: 8,
         gap: 4,
         "& .MuiAutocomplete-option": {
            padding: "8px 8px",
            borderRadius: 5,
         },
      },
   },
};
