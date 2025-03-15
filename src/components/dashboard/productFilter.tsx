import React, { useState } from "react";
import { Card, Stack, TextField, useMediaQuery, useTheme } from "@mui/material";
import { MultiSelect } from "./multiSelect";
import "../../styles/search.css";

export const typeOptions = [
   { label: "饰品", value: "Jewels" },
   { label: "玩具", value: "Toys" },
   { label: "百货", value: "general_merchandise" },
   { label: "家电数码", value: "home_appliances_electronics" },
   { label: "家纺家饰", value: "home_textile_decor" },
   { label: "服装服饰", value: "clothing_accessories" },
   { label: "工艺品", value: "crafts" },
   { label: "箱包", value: "luggage_bags" },
   { label: "汽车用品", value: "automotive_products" },
   { label: "办公文教", value: "office_education_supplies" },
   { label: "体育用品", value: "sporting_goods" },
   { label: "化妆品", value: "cosmetics" },
   { label: "辅料", value: "accessories_materials" },
   { label: "五金电工", value: "hardware_electrical" },
   { label: "鞋靴", value: "shoes_boots" },
   { label: "钟表眼镜", value: "watches_eyewear" },
   { label: "医疗", value: "medical" },
   { label: "户外用品", value: "outdoor_supplies" },
   { label: "节庆用品", value: "festival_supplies" },
];

interface ProductFiltersProps {
   searchQuery: string;
   setSearchQuery: (value: string) => void;
   setPage: (value: number) => void;
   searchMode: string;
   setSearchMode: (value: string) => void;
   setProductType: any;
   productType: any;
}

export function ProductFilters({
   searchQuery,
   setSearchQuery,
   setPage,
   searchMode,
   setSearchMode,
   setProductType,
   productType
}: ProductFiltersProps) {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

   return (
      <React.Fragment>
         <Card
            sx={{
               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
               p: { xs: 2.5, md: 3 },
               pt: 1,
               borderRadius: { xs: 5, md: 12 },
               width: { xs: "95%", sm: "80%" },
               justifySelf: "center",
               background: "background.default",
            }}
            className="search-dash-container"
         >
            <Stack spacing={2}>
               {isMobile && (
                  <SearchBox
                     searchQuery={searchQuery}
                     setSearchQuery={setSearchQuery}
                     setPage={setPage}
                     searchMode={searchMode}
                  />
               )}

               {isMobile ? (
                  <Stack spacing={2} direction="row" justifyContent="space-between">
                     <MultiSelect
                        label="搜索方式"
                        options={[
                           { label: "按店铺搜索", value: "company" },
                           { label: "按产品搜索", value: "product" },
                        ]}
                        value={searchMode}
                        onChange={(value: string) => setSearchMode(value)}
                     />
                     <MultiSelect
                        label="类别"
                        options={typeOptions}
                        value={productType}
                        onChange={(value: string) => setProductType(value)}
                     />
                  </Stack>
               ) : (
                  <Stack
                     direction="row"
                     spacing={2}
                     sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                     }}
                  >
                     <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setPage={setPage}
                        searchMode={searchMode}
                     />
                     <ToggleSwitch
                        searchMode={searchMode}
                        setSearchMode={setSearchMode}
                     />
                     <MultiSelect
                        label="类别"
                        options={typeOptions}
                        value={productType}
                        onChange={(value: string) => setProductType(value)}
                     />
                  </Stack>
               )}
            </Stack>
         </Card>
      </React.Fragment>
   );
}

const ToggleSwitch: React.FC<{
   searchMode: string;
   setSearchMode: (value: string) => void;
}> = ({ searchMode, setSearchMode }) => {
   const theme = useTheme();
   return (
      <div className="toggle-container" data-selected={searchMode}>
         <div
            className="slider"
            style={{ background: theme.palette.primary.main }}
         />
         <button
            className="toggle-button"
            style={{
               color:
                  searchMode === "product"
                     ? theme.palette.text.primary
                     : theme.palette.text.secondary,
            }}
            onClick={() => setSearchMode("product")}
         >
            按产品
         </button>
         <button
            className="toggle-button"
            style={{
               color:
                  searchMode === "company"
                     ? theme.palette.text.primary
                     : theme.palette.text.secondary,
            }}
            onClick={() => setSearchMode("company")}
         >
            按店铺
         </button>
      </div>
   );
};

interface SearchBoxProps {
   searchQuery: string;
   setSearchQuery: (value: string) => void;
   setPage: (value: number) => void;
   searchMode: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
   searchQuery,
   setSearchQuery,
   setPage,
   searchMode,
}) => {
   return (
      <div className="custom-search-box">
         <input
            type="text"
            placeholder={
               searchMode === "product"
                  ? "搜索产品..."
                  : "搜索店铺..."
            }
            value={searchQuery}
            onChange={(e) => {
               setSearchQuery(e.target.value);
               setPage(1);
            }}
         />
      </div>
   );
};
