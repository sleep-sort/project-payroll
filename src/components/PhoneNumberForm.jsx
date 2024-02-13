import { useState, useEffect, useRef } from "react";

import {
	firebaseGetRecaptchaVerifier,
	firebaseSetPersistence,
	firebaseSignInWithContact,
	firebaseOnAuthStateChange,
	firebaseSignOut,
} from "../firebase";

async function fakeDelay(delay = 1000) {
	const promise = new Promise((resolve) => setTimeout(() => resolve(true), delay));
  
	await Promise.resolve(promise);
  }

export default function PhoneNumberForm({
	setLoading,
	setNextIndex,
	appVerifier,
	confirmation,
}) {
	const [number, setNumber] = useState("");
	// const [code, setCode] = useState({ callingCode: "+1", country: "US" });
	const [rememberMe, setRememberMe] = useState(true);

	const onSubmit = async (e) => {
		e?.preventDefault();
		const phoneNumber = number;
		setLoading(true);
		try {
			if (!appVerifier.current) throw "Recaptcha Not Found";

			console.log({
				phoneNumber,
				appVerifier: appVerifier.current,
			})

			const confirmationResult = await firebaseSignInWithContact(
				phoneNumber,
				appVerifier.current
			);
			confirmation.current = confirmationResult;
			await firebaseSetPersistence(rememberMe);

			await fakeDelay(1000);
			setNextIndex();			
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Enter your phone number</h1>
			<input
				type="text"
				value={number}
				onChange={(e) => setNumber(e.target.value)}
			/>
			<button type="submit">Send code</button>
		</form>
	);
}
