'use client';

import { initializeFirebase, FirebaseProvider } from '.';
import { UserProvider } from './auth/use-user';
import { useMemo } from 'react';

export default function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, firestore, auth } = useMemo(
    () => initializeFirebase(),
    []
  );

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      <UserProvider>{children}</UserProvider>
    </FirebaseProvider>
  );
}
