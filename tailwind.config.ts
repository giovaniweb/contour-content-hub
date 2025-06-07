import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'Poppins', 'Montserrat', 'sans-serif'],
				heading: ['Poppins', 'Montserrat', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Aurora Borealis Color Palette
				aurora: {
					lavender: '#C4B5FD',
					teal: '#14B8A6',
					turquoise: '#06B6D4',
					'deep-violet': '#7C3AED',
					'soft-pink': '#F472B6',
					'electric-blue': '#3B82F6',
					sage: '#A7F3D0',
					midnight: '#1E1B4B',
				},
				// Fluida brand colors - updated with Aurora palette
				fluida: {
					blue: '#3B82F6',    // Aurora electric blue
					pink: '#F472B6',    // Aurora soft pink
					blueDark: '#1E40AF',
					pinkDark: '#BE185D',
					lightGray: '#F8FAFC',
					gradient: 'linear-gradient(to right, #3B82F6, #F472B6)'
				},
				// Contourline colors - keeping for compatibility
				contourline: {
					darkBlue: '#3A567A',
					mediumBlue: '#3B82F6', // Updated to Aurora electric blue
					lightBlue: '#93C5FD',
					lightGray: '#F8FAFC',
					black: '#121212',
					white: '#FFFFFF',
					accent: '#F472B6', // Aurora soft pink
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-light': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(196, 181, 253, 0.2), 0 0 10px rgba(196, 181, 253, 0.1)' 
					},
					'50%': { 
						boxShadow: '0 0 15px rgba(196, 181, 253, 0.3), 0 0 20px rgba(196, 181, 253, 0.2)' 
					}
				},
				'bounce-light': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				// Aurora-specific animations
				'aurora-flow': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'aurora-pulse': {
					'0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' }
				},
				'aurora-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'aurora-shimmer': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				},
				'aurora-particles': {
					'0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-light': 'pulse-light 2s infinite ease-in-out',
				'bounce-light': 'bounce-light 2s infinite ease-in-out',
				// Aurora animations
				'aurora-flow': 'aurora-flow 8s ease-in-out infinite',
				'aurora-pulse': 'aurora-pulse 2s infinite',
				'aurora-float': 'aurora-float 6s ease-in-out infinite',
				'aurora-shimmer': 'aurora-shimmer 3s infinite',
				'aurora-particles': 'aurora-particles linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'fluida-gradient': 'linear-gradient(to right, #3B82F6, #F472B6)',
				'lavender-gradient': 'linear-gradient(to bottom, #F8FAFC, #E8F0FF)',
				// Aurora gradients
				'aurora-gradient': 'linear-gradient(135deg, #C4B5FD, #14B8A6, #06B6D4, #7C3AED, #F472B6)',
				'aurora-gradient-primary': 'linear-gradient(135deg, #C4B5FD, #14B8A6)',
				'aurora-gradient-secondary': 'linear-gradient(135deg, #7C3AED, #F472B6)',
				'aurora-gradient-tertiary': 'linear-gradient(135deg, #06B6D4, #3B82F6)',
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'aurora-glow': '0 0 20px rgba(196, 181, 253, 0.3)',
				'aurora-glow-intense': '0 0 40px rgba(124, 58, 237, 0.5)',
				'aurora-glass': '0 8px 32px rgba(31, 41, 55, 0.12)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
