import * as React from "react";
import {
   Button,
   Card,
   CardContent,
   CardHeader,
   Stack,
   Typography,
} from "@mui/material";

export function DeleteAccount() {
   return (
      <Card
         sx={{
            borderRadius: 4,
            p: 2,
            boxShadow: "0 2px 12px rgb(245, 41, 34, 0.3)",
            bgcolor: "rgb(245, 41, 34, 0.15)",
            border: "1px solid rgb(245, 41, 34, 0.5)",
         }}
      >
         <CardHeader
            title={
               <Typography
                  variant="h6"
                  sx={{
                     fontSize: { xs: "1.8rem", sm: "2.2rem" },
                     fontWeight: 600,
                  }}
               >
                  删除账户
               </Typography>
            }
         />
         <CardContent>
            <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
               <Typography variant="subtitle1">
                  删除您的账户以及所有相关数据，该操作不可撤销。
               </Typography>
               <Button
                  color="error"
                  variant="outlined"
                  sx={{ borderRadius: 5 }}
               >
                  删除账户
               </Button>
            </Stack>
         </CardContent>
      </Card>
   );
}
