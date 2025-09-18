
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
				// Enhanced Aurora Navy Blue Color Palette
				aurora: {
					'deep-navy': 'hsl(220, 100%, 4%)',
					'card-bg': 'hsl(220, 70%, 8%)',
					'neon-blue': 'hsl(220, 90%, 55%)',
					'electric-purple': 'hsl(263, 70%, 50%)',
					'cyan': 'hsl(195, 100%, 50%)',
					'bright-cyan': 'hsl(195, 100%, 60%)',
					'emerald': 'hsl(160, 84%, 39%)',
					'lime': 'hsl(84, 81%, 44%)',
					'text-primary': 'hsl(0, 0%, 98%)',
					'text-muted': 'hsl(0, 0%, 70%)',
					// Legacy compatibility colors - converted to HSL
					'space-black': 'hsl(220, 100%, 4%)',
					'void-black': 'hsl(220, 70%, 8%)',
					'dark-violet': 'hsl(220, 60%, 12%)',
					'midnight': 'hsl(220, 90%, 55%)',
					'lavender': 'hsl(263, 70%, 65%)',
					'teal': 'hsl(174, 85%, 40%)',
					'turquoise': 'hsl(195, 95%, 45%)',
					'deep-violet': 'hsl(263, 70%, 50%)',
					'soft-pink': 'hsl(328, 85%, 70%)',
					'electric-blue': 'hsl(221, 83%, 53%)',
					'sage': 'hsl(160, 84%, 39%)',
				},
				// Enhanced Fluida brand colors
				fluida: {
					blue: '#3b82f6',
					pink: '#f472b6',
					blueDark: '#6b46c1',
					pinkDark: '#be185d',
					lightGray: '#1a0b2e',
					gradient: 'linear-gradient(to right, #6b46c1, #3b82f6)'
				},
				// Enhanced Contourline colors
				contourline: {
					darkBlue: '#1a0b2e',
					mediumBlue: '#6b46c1',
					lightBlue: '#8b5cf6',
					lightGray: '#2d1b3d',
					black: '#000511',
					white: '#ffffff',
					accent: '#f472b6',
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
						boxShadow: '0 0 5px rgba(107, 70, 193, 0.3), 0 0 10px rgba(107, 70, 193, 0.2)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(107, 70, 193, 0.5), 0 0 30px rgba(107, 70, 193, 0.3)' 
					}
				},
				'bounce-light': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				// Enhanced Aurora animations
				'aurora-flow': {
					'0%, 100%': { backgroundPosition: '0% 50%', transform: 'rotate(0deg)' },
					'25%': { backgroundPosition: '100% 0%', transform: 'rotate(1deg)' },
					'50%': { backgroundPosition: '100% 100%', transform: 'rotate(0deg)' },
					'75%': { backgroundPosition: '0% 100%', transform: 'rotate(-1deg)' }
				},
				'aurora-pulse': {
					'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' }
				},
				'aurora-float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
					'33%': { transform: 'translateY(-20px) rotate(2deg) scale(1.02)' },
					'66%': { transform: 'translateY(-10px) rotate(-2deg) scale(0.98)' }
				},
				'aurora-shimmer': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				},
				'aurora-particles': {
					'0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
					'10%': { opacity: '0.8' },
					'90%': { opacity: '0.8' },
					'100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: '0' }
				},
				'aurora-wave': {
					'0%, 100%': { 
						transform: 'translateX(0) scale(1)',
						filter: 'hue-rotate(0deg) brightness(1)'
					},
					'33%': { 
						transform: 'translateX(15px) scale(1.03)',
						filter: 'hue-rotate(60deg) brightness(1.1)'
					},
					'66%': { 
						transform: 'translateX(-15px) scale(0.97)',
						filter: 'hue-rotate(120deg) brightness(0.9)'
					}
				},
				'aurora-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px #6b46c1, 0 0 40px #6b46c1, 0 0 60px #6b46c1',
						filter: 'brightness(1)'
					},
					'50%': { 
						boxShadow: '0 0 30px #3b82f6, 0 0 60px #3b82f6, 0 0 90px #3b82f6',
						filter: 'brightness(1.2)'
					}
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
				// Enhanced Aurora animations
				'aurora-flow': 'aurora-flow 20s ease-in-out infinite',
				'aurora-pulse': 'aurora-pulse 3s infinite',
				'aurora-float': 'aurora-float 12s ease-in-out infinite',
				'aurora-shimmer': 'aurora-shimmer 4s infinite',
				'aurora-particles': 'aurora-particles linear infinite',
				'aurora-wave': 'aurora-wave 18s ease-in-out infinite',
				'aurora-glow': 'aurora-glow 4s infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'fluida-gradient': 'linear-gradient(to right, #6b46c1, #3b82f6)',
				'lavender-gradient': 'linear-gradient(to bottom, #1a0b2e, #2d1b3d)',
				// Enhanced Aurora gradients
				'aurora-gradient': 'linear-gradient(135deg, #000511, #1a0b2e, #6b46c1, #3b82f6, #06b6d4, #10b981)',
				'aurora-gradient-primary': 'linear-gradient(135deg, #6b46c1, #3b82f6)',
				'aurora-gradient-secondary': 'linear-gradient(135deg, #1a0b2e, #6b46c1)',
				'aurora-gradient-tertiary': 'linear-gradient(135deg, #3b82f6, #06b6d4)',
				'aurora-gradient-dark': 'linear-gradient(135deg, #000511, #0a0015, #1a0b2e, #2d1b3d)',
				'aurora-gradient-emerald': 'linear-gradient(135deg, #10b981, #84cc16)',
				'aurora-gradient-enhanced': 'linear-gradient(45deg, #000511, #1a0b2e, #6b46c1, #3b82f6, #06b6d4, #10b981)',
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'aurora-glow': '0 0 40px rgba(107, 70, 193, 0.6)',
				'aurora-glow-intense': '0 0 60px rgba(107, 70, 193, 0.8)',
				'aurora-glow-blue': '0 0 35px rgba(59, 130, 246, 0.5)',
				'aurora-glow-emerald': '0 0 30px rgba(16, 185, 129, 0.4)',
				'aurora-glass': '0 8px 32px rgba(0, 5, 17, 0.4)',
				'aurora-floating': '0 25px 50px -12px rgba(0, 5, 17, 0.6), 0 20px 20px -10px rgba(0, 5, 17, 0.3)',
			},
			textShadow: {
				'aurora-glow': '0 0 10px rgba(107, 70, 193, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
