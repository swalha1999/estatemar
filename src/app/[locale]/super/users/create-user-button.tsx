'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { CreateUserDialog } from './create-user-dialog';

export function CreateUserButton() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const t = useTranslations('super.users.page');

	return (
		<>
			<Button onClick={() => setDialogOpen(true)}>
				{t('create_user')}
			</Button>
			<CreateUserDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>
		</>
	);
} 