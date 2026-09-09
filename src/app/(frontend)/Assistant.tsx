'use client'

import React, { useState } from 'react'

export default function Assistant({
  label = 'Ask about shutters',
  intro = "Answers come only from this site's CMS content.",
  suggestions = [],
}: {
  label?: string
  intro?: string
  suggestions?: string[]
}) {
  const SUGGESTIONS = suggestions.length
    ? suggestions
    : [
        'Which shutter suits a west-facing window?',
        'Are your shutters made in Australia?',
        'How do I book a design consult?',
      ]
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [mode, setMode] = useState('')
  const [busy, setBusy] = useState(false)

  const ask = async (question: string) => {
    if (!question.trim()) return
    setBusy(true)
    setAnswer('')
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      setAnswer(data.answer)
      setMode(data.mode)
    } catch {
      setAnswer('Something went wrong. Please try again.')
    }
    setBusy(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', right: 24, bottom: 24, zIndex: 60,
          background: '#0061b2', color: '#fff', border: 0, cursor: 'pointer',
          borderRadius: 999, padding: '15px 26px', fontSize: 15, fontWeight: 500,
          boxShadow: '0 10px 30px rgba(0,0,0,.22)',
        }}
      >
        {open ? 'Close' : label}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', right: 24, bottom: 92, zIndex: 60, width: 380, maxWidth: 'calc(100vw - 48px)',
            background: '#fff', borderRadius: 16, padding: 22,
            boxShadow: '0 24px 60px rgba(0,0,0,.24)', border: '1px solid #d7e3e6',
          }}
        >
          <div style={{ fontSize: 13, color: '#868990', marginBottom: 12 }}>
            {intro}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(q)}
              placeholder="Ask a question…"
              style={{ flex: 1, padding: '11px 13px', borderRadius: 9, border: '1px solid #d7e3e6', fontSize: 15 }}
            />
            <button
              onClick={() => ask(q)}
              disabled={busy}
              style={{ background: '#1d283c', color: '#fff', border: 0, borderRadius: 9, padding: '0 16px', cursor: 'pointer' }}
            >
              {busy ? '…' : 'Ask'}
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setQ(s); ask(s) }}
                style={{ fontSize: 12.5, background: '#f4f8fa', border: '1px solid #d7e3e6', borderRadius: 999, padding: '6px 11px', cursor: 'pointer' }}
              >
                {s}
              </button>
            ))}
          </div>

          {answer && (
            <div style={{ marginTop: 16, fontSize: 15, lineHeight: 1.65 }}>
              {answer}
              <div style={{ marginTop: 10, fontSize: 12, color: '#868990' }}>
                {mode === 'stub' ? 'Stub mode. Add an API key to run live against Claude.' : 'Answered live by Claude.'}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
