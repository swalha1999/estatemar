"use client";
import { useTranslation } from "@/app/i18n/client";
import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import "./searchFilters.css";

interface Filters {
    location: string;
    minPrice: string;
    maxPrice: string;
    beds: string;
}

interface FilterInputProps {
    value: string;
    placeholder: string;
    icon: React.ReactNode;
    options: string[];
    onChange: (value: string) => void;
    formatValue?: (value: string) => string;
    lng: string;
}

const FilterInput: React.FC<FilterInputProps> = ({
    value,
    placeholder,
    icon,
    options,
    onChange,
    formatValue = (v) => v,
    lng,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isRTL = lng === "ar" || lng === "he";

    return (
        <div className={`search-input-container ${isRTL ? "rtl" : ""}`} ref={ref}>
            {icon}
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                readOnly
                className="search-input"
                onClick={() => setShowDropdown(!showDropdown)}
                dir={isRTL ? "rtl" : "ltr"}
            />
            {value && (
                <button type="button" className="clear-input-button" onClick={() => onChange("")}>
                    <Icon name="FaTimes" />
                </button>
            )}
            <Icon name="FaChevronDown" className="dropdown-icon" />
            {showDropdown && (
                <div className={`dropdown-menu ${isRTL ? "rtl" : ""}`}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="dropdown-item"
                            onClick={() => {
                                onChange(option);
                                setShowDropdown(false);
                            }}
                        >
                            {formatValue(option)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SearchFilters: React.FC<any> = ({ initialFilters, lng }) => {
    const { t } = useTranslation(lng, "common", "");

    const priceOptions = [
        "0",
        "100000",
        "200000",
        "300000",
        "400000",
        "500000",
        "750000",
        "1000000",
        "1500000",
        "2000000",
        "3000000",
        "5000000",
    ];
    const bedOptions = ["1", "2", "3", "4", "5+"];

    const updateFilters = (key: keyof Filters, value: string) => {};

    const formatPrice = (value: string) => {
        return value ? `$${Number(value).toLocaleString()}` : "";
    };

    return (
        <div className="search-filters-form">
            <div className="search-filters-row">
                <FilterInput
                    value={""}
                    placeholder={t("location")}
                    icon={<Icon name="FaMapMarkerAlt" className="input-icon" />}
                    options={[]}
                    onChange={(value) => updateFilters("location", value)}
                    lng={lng}
                />
                <FilterInput
                    value={""}
                    placeholder={t("minPrice")}
                    icon={<Icon name="FaDollarSign" className="input-icon" />}
                    options={priceOptions}
                    onChange={(value) => updateFilters("minPrice", value)}
                    formatValue={formatPrice}
                    lng={lng}
                />
                <FilterInput
                    value={""}
                    placeholder={t("maxPrice")}
                    icon={<Icon name="FaDollarSign" className="input-icon" />}
                    options={priceOptions}
                    onChange={(value) => updateFilters("maxPrice", value)}
                    formatValue={formatPrice}
                    lng={lng}
                />
                {/* <FilterInput
                    value={filters.beds}
                    placeholder={t("beds")}
                    icon={<FaBed className="input-icon" />}
                    options={bedOptions}
                    onChange={(value) => updateFilters("beds", value)}
                    lng={lng}
                /> */}
            </div>
        </div>
    );
};

export default SearchFilters;
