const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const checkWhatsAppRateLimit = async (): Promise<{ canSend: boolean; rateLimitInfo?: any }> => {
	try {
		const response = await fetch(
			`https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}?fields=rate_limit_hit,rate_limit_reset_time`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${WHATSAPP_TOKEN}`,
				},
			}
		);

		if (!response.ok) {
			console.warn('Failed to check rate limit, proceeding with caution');
			return { canSend: true };
		}

		const data = await response.json();
		
		// Check if we've hit the rate limit
		if (data.rate_limit_hit === true) {
			console.log('Rate limit hit, cannot send message', data);
			return { 
				canSend: false, 
				rateLimitInfo: {
					resetTime: data.rate_limit_reset_time,
					message: 'Rate limit exceeded'
				}
			};
		}

		return { canSend: true, rateLimitInfo: data };
	} catch (error) {
		console.error('Error checking rate limit:', error);
		// If we can't check the rate limit, we'll proceed with caution
		return { canSend: true };
	}
};
