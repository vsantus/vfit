import type { FirebaseApp } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getFirebaseConfig } from "@/lib/firebase/config";

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedAnalytics: Promise<Analytics | null> | null = null;

export function getFirebaseApp() {
  if (cachedApp) {
    return cachedApp;
  }

  cachedApp = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());

  return cachedApp;
}

export function getFirebaseAuth() {
  if (cachedAuth) {
    return cachedAuth;
  }

  cachedAuth = getAuth(getFirebaseApp());

  return cachedAuth;
}

export function getFirestoreDb() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (cachedAnalytics) {
    return cachedAnalytics;
  }

  cachedAnalytics = isSupported()
    .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
    .catch(() => null);

  return cachedAnalytics;
}
