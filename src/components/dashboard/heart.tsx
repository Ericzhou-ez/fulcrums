import { IconButton } from "@mui/material";
import { Heart } from "phosphor-react";
import { useState } from "react";

export default function HeartComponent({ saved }: { saved: boolean }) {
   const [isSaved, setIsSaved] = useState(saved);

   return (
      <IconButton onClick={() => setIsSaved(!isSaved)}>
         {isSaved ? (
            <Heart size={24} color="red" weight="fill" />
         ) : (
            <Heart size={24} />
         )}
      </IconButton>
   );
}
