'use client';
import { createContext, ReactNode, useContext } from 'react';
import { User } from '@/../types/user';
import { useUserData } from '@/utils/user';

interface AuthContextType {
	user: User | null;
	logout: () => any;
	loading: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data: user, setData, loading } = useUserData();
	const logout = () => setData(null);
	return <AuthContext.Provider value={{ user, logout, loading }}>{children}</AuthContext.Provider>;
}
