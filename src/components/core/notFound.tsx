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
            <p>您访问的页面不存在，可能从未创建过。我们为此表示歉意。</p>
            <a href="/">回到首页</a>
         </div>
      </div>
   );
}
