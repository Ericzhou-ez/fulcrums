import { useState, useEffect, useRef } from "react";
import { MagnifyingGlass } from "phosphor-react";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";
import { Clients, Product, Supplier } from "../../types/types";
import { getSupplierFromId } from "../../lib/supplierHelpers";
import { useThemeContext } from "../../contexts/themeContextProvider";

type SearchOption =
   | { type: "header"; label: string }
   | { type: "divider" }
   | { type: "product"; label: string; data: Product }
   | { type: "supplier"; label: string; data: Supplier }
   | { type: "client"; label: string; data: Clients }
   | { type: "noResults"; label: string };

function SearchBar({ isDark, searchBar }: { isDark: boolean; searchBar: any }) {
   const { products, suppliers, clients } = useProductSupplierClientContext();
   const { isMdUp } = useThemeContext();

   const [searchTerm, setSearchTerm] = useState("");
   const [options, setOptions] = useState<SearchOption[]>([]);
   const [isFocused, setIsFocused] = useState(false);
   const anchorRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const newOptions: SearchOption[] = [];

      const productsArray = Object.values(products || {});
      const suppliersArray = Object.values(suppliers || {});
      const clientsArray = Object.values(clients || {});

      const filteredProducts = productsArray.filter((product: Product) =>
         searchTerm
            ? product.productChineseName
                 ?.toLowerCase()
                 .includes(searchTerm.toLowerCase()) ||
              product.productEnglishName
                 ?.toLowerCase()
                 .includes(searchTerm.toLowerCase()) ||
              product.productId
                 ?.toLowerCase()
                 .includes(searchTerm.toLowerCase())
            : true
      ) as Product[];

      const filteredSuppliers = suppliersArray.filter((supplier: Supplier) =>
         searchTerm
            ? supplier.supplierName
                 ?.toLowerCase()
                 .includes(searchTerm.toLowerCase()) ||
              supplier.supplierId
                 ?.toLowerCase()
                 .includes(searchTerm.toLowerCase())
            : true
      ) as Supplier[];

      const filteredClients = clientsArray.filter((client: Clients) =>
         searchTerm
            ? client.companyName
                 ?.toLowerCase()
                 .includes(searchTerm.toLowerCase()) ||
              client.clientId?.toLowerCase().includes(searchTerm.toLowerCase())
            : true
      ) as Clients[];

      if (
         filteredProducts.length === 0 &&
         filteredSuppliers.length === 0 &&
         filteredClients.length === 0
      ) {
         newOptions.push({ type: "noResults", label: "没有结果" });
      } else {
         if (filteredProducts.length > 0) {
            newOptions.push({ type: "header", label: "产品" });
            filteredProducts.forEach((product) =>
               newOptions.push({
                  type: "product",
                  label: product.productChineseName,
                  data: product,
               })
            );
            newOptions.push({ type: "divider" });
         }
         if (filteredSuppliers.length > 0) {
            newOptions.push({ type: "header", label: "供应商" });
            filteredSuppliers.forEach((supplier) =>
               newOptions.push({
                  type: "supplier",
                  label: supplier.supplierName,
                  data: supplier,
               })
            );
            newOptions.push({ type: "divider" });
         }
         if (filteredClients.length > 0) {
            newOptions.push({ type: "header", label: "客户" });
            filteredClients.forEach((client) =>
               newOptions.push({
                  type: "client",
                  label: client.companyName,
                  data: client,
               })
            );
         }
      }

      setOptions(newOptions);
   }, [searchTerm, products, suppliers, clients]);

   return (
      <Box
         ref={anchorRef}
         sx={{
            width: "100%",
            display: searchBar ? "flex" : "none",
            justifyContent: "center",
            position: "relative",
            minWidth: 0,
         }}
      >
         <Box
            sx={{
               display: "flex",
               width: "100%",
               padding: "5px 14px",
               borderRadius: "30px",
               overflow: "hidden",
               alignItems: "center",
               boxShadow: "0 3px 10px rgba(46, 24, 1, 0.08)",
               background: "rgba(236, 236, 236, 0.15)",
               minWidth: 0,
            }}
         >
            <input
               type="text"
               placeholder="筛选产品名称或ID"
               aria-autocomplete="list"
               style={{
                  overflow: "hidden",
                  minWidth: 0,
                  maxWidth: "none",
                  flex: 1,
                  padding: "2px",
                  fontSize: "16px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: isDark ? "#fff" : "#000",
                  outline: "none",
               }}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            <Tooltip title="搜索">
               <MagnifyingGlass size={17} color={isDark ? "#fff" : "#000"} />
            </Tooltip>
         </Box>

         {isFocused && options.length > 0 && (
            <Popper
               disablePortal
               popperOptions={{ strategy: "fixed" }}
               open={isFocused}
               anchorEl={anchorRef.current}
               placement="bottom-start"
               sx={{
                  zIndex: 9999,
                  width: isMdUp ? anchorRef.current?.clientWidth : "95%",
                  ...(isMdUp
                     ? {}
                     : {
                          left: "50% !important",
                          transform: "translate(-50%, 15%) !important",
                       }),
               }}
            >
               <Paper
                  elevation={5}
                  sx={{
                     backgroundColor: isDark ? "#0f0f0f" : "#fff",
                     color: isDark ? "#fff" : "#000",
                     height: "300px",
                     overflowY: "auto",
                     borderRadius: "12px",
                     mt: 1,
                     border: isDark
                        ? "1px solid rgba(255, 255, 255, 0.15)"
                        : "1px solid rgb(228, 228, 228)",
                     boxShadow: isDark
                        ? "0 0 0 1px #444"
                        : "0 4px 12px rgba(0,0,0,0.08)",
                     "&::-webkit-scrollbar": {
                        display: "none",
                     },
                     scrollbarWidth: "none",
                     msOverflowStyle: "none",
                  }}
               >
                  <List>
                     {options.map((option, index) => {
                        if (option.type === "header") {
                           return (
                              <Typography
                                 key={index}
                                 sx={{
                                    px: 1.5,
                                    py: 1.5,
                                    fontSize: "19px",
                                    fontWeight: 900,
                                    color: isDark ? "#fff" : "#000",
                                 }}
                              >
                                 {option.label}
                              </Typography>
                           );
                        }

                        if (option.type === "divider") {
                           return <Divider key={index} sx={{ mt: 1, mb: 2 }} />;
                        }

                        if (option.type === "noResults") {
                           return (
                              <ListItem
                                 key={index}
                                 sx={{ placeContent: "center", py: 3 }}
                              >
                                 <Typography sx={{ fontSize: "14px" }}>
                                    {option.label}
                                 </Typography>
                              </ListItem>
                           );
                        }

                        return (
                           <ListItem
                              key={index}
                              sx={{
                                 display: "flex",
                                 justifyContent:
                                    option.type === "product"
                                       ? "space-between"
                                       : "flex-start",
                                 alignItems:
                                    option.type === "product"
                                       ? "flex-start"
                                       : "center",
                                 px: 2,
                                 py: 1.5,
                                 cursor: "pointer",
                                 "&:hover": {
                                    backgroundColor: isDark
                                       ? "#131414"
                                       : "#f9fafb",
                                 },
                              }}
                              onMouseDown={(e) => e.preventDefault()}
                           >
                              {option.type === "product" ? (
                                 <Stack
                                    direction="row"
                                    gap={2}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                       width: "100%",
                                    }}
                                 >
                                    <a
                                       href={`/product/${option.data.productId}`}
                                    >
                                       <Stack
                                          direction="row"
                                          gap={2}
                                          sx={{ width: "100%", flexShrink: 1 }}
                                       >
                                          <img
                                             src={option.data.image}
                                             height={50}
                                             width={50}
                                             style={{ borderRadius: "8px" }}
                                             alt={
                                                option.data.productChineseName
                                             }
                                          />
                                          <Box>
                                             <Typography
                                                sx={{
                                                   "&:hover": {
                                                      textDecoration:
                                                         "underline",
                                                   },
                                                   fontSize: "15px",
                                                   fontWeight: 600,
                                                   color: isDark
                                                      ? "#ffffff"
                                                      : "#111827",
                                                }}
                                             >
                                                {option.data.productChineseName}
                                             </Typography>
                                             <Typography
                                                sx={{
                                                   fontSize: "13px",
                                                   color: isDark
                                                      ? "#aaaaaa"
                                                      : "#6b7280",
                                                }}
                                             >
                                                {getSupplierFromId(
                                                   option.data.supplierId,
                                                   suppliers
                                                )?.supplierName || "供应商"}
                                             </Typography>
                                          </Box>
                                       </Stack>
                                    </a>
                                    <Typography
                                       sx={{
                                          flexShrink: 1,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          color: isDark ? "#eeeeee" : "#111827",
                                          whiteSpace: "nowrap",
                                       }}
                                    >
                                       ¥{option.data.unitPrice}
                                    </Typography>
                                 </Stack>
                              ) : (
                                 <Typography
                                    sx={{
                                       fontSize: "14px",
                                       fontWeight: 500,
                                       color: isDark ? "#eeeeee" : "#000",
                                    }}
                                 >
                                    {option.label}
                                 </Typography>
                              )}
                           </ListItem>
                        );
                     })}
                  </List>
               </Paper>
            </Popper>
         )}
      </Box>
   );
}

export default SearchBar;
