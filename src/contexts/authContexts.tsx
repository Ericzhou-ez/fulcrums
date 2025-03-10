import { createContext, useContext, useEffect, useRef } from "react";
import { AuthContextType, UserType } from "../types/types";
import { auth, db } from "../configs/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
   children: React.ReactNode;
   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
   user: UserType | null;
   loading: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
   children,
   setUser,
   setLoading,
   user,
   loading,
}) => {
   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         if (currentUser) {
            setUser({ uid: currentUser?.uid, name: currentUser?.displayName, email: currentUser?.email, photo: currentUser?.photoURL } as UserType);
            setLoading(false);
         } else {
            setUser(null);
            setLoading(false);
         }
      });

      return () => unsubscribe();
   }, []);

   useEffect(() => {
      const uid = user?.uid;
      
      if (uid) {
         fetchUserData(uid).then((userData) => setUser(userData));
      }

   }, []);

   const signedIn = !!user;

   return (
      <AuthContext.Provider
         value={{ user, setUser, loading, setLoading, signedIn }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = (): AuthContextType => {
   const authContext = useContext(AuthContext);
   if (!authContext) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return authContext;
};

export async function fetchUserData(uid: string) {
   try {
      const userRef = doc(db, "users", uid); //only creates the path
      const userSnap = await getDoc(userRef);

      if (userSnap) {
         const userData = userSnap.data() as UserType;
         return userData;
      } else {
         console.log("no such user");
         return null;
      }
   } catch (err) {
      console.error(err);
      return null;
   }
}
