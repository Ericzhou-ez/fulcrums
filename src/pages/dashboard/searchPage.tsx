import React, { useEffect, useState } from "react";
import {
   Box,
   Stack,
   Pagination,
   Select,
   MenuItem,
   Typography,
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import { CompanyCard } from "../../components/dashboard/companyCard";
import { ProductFilters } from "../../components/dashboard/productFilter";
import { ProductCard } from "../../components/dashboard/productSearchCard";
import data from "../../data/products_companies.json";
import InfoIcon from "../../assets/icons/iconly-glass-info.svg";
import { useTheme } from "@mui/material/styles";

const mainContentStyles = (navOpen: boolean) => ({
   marginLeft: { xs: 0, md: navOpen ? "240px" : "0px" },
   transition: "margin-left 0.3s ease",
});

interface Company {
   id: string;
   name: string;
   ownerName: string;
   phoneNumber: number;
   address: string;
   category: string[];
   products: { name: string; link: string }[];
}

interface Product {
   id: string;
   productName: string;
   ownerName: string;
   phoneNumber: number;
   address: string;
   category: string[];
   storeName: string;
   link: string;
}

interface SearchPageProps {
   isModalOpen: boolean;
   toggleModal: () => void;
   navOpen: boolean;
   setNavOpen: (navOpen: boolean) => void;
   overlay: boolean;
   setOverlay: (overlay: boolean) => void;
   closeOverlay: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
   isModalOpen,
   toggleModal,
   navOpen,
   setNavOpen,
   overlay,
   setOverlay,
   closeOverlay,
}) => {
   const [searchQuery, setSearchQuery] = useState("");
   const [page, setPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [searchMode, setSearchMode] = useState("product");
   const [productType, setProductType] = useState("");
   const [filteredResults, setFilteredResults] = useState<
      (Company | Product)[]
   >([]);

   useEffect(() => {
      let companies: Company[] = Object.entries(data.search_by_store).map(
         ([name, info]: [string, any], idx) => ({
            id: `company-${idx}`,
            name,
            ownerName: info["Owner Name"],
            phoneNumber: Number(info["Phone Number"]),
            address: info.Address,
            category: Array.isArray(info.Category)
               ? info.Category
               : [info.Category],
            products:
               info.Products.map((product: string) => ({
                  name: product,
                  link: "",
               })) || [],
         })
      );

      let products: Product[] = Object.entries(data.search_by_product).map(
         ([name, info]: [string, any], idx) => ({
            id: `product-${idx}`,
            productName: name,
            ownerName: info["Owner Name"],
            phoneNumber: Number(info["Phone Number"]),
            address: info.Address,
            category: Array.isArray(info.Category)
               ? info.Category
               : [info.Category],
            storeName: info["Factory Name"],
            link: info.Link || "",
         })
      );

      if (productType) {
         companies = companies.filter((company) =>
            company.category.includes(productType)
         );
         products = products.filter((product) =>
            product.category.includes(productType)
         );
      }

      let results =
         searchMode === "company"
            ? companies.filter((company) =>
                 company.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : products.filter((product) =>
                 product.productName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              );

      setFilteredResults(results);
      setPage(1);
   }, [searchQuery, searchMode, productType]);

   const totalPages = Math.max(
      1,
      Math.ceil(filteredResults.length / itemsPerPage)
   );

   const paginatedResults = filteredResults.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
   );

   const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
   };

   return (
      <Box sx={mainContentStyles(navOpen)}>
         <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
         <Nav
            home={false}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            overlay={overlay}
            setOverlay={setOverlay}
            searchBar={false}
         />

         <Stack spacing={4}>
            <div
               style={{
                  padding: "0 25px",
                  paddingBottom: "50px",
                  paddingTop: "110px",
               }}
            >
               <ProductFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setPage={setPage}
                  searchMode={searchMode}
                  setSearchMode={setSearchMode}
                  productType={productType}
                  setProductType={setProductType}
               />
            </div>

            {paginatedResults.length === 0 ? (
               <div className="no-results-container">
                  <img
                     src={InfoIcon}
                     alt="No Results"
                     className="no-results-icon"
                  />
                  <p className="no-results-text">没有结果 :(</p>
               </div>
            ) : (
               <div style={{ padding: "0 16px", marginTop: 0 }}>
                  {paginatedResults.map((item) => {
                     if ("products" in item) {
                        return (
                           <CompanyCard
                              key={item.id}
                              company={item as Company}
                           />
                        );
                     } else {
                        return (
                           <ProductCard
                              key={item.id}
                              product={item as Product}
                           />
                        );
                     }
                  })}
               </div>
            )}

            <Stack
               direction={{ sx: "column", sm: "row" }}
               gap={2}
               justifyContent="space-between"
               alignItems="center"
               sx={{ mt: 2, padding: "0 16px" }}
            >
               <Select
                  value={itemsPerPage}
                  onChange={(e) => {
                     setItemsPerPage(e.target.value as number);
                     setPage(1);
                  }}
                  sx={{
                     minWidth: "100px",
                     height: { xs: "30px", md: "40px" },
                     borderRadius: "30px",
                  }}
               >
                  <MenuItem value={10}>每页 10 个</MenuItem>
                  <MenuItem value={20}>每页 20 个</MenuItem>
                  <MenuItem value={50}>每页 50 个</MenuItem>
               </Select>

               <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  sx={{
                     display: "flex",
                     justifyContent: "center",
                     "& .MuiPagination-ul": {
                        flexWrap: "wrap",
                     },
                     "& .MuiPaginationItem-root": {
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1rem" },
                        padding: { xs: "0px", sm: "6px", md: "8px" },
                        minWidth: { xs: "25px", sm: "28px", md: "32px" },
                        maxHeight: { xs: "25px", sm: "28px", md: "32px" },
                     },
                  }}
               />
            </Stack>
         </Stack>

         <FooterDisclaimer />

         {overlay && (
            <div
               style={{
                  transition: "all 0.2s ease-in-out",
                  position: "fixed",
                  width: "100vw",
                  height: "100vh",
                  zIndex: 500,
                  top: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  backdropFilter: "blur(2px)",
               }}
               onClick={closeOverlay}
            ></div>
         )}

         <div style={{ padding: "0 16px" }}>
            <Footer />
         </div>
      </Box>
   );
};

export default SearchPage;

const FooterDisclaimer = () => {
   const theme = useTheme();
   const textColor =
      theme.palette.mode === "dark"
         ? "rgba(255, 255, 255, 0.6)"
         : "rgba(0, 0, 0, 0.6)";

   return (
      <Box
         sx={{
            mt: 4,
            mp: 2,
            ml: "16px",
            backgroundColor: theme.palette.background.default,
         }}
      >
         <Typography
            variant="body2"
            sx={{
               color: textColor,
               fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.9rem" },
               fontWeight: 400,
               lineHeight: 1.6,
            }}
         >
            1. Fulcrums与义乌购（YiWuGo）没有任何形式的关联.
            <br />
            2.
            产品和店铺信息，以及以上提供的信息，可能存在不准确、不完整或虚假的情况.
            <br />
            3.
            Fulcrums不对信息的真实性、准确性或完整性负责，也不承担任何法律责任.
            <br />
         </Typography>
      </Box>
   );
};
