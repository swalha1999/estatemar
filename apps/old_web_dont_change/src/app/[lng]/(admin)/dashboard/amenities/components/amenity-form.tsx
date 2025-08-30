"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getIconNames, Icon } from "@/components/icon";
import { Amenity } from "@/db/schema";
import { useRouter } from "next/navigation";

interface AmenityFormProps {
    title: string;
    initialData?: Amenity;
    onSubmit: (data: Partial<Amenity>) => Promise<void>;
}

export function AmenityForm({ title, initialData, onSubmit }: AmenityFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [iconSearch, setIconSearch] = useState("");
    const [selectedIconName, setSelectedIconName] = useState<string>(initialData?.icon ?? "");
    const selectedIconRef = useRef<HTMLButtonElement>(null);

    const iconNames = useMemo(() => getIconNames(), []);
    const filteredIcons = useMemo(() => {
        const searchTerm = iconSearch.toLowerCase();
        return searchTerm === ""
            ? iconNames
            : iconNames.filter((name) => name.toLowerCase().includes(searchTerm));
    }, [iconNames, iconSearch]);

    useEffect(() => {
        if (selectedIconName && selectedIconRef.current) {
            selectedIconRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [selectedIconName]);

    const handleSubmit = async (formData: FormData) => {
        await onSubmit({
            ...initialData,
            name,
            description,
            icon: selectedIconName,
        });
        router.push("/dashboard/amenities");
    };

    const IconGrid = useMemo(
        () => (
            <div className="grid grid-cols-6 gap-2">
                {filteredIcons.map((iconName) => (
                    <Button
                        key={iconName}
                        ref={iconName === selectedIconName ? selectedIconRef : null}
                        type="button"
                        variant={selectedIconName === iconName ? "default" : "outline"}
                        className={`h-12 w-full ${
                            selectedIconName === iconName ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedIconName(iconName)}
                    >
                        <Icon name={iconName} color="currentColor" size={20} />
                    </Button>
                ))}
            </div>
        ),
        [filteredIcons, selectedIconName]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name">Name</label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description">Description</label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="icon">Icon</label>
                        <Input
                            placeholder="Search icons..."
                            value={iconSearch}
                            onChange={(e) => setIconSearch(e.target.value)}
                            className="mb-4"
                        />
                        <ScrollArea className="h-[300px] border rounded-md p-4">
                            {IconGrid}
                        </ScrollArea>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={!selectedIconName}>
                            Save
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
