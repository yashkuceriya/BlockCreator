import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Editorial Engine | AI-Powered WordPress Block Theme Generator',
  description:
    'Generate production-ready WordPress block themes from natural language. Complete with theme.json, FSE templates, patterns, live preview in WordPress Playground, and ZIP download. Powered by Claude AI. Zero custom HTML blocks.',
  openGraph: {
    title: 'The Editorial Engine — AI WordPress Theme Generator',
    description:
      'Describe your vision, get a production-ready WordPress block theme. Live preview, ZIP download, theme iteration.',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
