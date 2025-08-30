"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n/client";
import styles from "./PartnerApplicationForm.module.css";
import { submitPartnerApplication } from "./actions";
import { PartnerLead } from "@/utils/leads/partner_leads";

export default function PartnerApplicationForm({ lng }: { lng: string }) {
    const [mounted, setMounted] = useState(false);
    const { t } = useTranslation(lng, "partners-page", "");

    const [formData, setFormData] = useState<Omit<PartnerLead, "id" | "created_at">>({
        company_name: "",
        email: "",
        phone: "",
    });

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
        null
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await submitPartnerApplication(formData);
            if (result.success) {
                // Clear form
                setFormData({
                    company_name: "",
                    email: "",
                    phone: "",
                });

                // Show success message
                setMessage({
                    type: "success",
                    text: t(
                        "partner.form.success",
                        "Thank you for your application! We'll be in touch soon."
                    ),
                });

                // Clear message after 5 seconds
                setTimeout(() => {
                    setMessage(null);
                }, 5000);
            } else {
                throw new Error();
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: t("partner.form.error", "Something went wrong. Please try again."),
            });
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
            )}

            <div className={styles.formGroup}>
                <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder={t("partner.form.companyName", "Company Name")}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("partner.form.email", "Email")}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("partner.form.phone", "Phone Number")}
                    className={styles.input}
                    required
                />
            </div>

            <button type="submit" className={styles.submitButton}>
                {t("partner.form.submit", "Submit Application")}
            </button>
        </form>
    );
}
