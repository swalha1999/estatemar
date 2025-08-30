"use client";

import { useEffect } from "react";
import { submitMetric } from "@/data/metrics";

function ViewCollector({ metricKey }: { metricKey: string }) {
    useEffect(() => {
        const collectView = async () => {
            try {
                await submitMetric(metricKey, 1, new Date());
            } catch (error) {
                console.error(`Failed to collect view for ${metricKey}:`, error);
            }
        };

        collectView();

        return () => {};
    }, [metricKey]);

    return <></>;
}

export default ViewCollector;
