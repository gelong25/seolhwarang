/** @type {import('tailwindcss').Config} */
export const content = [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ];
export const theme = {
    extend: {
        maxWidth: {
            'mobile': '428px',
        },
        colors: {
            'jeju-green': '#8FBC8F',
            'jeju-blue': '#4A90E2',
            'jeju-orange': '#FF8C42',
        },
    },
};
export const plugins = [];