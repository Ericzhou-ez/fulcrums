import { IconButton } from "@mui/material";
import { Heart } from "phosphor-react";

export default function HeartComponent({ saved }: { saved: boolean }) {
   return (
      <IconButton>
         {saved ? (
            <Heart size={24} color="red" weight="fill" />
         ) : (
            <Heart size={24} />
         )}
      </IconButton>
   );
}
