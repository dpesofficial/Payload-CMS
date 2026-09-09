import type { CollectionConfig } from 'payload'
import { blocks } from '../blocks/index'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: () => true },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [{ name: 'layout', type: 'blocks', blocks, labels: { singular: 'Section', plural: 'Sections' } }],
        },
        {
          label: 'SEO & AI',
          fields: [
            {
              name: 'aiTools',
              type: 'ui',
              admin: { components: { Field: '/components/GenerateSeo#GenerateSeo' } },
            },
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
            {
              name: 'aiSummary',
              type: 'textarea',
              admin: {
                description:
                  'Plain-language summary served to AI answer engines via /llms.txt. This is what ChatGPT and Perplexity read.',
              },
            },
          ],
        },
      ],
    },
  ],
}
