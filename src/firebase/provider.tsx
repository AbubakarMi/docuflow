'use client';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { createContext, useContext } from 'react';

export interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({
  children,
  ...props
}: React.PropsWithChildren<FirebaseContextType>) => {
  return (
    <FirebaseContext.Provider value={props}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(FirebaseContext);
}

export const useFirebaseApp = () => {
  return useFirebase()?.firebaseApp;
}

export const useAuth = () => {
  return useFirebase()?.auth;
}

export const useFirestore = () => {
  return useFirebase()?.firestore;
}
