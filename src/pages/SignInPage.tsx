import { useState } from "react";
import { auth, googleAuth } from "../configs/firebase";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   signOut,
} from "firebase/auth";
import "../styles/authentication.css";
import ThemeToggle from "../components/themeSwitch";

export default function SignInPage({theme, handleToggleTheme}) {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isUserSigningUp, setIsUserSigningUp] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   async function handleAuthAction() {
      try {
         setErrorMessage("");

         // 验证邮箱和密码输入
         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址。");
         }
         if (!password || password.length < 6) {
            throw new Error("密码至少需要6个字符。");
         }

         if (isUserSigningUp) {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("用户注册成功！");
         } else {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("用户登录成功！");
         }
      } catch (err) {
         setErrorMessage(err.message || "发生了意外错误。");
         console.error(err);
      }
   }

   async function handleGoogleSignIn() {
      try {
         await signInWithPopup(auth, googleAuth);
      } catch (err) {
         console.error(err);
      }
   }

   return (
      <div className="auth" onClick={(e) => e.stopPropagation()}>
         <h1>{isUserSigningUp ? "创建账户" : "欢迎回来"}</h1>

         <div className="email-signin-input">
            <label>邮箱</label>
            <input
               type="email"
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
         </div>
         <div className="password-signin-input">
            <label>密码</label>
            <input
               type="password"
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
         </div>

         {errorMessage && <p className="error-message">{errorMessage}</p>}

         <button className="signin-btn" onClick={handleAuthAction}>
            {isUserSigningUp ? "注册" : "登录"}
         </button>

         <p>
            {isUserSigningUp ? "已经有账号了？" : "还没有账号？"}
            <strong>
               <span
                  onClick={() => setIsUserSigningUp(!isUserSigningUp)}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
               >
                  {isUserSigningUp ? "登录" : "注册"}
               </span>
            </strong>
         </p>

         <div className="alternative-signin">
            <div className="light-grey-divider"></div>
            <p>或</p>
            <div className="light-grey-divider"></div>
         </div>

         <button className="google-signin" onClick={handleGoogleSignIn}>
            <svg
               className="w-5 h-5"
               viewBox="0 0 48 48"
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
            >
               <g clipPath="url(#clip0_17_40)">
                  <path
                     d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                     fill="#4285F4"
                  />
                  <path
                     d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                     fill="#34A853"
                  />
                  <path
                     d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                     fill="#FBBC04"
                  />
                  <path
                     d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                     fill="#EA4335"
                  />
               </g>
               <defs>
                  <clipPath id="clip0_17_40">
                     <rect width="48" height="48" fill="white" />
                  </clipPath>
               </defs>
            </svg>
            使用 Google 继续
         </button>

         <div className="theme-toggle-sign-in">
            <ThemeToggle handleToggleTheme={handleToggleTheme} theme={theme} />
         </div>
      </div>
   );
}