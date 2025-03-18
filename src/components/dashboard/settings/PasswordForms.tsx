import * as React from "react";
import {
   Box,
   Button,
   Card,
   CardContent,
   CardHeader,
   FormControl,
   InputLabel,
   OutlinedInput,
   Stack,
   TextField,
   Typography,
} from "@mui/material";

export function PasswordForm({isDark}: any) {
   return (
      <Card
         sx={{
            borderRadius: 4,
            p: 2,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            bgcolor: isDark ? "#1d1c1f" : "#faf8f5",
         }}
      >
         <CardHeader
            title={
               <Typography
                  variant="h6"
                  sx={{
                     fontSize: { xs: "1.6rem", sm: "2rem" },
                     fontWeight: 600,
                  }}
               >
                  修改密码
               </Typography>
            }
         />
         <CardContent>
            <Stack spacing={3}>
               <Stack spacing={3.6}>
                  <TextField
                     id="standard-basic"
                     label="旧密码"
                     variant="standard"
                     margin="dense"
                  />
                  <TextField
                     id="outlined-basic"
                     label="新密码"
                     variant="outlined"
                     margin="dense"
                  />
                  <TextField
                     id="outlined-basic"
                     label="确认新密码"
                     variant="outlined"
                     margin="dense"
                  />
               </Stack>
               <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" size="medium">
                     更新
                  </Button>
               </Box>
            </Stack>
         </CardContent>
      </Card>
   );
}
