/* eslint-disable react-hooks/exhaustive-deps */
/* ──────────────────────────────────────────────────────────── */
/*  Offline‑indicator FAB  +  80 vh bottom drawer (Dexie)       */
/*  Full‑field editor, image upload (base‑64), slim UI          */
/* ──────────────────────────────────────────────────────────── */
import {
   useState,
   useEffect,
   Fragment,
   SyntheticEvent,
   ChangeEvent,
} from "react";
import {
   Box,
   Collapse,
   Grow,
   Typography,
   Drawer,
   Tabs,
   Tab,
   List,
   ListItem,
   ListItemText,
   Divider,
   CircularProgress,
   TextField,
   Button,
   IconButton,
   Avatar,
} from "@mui/material";
import { CloudSlash, Package, ArrowLeft } from "phosphor-react";
import {
   getProductCount,
   getAllRecords,
   updateRecord,
   db,
} from "../../../lib/dexieUtils";
import getBase64FromBlobUrl from "../../../lib/blob-to-blob64";
import { Product, Supplier, Clients } from "../../../types/types";

/* ──────────────────────────────────────────────────────────── */
/*  MAIN FLOATING BUTTON + DRAWER                               */
/* ──────────────────────────────────────────────────────────── */
interface OfflineDrawerProps {
   isOnline: boolean;
}

export function OfflineDrawer({ isOnline }: OfflineDrawerProps) {
   const [count, setCount] = useState<number | null>(null);
   const [showCloud, setShowCloud] = useState(true);
   const [open, setOpen] = useState(false);

   useEffect(() => {
      getProductCount().then(setCount).catch(console.error);
   }, []);

   useEffect(() => {
      if (!isOnline) {
         const t = setTimeout(() => setShowCloud(false), 1200);
         return () => clearTimeout(t);
      }
      setShowCloud(true);
   }, [isOnline]);

   if (isOnline) return null;

   return (
      <>
         {/* FAB */}
         <Grow in>
            <Box
               onClick={() => setOpen(true)}
               sx={{
                  position: "fixed",
                  bottom: 16,
                  right: 16,
                  display: "flex",
                  alignItems: "center",
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 999,
                  boxShadow: 4,
                  bgcolor: (t) => t.palette.background.default,
                  cursor: "pointer",
                  zIndex: 1300,
               }}
            >
               <Collapse in={showCloud} orientation="horizontal" timeout={400}>
                  <CloudSlash size={20} weight="fill" />
               </Collapse>

               <Collapse in={!showCloud} orientation="horizontal" timeout={400}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                     <Package size={18} weight="fill" />
                     <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                     >
                        {count ?? "…"}
                     </Typography>
                  </Box>
               </Collapse>
            </Box>
         </Grow>

         <EntityDrawer open={open} onClose={() => setOpen(false)} />
      </>
   );
}

/* ──────────────────────────────────────────────────────────── */
/*  DRAWER (tabs → list → detail)                               */
/* ──────────────────────────────────────────────────────────── */
type TabKey = "products" | "suppliers" | "clients";

interface EntityDrawerProps {
   open: boolean;
   onClose: () => void;
}

function EntityDrawer({ open, onClose }: EntityDrawerProps) {
   const [tab, setTab] = useState<TabKey>("products");
   const [view, setView] = useState<"list" | "detail">("list");
   const [select, setSelect] = useState<Product | Supplier | Clients | null>(
      null
   );

   const [products, setProducts] = useState<Product[] | null>(null);
   const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
   const [clients, setClients] = useState<Clients[] | null>(null);

   useEffect(() => {
      const load = async () => {
         switch (tab) {
            case "products":
               if (!products) setProducts(await getAllRecords("products"));
               break;
            case "suppliers":
               if (!suppliers) setSuppliers(await getAllRecords("suppliers"));
               break;
            case "clients":
               if (!clients) setClients(await getAllRecords("clients"));
               break;
         }
      };
      load().catch(console.error);
   }, [tab]);

   /* ---------- save helper ---------- */
   const handleSave = async (updated: any) => {
      const table =
         tab === "products"
            ? "products"
            : tab === "suppliers"
            ? "suppliers"
            : "clients";
      const idField = idKey(table);

      await db.table(table).put(updated); 

      // ← pull fresh list from Dexie so React gets new object refs
      const fresh = await getAllRecords(table as any);

      if (table === "products") setProducts(fresh as Product[]);
      if (table === "suppliers") setSuppliers(fresh as Supplier[]);
      if (table === "clients") setClients(fresh as Clients[]);

      setView("list");
   };

   return (
      <Drawer
         anchor="bottom"
         open={open}
         onClose={onClose}
         PaperProps={{
            sx: {
               height: "90vh",
               borderTopLeftRadius: 16,
               borderTopRightRadius: 16,
            },
         }}
      >
         {view === "list" && (
            <Tabs
               value={tab}
               onChange={(_e: SyntheticEvent, v: TabKey) => {
                  setTab(v);
                  setView("list");
               }}
               variant="fullWidth"
               sx={{ borderBottom: 1, borderColor: "divider", pt: 1 }}
            >
               <Tab label="Products" value="products" />
               <Tab label="Suppliers" value="suppliers" />
               <Tab label="Clients" value="clients" />
            </Tabs>
         )}

         <Box sx={{ height: "90vh", overflowY: "auto", p: 1.5 }}>
            {view === "list" && (
               <>
                  {tab === "products" && (
                     <EntityList<Product>
                        loading={!products}
                        items={products ?? []}
                        primary={(p) =>
                           p.productChineseName || p.productEnglishName
                        }
                        secondary={(p) =>
                           `${p.currency ?? ""}${p.unitPrice ?? ""}  •  ${
                              p.material ?? ""
                           }`
                        }
                        avatarSrc={(p) => p.image}
                        onSelect={(p) => {
                           setSelect(p);
                           setView("detail");
                        }}
                     />
                  )}

                  {tab === "suppliers" && (
                     <EntityList<Supplier>
                        loading={!suppliers}
                        items={suppliers ?? []}
                        primary={(s) => s.supplierName}
                        secondary={(s) => s.supplierPhoneNumber ?? ""}
                        onSelect={(s) => {
                           setSelect(s);
                           setView("detail");
                        }}
                     />
                  )}

                  {tab === "clients" && (
                     <EntityList<Clients>
                        loading={!clients}
                        items={clients ?? []}
                        primary={(c) => c.companyName}
                        secondary={(c) => c.contactEmail ?? ""}
                        onSelect={(c) => {
                           setSelect(c);
                           setView("detail");
                        }}
                     />
                  )}
               </>
            )}

            {view === "detail" && select && (
               <DetailForm
                  item={select}
                  tab={tab}
                  onBack={() => setView("list")}
                  onSave={handleSave}
               />
            )}
         </Box>
      </Drawer>
   );
}

/* ──────────────────────────────────────────────────────────── */
/*  SHARED LIST COMPONENT                                       */
/* ──────────────────────────────────────────────────────────── */
interface EntityListProps<T> {
   loading: boolean;
   items: T[];
   primary: (item: T) => string;
   secondary?: (item: T) => string;
   avatarSrc?: (item: T) => string | undefined;
   onSelect: (item: T) => void;
}

function EntityList<T>({
   loading,
   items,
   primary,
   secondary,
   avatarSrc,
   onSelect,
}: EntityListProps<T>) {
   if (loading)
      return (
         <Box sx={{ py: 3, textAlign: "center" }}>
            <CircularProgress size={24} />
         </Box>
      );

   if (!items.length)
      return (
         <Typography
            variant="body2"
            color="text.secondary"
            sx={{ py: 3, textAlign: "center" }}
         >
            No data.
         </Typography>
      );

   return (
      <List disablePadding>
         {items.map((item: any, idx) => (
            <Fragment key={idx}>
               <ListItem
                  button
                  onClick={() => onSelect(item)}
                  sx={{
                     borderRadius: 2,
                     "&:hover": { bgcolor: "action.hover" },
                     gap: 1,
                     px: 1,
                     py: 0.5,
                  }}
               >
                  {avatarSrc && avatarSrc(item) && (
                     <Box
                        component="img"
                        src={ensureDataUrl(avatarSrc(item))}
                        alt="thumb"
                        sx={{
                           width: 64,
                           height: 64,
                           objectFit: "cover",
                           borderRadius: 1,
                           flexShrink: 0,
                        }}
                     />
                  )}

                  <ListItemText
                     primary={primary(item)}
                     secondary={secondary ? secondary(item) : undefined}
                     primaryTypographyProps={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                     }}
                     secondaryTypographyProps={{ fontSize: "0.75rem" }}
                  />
               </ListItem>
               {idx < items.length - 1 && <Divider component="li" />}
            </Fragment>
         ))}
      </List>
   );
}

/* ──────────────────────────────────────────────────────────── */
/*  DETAIL / EDIT FORM                                          */
/* ──────────────────────────────────────────────────────────── */
interface DetailFormProps {
   item: Product | Supplier | Clients;
   tab: TabKey;
   onBack: () => void;
   onSave: (updated: any) => void;
}

function DetailForm({ item, tab, onBack, onSave }: DetailFormProps) {
   // deep copy so we don’t mutate the list item
   const [form, setForm] = useState<Record<string, any>>({ ...item });
   const [saving, setSaving] = useState(false);

   /* ---------- helpers ---------- */
   const ensureDataUrl = (b64: string) =>
      b64.startsWith("data:image") ? b64 : `data:image/png;base64,${b64}`;

   const handleChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

   const handleFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const blobUrl = URL.createObjectURL(file);
      const b64 = await getBase64FromBlobUrl(blobUrl);
      const base64 = b64 ? ensureDataUrl(b64) : "";

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      setForm({ ...form, productImage: base64 });
   };

   /* ---------- meta per entity ---------- */
   const FIELDS: Record<
      TabKey,
      { key: string; label: string; type?: string }[]
   > = {
      products: [
         { key: "productChineseName", label: "Chinese Name" },
         { key: "productEnglishName", label: "English Name" },
         { key: "unitPrice", label: "Unit Price", type: "number" },
         { key: "currency", label: "Currency" },
         { key: "material", label: "Material" },
         { key: "hsCode", label: "HS Code" },
         { key: "packing", label: "Packing" },
         { key: "productImage", label: "Image", type: "file" },
      ],
      suppliers: [
         { key: "supplierName", label: "Name" },
         { key: "supplierPhoneNumber", label: "Phone" },
         { key: "supplierAddress", label: "Address" },
         { key: "supplierEmail", label: "Email" },
      ],
      clients: [
         { key: "companyName", label: "Company" },
         { key: "contactName", label: "Contact" },
         { key: "contactPhoneNumber", label: "Phone" },
         { key: "contactEmail", label: "Email" },
         { key: "eoriNumber", label: "EORI" },
      ],
   };

   /* ---------- save ---------- */
   const submit = async () => {
      setSaving(true);
      await onSave(form); // parent will `.put()` entire record
      setSaving(false);
   };

   /* ---------- UI ---------- */
   return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
         {/* Preview first so you can’t miss it */}
         {form.productImage && (
            <Box
               component="img"
               src={ensureDataUrl(form.productImage)}
               alt="preview"
               sx={{ width: "100%", borderRadius: 1, mb: 1 }}
            />
         )}

         <IconButton onClick={onBack} size="small">
            <ArrowLeft size={20} />
         </IconButton>

         {FIELDS[tab].map(({ key, label, type }) =>
            type === "file" ? (
               <Button
                  key={key}
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ alignSelf: "flex-start" }}
               >
                  {form.productImage ? "Replace image" : "Upload image"}
                  <input
                     type="file"
                     accept="image/*"
                     hidden
                     onChange={handleFile}
                  />
               </Button>
            ) : (
               <TextField
                  key={key}
                  label={label}
                  type={type ?? "text"}
                  value={form[key] ?? ""}
                  onChange={handleChange(key)}
                  fullWidth
                  size="small"
               />
            )
         )}

         <Button
            variant="contained"
            size="small"
            onClick={submit}
            disabled={saving}
            sx={{ alignSelf: "flex-end" }}
         >
            {saving ? "Saving…" : "Save"}
         </Button>
      </Box>
   );
}
/* ──────────────────────────────────────────────────────────── */
function idKey(table: string) {
   return table === "products"
      ? "productId"
      : table === "suppliers"
      ? "supplierId"
      : "clientId";
}

function ensureDataUrl(str?: string) {
   if (!str) return "";
   return str.startsWith("data:image") ? str : `data:image/png;base64,${str}`;
}
