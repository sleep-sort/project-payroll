import { initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  getAuth,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  RecaptchaVerifier,
  setPersistence,
  signInWithCustomToken,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";

// declare const window: any;

const config = {
  apiKey: "AIzaSyBs-pxxCqj5Qjp7aHjyqO1SG1k2GRUuQCo",
  authDomain: "project-payroll-fb247.firebaseapp.com",
  projectId: "project-payroll-fb247",
  storageBucket: "project-payroll-fb247.appspot.com",
  messagingSenderId: "167662014094",
  appId: "1:167662014094:web:1cb6f234c398ca01a743df",
};

// Initialize Firebase
const firebaseApp = initializeApp(config);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export function firebaseOnAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export function firebaseStorageRef(url) {
  return ref(storage, url);
}

export function firebaseGetCurrentUser() {
  return auth.currentUser;
}

// const firebaseGetCurrentUser = () => auth.currentUser;

// interface updateProfileSchema {
//     displayName?: string | null;
//     photoURL?: string | null;
// }
// function updateUserProfile(args: updateProfileSchema) {
//     return updateProfile(auth.currentUser as User, args);
// }

export function firebaseSignOut() {
  return signOut(auth);
}

// function firebaseSignInWithGooglePopup() {
//     const googleProvider = new GoogleAuthProvider();
//     return signInWithPopup(auth, googleProvider);
// }

// function firebaseLinkWithGooglePopup() {
//     const googleProvider = new GoogleAuthProvider();
//     return linkWithPopup(auth.currentUser as User, googleProvider);
// }

// function firebaseLinkUserPhoneNumber(credential: AuthCredential) {
//     return linkWithCredential(auth.currentUser as User, credential);
// }

export function firebaseGetRecaptchaVerifier(refElem, callback, expCallback) {
  return new RecaptchaVerifier(auth, refElem, {
    size: "invisible",
    callback,
    "expired-callback": expCallback,
  });
}

export function firebaseSignInWithContact(phoneNumber, appVerifier) {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

export function firebaseSignInWithCustomToken(token) {
  return signInWithCustomToken(auth, token);
}

// function firebaseVerifyContact(
//     phoneNumber: string,
//     appVerifier: ApplicationVerifier
// ) {
//     const provider = new PhoneAuthProvider(auth);
//     return provider.verifyPhoneNumber(phoneNumber, appVerifier);
// }

export function firebaseSetPersistence(rememberMe) {
  const persist = rememberMe
    ? indexedDBLocalPersistence
    : browserSessionPersistence;
  return setPersistence(auth, persist);
}

export async function uploadImageToStorage(path, file) {
  const storageRef = firebaseStorageRef(path);
  const metadata = {
    contentType: file.type,
    // set the cache control to public for 1 year
    cacheControl: "public, max-age=31536000",
  };
  const fileRef = await uploadBytes(storageRef, file, metadata);
  const src = await getDownloadURL(fileRef.ref);
  const url = new URL(src);
  url.searchParams.set("timestamp", Date.now().toString());

  return url.toString();
}

export async function listAllFiles(path, maxResults = 50, nextPageToken) {
  const listRef = ref(storage, path);
  const page = await list(listRef, { maxResults, pageToken: nextPageToken });
  return page;
}

// ======================================================>>>Analytics<<<======================================================
// let analytics = null;

// (async () => {
//   const isAnalyticsSupported = await isSupported();
//   if (!isAnalyticsSupported) return;
//   analytics = getAnalytics(firebaseApp);
// })();

// export function firebaseAnalyticsLogEvent(
//   eventName,
//   eventParams,
//   options
// ) {
//   if (!analytics) return;

//   logEvent(
//     analytics,
//     eventName,
//     {
//       ...eventParams,
//       tenant_domain: window.location.hostname,
//       page_path: window.location.pathname,
//       provider: CONFIG_PROVIDER_NAME,
//     },
//     options
//   );
// }

// export function firebaseAnalyticsSetUserId(userId) {
//   if (!analytics) return;

//   setUserId(analytics, userId);
// }

// export function firebaseAnalyticsSetUserProperties(
//   userProperties
// ) {
//   if (!analytics) return;

//   setUserProperties(analytics, userProperties);
// }
