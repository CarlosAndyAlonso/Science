@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 210 11% 98%; /* #F8FAFC */
  --foreground: 215 25% 27%; /* #334155 */
  --muted: 210 40% 96%; /* #F1F5F9 */
  --muted-foreground: 215 16% 47%; /* #64748B */
  --popover: 0 0% 100%; /* #FFFFFF */
  --popover-foreground: 215 25% 27%; /* #334155 */
  --card: 0 0% 100%; /* #FFFFFF */
  --card-foreground: 215 25% 27%; /* #334155 */
  --border: 220 13% 91%; /* #E2E8F0 */
  --input: 220 13% 91%; /* #E2E8F0 */
  --primary: 239 84% 67%; /* #6366F1 */
  --primary-foreground: 210 40% 98%; /* #F8FAFC */
  --secondary: 262 83% 58%; /* #8B5CF6 */
  --secondary-foreground: 210 40% 98%; /* #F8FAFC */
  --accent: 220 13% 91%; /* #E2E8F0 */
  --accent-foreground: 215 25% 27%; /* #334155 */
  --destructive: 0 84% 60%; /* #EF4444 */
  --destructive-foreground: 0 0% 98%; /* #FAFAFA */
  --ring: 239 84% 67%; /* #6366F1 */
  --radius: 0.5rem;
  
  /* Custom colors for the app */
  --primary-dark: 239 84% 58%; /* #4F46E5 */
  --accent-cyan: 188 94% 43%; /* #06B6D4 */
  --accent-emerald: 158 64% 52%; /* #10B981 */
  --neutral-50: 210 40% 98%; /* #F8FAFC */
  --neutral-100: 210 40% 96%; /* #F1F5F9 */
  --neutral-200: 220 13% 91%; /* #E2E8F0 */
  --neutral-600: 215 16% 47%; /* #64748B */
  --neutral-700: 215 25% 27%; /* #334155 */
  --neutral-800: 217 33% 17%; /* #1E293B */
}

.dark {
  --background: 222 84% 5%; /* #0F172A */
  --foreground: 210 40% 98%; /* #F8FAFC */
  --muted: 217 33% 17%; /* #1E293B */
  --muted-foreground: 215 20% 65%; /* #94A3B8 */
  --popover: 222 84% 5%; /* #0F172A */
  --popover-foreground: 210 40% 98%; /* #F8FAFC */
  --card: 222 84% 5%; /* #0F172A */
  --card-foreground: 210 40% 98%; /* #F8FAFC */
  --border: 217 33% 17%; /* #1E293B */
  --input: 217 33% 17%; /* #1E293B */
  --primary: 239 84% 67%; /* #6366F1 */
  --primary-foreground: 210 40% 98%; /* #F8FAFC */
  --secondary: 262 83% 58%; /* #8B5CF6 */
  --secondary-foreground: 210 40% 98%; /* #F8FAFC */
  --accent: 217 33% 17%; /* #1E293B */
  --accent-foreground: 210 40% 98%; /* #F8FAFC */
  --destructive: 0 84% 60%; /* #EF4444 */
  --destructive-foreground: 210 40% 98%; /* #F8FAFC */
  --ring: 239 84% 67%; /* #6366F1 */
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer utilities {
  .gradient-primary {
    @apply bg-gradient-to-r from-primary to-secondary;
  }
  
  .gradient-text {
    @apply bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent;
  }
  
  .shadow-glow {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary));
}
