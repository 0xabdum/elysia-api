const convertTimeToDate = (time: string): Date => {
	const unit = time.slice(-1);
	const value = Number.parseInt(time.slice(0, -1), 10);

	let milliseconds = 0;

	switch (unit) {
		case 'd': // Hari
			milliseconds = value * 1000 * 60 * 60 * 24;
			break;
		case 'h': // Jam
			milliseconds = value * 1000 * 60 * 60;
			break;
		case 'm': // Menit
			milliseconds = value * 1000 * 60;
			break;
		case 's': // Detik
			milliseconds = value * 1000;
			break;
		default:
			throw new Error(
				"Format waktu tidak valid (Gunakan 'd', 'h', 'm', atau 's')",
			);
	}

	return new Date(Date.now() + milliseconds);
};

function endpointToSlug(endpoint: string): string {
	return `${endpoint
		.split('/')
		.filter((item) => item !== '')
		.join('_')}`; // "/api/user/findById" → "api_user_findById"
}

export { convertTimeToDate, endpointToSlug };
