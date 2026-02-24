'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

function PressureMeter({ score }: { score: number }) {
    return (
        <div className="pressure-meter">
            <svg viewBox="0 0 200 120" className="w-full max-w-[280px]">
                {/* Background arc */}
                <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                {/* Calm zone */}
                <path
                    d="M 20 100 A 80 80 0 0 1 66 35"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.6"
                />
                {/* Warning zone */}
                <path
                    d="M 66 35 A 80 80 0 0 1 134 35"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.6"
                />
                {/* Panic zone */}
                <path
                    d="M 134 35 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.6"
                />
                {/* Needle */}
                <line
                    x1="100"
                    y1="100"
                    x2={100 + 60 * Math.cos(Math.PI - (score / 100) * Math.PI)}
                    y2={100 - 60 * Math.sin(Math.PI - (score / 100) * Math.PI)}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-gray-800 needle-line"
                />
                <circle cx="100" cy="100" r="5" fill="currentColor" className="text-gray-800" />
                {/* Score */}
                <text x="100" y="88" textAnchor="middle" className="text-[13px] font-semibold fill-gray-600">
                    {score}
                </text>
            </svg>
        </div>
    )
}

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const step = end / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [end, duration])

    return <>{count}</>
}

export default function LandingPage() {
    const [hoveredZone, setHoveredZone] = useState<string | null>(null)
    const [meterScore, setMeterScore] = useState(25)

    useEffect(() => {
        const interval = setInterval(() => {
            setMeterScore(prev => {
                if (prev >= 85) return 25
                return prev + 1
            })
        }, 80)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="landing-page">
            {/* ═══════════ NAVBAR ═══════════ */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <div className="nav-brand">
                        <span className="nav-logo">⏰</span>
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
                {/* subtle grid bg */}
                <div className="hero-grid" aria-hidden="true" />
            </section>

            {/* ═══════════ HOW IT WORKS ═══════════ */}
            <section id="how" className="how-section">
                <div className="how-inner">
                    <p className="section-eyebrow">The system</p>
                    <h2 className="section-title">Three steps to less panic</h2>

                    <div className="steps-grid">
                        <div className="step-card">
                            <span className="step-number">01</span>
                            <h3 className="step-title">Dump your deadlines</h3>
                            <p className="step-desc">
                                Add what&apos;s haunting you. Set a deadline, pick difficulty.
                                That&apos;s it. No color-coding, no priority matrices,
                                no &ldquo;urgent-important&rdquo; quadrants.
                            </p>
                        </div>
                        <div className="step-card">
                            <span className="step-number">02</span>
                            <h3 className="step-title">Watch pressure build</h3>
                            <p className="step-desc">
                                Each task gets a live pressure score based on time left, effort,
                                and how much you&apos;ve actually done. It goes up. Constantly.
                                Like real anxiety.
                            </p>
                        </div>
                        <div className="step-card">
                            <span className="step-number">03</span>
                            <h3 className="step-title">Do the tiny thing</h3>
                            <p className="step-desc">
                                Every task is split into micro-tasks. You don&apos;t need
                                motivation — just check off one small box. Watch the pressure
                                drop. Feel the relief.
                            </p>
                        </div>
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
                        <div
                            className={`zone-card zone-card-calm ${hoveredZone === 'calm' ? 'zone-active' : ''}`}
                            onMouseEnter={() => setHoveredZone('calm')}
                            onMouseLeave={() => setHoveredZone(null)}
                        >
                            <div className="zone-dot" style={{ background: '#22c55e' }} />
                            <h3 className="zone-name">Calm</h3>
                            <p className="zone-range">0–30</p>
                            <p className="zone-meaning">
                                You&apos;re fine. For now. Enjoy this false sense of security.
                            </p>
                        </div>
                        <div
                            className={`zone-card zone-card-warning ${hoveredZone === 'warning' ? 'zone-active' : ''}`}
                            onMouseEnter={() => setHoveredZone('warning')}
                            onMouseLeave={() => setHoveredZone(null)}
                        >
                            <div className="zone-dot" style={{ background: '#f59e0b' }} />
                            <h3 className="zone-name">Warning</h3>
                            <p className="zone-range">31–60</p>
                            <p className="zone-meaning">
                                Things are getting real. Maybe open that document?
                            </p>
                        </div>
                        <div
                            className={`zone-card zone-card-panic ${hoveredZone === 'panic' ? 'zone-active' : ''}`}
                            onMouseEnter={() => setHoveredZone('panic')}
                            onMouseLeave={() => setHoveredZone(null)}
                        >
                            <div className="zone-dot" style={{ background: '#ef4444' }} />
                            <h3 className="zone-name">Panic</h3>
                            <p className="zone-range">61–100</p>
                            <p className="zone-meaning">
                                It&apos;s 3 AM. The deadline is tomorrow. You know what to do.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ FEATURES ═══════════ */}
            <section className="features-section">
                <div className="features-inner">
                    <p className="section-eyebrow">What you get</p>
                    <h2 className="section-title">Tools for the disorganized</h2>

                    <div className="features-grid">
                        <div className="feature-item">
                            <span className="feature-icon">📊</span>
                            <h3 className="feature-name">Live pressure scores</h3>
                            <p className="feature-desc">
                                Real-time anxiety quantification. Updates as deadlines approach
                                and you continue doing nothing.
                            </p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🧩</span>
                            <h3 className="feature-name">Auto micro-tasks</h3>
                            <p className="feature-desc">
                                Every task splits into small steps. Big tasks feel impossible.
                                Small steps feel like cheating.
                            </p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔮</span>
                            <h3 className="feature-name">Deadline simulator</h3>
                            <p className="feature-desc">
                                See what your pressure score looks like if you skip today.
                                Spoiler: it&apos;s worse.
                            </p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📈</span>
                            <h3 className="feature-name">Behavior insights</h3>
                            <p className="feature-desc">
                                Track your patterns. Discover you always start things at 11 PM.
                                Pretend to be surprised.
                            </p>
                        </div>
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
                    </Link>
                </div>
            </section>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="landing-footer">
                <div className="footer-inner">
                    <p>
                        Built with anxiety and Next.js &middot; DAM &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    )
}
