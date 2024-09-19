'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
	isDarkTheme: boolean;
	setDarkTheme: Dispatch<SetStateAction<boolean>>;
};
const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error('useTheme must be used within ThemeProvider');
	return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const localStorageKey = 'darkTheme';
	const [isDarkTheme, setDarkTheme] = useState<boolean>(true);
	const [mounted, setMounted] = useState<boolean>(false);
	useEffect(() => {
		const localValue = localStorage.getItem(localStorageKey);
		if (localValue === null) setDarkTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
		else setDarkTheme(localValue !== 'false');
		setMounted(true);
	}, [mounted]);
	useEffect(() => {
		if (!mounted) return;
		localStorage.setItem(localStorageKey, String(isDarkTheme));
		document.documentElement.classList.toggle('dark', isDarkTheme);
	}, [isDarkTheme, mounted]);
	return <ThemeContext.Provider value={{ isDarkTheme, setDarkTheme }}>{children}</ThemeContext.Provider>;
}
