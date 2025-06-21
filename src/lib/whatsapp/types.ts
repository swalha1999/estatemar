export interface NotificationPayload {
	object: 'whatsapp_business_account';
	entry: Entry[];
}

export interface Entry {
	id: string;
	changes: Change[];
}

export type Change = MessagesChange | MessageTemplateStatusUpdateChange;

export interface MessagesChange {
	field: 'messages';
	value: MessagesValue;
}

export interface MessageTemplateStatusUpdateChange {
	field: 'message_template_status_update';
	value: MessageTemplateStatusUpdateValue;
}

export interface MessageTemplateStatusUpdateValue {
	reason: string;
	message_template_name: string;
	event: string;
	message_template_language: string;
	message_template_id: number;
}

export interface MessagesValue {
	metadata: Metadata;
	messaging_product: MessagingProduct;
	statuses?: StatusElement[];
	messages?: Message[];
	contacts?: Contact[];
	errors?: Error[];
}

export interface Contact {
	profile: Profile;
	wa_id: string;
	user_id?: string;
}

export interface Profile {
	name: string;
}

export interface Message {
	from: string;
	id: string;
	timestamp: string;
	type: MessageType;
	text?: Text;
	image?: Image;
	audio?: Audio;
	video?: Video;
	document?: Document;
	sticker?: Sticker;
	location?: Location;
	contacts?: Contact[];
	interactive?: Interactive;
	button?: Button;
	context?: MessageContext;
	order?: Order;
	referral?: Referral;
	system?: System;
	errors?: Error[];
	identity?: Identity;
}

export interface MessageContext {
	forwarded?: boolean;
	frequently_forwarded?: boolean;
	from: string;
	id: string;
	referred_product?: ReferredProduct;
}

export interface ReferredProduct {
	catalog_id: string;
	product_retailer_id: string;
}

export interface Button {
	payload: string;
	text: string;
}

export interface Interactive {
	type: {
		button_reply?: {
			id: string;
			title: string;
		};
		list_reply?: {
			id: string;
			title: string;
			description: string;
		};
	};
}

export interface Order {
	catalog_id: string;
	text: string;
	product_items: ProductItem[];
}

export interface ProductItem {
	product_retailer_id: string;
	quantity: string;
	item_price: string;
	currency: string;
}

export interface Referral {
	source_url: string;
	source_type: string;
	source_id: string;
	headline: string;
	body: string;
	media_type: string;
	image_url?: string;
	video_url?: string;
	thumbnail_url?: string;
	ctwa_clid: string;
}

export interface System {
	body: string;
	identity: string;
	new_wa_id?: string;
	wa_id?: string;
	type: 'customer_changed_number' | 'customer_identity_changed';
	customer: string;
}

export interface Identity {
	acknowledged: string;
	created_timestamp: string;
	hash: string;
}

export interface Audio {
	id: string;
	mime_type: string;
}

export interface Image {
	caption?: string;
	sha256: string;
	id: string;
	mime_type: string;
}

export interface Video {
	caption?: string;
	sha256: string;
	id: string;
	mime_type: string;
}

export interface Document {
	caption?: string;
	filename: string;
	sha256: string;
	mime_type: string;
	id: string;
}

export interface Sticker {
	sha256: string;
	mime_type: string;
	animated: boolean;
	id: string;
}

export interface Location {
	latitude: number;
	longitude: number;
	name?: string;
	address?: string;
}

export interface Text {
	body: string;
}

export type MessageType =
	| 'audio'
	| 'button'
	| 'document'
	| 'text'
	| 'image'
	| 'interactive'
	| 'order'
	| 'sticker'
	| 'system'
	| 'unknown'
	| 'video'
	| 'location'
	| 'contacts';

export type MessagingProduct = 'whatsapp';

export interface Metadata {
	phone_number_id: string;
	display_phone_number: string;
}

export interface StatusElement {
	biz_opaque_callback_data?: string;
	id: string;
	conversation?: Conversation;
	pricing?: Pricing;
	status: StatusEnum;
	timestamp: string;
	recipient_id: string;
	errors?: Error[];
}

export interface Conversation {
	origin: Origin;
	id: string;
	expiration_timestamp?: string;
}

export interface Origin {
	type: Category;
}

export type Category =
	| 'authentication'
	| 'authentication_international'
	| 'marketing'
	| 'utility'
	| 'service'
	| 'referral_conversion';

export interface Error {
	code: number;
	title: string;
	message?: string;
	error_data?: ErrorData;
}

export interface ErrorData {
	details: string;
}

export interface Pricing {
	pricing_model: PricingModel;
	category: Category;
	billable: boolean;
}

export type PricingModel = 'CBP';

export type StatusEnum = 'delivered' | 'failed' | 'read' | 'sent';
