import {
   Button,
   Typography,
   Box,
   Stack,
   Autocomplete,
   TextField,
} from "@mui/material";

export default function Components() {
   const variants = ["text", "outlined", "contained"] as const;
   const sizes = ["small", "medium", "large"] as const;
   const colors = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "error",
   ] as const;

   return (
      <Box className="components" sx={{ placeContent: "center" }}>
         <Typography
            variant="h1"
            sx={{ margin: "20px 40px", fontSize: "2rem", fontWeight: "700" }}
            textAlign="center"
         >
            Components
         </Typography>

         <Autocomplete
            options={[
               "Option 1",
               "Option 2",
               "Option 3",
               "Option 4",
               "Option 5",
               "Option 6",
               "Option 7",
               "Option 8",
               "Option 9",
            ]}
            renderInput={(params) => (
               <TextField {...params} label="Autocomplete" />
            )}
         />

         <Stack spacing={4}>
            {colors.map((color) => (
               <div key={color}>
                  <h3 style={{ margin: 0, marginBottom: 8 }}>{color} color</h3>

                  {variants.map((variant) => (
                     <Stack
                        key={variant}
                        direction="row"
                        spacing={2}
                        marginBottom={2}
                     >
                        {sizes.map((size) => (
                           <Button
                              key={size}
                              variant={variant}
                              size={size}
                              color={color}
                           >
                              {`${variant} – ${size} – ${color}`}
                           </Button>
                        ))}
                     </Stack>
                  ))}
               </div>
            ))}
         </Stack>
      </Box>
   );
}
