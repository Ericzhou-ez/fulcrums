export default async function getBase64FromBlobUrl(blobUrl: string) {
   try {
      const res = await fetch(blobUrl);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const buf = await res.arrayBuffer();

      let binary = "";
      const bytes = new Uint8Array(buf);
      const chunkSize = 0x8000;

      for (let i = 0; i < bytes.length; i += chunkSize) {
         binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }

      return btoa(binary);
   } catch (err: any) {
      console.error("Error in blob -> base 64 conversion: " + err);
   }
}
