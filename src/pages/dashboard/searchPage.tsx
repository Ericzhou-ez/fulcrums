import React, { useEffect, useState } from "react";
import {
   Box,
   Stack,
   Pagination,
   Select,
   MenuItem,
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import { CompanyCard } from "../../components/dashboard/companyCard";
import { ProductFilters } from "../../components/dashboard/productFilter";
import { ProductCard } from "../../components/dashboard/productSearchCard";
import data from "../../data/lookup_temp.json";

const mainContentStyles = (navOpen: boolean) => ({
   marginLeft: { xs: 0, md: navOpen ? "240px" : "0px" },
   transition: "margin-left 0.3s ease",
});

interface SearchPageProps {
   signedIn: boolean;
   user: any;
   handleSignOut: () => void;
   isModalOpen: boolean;
   theme: any;
   handleToggleTheme: () => void;
   toggleModal: () => void;
   navOpen: boolean;
   setNavOpen: (navOpen: boolean) => void;
   overlay: boolean;
   setOverlay: (overlay: boolean) => void;
   closeOverlay: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
   signedIn,
   user,
   handleSignOut,
   isModalOpen,
   theme,
   handleToggleTheme,
   toggleModal,
   navOpen,
   setNavOpen,
   overlay,
   setOverlay,
   closeOverlay,
}) => {
   const [searchQuery, setSearchQuery] = useState("");
   const [page, setPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(5);
   const [searchMode, setSearchMode] = useState("product");
   const [productType, setProductType] = useState("");
   const [filteredResults, setFilteredResults] = useState<any[]>([]);

   useEffect(() => {
      let companies = Object.entries(data.search_by_company).map(
         ([name, info], idx) => ({
            id: `company-${idx}`,
            name,
            ownerName: info["Owner Name"],
            phoneNumber: info["Phone Number"],
            address: info.Address,
            category: info.Category,
            products: info.Products || [],
         })
      );

      let products = Object.entries(data.search_by_product).map(
         ([name, info], idx) => ({
            id: `product-${idx}`,
            productName: name,
            ownerName: info["Owner Name"],
            phoneNumber: info["Phone Number"],
            address: info.Address,
            category: info.Category,
            storeName: info["Factory Name"],
         })
      );

      if (productType) {
         companies = companies.filter((company) => company.category === productType);
         products = products.filter((product) => product.category === productType);
      }

      let results =
         searchMode === "company"
            ? companies.filter((company) =>
                 company.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : products.filter((product) =>
                 product.productName.toLowerCase().includes(searchQuery.toLowerCase())
              );

      setFilteredResults(results);
      setPage(1); 
   }, [searchQuery, searchMode, productType]);

   const totalPages = Math.max(1, Math.ceil(filteredResults.length / itemsPerPage));

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
            signedIn={signedIn}
            user={user}
            handleSignOut={handleSignOut}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            overlay={overlay}
            setOverlay={setOverlay}
            searchBar={false}
         />

         <Stack spacing={4}>
            <div
               style={{
                  backgroundColor: "#ff8400",
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
            <div className="hero-clip-curve"></div>

            <div style={{ padding: "0 16px", marginTop: 0 }}>
               {searchMode === "company"
                  ? paginatedResults.map((company: any) => (
                       <CompanyCard key={company.id} company={company} />
                    ))
                  : paginatedResults.map((product: any) => (
                       <ProductCard key={product.id} product={product} />
                    ))}
            </div>

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
                     height: "40px",
                     borderRadius: "30px",
                  }}
               >
                  <MenuItem value={5}>每页 5 个</MenuItem>
                  <MenuItem value={10}>每页 10 个</MenuItem>
                  <MenuItem value={20}>每页 20 个</MenuItem>
               </Select>

               <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  sx={{
                     "& .MuiPaginationItem-root": {
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1rem" },
                        padding: { xs: "2px", sm: "3px", md: "8px" },
                        minWidth: { xs: "24px", sm: "28px", md: "32px" },
                     },
                  }}
               />
            </Stack>
         </Stack>

         <div style={{ padding: "0 16px" }}>
            <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
         </div>
      </Box>
   );
};

export default SearchPage;
