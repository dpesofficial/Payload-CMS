import type { Block } from 'payload'

const link = (name: string) => ({
  name,
  type: 'group' as const,
  fields: [
    { name: 'label', type: 'text' as const },
    { name: 'url', type: 'text' as const },
  ],
})

/**
 * These block names mirror the ACF flexible-content layouts on the live
 * WordPress site (banner, your_journey, two_column, google_slider,
 * got_questions) so the editing model is familiar to the client.
 */
export const Banner: Block = {
  slug: 'banner',
  labels: { singular: 'Hero banner', plural: 'Hero banners' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        link('enquire'),
        link('learnMore'),
      ],
    },
    { name: 'crests', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}

export const YourJourney: Block = {
  slug: 'yourJourney',
  labels: { singular: 'Journey steps', plural: 'Journey steps' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const TwoColumn: Block = {
  slug: 'twoColumn',
  labels: { singular: 'Two column', plural: 'Two columns' },
  fields: [
    {
      name: 'rows',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'content', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'right',
          options: [
            { label: 'Image right', value: 'right' },
            { label: 'Image left', value: 'left' },
          ],
        },
        link('cta'),
      ],
    },
  ],
}

export const GoogleReviews: Block = {
  slug: 'googleReviews',
  labels: { singular: 'Google reviews', plural: 'Google reviews' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'reviews',
      type: 'array',
      fields: [
        { name: 'author', type: 'text' },
        { name: 'rating', type: 'number', defaultValue: 5, min: 1, max: 5 },
        { name: 'quote', type: 'textarea' },
      ],
    },
  ],
}

export const GotQuestions: Block = {
  slug: 'gotQuestions',
  labels: { singular: 'Got questions CTA', plural: 'Got questions CTAs' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'content', type: 'textarea' },
    { name: 'phone', type: 'text' },
    link('cta'),
  ],
}

export const blocks = [Banner, YourJourney, TwoColumn, GoogleReviews, GotQuestions]
