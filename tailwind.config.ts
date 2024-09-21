import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			screens: {
				'3xl': '2560px',
			},
			keyframes: {
				shakeX: {
					'0%, 100%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(3px)' },
				},
				fadeHide: {
					'100%': { opacity: '0' },
				},
				fadeShow: {
					'100%': { opacity: '1' },
				},
				dropError: {
					'50%': { opacity: '1' },
					'100%': { transform: 'translateX(100%)', opacity: '0' },
				},
				shrink: {
					'0%': { width: '100%' },
					'100': { width: '0%' },
				},
			},
			scale: {
				'102': '1.02',
			},
			animation: {
				shakeX: 'shakeX .25s ease-in',
				dropError: 'dropError .35s ease forwards',
				hide: 'fadeHide .2s ease forwards',
				fasthide: 'fadeHide 0s ease forwards',
				show: 'fadeShow .2s ease forwards',
				progressLong: 'shrink 30s ease forwards',
				progressShort: 'shrink 7s ease forwards',
			},
			backgroundImage: {
				'default-gradient': 'linear-gradient(140deg, #202c42 0%, #222e46 35%, #203649 100%)',
			},
			colors: {
				white: {
					default: '#ffffff',
					gray: '#f0f0f0',
				},
				black: {
					default: '#050505',
					light: '#111',
				},
				blue: {
					light: '#7e7ef0',
				},
			},
			borderColor: {
				black: {
					default: '#131319',
					pure: '#000000',
					light: '#212126',
				},
				gray: '#3e3e43',
				blue: {
					sky: '#9c9cf7',
					light: '#7e7ef0',
					dark: '#1e1e2a',
					grayish: '#1f1f27',
				},
			},
			backgroundColor: {
				white: {
					default: '#ffffff',
					gray: '#f6f6f6',
					dark: '#e5e5e5',
					hover: '#ececef',
					active: '#e2e2f1',
				},
				black: {
					default: '#131319',
					pure: '#000000',
					light: '#212126',
					hover: '#2a2a32',
					active: '#383847',
				},
				red: {
					ansi: '#ff5555',
					'ansi-light': '#ff6969',
				},
				green: {
					success: '#5cb85c',
				},
				blue: {
					sky: '#9c9cf7',
					light: '#7e7ef0',
					dark: '#1e1e2a',
					grayish: '#1f1f27',
					active: '#adadf4',
				},
			},
			ringColor: {
				blue: '#aeaefb',
			},
		},
	},
	darkMode: 'class',
	plugins: [nextui()],
};
export default config;
