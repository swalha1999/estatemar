'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { MultiImageUploader } from '../../../components/multi-image-uploader';
import { updateProperty, addPropertyImage } from '../../../actions';
import { 
	PropertyWithImages, 
	propertyFormSchema, 
	PropertyFormData 
} from '@/data/access-layer-v2/interfaces/property.interface';

interface EditPropertyFormProps {
	property: PropertyWithImages;
}

export function EditPropertyForm({ property }: EditPropertyFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);

	const form = useForm<PropertyFormData>({
		resolver: zodResolver(propertyFormSchema),
		defaultValues: {
			title: property.title,
			description: property.description,
			price: property.price?.toString() || '',
			location: property.location,
			address: property.address,
			bedrooms: property.bedrooms,
			bathrooms: property.bathrooms,
			area: property.area?.toString() || '',
			propertyType: property.propertyType,
			listingType: property.listingType,
			isAvailable: property.isAvailable,
			isFeatured: property.isFeatured,
			amenities: property.amenities?.join(', ') || '',
			latitude: property.latitude || undefined,
			longitude: property.longitude || undefined,
			yearBuilt: property.yearBuilt || undefined,
			parkingSpaces: property.parkingSpaces || 0,
			agentName: property.agentName || '',
			agentPhone: property.agentPhone || '',
			agentEmail: property.agentEmail || '',
			virtualTourUrl: property.virtualTourUrl || '',
			monthlyRent: property.monthlyRent?.toString() || '',
			annualAppreciationRate: property.annualAppreciationRate?.toString() || '',
		},
	});

	const onSubmit = async (data: PropertyFormData) => {
		try {
			setIsSubmitting(true);
			
			const amenitiesArray = data.amenities 
				? data.amenities.split(',').map(a => a.trim()).filter(Boolean)
				: [];

			// Update property data
			const result = await updateProperty(property.id, {
				...data,
				amenities: amenitiesArray,
				price: parseFloat(data.price),
				area: parseFloat(data.area),
				latitude: data.latitude || undefined,
				longitude: data.longitude || undefined,
				yearBuilt: data.yearBuilt || undefined,
				parkingSpaces: data.parkingSpaces || 0,
				agentName: data.agentName || undefined,
				agentPhone: data.agentPhone || undefined,
				agentEmail: data.agentEmail || undefined,
				virtualTourUrl: data.virtualTourUrl || undefined,
				monthlyRent: data.monthlyRent ? parseFloat(data.monthlyRent) : undefined,
				annualAppreciationRate: data.annualAppreciationRate ? parseFloat(data.annualAppreciationRate) : undefined,
			});

			if (result.success) {
				// Handle new image uploads if any
				if (uploadedFileIds.length > 0) {
					// Add new images to the property
					for (let i = 0; i < uploadedFileIds.length; i++) {
						await addPropertyImage(
							property.id,
							uploadedFileIds[i],
							false, // Not primary by default
							i // Add to end
						);
					}
				}

				toast({
					title: 'Success',
					description: 'Property updated successfully',
				});
				router.push('/super/properties');
			} else {
				toast({
					title: 'Error',
					description: result.error || 'Failed to update property',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Modern Luxury Villa" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea 
											placeholder="Beautiful modern villa with stunning ocean views..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="propertyType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Property Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select property type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="villa">Villa</SelectItem>
											<SelectItem value="apartment">Apartment</SelectItem>
											<SelectItem value="house">House</SelectItem>
											<SelectItem value="commercial">Commercial</SelectItem>
											<SelectItem value="land">Land</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="listingType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Listing Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select listing type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="sale">For Sale</SelectItem>
											<SelectItem value="rent">For Rent</SelectItem>
											<SelectItem value="both">Both</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											step="0.01"
											placeholder="500000"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="area"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Area (sq ft)</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											step="0.01"
											placeholder="2500"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bedrooms"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bedrooms</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											min="0"
											placeholder="3"
											value={field.value}
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bathrooms"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bathrooms</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											min="0"
											placeholder="2"
											value={field.value}
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input placeholder="Dubai Marina" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input placeholder="123 Marina Walk, Dubai" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="yearBuilt"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Year Built</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											min="1900"
											max={new Date().getFullYear()}
											placeholder="2020"
											value={field.value || ''}
											onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="parkingSpaces"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Parking Spaces</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											min="0"
											placeholder="2"
											value={field.value}
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="latitude"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Latitude</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											step="any"
											placeholder="25.2048"
											value={field.value || ''}
											onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="longitude"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Longitude</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											step="any"
											placeholder="-118.7798"
											value={field.value || ''}
											onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="agentName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Name</FormLabel>
									<FormControl>
										<Input placeholder="Sarah Johnson" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="agentPhone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Phone</FormLabel>
									<FormControl>
										<Input placeholder="+1 (555) 123-4567" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="agentEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="sarah.johnson@estatemar.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="virtualTourUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Virtual Tour URL</FormLabel>
									<FormControl>
										<Input placeholder="https://tourin3d.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="monthlyRent"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monthly Rent</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											step="0.01"
											placeholder="14500"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="annualAppreciationRate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Annual Appreciation Rate (%)</FormLabel>
									<FormControl>
										<Input 
											type="number" 
											step="0.1"
											placeholder="4.2"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="amenities"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Amenities</FormLabel>
									<FormControl>
										<Input 
											placeholder="Swimming Pool, Ocean View, Garden, Garage (comma separated)" 
											{...field} 
										/>
									</FormControl>
									<FormDescription>
										Enter amenities separated by commas
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="col-span-2 space-y-4">
							<div className="flex gap-4">
								<FormField
									control={form.control}
									name="isAvailable"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Available</FormLabel>
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="isFeatured"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Featured</FormLabel>
											</div>
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="col-span-2">
							<FormLabel>Property Images</FormLabel>
							<MultiImageUploader
								onImagesChange={setUploadedFileIds}
								maxImages={10}
								maxSizeMB={5}
								existingImages={property.images || []}
							/>
						</div>
					</div>

					<div className="flex justify-end gap-4">
						<Button type="button" variant="outline" onClick={() => router.back()}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Updating...' : 'Update Property'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
} 