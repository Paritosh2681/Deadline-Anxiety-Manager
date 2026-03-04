import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: {
    default: 'Deadline Anxiety Manager – Turn Anxiety Into Productivity',
    template: '%s | Deadline Anxiety Manager',
  },
  description:
    'Stop procrastinating. DAM is a psychological deadline management system that turns your anxiety into a pressure score and breaks tasks into micro-steps you can actually finish.',
  keywords: [
    'deadline manager',
    'task manager',
    'productivity app',
    'anxiety management',
    'procrastination',
    'micro tasks',
    'deadline tracker',
    'pressure score',
    'todo app',
    'time management',
  ],
  authors: [{ name: 'Deadline Anxiety Manager' }],
  creator: 'Deadline Anxiety Manager',
  manifest: '/manifest.json',
  metadataBase: new URL('https://deadline-anxiety-manager.onrender.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deadline-anxiety-manager.onrender.com',
    siteName: 'Deadline Anxiety Manager',
    title: 'Deadline Anxiety Manager – Turn Anxiety Into Productivity',
    description:
      'Stop procrastinating. DAM turns your anxiety into a pressure score and breaks tasks into micro-steps you can actually finish.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Deadline Anxiety Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deadline Anxiety Manager – Turn Anxiety Into Productivity',
    description:
      'Stop procrastinating. DAM turns your anxiety into a pressure score and breaks tasks into micro-steps you can actually finish.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DAM',
  },
  verification: {
    google: 'Q26xpWRUTcvjvRrS56jXWVQQ50Tq4hnNQ2e61hUvL8M',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="light"
          toastClassName="!rounded-lg !shadow-card !border !border-gray-200 !text-sm"
        />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
