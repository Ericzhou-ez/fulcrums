import React from "react";
import styles from "../../styles/NotFound.module.css";

export default function NotFound() {
   return (
      <div className={styles.notFound}>
         <h1 className={styles.errorCode}>404</h1>

         <div className={styles.cloakWrapper}>
            <div className={styles.cloakContainer}>
               <div className={styles.cloak}></div>
            </div>
         </div>

         <div className={styles.info}>
            <h2>我们找不到该页面</h2>
            <p>您访问的页面不存在，可能从未创建过.</p>
            <a href="/">
               <button
                  style={{
                     border: "none",
                     backgroundColor: "rgb(230, 230, 230)",
                     color: "black",
                     padding: "10px 18px",
                     borderRadius: "20px",
                     marginRight: "10px",
                  }}
               >
                  回到首页
               </button>
            </a>
            <a href="/dashboard">
               <button
                  style={{
                     border: "none",
                     backgroundColor: "#de9849",
                     color: "black",
                     padding: "10px 18px",
                     borderRadius: "20px",
                  }}
               >
                  回到表板
               </button>
            </a>
         </div>
      </div>
   );
}
