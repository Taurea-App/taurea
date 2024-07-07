import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";

import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { DBUser } from "@/types";

export const UserContext = createContext<{
  user: User | null;
  dbUser: DBUser | null;
  refreshUserData: () => void;
}>({
  user: null,
  dbUser: null,
  refreshUserData: () => {},
});

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);

  const refreshUserData = async () => {
    if (user) {
      const userRef = doc(FIRESTORE_DB, "users", user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setDbUser(doc.data() as DBUser);
        }
      });
      return () => unsubscribe();
    }
  };

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
    });
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, dbUser, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};
