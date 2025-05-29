export default async function getBase64FromBlobUrl(
   blobUrl: string
): Promise<string | undefined> {
   try {
      const res = await fetch(blobUrl);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const contentType = res.headers.get("Content-Type") || "image/png";
      const buf = await res.arrayBuffer();

      let binary = "";
      const bytes = new Uint8Array(buf);
      const chunkSize = 0x8000;

      for (let i = 0; i < bytes.length; i += chunkSize) {
         binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }

      const base64 = btoa(binary);
      return `data:${contentType};base64,${base64}`;
   } catch (err: any) {
      console.error("Error in blob conversion to base64:", err);
   }
}
