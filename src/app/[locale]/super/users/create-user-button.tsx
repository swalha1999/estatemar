'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { CreateUserDialog } from './create-user-dialog';

export function CreateUserButton() {
	const [open, setOpen] = useState(false);
	const t = useTranslations('super.users.create_user_button');

	return (
		<>
			<Button onClick={() => setOpen(true)}>
				{t('create_user')}
			</Button>
			<CreateUserDialog open={open} onOpenChange={setOpen} />
		</>
	);
} 