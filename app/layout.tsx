import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyFitnessPlan — Your Personalized Training Program',
  description:
    'Answer 7 questions. Pay once. Get a fully personalized training program built by AI — instant PDF download.',
  keywords: ['fitness program', 'training plan', 'personalized workout', 'AI fitness'],
  openGraph: {
    title: 'MyFitnessPlan — Your Personalized Training Program',
    description: 'Custom AI-generated training programs. From $19.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  )
}
