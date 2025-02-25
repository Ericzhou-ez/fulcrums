import React, { useState, useRef } from "react";
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
   onChange?: (value: string[]) => void;
   options: Option[];
   value?: string[];
}

export function MultiSelect({ label, onChange, options, value = [] }: MultiSelectProps) {
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);

   const handleOpen = (event: any) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const handleValueChange = (v: any, checked: any) => {
      let updatedValue = [...value];

      if (checked) {
         updatedValue.push(v);
      } else {
         updatedValue = updatedValue.filter((item) => item !== v);
      }

      onChange?.(updatedValue);
   };

   return (
      <React.Fragment>
         <Button
            color="secondary"
            endIcon={<CaretDownIcon />}
            onClick={handleOpen}
            sx={{
               "& .MuiButton-endIcon svg": {
                  fontSize: "var(--icon-fontSize-sm)",
               },
            }}
         >
            {label}
         </Button>
         <Menu
            anchorEl={anchorEl}
            onClose={handleClose}
            open={open}
            PaperProps={{ sx: { width: "250px" } }}
         >
            {options.map((option) => {
               const selected = value.includes(option.value);

               return (
                  <MenuItem
                     key={option.label}
                     onClick={() => handleValueChange(option.value, !selected)}
                     selected={selected}
                  >
                     {option.label}
                  </MenuItem>
               );
            })}
         </Menu>
      </React.Fragment>
   );
}
