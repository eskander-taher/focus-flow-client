import React, { useState } from "react";
import { CheckCircle, RotateCcw } from "lucide-react";

interface SessionCompleteProps {
	goal: string;
	duration: number;
	onSave: (result: string) => void;
	onNewSession: () => void;
}

export const SessionComplete: React.FC<SessionCompleteProps> = ({
	goal,
	duration,
	onSave,
	onNewSession,
}) => {
	const [result, setResult] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(result.trim());
	};

	return (
		<div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4 sm:px-0">
			<div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-green-500/20">
				<div className="text-center mb-8">
					<div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
						<CheckCircle className="text-white" size={32} />
					</div>
					<h2 className="text-3xl font-bold text-white mb-2">Session Complete! 🎉</h2>
					<p className="text-gray-300 mb-4">
						Great job on your {duration}-minute session!
					</p>

					<div className="bg-gray-700/30 rounded-xl p-4 mb-6">
						<p className="text-gray-300 text-sm mb-1">Your Goal:</p>
						<p className="text-white font-semibold">{goal}</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-gray-300 text-sm font-semibold mb-3">
							What did you accomplish?
						</label>
						<textarea
							value={result}
							onChange={(e) => setResult(e.target.value)}
							placeholder="Describe what you achieved during this session..."
							rows={4}
							className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
							required
						/>
					</div>

					<div className="flex space-x-4">
						<button
							type="submit"
							disabled={!result.trim()}
							className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200"
						>
							Save Session
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
