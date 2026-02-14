import React, { ReactNode } from "react";
import "../../styles/home.css";

export interface MarketingDemoSectionProps {
   /** "left" = demo on left, "right" = demo on right */
   demoPosition: "left" | "right";
   /** The demo content (e.g. MacOS window with table/modal) */
   demo: ReactNode;
   /** Background for the demo container: image URL or CSS color */
   demoBackgroundImage?: string;
   /** Card background only (not the section): image URL or CSS color. Responsive. */
   sectionBackground?: string;
   /** Section title */
   title: string;
   /** CTA link: { label, href } */
   cta: { label: string; href: string };
}

function isImageUrl(value: string): boolean {
   return /^url\(|^\/|^https?:\/\//i.test(value.trim());
}

export default function MarketingDemoSection({
   demoPosition,
   demo,
   demoBackgroundImage,
   sectionBackground,
   title,
   cta,
}: MarketingDemoSectionProps) {
   const cardBgStyle =
      sectionBackground == null
         ? undefined
         : isImageUrl(sectionBackground)
           ? { backgroundImage: `url(${sectionBackground})` }
           : { backgroundColor: sectionBackground };

   return (
      <section
         className="marketing-demo-section"
         data-demo-position={demoPosition}
      >
         <div className="marketing-demo-section-card" style={cardBgStyle}>
            <div className="marketing-demo-section-inner">
               <div
                  className="marketing-demo-copy"
                  style={{ gridArea: "copy" }}
               >
                  <h2 className="marketing-demo-title">{title}</h2>
                  <a href={cta.href} className="marketing-demo-cta">
                     {cta.label} →
                  </a>
               </div>
               <div
                  className="marketing-demo-visual"
                  style={{
                     gridArea: "demo",
                     backgroundImage: demoBackgroundImage
                        ? `url(${demoBackgroundImage})`
                        : undefined,
                  }}
               >
                  {demo}
               </div>
            </div>
         </div>
      </section>
   );
}
