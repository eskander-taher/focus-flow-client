import React, { useEffect, useState } from "react";
import { login, register, getMe, logout, AuthUser } from "../utils/auth";

export const AuthBar: React.FC = () => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState<"login" | "register">("login");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const me = await getMe();
			setUser(me);
		})();
		const onExternalLogout = () => setUser(null);
		window.addEventListener("auth:logout", onExternalLogout as EventListener);
		return () => {
			window.removeEventListener("auth:logout", onExternalLogout as EventListener);
		};
	}, []);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			const { user } = await login(username, password);
			setUser(user);
			setUsername("");
			setPassword("");
			window.dispatchEvent(new Event("auth:login"));
		} catch (e: any) {
			setError(e?.response?.data?.error?.message || "Login failed");
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			const { user } = await register(username, password);
			setUser(user);
			setUsername("");
			setPassword("");
			window.dispatchEvent(new Event("auth:login"));
		} catch (e: any) {
			setError(e?.response?.data?.error?.message || "Register failed");
		}
	};

	if (user) {
		return;
	}

	return (
		<form
			onSubmit={mode === "login" ? handleLogin : handleRegister}
			className="flex items-center space-x-2"
		>
			<input
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				className="bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm"
				required
			/>
			<input
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				type="password"
				className="bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm"
				required
			/>
			<button
				type="submit"
				className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-3 py-2 rounded-xl border border-gray-600 text-sm"
			>
				{mode === "login" ? "Login" : "Register"}
			</button>
			<button
				type="button"
				onClick={() => setMode(mode === "login" ? "register" : "login")}
				className="text-purple-400 hover:text-purple-300 text-xs"
			>
				{mode === "login" ? "Need an account?" : "Have an account?"}
			</button>
			{error && <span className="text-red-400 text-xs ml-2">{error}</span>}
		</form>
	);
};
