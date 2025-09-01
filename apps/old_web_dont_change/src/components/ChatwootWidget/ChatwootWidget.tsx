"use client";

import type React from "react";
import { useEffect } from "react";

interface ChatwootSettings {
	hideMessageBubble: boolean;
	position: "left" | "right";
	locale: string;
	type: "standard" | "expanded_bubble";
}

declare global {
	interface Window {
		chatwootSettings: ChatwootSettings;
		chatwootSDK: {
			run: (config: { websiteToken: string; baseUrl: string }) => void;
		};
	}
}

interface ChatwootWidgetProps {
	locale: string;
}

const ChatwootWidget: React.FC<ChatwootWidgetProps> = ({ locale }) => {
	useEffect(() => {
		// Add Chatwoot Settings
		window.chatwootSettings = {
			hideMessageBubble: false,
			position: "right",
			locale: locale,
			type: "standard",
		};

		// Chatwoot SDK initialization
		((d, t) => {
			const BASE_URL = "https://chat.techween.io/";
			const g = d.createElement(t) as HTMLScriptElement;
			const s = d.getElementsByTagName(t)[0];
			g.src = BASE_URL + "/packs/js/sdk.js";
			g.defer = true;
			g.async = true;
			if (s?.parentNode) {
				s.parentNode.insertBefore(g, s);
			}
			g.onload = () => {
				window.chatwootSDK.run({
					websiteToken: "Ats8Yz4x5F9rymo7fHmv9qsM",
					baseUrl: BASE_URL,
				});
			};
		})(document, "script");
	}, [locale]);

	return null;
};

export default ChatwootWidget;
