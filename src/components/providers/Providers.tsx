'use client';

import { AlertProvider } from './Alert';
import { NextUIProvider } from '@nextui-org/react';
import { PopupProvider } from './Popup';
import { AuthProvider } from './Auth';
import { ThemeProvider } from './Theme';

export default function Providers({ children }: { children: Readonly<React.ReactNode> }) {
	return (
		<NextUIProvider>
			<ThemeProvider>
				<AuthProvider>
					<PopupProvider>
						<AlertProvider>{children}</AlertProvider>
					</PopupProvider>
				</AuthProvider>
			</ThemeProvider>
		</NextUIProvider>
	);
}
