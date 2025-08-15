let alarmAudio: HTMLAudioElement | null = null;

function getAlarmAudio(): HTMLAudioElement {
	if (!alarmAudio) {
		alarmAudio = new Audio("/alarm.mp3");
		alarmAudio.preload = "auto";
	}
	return alarmAudio;
}

export async function primeAlarmAudio(): Promise<void> {
	const a = getAlarmAudio();
	try {
		a.volume = 0;
		await a.play();
		a.pause();
		a.currentTime = 0;
	} catch (_) {
		// ignore - browser may block until user gesture; we call this from a gesture anyway
	}
}

export function playAlarmAudio(volume: number = 0.7): void {
	const a = getAlarmAudio();
	try {
		a.volume = volume;
		a.currentTime = 0;
		void a.play();
	} catch (_) {
		// ignore
	}
}

