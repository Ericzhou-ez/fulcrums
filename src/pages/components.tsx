import { Typography } from "@mui/material";
import CardSlider from "../components/cardSlider";

export default function Components() {
   return (
      <div className="components">
         <Typography
            variant="h1"
            sx={{ margin: "20px 40px", fontSize: "2rem", fontWeight: "700" }}
            textAlign="center"
         >
            Components
         </Typography>

         {/* <CardSlider /> */}
      </div>
   );
}
