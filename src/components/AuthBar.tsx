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
		return (
			<div className="flex items-center space-x-3">
				<span className="text-gray-300 text-sm">Hi, {user.username}</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
			<form
				onSubmit={mode === "login" ? handleLogin : handleRegister}
				className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto"
			>
				<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Username"
						className="bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm w-full sm:w-auto min-w-[120px]"
						required
					/>
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						type="password"
						className="bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-white placeholder-gray-400 text-sm w-full sm:w-auto min-w-[120px]"
						required
					/>
				</div>
				<div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
					<button
						type="submit"
						className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-3 py-2 rounded-xl border border-gray-600 text-sm flex-1 sm:flex-none"
					>
						{mode === "login" ? "Login" : "Register"}
					</button>
					<button
						type="button"
						onClick={() => setMode(mode === "login" ? "register" : "login")}
						className="text-purple-400 hover:text-purple-300 text-xs whitespace-nowrap"
					>
						{mode === "login" ? "Need an account?" : "Have an account?"}
					</button>
				</div>
			</form>
			{error && (
				<div className="text-red-400 text-xs mt-1 sm:mt-0 sm:ml-2 w-full sm:w-auto">
					{error}
				</div>
			)}
		</div>
	);
};
