import { useState, useEffect } from "react";
import { SessionSetup } from "./components/SessionSetup";
import { Timer } from "./components/Timer";
import { SessionComplete } from "./components/SessionComplete";
import { SessionHistory } from "./components/SessionHistory";
import { MusicPlayer } from "./components/MusicPlayer";
import { Session, SessionStats } from "./types";
import { saveSessions, loadSessions, generateId, clearStoredSessions } from "./utils/storage";
import { AuthBar } from "./components/AuthBar";
import { getMe, AuthUser } from "./utils/auth";
import {
	fetchSessions,
	createSession,
	clearSessions as apiClearSessions,
} from "./utils/sessionApi";
import { calculateStats } from "./utils/stats";

type AppState = "setup" | "active" | "complete" | "history";

interface ActiveSession {
	goal: string;
	duration: number;
	startTime: Date;
}

function App() {
	const [state, setState] = useState<AppState>("setup");
	const [sessions, setSessions] = useState<Session[]>([]);
	const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [stats, setStats] = useState<SessionStats>({
		totalSessions: 0,
		totalTime: 0,
		currentStreak: 0,
		longestStreak: 0,
		completedToday: 0,
	});

	// Load sessions and user on mount
	useEffect(() => {
		(async () => {
			const me = await getMe();
			setUser(me);
			if (me) {
				try {
					const serverSessions = await fetchSessions();
					setSessions(serverSessions);
					setStats(calculateStats(serverSessions));
					return;
				} catch (e) {
					// fallback to local if server fetch fails
				}
			}
			const loadedSessions = loadSessions();
			setSessions(loadedSessions);
			setStats(calculateStats(loadedSessions));
		})();
	}, []);

	// Save sessions when they change
	useEffect(() => {
		saveSessions(sessions);
		setStats(calculateStats(sessions));
	}, [sessions]);

	// React to auth events: fetch server history on login, fallback to local on logout
	useEffect(() => {
		const onLogin = async () => {
			try {
				const me = await getMe();
				setUser(me);
				const serverSessions = await fetchSessions();
				setSessions(serverSessions);
				setStats(calculateStats(serverSessions));
			} catch {
				// ignore
			}
		};
		const onLogout = () => {
			// Clear local sessions to avoid duplication when switching between auth states
			setUser(null);
			clearStoredSessions();
			setSessions([]);
			setStats(calculateStats([]));
		};

		window.addEventListener("auth:login", onLogin as unknown as EventListener);
		window.addEventListener("auth:logout", onLogout as unknown as EventListener);
		return () => {
			window.removeEventListener("auth:login", onLogin as unknown as EventListener);
			window.removeEventListener("auth:logout", onLogout as unknown as EventListener);
		};
	}, []);

	const handleStartSession = (goal: string, duration: number) => {
		setActiveSession({
			goal,
			duration,
			startTime: new Date(),
		});
		setState("active");
	};

	const handleSessionComplete = () => {
		setState("complete");
	};

	const handleStopSession = () => {
		setActiveSession(null);
		setState("setup");
	};

	const handleSaveSession = async (result: string) => {
		if (!activeSession) return;
		const newSession: Session = {
			id: generateId(),
			goal: activeSession.goal,
			duration: activeSession.duration,
			result,
			startTime: activeSession.startTime,
			endTime: new Date(),
			completed: true,
		};

		setSessions((prev) => [newSession, ...prev]);
		setActiveSession(null);
		setState("setup");

		try {
			await createSession(newSession);
		} catch {
			// stay silent; user may be offline or not authenticated
		}
	};

	const handleNewSession = () => {
		setActiveSession(null);
		setState("setup");
	};

	const handleShowHistory = () => {
		setState("history");
	};

	const handleBackToSetup = () => {
		setState("setup");
	};

	const handleClearHistory = async () => {
		if (
			window.confirm(
				"Are you sure you want to clear all session history? This action cannot be undone."
			)
		) {
			setSessions([]);
			try {
				await apiClearSessions();
			} catch {
				// ignore
			}
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

			<div className="relative z-10">
				{/* Header */}
				<header className="p-3 sm:p-4 lg:p-6">
					<div className="max-w-7xl mx-auto">
						{/* Top row - Logo and Controls */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 mb-4">
							<div className="flex items-center space-x-3">
								<img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-2xl object-cover" />
								<div>
									<h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
										{user ? `${user.username.toUpperCase()} Flow` : 'UserFlow'}
									</h1>
									<p className="text-gray-400 text-xs sm:text-sm">
										Track your productivity
									</p>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
								<div className="order-2 sm:order-1 w-full sm:w-auto">
									<AuthBar />
								</div>
								<div className="order-1 sm:order-2">
									<MusicPlayer onShowHistory={handleShowHistory} onNewSession={handleBackToSetup} onClearHistory={handleClearHistory} />
								</div>
							</div>
						</div>

						{/* Navigation Buttons - Only show when not in setup */}
						{state !== "setup" && (
							<div className="flex items-center justify-center sm:justify-end">
								<button
									onClick={handleBackToSetup}
									className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-4 py-2 sm:px-5 sm:py-3 rounded-xl border border-gray-600 transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
								>
									<Plus size={16} />
									<span>New Session</span>
								</button>
							</div>
						)}
					</div>
				</header>

				{/* Main Content */}
				<main className="p-3 sm:p-4 lg:p-6">
					<div className="max-w-7xl mx-auto">
						{state === "setup" && <SessionSetup onStart={handleStartSession} />}

						{state === "active" && activeSession && (
							<div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4 sm:px-0">
								<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-purple-500/20 text-center mb-6 sm:mb-8">
									<h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
										Focus Session
									</h2>
									<div className="bg-gray-700/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
										<p className="text-gray-300 text-xs sm:text-sm mb-1">Current Goal:</p>
										<p className="text-white font-semibold text-sm sm:text-base break-words">
											{activeSession.goal}
										</p>
									</div>
								</div>

								<Timer
									duration={activeSession.duration}
									onComplete={handleSessionComplete}
									onStop={handleStopSession}
								/>
							</div>
						)}

						{state === "complete" && activeSession && (
							<SessionComplete
								goal={activeSession.goal}
								duration={activeSession.duration}
								onSave={handleSaveSession}
								onNewSession={handleNewSession}
							/>
						)}

						{state === "history" && (
							<SessionHistory
								sessions={sessions}
								stats={stats}
								onClearHistory={handleClearHistory}
							/>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

export default App;
