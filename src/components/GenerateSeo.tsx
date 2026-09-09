'use client'

import React, { useState } from 'react'
import { Button, useAllFormFields, useDocumentInfo, useForm } from '@payloadcms/ui'

/**
 * Admin-side AI. Reads the page the editor is on, asks Claude for metadata,
 * and writes the result straight back into the form fields.
 */
export const GenerateSeo: React.FC = () => {
  const { id } = useDocumentInfo()
  const { dispatchFields } = useForm()
  const [fields] = useAllFormFields()
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const [note, setNote] = useState('')

  const run = async () => {
    if (!id) {
      setState('error')
      setNote('Save the page once before generating.')
      return
    }
    setState('working')
    setNote('')
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pageId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')

      for (const key of ['metaTitle', 'metaDescription', 'aiSummary'] as const) {
        if (data[key]) dispatchFields({ type: 'UPDATE', path: key, value: data[key] })
      }
      setState('done')
      setNote(
        data.mode === 'stub'
          ? 'Generated in stub mode. Add ANTHROPIC_API_KEY to run live.'
          : 'Generated live by Claude.',
      )
    } catch (err: any) {
      setState('error')
      setNote(err.message)
    }
  }

  void fields

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <Button buttonStyle="secondary" onClick={run} disabled={state === 'working'}>
        {state === 'working' ? 'Asking Claude…' : 'Generate with Claude'}
      </Button>
      {note && (
        <p style={{ marginTop: '.5rem', fontSize: '.85rem', opacity: 0.75 }}>{note}</p>
      )}
    </div>
  )
}
