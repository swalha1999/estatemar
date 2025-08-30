"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type Amenity } from "@/db/schema";
import { deleteAmenity } from "../actions";
import { Icon } from "@/components/icon";

interface AmenitiesTableProps {
    amenities: Amenity[];
    lng: string;
}

export function AmenitiesTable({ amenities, lng }: AmenitiesTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {amenities.map((amenity) => {
                    return (
                        <TableRow key={amenity.id}>
                            <TableCell>
                                <Icon name={amenity.icon} color="currentColor" size={20} />
                            </TableCell>
                            <TableCell>{amenity.name}</TableCell>
                            <TableCell>{amenity.description}</TableCell>
                            <TableCell>{amenity.created_at.toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link
                                            href={`/${lng}/dashboard/amenities/${amenity.id}/edit`}
                                        >
                                            <Icon name="Pencil" color="currentColor" size={20} />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => deleteAmenity(amenity.id.toString())}
                                    >
                                        <Icon name="Trash" color="currentColor" size={20} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
