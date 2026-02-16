import type { Metadata } from 'next'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import AppShell from '@/components/layout/AppShell'
import { ToastContainer } from 'react-toastify'

export const metadata: Metadata = {
  title: 'Deadline Anxiety Manager',
  description: 'A psychological deadline management system that reduces anxiety through intelligent task distribution.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppShell>
          {children}
        </AppShell>
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
      </body>
    </html>
  )
}
