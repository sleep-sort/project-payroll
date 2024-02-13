import { useState, useEffect, useRef } from "react";

import {
	firebaseGetRecaptchaVerifier,
	firebaseSetPersistence,
	firebaseSignInWithContact,
	firebaseOnAuthStateChange,
	firebaseSignOut,
} from "../firebase";

export default function AuthCodeForm({ confirmation, setLoading }) {
	const [authCode, setAuthCode] = useState("");

	const onSubmit = async (e) => {
		e?.preventDefault();
		setLoading(true);
		try {
			await confirmation.current?.confirm(authCode);

			console.log("User signed in successfully ✅")
		} catch (err) {
			setAuthCode("");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Enter the code you received</h1>
			<input
				type="text"
				value={authCode}
				onChange={(e) => setAuthCode(e.target.value)}
			/>
			<button type="submit">Log in</button>
		</form>
	);
}
