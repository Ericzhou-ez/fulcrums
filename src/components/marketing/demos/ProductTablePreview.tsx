import React, { useState, useMemo } from "react";
import {
   Box,
   Card,
   Divider,
   OutlinedInput,
   InputAdornment,
   Select,
   MenuItem,
   Stack,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   TablePagination,
} from "@mui/material";
import {
   Image as ImageIcon,
   MagnifyingGlass as MagnifyingGlassIcon,
} from "phosphor-react";
import { Product } from "../../../types/types";
import { useThemeContext } from "../../../contexts/themeContextProvider";

const symbolToCurrencyCode: Record<string, string> = {
   "¥": "CNY",
   $: "USD",
   "€": "EUR",
};

function formatTimeAgo(iso: string): string {
   const d = new Date(iso);
   const now = Date.now();
   const diff = now - d.getTime();
   const days = Math.floor(diff / 86400000);
   if (days === 0) return "今天";
   if (days === 1) return "昨天";
   if (days < 7) return `${days} 天前`;
   return d.toLocaleDateString();
}

export default function ProductTablePreview({
   productList,
}: {
   productList: Product[];
}) {
   const { isDark, isSmUp } = useThemeContext();
   const [searchTerm, setSearchTerm] = useState("");
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);

   const filteredProducts = useMemo(() => {
      let data = [...productList];
      if (searchTerm) {
         const lower = searchTerm.toLowerCase();
         data = data.filter(
            (item) =>
               item.productEnglishName.toLowerCase().includes(lower) ||
               item.productChineseName.includes(searchTerm) ||
               item.hsCode.includes(searchTerm),
         );
      }
      return data;
   }, [productList, searchTerm]);

   const displayedProducts = useMemo(() => {
      const start = page * rowsPerPage;
      return filteredProducts.slice(start, start + rowsPerPage);
   }, [filteredProducts, page, rowsPerPage]);

   const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
   const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
   };

   return (
      <Box
         sx={{ bgcolor: "var(--mui-palette-background-level1)", mt: 0 }}
         borderRadius={5}
      >
         <Card
            sx={{
               px: 0,
               pt: 2,
               pb: 2,
               boxShadow: isDark
                  ? "0 2px 8px rgba(255,255,255,0.12)"
                  : "0 3px 13px rgba(0,0,0,0.12)",
               borderRadius: "12px",
               bgcolor: isDark ? "#090a0b" : "#fffe",
            }}
         >
            <Stack
               direction={isSmUp ? "row" : "column"}
               spacing={2}
               sx={{ alignItems: "center", px: { xs: 2, sm: 3 } }}
            >
               <OutlinedInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  placeholder="搜索产品"
                  startAdornment={
                     <InputAdornment position="start">
                        <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                     </InputAdornment>
                  }
                  sx={{ width: "100%" }}
               />
               {isSmUp && (
                  <>
                     <Select
                        size="small"
                        value="desc"
                        name="sort"
                        sx={{ minWidth: 100 }}
                     >
                        <MenuItem value="desc">最新</MenuItem>
                        <MenuItem value="asc">最早</MenuItem>
                     </Select>
                     <Select size="small" value="all" sx={{ minWidth: 110 }}>
                        <MenuItem value="all">全部客户</MenuItem>
                     </Select>
                     <Select size="small" value="all" sx={{ minWidth: 110 }}>
                        <MenuItem value="all">全部供应商</MenuItem>
                     </Select>
                  </>
               )}
            </Stack>
            <Divider sx={{ mt: 2 }} />
            <Box sx={{ overflowX: "auto", "& .MuiTableCell-root": { px: 2 } }}>
               <Table size="small">
                  <TableHead
                     sx={{
                        bgcolor: isDark ? "#242424" : "#f5f5f5",
                        fontWeight: 500,
                     }}
                  >
                     <TableRow>
                        <TableCell>产品</TableCell>
                        <TableCell>供应商</TableCell>
                        <TableCell>数量</TableCell>
                        <TableCell>单价</TableCell>
                        <TableCell>上次更新</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {displayedProducts.map((row) => {
                        const priceString = new Intl.NumberFormat("en-US", {
                           style: "currency",
                           currency:
                              symbolToCurrencyCode[row.currency] ?? "CNY",
                        }).format(parseFloat(row.unitPrice));
                        return (
                           <TableRow key={row.productId} hover>
                              <TableCell>
                                 <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                 >
                                    {row.image ? (
                                       <Box
                                          sx={{
                                             width: 56,
                                             height: 56,
                                             borderRadius: 1,
                                             bgcolor:
                                                "var(--mui-palette-background-level2)",
                                             backgroundImage: `url(${row.image})`,
                                             backgroundSize: "cover",
                                             flexShrink: 0,
                                          }}
                                       />
                                    ) : (
                                       <Box
                                          sx={{
                                             width: 56,
                                             height: 56,
                                             borderRadius: 1,
                                             bgcolor:
                                                "var(--mui-palette-background-level2)",
                                             display: "flex",
                                             alignItems: "center",
                                             justifyContent: "center",
                                             flexShrink: 0,
                                          }}
                                       >
                                          <ImageIcon fontSize="var(--icon-fontSize-md)" />
                                       </Box>
                                    )}
                                    <Box
                                       sx={{
                                          maxWidth: "80%",
                                          overflow: "hidden",
                                       }}
                                    >
                                       <Typography variant="subtitle2" noWrap>
                                          {row.productChineseName}
                                       </Typography>
                                       <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          noWrap
                                       >
                                          {row.productEnglishName}
                                       </Typography>
                                    </Box>
                                 </Stack>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="body2">
                                    演示供应商
                                 </Typography>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="body2">
                                    {row.packing}
                                 </Typography>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="body2">
                                    {priceString}
                                 </Typography>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="body2">
                                    {formatTimeAgo(row.updatedAt)}
                                 </Typography>
                              </TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </Box>
            <TablePagination
               rowsPerPageOptions={[5, 10]}
               component="div"
               count={filteredProducts.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={handleChangePage}
               onRowsPerPageChange={handleChangeRowsPerPage}
               labelRowsPerPage="每页:"
               size="small"
            />
         </Card>
      </Box>
   );
}
