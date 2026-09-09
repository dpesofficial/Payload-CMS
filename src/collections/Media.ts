import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    staticDir: 'public/media',
    // Keep the demo fast: no image resizing pipeline, we reuse the WP renditions.
    disableLocalStorage: false,
  },
  fields: [
    { name: 'alt', type: 'text' },
    {
      name: 'wpId',
      type: 'number',
      admin: { readOnly: true, description: 'Original WordPress attachment ID.' },
      index: true,
    },
  ],
}
