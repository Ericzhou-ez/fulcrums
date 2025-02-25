import React, { useState } from "react";
import {
   Typography,
   Box,
   Stack,
   IconButton,
   TextField,
   Pagination,
} from "@mui/material";
import Nav from "../../components/core/nav";
import Footer from "../../components/core/footer";
import SideNav from "../../components/dashboard/dashboardNav";
import {
   CaretLeft as CaretLeftIcon,
   CaretRight as CaretRightIcon,
} from "phosphor-react";
import { CompanyCard } from "../../components/dashboard/companyCard";
import { ProductFilters } from "../../components/dashboard/productFilter";
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

const itemsPerPage = 5;

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
   const [searchMode, setSearchMode] = useState("");

   const companies = Object.entries(data.search_by_company).map(
      ([name, info], idx) => ({
         id: `company-${idx}`,
         name,
         ownerName: info["Owner Name"],
         phoneNumber: info["Phone Number"],
         address: info.Address,
         category: info.Category,
         products: info.Products,
      })
   );

   const filteredCompanies =
      searchQuery.length >= 3
         ? companies.filter((company) =>
              company.name.toLowerCase().includes(searchQuery.toLowerCase())
           )
         : companies;

   const paginatedCompanies = filteredCompanies.slice(
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
                  backgroundColor: "#FFA500",
                  padding: "0 25px",
                  paddingBottom: "50px",
                  height: "220px",
                  [theme.breakpoints.up('sm')]: {
                     height: "200px",
                  },
               }}
            >
               <ProductFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setPage={setPage}
                  searchMode={searchMode}
                  setSearchMode={setSearchMode}
               />
            </div>
            <div className="hero-clip-curve"></div>

            <div style={{ padding: "0 16px", marginTop: 0 }}>
               {paginatedCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
               ))}
            </div>

            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
               <Pagination
                  count={Math.ceil(filteredCompanies.length / itemsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
               />
            </Stack>
         </Stack>

         <div style={{ padding: "0 16px" }}>
            <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
         </div>

         {overlay && (
            <Box
               sx={{
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
            />
         )}
      </Box>
   );
};

export default SearchPage;
