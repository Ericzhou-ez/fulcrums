import React, { useState } from "react";
import {
   Box,
   Typography,
   TextField,
   Stack,
   Button,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
} from "@mui/material";

/** Mock border/customs declaration form for marketing demo. */
export default function BorderDeclarationForm() {
   const [origin, setOrigin] = useState("中国");
   const [hsCode, setHsCode] = useState("73239300");
   const [material, setMaterial] = useState("不锈钢");
   const [weight, setWeight] = useState("8.5");

   return (
      <Box sx={{ p: 2 }}>
         <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            报关单 / 海关申报
         </Typography>
         <Stack spacing={2} sx={{ mb: 2 }}>
            <TextField
               size="small"
               fullWidth
               label="品名"
               value="不锈钢保温杯"
               helperText="产品中文名称"
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
               <TextField
                  size="small"
                  label="HS 编码"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  fullWidth
               />
               <FormControl size="small" sx={{ minWidth: 120 }} fullWidth>
                  <InputLabel>原产地</InputLabel>
                  <Select
                     value={origin}
                     label="原产地"
                     onChange={(e) => setOrigin(e.target.value)}
                  >
                     <MenuItem value="中国">中国</MenuItem>
                     <MenuItem value="越南">越南</MenuItem>
                     <MenuItem value="泰国">泰国</MenuItem>
                  </Select>
               </FormControl>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
               <TextField
                  size="small"
                  label="材质"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  fullWidth
               />
               <TextField
                  size="small"
                  label="重量 (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  type="number"
                  fullWidth
               />
            </Stack>
         </Stack>
         <Table size="small" sx={{ "& .MuiTableCell-root": { py: 1 } }}>
            <TableHead>
               <TableRow>
                  <TableCell>项号</TableCell>
                  <TableCell>商品编码</TableCell>
                  <TableCell>品名</TableCell>
                  <TableCell>数量</TableCell>
                  <TableCell>单位</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>7323.93.00</TableCell>
                  <TableCell>不锈钢保温杯</TableCell>
                  <TableCell>100</TableCell>
                  <TableCell>个</TableCell>
               </TableRow>
               <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>6912.00.10</TableCell>
                  <TableCell>陶瓷马克杯</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>个</TableCell>
               </TableRow>
            </TableBody>
         </Table>
         <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" size="small" color="primary">
               生成报关单
            </Button>
            <Button variant="outlined" size="small">
               导出
            </Button>
         </Stack>
      </Box>
   );
}
