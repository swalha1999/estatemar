"use server";

// make this call the local database instead of the solletics api
export const submitMetric = async (key: string, value: number, date: Date) => {
	try {
		console.log("submitting metric", key, value, date);
		return { success: true };
	} catch (error) {
		console.error("Error submitting metric:", error);
		throw error;
	}
};
