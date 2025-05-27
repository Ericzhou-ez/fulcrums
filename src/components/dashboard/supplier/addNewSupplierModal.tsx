import { useState, useEffect, useMemo, ChangeEvent } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   Stack,
   Box,
   Button,
   Autocomplete,
   InputAdornment,
   IconButton,
   Popper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { X } from "phosphor-react";
import ProductandCompanyData from "../../../data/products_companies.json";
import { useProductSupplierClientContext } from "../../../contexts/productSupplierClientContextProvider";
import { addRecord } from "../../../lib/dexieUtils";

interface Props {
   open: boolean;
   onClose: () => void;
   isOnline: boolean;
}

const NewSupplierModal: React.FC<Props> = ({ open, onClose, isOnline }) => {
   const theme = useTheme();
   const { addSupplier, setErrorMessages } = useProductSupplierClientContext();

   const [supplierName, setSupplierName] = useState<string>("");
   const [selectedSupplier, setSelectedSupplier] = useState<string | null>(
      null
   );
   const [supplierAddress, setSupplierAddress] = useState<string>("");
   const [supplierEmail, setSupplierEmail] = useState<string>("");
   const [supplierPhone, setSupplierPhone] = useState<string>("");

   const supplierOptions = useMemo(() => {
      if (supplierName.trim().length === 0) return [] as string[];
      const keys = Object.keys(ProductandCompanyData["search_by_store"]);
      return keys.filter((k) => k.includes(supplierName)).slice(0, 10);
   }, [supplierName]);

   useEffect(() => {
      if (typeof selectedSupplier === "string" && selectedSupplier.length > 0) {
         const companyData = (
            ProductandCompanyData.search_by_store as Record<string, any>
         )[selectedSupplier];

         if (companyData) {
            setSupplierAddress(companyData["Address"] || "");
            setSupplierPhone(String(companyData["Phone Number"] || ""));
         } else {
            setSupplierAddress("");
            setSupplierPhone("");
         }
      } else {
         return;
      }
   }, [selectedSupplier]);

   const canSave = supplierName.trim() !== "";

   const handleSave = () => {
      if (!canSave) return;

      if (!isOnline) {
         addRecord("suppliers", {
            supplierName,
            supplierAddress,
            supplierEmail,
            supplierPhoneNumber: supplierPhone,
         });

         setErrorMessages(`添加${supplierName}成功`)
         handleReset();
         onClose();
         return;
      }

      addSupplier({
         supplierName,
         supplierAddress,
         supplierEmail,
         supplierPhone,
      });

      handleReset();
      onClose();
   };

   const handleReset = () => {
      setSupplierName("");
      setSelectedSupplier(null);
      setSupplierAddress("");
      setSupplierPhone("");
   };

   return (
      <Dialog
         open={open}
         onClose={onClose}
         fullWidth
         maxWidth="sm"
         PaperProps={{
            sx: {
               p: { xs: 1.5, sm: 4.5 },
               borderRadius: 4,
               boxShadow: theme.shadows[24],
            },
         }}
         BackdropProps={{
            sx: {
               bgcolor: "rgba(18, 18, 18, 0.1)",
               backdropFilter: "blur(3px)",
            },
         }}
      >
         <DialogTitle
            sx={{
               fontWeight: 700,
               pb: 1,
               mt: 2,
               fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
         >
            添加新供应商
         </DialogTitle>

         <DialogContent>
            <Stack spacing={2} mt={4}>
               <Box>
                  <Autocomplete
                     freeSolo
                     options={supplierOptions}
                     fullWidth
                     // to do load with firestore supplier data  options={}
                     value={selectedSupplier}
                     inputValue={supplierName}
                     onInputChange={(event, newInputValue) =>
                        setSupplierName(newInputValue)
                     }
                     onChange={(event, newValue) => {
                        setSelectedSupplier(newValue);
                        setSupplierName(newValue || "");
                     }}
                     clearOnEscape
                     PopperComponent={(props) => (
                        <Popper
                           {...props}
                           sx={{
                              mt: 0,
                              "& .MuiAutocomplete-paper": {
                                 maxHeight: 300,
                                 overflowY: "auto",
                                 overflowX: "hidden",
                              },
                              "& .MuiAutocomplete-listbox": {
                                 maxHeight: 300,
                                 overflowY: "auto",
                                 overflowX: "hidden",
                                 padding: 2,
                                 scrollbarWidth: "none",
                                 "&::-webkit-scrollbar": {
                                    display: "none",
                                 },
                              },
                           }}
                        />
                     )}
                     sx={{
                        "& .MuiAutocomplete-inputRoot": {
                           paddingBottom: "2px",
                        },
                     }}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           fullWidth
                           inputProps={{ ...params.inputProps, maxLength: 100 }}
                           label="供应商名称"
                           required
                           InputProps={{
                              ...params.InputProps,
                              endAdornment: supplierName ? (
                                 <InputAdornment position="end">
                                    <IconButton
                                       onClick={(event) => {
                                          event.stopPropagation();
                                          setSupplierName("");
                                          setSelectedSupplier(null);
                                       }}
                                    >
                                       <X size={20} />
                                    </IconButton>
                                 </InputAdornment>
                              ) : null,
                           }}
                           sx={{ my: 1 }}
                        />
                     )}
                  />
               </Box>

               <Box sx={{ display: "grid", gridTemplateColumns: "1fr" }}>
                  <TextField
                     fullWidth
                     size="small"
                     label="供应商地址"
                     value={supplierAddress}
                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSupplierAddress(e.target.value)
                     }
                  />
               </Box>

               <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 2, sm: 1 }}
                  justifyContent={"space-between"}
               >
                  <TextField
                     sx={{ width: "100%" }}
                     size="small"
                     label="供应商电话"
                     value={supplierPhone}
                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSupplierPhone(e.target.value)
                     }
                  />

                  <TextField
                     sx={{ width: "100%" }}
                     fullWidth
                     size="small"
                     label="供应商邮箱"
                     value={supplierEmail}
                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSupplierEmail(e.target.value)
                     }
                  />
               </Stack>
            </Stack>
         </DialogContent>

         <DialogActions sx={{ pt: 2, px: 3 }}>
            <Button
               fullWidth
               variant="outlined"
               onClick={onClose}
               sx={{ borderRadius: 3.5 }}
               color="info"
            >
               取消
            </Button>
            <Button
               fullWidth
               variant="contained"
               disabled={!canSave}
               sx={{ borderRadius: 3.5 }}
               onClick={handleSave}
            >
               保存
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default NewSupplierModal;
