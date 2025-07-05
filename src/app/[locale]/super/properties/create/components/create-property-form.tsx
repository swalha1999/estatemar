'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { MultiImageUploader } from '../../components/multi-image-uploader';
import { createProperty, addPropertyImage } from '../../actions';

const formSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.string().min(1, 'Price is required'),
	location: z.string().min(1, 'Location is required'),
	address: z.string().min(1, 'Address is required'),
	bedrooms: z.number().min(0),
	bathrooms: z.number().min(0),
	area: z.string().min(1, 'Area is required'),
	propertyType: z.enum(['villa', 'apartment', 'house', 'commercial', 'land', 'other']),
	listingType: z.enum(['sale', 'rent', 'both']),
	isAvailable: z.boolean(),
	isFeatured: z.boolean(),
	amenities: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	yearBuilt: z.number().optional(),
	parkingSpaces: z.number().min(0),
	agentName: z.string().optional(),
	agentPhone: z.string().optional(),
	agentEmail: z.string().email().optional().or(z.literal('')),
	virtualTourUrl: z.string().url().optional().or(z.literal('')),
	monthlyRent: z.string().optional(),
	annualAppreciationRate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreatePropertyForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			price: '',
			location: '',
			address: '',
			bedrooms: 0,
			bathrooms: 0,
			area: '',
			propertyType: 'villa',
			listingType: 'sale',
			isAvailable: true,
			isFeatured: false,
			amenities: '',
			latitude: undefined,
			longitude: undefined,
			yearBuilt: undefined,
			parkingSpaces: 0,
			agentName: '',
			agentPhone: '',
			agentEmail: '',
			virtualTourUrl: '',
			monthlyRent: '',
			annualAppreciationRate: '',
		},
	});

	const onSubmit = async (data: FormData) => {
		try {
			setIsSubmitting(true);
			
			const amenitiesArray = data.amenities 
				? data.amenities.split(',').map(a => a.trim()).filter(Boolean)
				: [];

			// Create property with images
			const result = await createProperty({
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
			}, uploadedFileIds);

			if (result.success) {
				toast({
					title: 'Success',
					description: 'Property created successfully',
				});
				router.push('/super/properties');
			} else {
				toast({
					title: 'Error',
					description: result.error || 'Failed to create property',
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
							/>
						</div>
					</div>

					<div className="flex justify-end gap-4">
						<Button type="button" variant="outline" onClick={() => router.back()}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Creating...' : 'Create Property'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
} 