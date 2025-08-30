"use client";

import React from "react";
import styles from "./Modal.module.css";
import { useTranslation } from "@/app/i18n/client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    lng: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen = true, onClose, children, lng }) => {
    const { t } = useTranslation(lng, "privacy", "");
    const router = useRouter();

    const handleClose = useCallback(() => {
        router.back();
        if (onClose) {
            onClose();
        }
    }, [router, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [handleClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalScrollContent}>{children}</div>
                <button className={styles.bottomCloseButton} onClick={handleClose}>
                    {t("closeButton")}
                </button>
            </div>
        </div>
    );
};

export default Modal;
