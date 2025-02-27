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
   onChange: any;
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
            endIcon={<CaretDownIcon />}
            onClick={handleOpen}
            sx={{
               "& .MuiButton-endIcon svg": {
                  fontSize: "var(--icon-fontSize-sm)",
               },
               textTransform: "none",
               maxWidth: "200px",
               overflow: "hidden",
               textOverflow: "ellipsis",
               whiteSpace: "nowrap",
               color: selectedOption ? "inherit" : "gray",
               borderRadius: 4,
            }}
         >
            {displayText}
         </Button>
         <Menu
            anchorEl={anchorEl}
            onClose={handleClose}
            open={open}
            PaperProps={{ sx: { width: { xs: "150px", md: "230px", maxHeight: "400px" }, borderRadius: 4 } }}
         >
            {options.map((option) => (
               <MenuItem
                  key={option.value}
                  onClick={() => handleValueChange(option.value)}
                  selected={value === option.value}
               >
                  {option.label}
               </MenuItem>
            ))}
         </Menu>
      </>
   );
}
