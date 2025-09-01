"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import "react-phone-input-2/lib/style.css";
import "./Subscribe.css";
import type { UpdatesLead } from "@/utils/leads/updates_leads";
import { submitSubscribe } from "./actions";

const PhoneInput = dynamic(() => import("react-phone-input-2"), {
	ssr: false,
});

interface SubscribeProps {
	params: {
		lng: string;
	};
}

function Subscribe(props: SubscribeProps) {
	const { lng } = props.params;
	const { t } = useTranslation(lng, "landing-page", {});
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		try {
			await submitSubscribe({
				...data,
				phone: phone,
			} as Omit<UpdatesLead, "id" | "created_at">);

			// Clear form
			form.reset();
			setPhone("");

			// Show success message
			setMessage({
				type: "success",
				text: t(
					"subscribe.success",
					"Thank you for subscribing! We'll keep you updated.",
				),
			});

			// Clear message after 5 seconds
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		} catch (error) {
			setMessage({
				type: "error",
				text: t("subscribe.error", "Something went wrong. Please try again."),
			});
		}
	}

	return (
		<div className="subscribe-container">
			<div className="subscribe-content">
				<h2>
					{t("subscribe.title", "Subscribe for Special Offers")}
					<span className="free-label">{t("subscribe.free", "Free")}</span>
				</h2>
				<p>
					{t(
						"subscribe.description",
						"Stay updated with new listings and exclusive discounts!",
					)}
				</p>

				{message && (
					<div className={`message ${message.type}`}>{message.text}</div>
				)}

				<form className="subscribe-form" onSubmit={handleSubmit}>
					<input
						type="text"
						name="name"
						placeholder={t("subscribe.fullName", "Full Name")}
						required
					/>
					<input
						type="email"
						name="email"
						placeholder={t("subscribe.email", "Email")}
						required
					/>
					<div className="phone-input-wrapper">
						<PhoneInput
							country={"us"}
							value={phone}
							onChange={(phone) => setPhone(phone)}
							inputProps={{
								required: true,
								name: "phone", // Add name attribute
								placeholder: t("subscribe.phone", "Phone Number"),
							}}
							enableSearch={true}
							searchPlaceholder={t(
								"subscribe.searchCountry",
								"Search country...",
							)}
						/>
					</div>
					<button type="submit">{t("subscribe.button", "Subscribe")}</button>
				</form>
			</div>
		</div>
	);
}

export default Subscribe;
