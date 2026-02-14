import React, { useState } from "react";
import {
   Box,
   DialogTitle,
   DialogContent,
   DialogActions,
   Stack,
   TextField,
   InputAdornment,
   IconButton,
   Button,
   Typography,
} from "@mui/material";

/** In-window preview of the quotation export modal (same UI, no real export). */
export default function QuotationExportPreview() {
   const [upCharge, setUpCharge] = useState("1.05");
   const [conversionRate, setConversionRate] = useState("7.20");
   const [pricePerContainer, setPricePerContainer] = useState("4500");
   const [currency, setCurrency] = useState("$");

   const toggleCurrency = () => setCurrency((c) => (c === "$" ? "€" : "$"));

   return (
      <Box
         sx={{
            p: 2,
            bgcolor: "background.default",
            borderRadius: 2,
            maxWidth: 400,
            mx: "auto",
            mt: 1,
         }}
      >
         <DialogTitle sx={{ pb: 1, pt: 0, fontWeight: 600, fontSize: "1.25rem" }}>
            请选择导出类型
         </DialogTitle>
         <DialogContent sx={{ pt: 0, pb: 2 }}>
            <Typography mb={2} variant="body2">
               您想要<strong>内部导出</strong>还是<strong>导出给客户</strong>？
            </Typography>
            <Stack spacing={1.5}>
               <TextField
                  size="small"
                  label="加价幅度"
                  type="number"
                  value={upCharge}
                  onChange={(e) => setUpCharge(e.target.value)}
                  helperText="5% 为 1.05"
                  fullWidth
               />
               <TextField
                  size="small"
                  label="设置汇率"
                  type="number"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <Box display="flex" alignItems="center">
                              ¥ →
                              <IconButton size="small" sx={{ ml: 0.5 }} onClick={toggleCurrency}>
                                 {currency}
                              </IconButton>
                           </Box>
                        </InputAdornment>
                     ),
                  }}
                  fullWidth
               />
               <TextField
                  size="small"
                  label="每柜价格"
                  type="number"
                  value={pricePerContainer}
                  onChange={(e) => setPricePerContainer(e.target.value)}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <IconButton size="small" onClick={toggleCurrency}>
                              {currency}
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  fullWidth
               />
            </Stack>
         </DialogContent>
         <DialogActions sx={{ pt: 0, pb: 1 }}>
            <Stack spacing={1} width="100%">
               <Button fullWidth variant="contained" color="info" size="small">
                  导出给客户
               </Button>
               <Button fullWidth variant="outlined" color="info" size="small">
                  内部导出
               </Button>
               <Button fullWidth variant="text" size="small">
                  取消
               </Button>
            </Stack>
         </DialogActions>
      </Box>
   );
}
