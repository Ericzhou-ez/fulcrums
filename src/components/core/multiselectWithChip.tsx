import * as React from "react";
import {
   Box,
   Chip,
   FormControl,
   InputLabel,
   MenuItem,
   OutlinedInput,
   Select,
   SelectChangeEvent,
} from "@mui/material";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";

interface ClientSelectProps {
   selectedClientIds: string[];
   setSelectedClientIds: (val: string[]) => void;
}

const MultipleSelectChip: React.FC<ClientSelectProps> = ({
   selectedClientIds,
   setSelectedClientIds,
}) => {
   const { clients } = useProductSupplierClientContext();

   const handleChange = (
      event: SelectChangeEvent<typeof selectedClientIds>
   ) => {
      const {
         target: { value },
      } = event;
      setSelectedClientIds(
         typeof value === "string" ? value.split(",") : value
      );
   };

   return (
      <FormControl fullWidth sx={{ bgcolor: "background.paper" }}>
         <InputLabel id="client-name-label">客户</InputLabel>
         <Select
            labelId="client-name-label"
            id="client-name-select"
            multiple
            value={selectedClientIds}
            onChange={handleChange}
            input={
               <OutlinedInput
                  label="客户"
                  sx={{
                     borderRadius: 2,
                     "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d0d7de",
                     },
                     "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#aab4be",
                     },
                  }}
               />
            }
            renderValue={(selected) => (
               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => (
                     <Chip
                        key={id}
                        label={clients[id]?.companyName ?? id}
                        sx={{
                           borderRadius: "8px",
                           fontWeight: 500,
                        }}
                     />
                  ))}
               </Box>
            )}
            MenuProps={{
               PaperProps: {
                  sx: {
                     borderRadius: 3,
                     boxShadow: "0px 5px 25px rgba(0,0,0,0.1)",
                     "& .MuiMenuItem-root": {
                        borderRadius: 1,
                        transition: "background-color 0.2s",
                     },
                     "& .MuiMenuItem-root:hover": {
                        bgcolor: "rgba(0,0,0,0.04)",
                     },
                     "& .MuiMenuItem-root:active": {
                        bgcolor: "rgba(0,0,0,0.1)",
                     },
                  },
               },
            }}
         >
            {Object.values(clients).map((c) => (
               <MenuItem
                  key={c.clientId}
                  value={c.clientId}
                  sx={{ px: 2, py: 1 }}
               >
                  {c.companyName}
               </MenuItem>
            ))}
         </Select>
      </FormControl>
   );
};

export default MultipleSelectChip;
