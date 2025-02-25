import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Users as UsersIcon, Star as StarIcon } from "phosphor-react";
import { SimpleCard } from "./simpleCard";

interface Company {
   id: string;
   name: string;
   ownerName: string;
   phoneNumber: number;
   address: string;
   category: string;
   products: string[];
}

interface CompanyCardProps {
   company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
   return (
      <Card
         sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            p: { xs: 2.5, md: 3 },
            pt: 1,
            mt: 3,
            borderRadius: 4,
            cursor: "pointer"

         }}
      >
         <CardContent>
            <Stack spacing={2}>
               <Stack direction="row" spacing={2}>
                  <Stack spacing={1}>
                     <Link color="text.primary" variant="h6">
                        {company.name}
                     </Link>
                     <Typography variant="body2">{company.category}</Typography>
                     <Typography variant="body2">{company.address}</Typography>
                     <Typography variant="body2">
                        Owner: {company.ownerName}
                     </Typography>
                     <Typography variant="body2">
                        Phone: {company.phoneNumber}
                     </Typography>
                  </Stack>
               </Stack>
               {company.products && <SimpleCard products={company.products} />}
            </Stack>
         </CardContent>
      </Card>
   );
}
