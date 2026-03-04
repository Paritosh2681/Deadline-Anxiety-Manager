'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Timer, BarChart2, Puzzle, Telescope, TrendingUp, ArrowRight } from 'lucide-react'

function PressureMeter({ score }: { score: number }) {
  return (
    <div className="pressure-meter">
      <svg viewBox="0 0 200 120" className="w-full max-w-[280px]">
        {/* Background arc */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e4e4e7" strokeWidth="10" strokeLinecap="round" />
        {/* Calm zone */}
        <path d="M 20 100 A 80 80 0 0 1 66 35" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        {/* Warning zone */}
        <path d="M 66 35 A 80 80 0 0 1 134 35" fill="none" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        {/* Panic zone */}
        <path d="M 134 35 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        {/* Needle */}
        <line
          x1="100" y1="100"
          x2={100 + 62 * Math.cos(Math.PI - (score / 100) * Math.PI)}
          y2={100 - 62 * Math.sin(Math.PI - (score / 100) * Math.PI)}
          stroke="#18181b"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="needle-line"
        />
        <circle cx="100" cy="100" r="5" fill="#18181b" />
        {/* Score */}
        <text x="100" y="87" textAnchor="middle" fontSize="13" fontWeight="600" fill="#71717a" fontFamily="Inter, sans-serif">
          {score}
        </text>
      </svg>
    </div>
  )
}

export default function LandingPage() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [meterScore, setMeterScore] = useState(25)

  useEffect(() => {
    const interval = setInterval(() => {
      setMeterScore(prev => prev >= 85 ? 25 : prev + 1)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: BarChart2,
      name: 'Live pressure scores',
      desc: 'Real-time anxiety quantification. Updates as deadlines approach and you continue doing nothing.',
    },
    {
      icon: Puzzle,
      name: 'Auto micro-tasks',
      desc: 'Every task splits into small steps. Big tasks feel impossible. Small steps feel like cheating.',
    },
    {
      icon: Telescope,
      name: 'Deadline simulator',
      desc: "See what your pressure score looks like if you skip today. Spoiler: it's worse.",
    },
    {
      icon: TrendingUp,
      name: 'Behavior insights',
      desc: "Track your patterns. Discover you always start things at 11 PM. Pretend to be surprised.",
    },
  ]

  return (
    <div className="landing-page">
      {/* JSON-LD Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Deadline Anxiety Manager',
            alternateName: 'DAM',
            description:
              'A psychological deadline management app that turns anxiety into a pressure score and breaks tasks into micro-steps.',
            url: 'https://your-domain.com',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Live pressure scores',
              'Auto micro-tasks',
              'Deadline simulator',
              'Behavior insights',
            ],
          }),
        }}
      />

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="nav-brand">
            <div className="nav-logo">
              <Timer size={15} strokeWidth={2.5} />
            </div>
            <span className="nav-title">DAM</span>
          </div>
          <Link href="/dashboard" className="nav-cta">
            Open App →
          </Link>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="hero-eyebrow">for the eternally anxious</p>
            <h1 className="hero-headline">
              Your deadlines are
              <br />
              <span className="hero-highlight">judging you.</span>
            </h1>
            <p className="hero-sub">
              Stop pretending that &ldquo;you&apos;ll get to it later.&rdquo;
              DAM turns your avoidance into a pressure score — and breaks every
              task into bite-sized pieces you might actually finish.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="hero-btn-primary">
                Face your deadlines
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <a href="#how" className="hero-btn-ghost">
                How it works ↓
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="meter-card">
              <p className="meter-label">Your current anxiety</p>
              <PressureMeter score={meterScore} />
              <div className="meter-zone-strip">
                <span className="zone-tag zone-calm">calm</span>
                <span className="zone-tag zone-warning">hmm</span>
                <span className="zone-tag zone-panic">oh no</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-grid" aria-hidden="true" />
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how" className="how-section">
        <div className="how-inner">
          <p className="section-eyebrow">The system</p>
          <h2 className="section-title">Three steps to less panic</h2>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Dump your deadlines', desc: "Add what's haunting you. Set a deadline, pick difficulty. That's it. No color-coding, no priority matrices, no 'urgent-important' quadrants." },
              { n: '02', title: 'Watch pressure build', desc: "Each task gets a live pressure score based on time left, effort, and how much you've actually done. It goes up. Constantly. Like real anxiety." },
              { n: '03', title: 'Do the tiny thing', desc: "Every task is split into micro-tasks. You don't need motivation — just check off one small box. Watch the pressure drop. Feel the relief." },
            ].map((step) => (
              <div key={step.n} className="step-card">
                <span className="step-number">{step.n}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PHILOSOPHY ═══════════ */}
      <section className="philosophy-section">
        <div className="philosophy-inner">
          <div className="philosophy-text">
            <p className="section-eyebrow">The idea</p>
            <h2 className="section-title">
              Productivity apps failed you.<br />
              This one{' '}
              <span className="philosophy-italic">guilts</span> you.
            </h2>
            <p className="philosophy-desc">
              Most todo apps assume you&apos;re organized. You&apos;re not.
              You&apos;re here because you&apos;ve got 14 tabs open, an essay
              due tomorrow, and a vague sense of dread.
            </p>
            <p className="philosophy-desc">
              DAM doesn&apos;t motivate. It mirrors. It shows you a number
              that represents how screwed you are — and gives you the smallest
              possible action to make it better. That&apos;s the whole trick.
            </p>
          </div>
          <div className="philosophy-visual">
            <div className="quote-card">
              <p className="quote-text">
                &ldquo;I don&apos;t need another app that tells me to plan my
                week. I need one that tells me I have 6 hours left and I&apos;ve
                done nothing.&rdquo;
              </p>
              <p className="quote-attr">— literally everyone</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRESSURE ZONES ═══════════ */}
      <section className="zones-section">
        <div className="zones-inner">
          <p className="section-eyebrow">Pressure zones</p>
          <h2 className="section-title">Color-coded denial levels</h2>
          <div className="zones-grid">
            {[
              { key: 'calm', color: '#22c55e', name: 'Calm', range: '0–30', meaning: "You're fine. For now. Enjoy this false sense of security." },
              { key: 'warning', color: '#f59e0b', name: 'Warning', range: '31–60', meaning: "Things are getting real. Maybe open that document?" },
              { key: 'panic', color: '#ef4444', name: 'Panic', range: '61–100', meaning: "It's 3 AM. The deadline is tomorrow. You know what to do." },
            ].map(({ key, color, name, range, meaning }) => (
              <div
                key={key}
                className={`zone-card zone-card-${key}`}
                onMouseEnter={() => setHoveredZone(key)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                <div className="zone-dot" style={{ background: color }} />
                <h3 className="zone-name">{name}</h3>
                <p className="zone-range">{range}</p>
                <p className="zone-meaning">{meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="features-section">
        <div className="features-inner">
          <p className="section-eyebrow">What you get</p>
          <h2 className="section-title">Tools for the disorganized</h2>
          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.name} className="feature-item">
                  <div className="feature-icon-wrap">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h3 className="feature-name">{feature.name}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER CTA ═══════════ */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-headline">
            Still scrolling instead of working?
          </h2>
          <p className="cta-sub">
            That&apos;s kind of the problem, isn&apos;t it.
          </p>
          <Link href="/dashboard" className="cta-button">
            Open the app already
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <p>Built with anxiety and Next.js · DAM © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
