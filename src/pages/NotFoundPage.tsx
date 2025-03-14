import NotFound from "../components/core/notFound";
import { useEffect } from "react";

export default function NotFoundPage() {
   useEffect(() => {
      document.title = "Fulcrums | 404";
   }, []);

   return <NotFound />;
}
