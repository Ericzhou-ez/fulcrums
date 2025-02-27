import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CaretDown as CaretDownIcon } from "phosphor-react";

interface Option {
   label: string;
   value: string;
}

interface MultiSelectProps {
   label: string;
   options: Option[];
   value: string | null;
   onChange: (value: string) => void;
}

export function MultiSelect({
   label,
   options,
   value,
   onChange,
}: MultiSelectProps) {
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);

   const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const handleValueChange = (optionValue: string) => {
      onChange(optionValue);
      handleClose();
   };

   const selectedOption = options.find((option) => option.value === value);
   const displayText = selectedOption?.label || label;

   return (
      <>
         <Button
            color="secondary"
            endIcon={<CaretDownIcon size={15} />}
            onClick={handleOpen}
            sx={{
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               padding: "6px 20px",
               textTransform: "none",
               maxWidth: "250px",
               overflow: "hidden",
               textOverflow: "ellipsis",
               whiteSpace: "nowrap",
               color: selectedOption ? "inherit" : "gray",
               borderRadius: 5,
               border: "1px solid rgba(0,0,0,0.1)",
               fontSize: { xs: "0.78rem", md: "0.9rem" },
               fontWeight: "400",
               "& .MuiButton-endIcon": {
                  marginLeft: "0px",
               },
            }}
         >
            <span
               style={{
                  margin: "0 5px",
               }}
            >
               {displayText}
            </span>
         </Button>

         <Menu
            anchorEl={anchorEl}
            onClose={handleClose}
            open={open}
            PaperProps={{
               sx: {
                  width: { xs: "150px", md: "250px" },
                  borderRadius: 4,
                  maxHeight: "300px",
               },
            }}
         >
            {options.map((option) => (
               <MenuItem
                  key={option.value}
                  onClick={() => handleValueChange(option.value)}
                  selected={value === option.value}
                  sx={{
                     padding: "10px 15px",
                     fontSize: { xs: "0.78rem", md: "0.9rem" },
                     fontWeight: value === option.value ? "600" : "400",
                     backgroundColor:
                        value === option.value
                           ? "rgba(0, 0, 0, 0.05)"
                           : "transparent",
                     "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                     },
                  }}
               >
                  {option.label}
               </MenuItem>
            ))}
         </Menu>
      </>
   );
}
