import * as React from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Box,
   Stack,
   TextField,
   Button,
   Grid,
   useTheme,
} from "@mui/material";
import { useProductSupplierClientContext } from "../../contexts/productSupplierClientContextProvider";

interface NewClientModalProps {
   open: boolean;
   onClose: () => void;
}

export interface ClientForm {
   companyName: string;
   address: string;
   contactName: string;
   contactPhoneNumber: string;
   contactEmail: string;
   eoriNumber: string;
   vatNumber: string;
}

const emptyForm: ClientForm = {
   companyName: "",
   address: "",
   contactName: "",
   contactPhoneNumber: "",
   contactEmail: "",
   eoriNumber: "",
   vatNumber: "",
};

const fieldMeta: Array<{
   key: keyof ClientForm;
   label: string;
   required?: boolean;
}> = [
   { key: "companyName", label: "公司全称", required: true },
   { key: "address", label: "完整地址", required: true },
   { key: "contactName", label: "联系人", required: true },
   { key: "contactPhoneNumber", label: "电话号码", required: true },
   { key: "contactEmail", label: "电子邮件地址" },
   { key: "eoriNumber", label: "EORI 编号" },
   { key: "vatNumber", label: "VAT 增值税号" },
];

const NewClientModal: React.FC<NewClientModalProps> = ({ open, onClose }) => {
   const theme = useTheme();
   const [form, setForm] = React.useState<ClientForm>(emptyForm);
   const { addClient } = useProductSupplierClientContext();

   const handleSave = () => {
      addClient(form);

      setForm(emptyForm);
      onClose();
   };

   const handleChange =
      (key: keyof ClientForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
         setForm((prev) => ({ ...prev, [key]: e.target.value }));

   const canSave = fieldMeta
      .filter((f) => f.required)
      .every((f) => form[f.key].trim());

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
               fontSize: { xs: "2rem", sm: "2.2rem" },
            }}
         >
            添加新客户
         </DialogTitle>

         <DialogContent>
            <Stack spacing={2.5} mt={4}>
               {/* Each on its own line */}
               <TextField
                  size="small"
                  required
                  label="公司全称"
                  value={form.companyName}
                  onChange={handleChange("companyName")}
               />
               <TextField
                  size="small"
                  required
                  label="完整地址"
                  value={form.address}
                  onChange={handleChange("address")}
               />
               <TextField
                  size="small"
                  required
                  label="联系人"
                  value={form.contactName}
                  onChange={handleChange("contactName")}
               />

               <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%" }}
               >
                  <Box sx={{ flex: 1 }}>
                     <TextField
                        fullWidth
                        size="small"
                        required
                        label="电话号码"
                        value={form.contactPhoneNumber}
                        onChange={handleChange("contactPhoneNumber")}
                     />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                     <TextField
                        fullWidth
                        size="small"
                        label="电子邮件地址"
                        value={form.contactEmail}
                        onChange={handleChange("contactEmail")}
                     />
                  </Box>
               </Stack>

               <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ width: "100%", mt: 2 }}
               >
                  <Box sx={{ flex: 1 }}>
                     <TextField
                        fullWidth
                        size="small"
                        label="VAT 增值税号"
                        value={form.vatNumber}
                        onChange={handleChange("vatNumber")}
                     />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                     <TextField
                        fullWidth
                        size="small"
                        label="EORI 编号"
                        value={form.eoriNumber}
                        onChange={handleChange("eoriNumber")}
                     />
                  </Box>
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

export default NewClientModal;
