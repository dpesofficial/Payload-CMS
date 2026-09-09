import type { GlobalConfig } from 'payload'

/**
 * Everything that is not page content but still appears on screen. Without
 * this the header, footer and demo notice would be hard-coded, which is
 * exactly the complaint clients have about half-built CMS work.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: { read: () => true },
  admin: { group: 'Configuration' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            { name: 'brand', type: 'text', defaultValue: 'Titan' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'nav',
              type: 'array',
              labels: { singular: 'Menu item', plural: 'Menu items' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text' },
              ],
            },
            {
              name: 'headerCta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'footerText', type: 'textarea' },
            { name: 'phone', type: 'text' },
          ],
        },
        {
          label: 'Demo notice',
          fields: [
            {
              name: 'showDemoBar',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'The dark strip at the top of the site. Turn off for a clean client view.' },
            },
            { name: 'demoBarText', type: 'text' },
          ],
        },
        {
          label: 'Assistant',
          fields: [
            { name: 'assistantButton', type: 'text', defaultValue: 'Ask about shutters' },
            { name: 'assistantIntro', type: 'text' },
            {
              name: 'assistantSuggestions',
              type: 'array',
              fields: [{ name: 'question', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
