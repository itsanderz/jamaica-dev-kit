import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Jamaica Developer Kit',
  description: 'The definitive open-source toolkit for building Jamaica-focused applications. 21 packages for identity, finance, geography, education, health, developer experience, and live data.',
  head: [
    ['meta', { name: 'theme-color', content: '#009B3A' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap', rel: 'stylesheet' }],
  ],
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo.svg' },
    siteTitle: 'Jamaica Dev Kit',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Packages', link: '/packages/overview' },
      { text: 'Playground', link: '/playground/' },
      { text: 'Sectors', link: '/sectors/fintech' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Examples', link: '/examples/common-patterns' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
      ],
      '/packages/': [
        {
          text: 'Overview',
          items: [
            { text: 'All Packages', link: '/packages/overview' },
          ],
        },
        {
          text: 'Core',
          collapsed: false,
          items: [
            { text: 'jamaica-trn', link: '/packages/trn' },
            { text: 'jamaica-phone', link: '/packages/phone' },
            { text: 'jamaica-addresses', link: '/packages/addresses' },
            { text: 'jamaica-constants', link: '/packages/constants' },
          ],
        },
        {
          text: 'Finance',
          collapsed: false,
          items: [
            { text: 'jamaica-currency', link: '/packages/currency' },
            { text: 'jamaica-tax', link: '/packages/tax' },
            { text: 'jamaica-banks', link: '/packages/banks' },
            { text: 'jamaica-gov-fees', link: '/packages/gov-fees' },
          ],
        },
        {
          text: 'Geography',
          collapsed: false,
          items: [
            { text: 'jamaica-parishes', link: '/packages/parishes' },
            { text: 'jamaica-places', link: '/packages/places' },
            { text: 'jamaica-constituencies', link: '/packages/constituencies' },
            { text: 'jamaica-transport', link: '/packages/transport' },
          ],
        },
        {
          text: 'Social',
          collapsed: false,
          items: [
            { text: 'jamaica-schools', link: '/packages/schools' },
            { text: 'jamaica-health', link: '/packages/health' },
            { text: 'jamaica-emergency', link: '/packages/emergency' },
            { text: 'jamaica-holidays', link: '/packages/holidays' },
          ],
        },
        {
          text: 'Developer Experience',
          collapsed: false,
          items: [
            { text: 'jamaica-zod', link: '/packages/zod' },
            { text: 'jamaica-react', link: '/packages/react' },
            { text: 'jamaica-express', link: '/packages/express' },
          ],
        },
        {
          text: 'Live Data',
          collapsed: false,
          items: [
            { text: 'jamaica-boj', link: '/packages/boj' },
            { text: 'jamaica-open-data', link: '/packages/open-data' },
          ],
        },
      ],
      '/playground/': [
        {
          text: 'Playground',
          items: [
            { text: 'Overview', link: '/playground/' },
            { text: 'TRN Validator', link: '/playground/trn' },
            { text: 'Phone Formatter', link: '/playground/phone' },
            { text: 'Currency & GCT', link: '/playground/currency' },
            { text: 'Payroll Calculator', link: '/playground/payroll' },
            { text: 'Address Parser', link: '/playground/address' },
            { text: 'Government Fees', link: '/playground/fees' },
            { text: 'Public Holidays', link: '/playground/holidays' },
            { text: 'Parish Explorer', link: '/playground/parishes' },
          ],
        },
      ],
      '/sectors/': [
        {
          text: 'Sector Guides',
          items: [
            { text: 'Fintech', link: '/sectors/fintech' },
            { text: 'E-commerce', link: '/sectors/ecommerce' },
            { text: 'Government', link: '/sectors/government' },
            { text: 'HR & Payroll', link: '/sectors/hr-payroll' },
            { text: 'Healthcare', link: '/sectors/health' },
            { text: 'Education', link: '/sectors/education' },
            { text: 'Logistics & Delivery', link: '/sectors/logistics' },
            { text: 'Civic Tech', link: '/sectors/civic-tech' },
            { text: 'Diaspora Apps', link: '/sectors/diaspora' },
          ],
        },
      ],
      '/cli/': [
        {
          text: 'CLI',
          items: [
            { text: 'Overview', link: '/cli/' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Common Patterns', link: '/examples/common-patterns' },
            { text: 'React Forms', link: '/examples/react-forms' },
            { text: 'Express Middleware', link: '/examples/express-middleware' },
            { text: 'Full-Stack', link: '/examples/full-stack' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jamaica-digital/jamaica' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Jamaica Digital',
    },
  },
});
