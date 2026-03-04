import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deadline Anxiety Manager – Turn Anxiety Into Productivity',
  description:
    'Stop procrastinating. DAM is a psychological deadline management app that turns your anxiety into a pressure score and breaks tasks into bite-sized micro-steps you can actually finish.',
  alternates: {
    canonical: 'https://deadline-anxiety-manager.onrender.com',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
