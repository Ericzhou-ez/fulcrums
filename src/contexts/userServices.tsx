import React, { createContext, useContext } from "react";
import { UserType } from "../types/types";
import {
   signOut,
   signInWithEmailAndPassword,
   signInWithPopup,
   createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, googleAuth, db } from "../configs/firebase";

interface UserContextProps {
   signInWithGoogle: () => Promise<void>;
   signInWithEmail: (email: string, password: string) => Promise<void>;
   signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
   logOut: () => Promise<void>;
   user: UserType | null;
   loading: boolean;
   errorMessage: string;
   successMessage: string;
}

interface UserServiceProps {
   children: React.ReactNode;
   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
   user: UserType | null;
   loading: boolean;
   errorMessage: string;
   successMessage: string;
   setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
   setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserServiceProvider: React.FC<UserServiceProps> = ({
   children,
   setUser,
   user,
   setLoading,
   loading,
   errorMessage,
   setErrorMessage,
   successMessage,
   setSuccessMessage,
}) => {
   async function signInWithGoogle() {
      try {
         setLoading(true);
         const res = await signInWithPopup(auth, googleAuth);
         await setNewUserDoc(res, "");
         // if exists loaded by auth context
      } catch (err) {
         setErrorMessage("无法使用Google登录.");
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   async function signInWithEmail(email: string, password: string) {
      try {
         setLoading(true);
         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址.");
         }
         if (!password || password.length < 6) {
            throw new Error("密码至少需要6个字符.");
         }
         // only call if signing in
         await signInWithEmailAndPassword(auth, email, password);
         // auth context handles the data population
      } catch (err) {
         console.error(err);
         setErrorMessage(
            err instanceof Error ? err.message : "发生了意外错误."
         );
      } finally {
         setLoading(false);
      }
   }

   async function signUpWithEmail(email: string, password: string, name: string) {
      try {
         setLoading(true);
         if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("请输入有效的邮箱地址.");
         }
         if (!password || password.length < 6) {
            throw new Error("密码至少需要6个字符.");
         }
         setSuccessMessage("注册中，请稍等");
         // only call if signing up
         const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
         );
         // create new collection in users
         await setNewUserDoc(res, name);
      } catch (err) {
         console.error(err);
          setErrorMessage(err instanceof Error ? err.message : "注册失败");
      } finally {
         setLoading(false);
      }
   }

   async function logOut() {
      try {
         setLoading(true);
         await signOut(auth);
         setUser(null);
      } catch (error) {
         console.error("Logout Error:", error);
      } finally {
         setLoading(false);
      }
   }

   return (
      <UserContext.Provider
         value={{
            signInWithEmail,
            signInWithGoogle,
            signUpWithEmail,
            logOut,
            user,
            loading,
            successMessage,
            errorMessage,
         }}
      >
         {children}
      </UserContext.Provider>
   );
};

export function useUserServices() {
   const context = useContext(UserContext);

   if (!context) {
      throw new Error(
         "useUserService must be used within an UserServiceProvider"
      );
   }

   return context;
}

async function setNewUserDoc(res: { user: any }, name: string): Promise<void> {
   try {
      const userUID = res.user.uid;
      const currUser = res.user;
      const userRef = doc(db, "users", userUID);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
         await setDoc(
            userRef,
            {
               name: currUser.displayName || name || "用户",
               email: currUser.email || "",
               photo: currUser.photoURL || "",
               uid: userUID,
               createdAt: new Date().toISOString(),
               role: "user",
               supplier: {},
               products: {},
               clients: {},
            },
            { merge: true }
         );
      }
   } catch (error) {
      console.error("Error setting user document in Firestore:", error);
   }
}
