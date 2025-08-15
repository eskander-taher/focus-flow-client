import React, { useState, useRef, useEffect } from "react";
import { Music, Settings, Play, Pause, History, LogOut, Plus } from "lucide-react";
import { getMe, logout, AuthUser } from "../utils/auth";


interface Track {
	name: string;
	time: number; // seconds
}

interface MusicPlayerProps {
	onShowHistory?: () => void;
	onNewSession?: () => void;
	onClearHistory?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onShowHistory, onNewSession, onClearHistory }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.3);
	const [showSettings, setShowSettings] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<AuthUser | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

	// One file containing all songs
	const musicUrl = "/jazz.mp3";

	// Tracklist from your screenshot
	const tracklist: Track[] = [
		{ name: "No Mail Today", time: 0 },
		{ name: "Coffee Rings And Blue Notes", time: 4 * 60 + 21 },
		{ name: "Late Shift", time: 7 * 60 + 37 },
		{ name: "Stopped At Green", time: 11 * 60 + 10 },
		{ name: "Empty Jukebox", time: 14 * 60 + 22 },
		{ name: "Leaned On Me", time: 19 * 60 + 16 },
		{ name: "Fading Soft Light", time: 22 * 60 + 21 },
		{ name: "Echoes Of You", time: 25 * 60 + 36 },
		{ name: "Softest Evening Glow", time: 28 * 60 + 38 },
		{ name: "Lost Moments", time: 32 * 60 + 18 },
		{ name: "Empty Streets", time: 36 * 60 + 27 },
		{ name: "Soft Light", time: 39 * 60 + 11 },
		{ name: "Quiet Room", time: 43 * 60 + 11 },
		{ name: "Gentle Rain", time: 47 * 60 + 19 },
		{ name: "Late Call", time: 51 * 60 + 23 },
		{ name: "Warm Light", time: 55 * 60 + 59 },
	];

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	// Autoplay when mounted
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			audioRef.current
				.play()
				.then(() => setIsPlaying(true))
				.catch((err) => {
					console.warn("Autoplay blocked by browser:", err);
				});
		}
	}, []);

	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play().catch(console.error);
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleVolumeChange = (newVolume: number) => {
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const jumpToTrack = (seconds: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = seconds;
			audioRef.current.play().catch(console.error);
			setIsPlaying(true);
		}
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setShowSettings(false);
			}
		};
		if (showSettings) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showSettings]);

	useEffect(() => {
		// initialize from stored token
		const hasToken = !!localStorage.getItem("auth_token");
		setIsAuthenticated(hasToken);
		if (hasToken) {
			getMe().then(setUser).catch(() => setUser(null));
		}

		const onLogin = () => {
			setIsAuthenticated(true);
			getMe().then(setUser).catch(() => setUser(null));
		};
		const onLogout = () => {
			setIsAuthenticated(false);
			setShowSettings(false);
			setUser(null);
		};

		window.addEventListener('auth:login', onLogin as unknown as EventListener);
		window.addEventListener('auth:logout', onLogout as unknown as EventListener);

		return () => {
			window.removeEventListener('auth:login', onLogin as unknown as EventListener);
			window.removeEventListener('auth:logout', onLogout as unknown as EventListener);
		};
	}, []);

	return (
		<div ref={wrapperRef} className="relative flex items-center">
			{/* Hidden audio element */}
			<audio
				ref={audioRef}
				loop
				src={musicUrl}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				onLoadedData={() => {
					if (audioRef.current) {
						audioRef.current.volume = volume;
					}
				}}
			/>

			{/* Controls */}
			<div className="flex items-center space-x-2 mb-4">
				{/* New session button next to History */}
				<button
					onClick={onNewSession}
					disabled={!onNewSession}
					className="bg-gray-800/50 hover:bg-gray-700/50 text-purple-400 p-2 rounded-lg border border-gray-600 transition-all duration-200 disabled:opacity-50"
					title="New Session"
				>
					<Plus size={16} />
				</button>
				{/* History button inline with settings */}
				<button
					onClick={onShowHistory}
					disabled={!onShowHistory}
					className="bg-gray-800/50 hover:bg-gray-700/50 text-purple-400 p-2 rounded-lg border border-gray-600 transition-all duration-200 disabled:opacity-50"
					title="History"
				>
					<History size={16} />
				</button>
				<button
					onClick={togglePlay}
					className="bg-gray-800/50 hover:bg-gray-700/50 text-purple-400 p-2 rounded-lg border border-gray-600 transition-all duration-200"
					title={isPlaying ? "Pause Music" : "Play Music"}
				>
					{isPlaying ? <Pause size={16} /> : <Play size={16} />}
				</button>

				<button
					onClick={() => setShowSettings(!showSettings)}
					className="bg-gray-800/50 hover:bg-gray-700/50 text-purple-400 p-2 rounded-lg border border-gray-600 transition-all duration-200"
					title="Settings"
				>
					<Settings size={16} />
				</button>
			</div>

			{/* Settings Panel */}
			{showSettings && (
				<div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-gray-800/90 backdrop-blur-lg rounded-xl p-4 border border-gray-600 shadow-xl z-50">
					<div className="space-y-4">
						{user && (
							<div className="flex items-center justify-between bg-gray-700/40 rounded-lg p-3 border border-gray-600/40">
								<div className="text-sm text-gray-300">
									<span className="text-gray-400">Signed in as</span>
									<span className="ml-2 font-semibold text-white">{user.username}</span>
								</div>
							</div>
						)}
						<div className="flex items-center space-x-2 mb-4">
							<Music className="text-purple-400" size={20} />
							<h3 className="text-white font-semibold">Music Settings</h3>
						</div>

						{/* Volume */}
						<div>
							<label className="block text-gray-300 text-sm mb-2">Volume</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={volume}
								onChange={(e) => handleVolumeChange(Number(e.target.value))}
								className="w-full accent-purple-500"
							/>
							<div className="text-xs text-gray-400 mt-1">
								{Math.round(volume * 100)}%
							</div>
						</div>

						{/* Tracklist */}
						<div>
							<label className="block text-gray-300 text-sm mb-2">Tracklist</label>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{tracklist.map((track, index) => (
									<button
										key={index}
										onClick={() => jumpToTrack(track.time)}
										className="w-full text-left p-3 rounded-lg bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-600/50 transition-all duration-200"
									>
										<div className="font-medium">{track.name}</div>
									</button>
								))}
							</div>
						</div>

						{isAuthenticated && (
							<div className="pt-2 border-t border-gray-700/60">
								{onClearHistory && (
									<button
										onClick={() => {
											const input = prompt('Type "remove history" to confirm clearing all sessions');
											if ((input || '').trim().toLowerCase() === 'remove history') {
												onClearHistory();
											}
										}}
										className="w-full flex items-center justify-center space-x-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 font-medium py-2 px-3 rounded-lg transition-colors mb-2"
									>
										<span>Remove History</span>
									</button>
								)}
								<button
									onClick={() => {
										// clear token and notify app
										logout();
										window.dispatchEvent(new Event('auth:logout'));
										setShowSettings(false);
										setIsAuthenticated(false);
									}}
									className="w-full flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium py-2 px-3 rounded-lg transition-colors"
								>
									<LogOut size={16} />
									<span>Logout</span>
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
