import { Heart, Gem, Home, Scroll, LucideIcon } from 'lucide-react';

export type InvitationType = 'keran_invite' | 'hall_invite' | 'home_invite' | 'traditional_invite';

export interface InvitationConfig {
	id: InvitationType;
	title: string;
	description: string;
	icon: LucideIcon;
	// Gradient colors for buttons and accents
	color: string;
	// Background gradients for cards
	bgColor: string;
	// Icon background styles
	iconBg: string;
	// Icon text color
	iconColor: string;
	// Card background for stats
	cardBg: string;
	// Accent background for decorative elements
	accentBg: string;
	// Availability status
	available: boolean;
}

export const invitationConfigs: Record<InvitationType, InvitationConfig> = {
	keran_invite: {
		id: 'keran_invite',
		title: 'دعوة القران',
		description: 'دعوة عقد قران مخصصة وأنيقة',
		icon: Heart,
		color: 'from-rose-500 to-pink-600',
		bgColor: 'from-rose-50 to-pink-50',
		iconBg: 'bg-rose-500/20',
		iconColor: 'text-rose-600',
		cardBg: 'warm-card dark:warm-card-dark',
		accentBg: 'from-rose-100/50 to-pink-50/30 dark:from-rose-900/30 dark:to-pink-900/20',
		available: true,
	},
	hall_invite: {
		id: 'hall_invite',
		title: 'دعوة الحفل',
		description: 'دعوة حفل زفاف فاخرة',
		icon: Gem,
		color: 'from-purple-500 to-indigo-600',
		bgColor: 'from-purple-50 to-indigo-50',
		iconBg: 'bg-purple-500/20',
		iconColor: 'text-purple-600',
		cardBg: 'warm-card dark:warm-card-dark',
		accentBg: 'from-amber-200/60 to-amber-100/40 dark:from-amber-800/40 dark:to-amber-900/30',
		available: true,
	},
	home_invite: {
		id: 'home_invite',
		title: 'دعوة المنزل',
		description: 'دعوة احتفال منزلي دافئة',
		icon: Home,
		color: 'from-emerald-500 to-green-600',
		bgColor: 'from-emerald-50 to-green-50',
		iconBg: 'bg-emerald-500/20',
		iconColor: 'text-emerald-600',
		cardBg: 'warm-card dark:warm-card-dark',
		accentBg: 'from-emerald-100/50 to-green-50/30 dark:from-emerald-900/30 dark:to-green-900/20',
		available: true,
	},
	traditional_invite: {
		id: 'traditional_invite',
		title: 'دعوة التقليدية',
		description: 'دعوة بتصميم تقليدي أصيل',
		icon: Scroll,
		color: 'from-amber-500 to-orange-600',
		bgColor: 'from-amber-50 to-orange-50',
		iconBg: 'bg-amber-500/20',
		iconColor: 'text-amber-600',
		cardBg: 'warm-card dark:warm-card-dark',
		accentBg: 'from-amber-100/50 to-yellow-50/30 dark:from-amber-900/30 dark:to-yellow-900/20',
		available: true,
	},
};

// Helper function to get config by type
export const getInvitationConfig = (type: InvitationType): InvitationConfig => {
	return invitationConfigs[type];
};

// Helper function to get all available invitation types
export const getAvailableInvitationTypes = (): InvitationConfig[] => {
	return Object.values(invitationConfigs).filter(config => config.available);
}; 