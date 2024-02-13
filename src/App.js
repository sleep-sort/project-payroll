import { useEffect, useRef, useState } from "react";
import "./App.css";
import AuthCodeForm from "./components/AuthCodeForm";
import PhoneNumberForm from "./components/PhoneNumberForm";
import {
  firebaseGetRecaptchaVerifier,
  firebaseOnAuthStateChange,
  firebaseSignOut,
} from "./firebase";

// ==============================>>><<<==============================

export default function App() {
  const [formIndex, setFormIndex] = useState(0);

  const confirmation = useRef();
  const recaptchaContainerRef = useRef(null);
  const appVerifier = useRef();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChange((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    appVerifier.current = firebaseGetRecaptchaVerifier(
      recaptchaContainerRef.current,
      undefined,
      () => {
        setLoading(false);
        setFormIndex(0);
      }
    );
  }, []);

  if (isLoggedIn)
    return (
      <div>
        <h1>You are logged in</h1>
        <button onClick={() => firebaseSignOut()}>Log out</button>
      </div>
    );
  return (
    <div>
      {loading && <h1>Loading...</h1>}

      {formIndex === 0 ? (
        <PhoneNumberForm
          setLoading={setLoading}
          setNextIndex={() => setFormIndex(1)}
          appVerifier={appVerifier}
          confirmation={confirmation}
        />
      ) : (
        <AuthCodeForm confirmation={confirmation} setLoading={setLoading} />
      )}

      <button ref={recaptchaContainerRef} style={{ display: "none" }} />
    </div>
  );
}
