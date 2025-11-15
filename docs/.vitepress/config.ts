import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MindWell Documentation',
  description: 'Complete documentation for the Mental Health & Wellness Companion App',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/authentication' },
      { text: 'Contributing', link: '/contributing' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/guide/architecture/overview' },
            { text: 'Frontend', link: '/guide/architecture/frontend' },
            { text: 'Backend', link: '/guide/architecture/backend' },
            { text: 'Database', link: '/guide/architecture/database' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Authentication', link: '/guide/features/authentication' },
            { text: 'User Management', link: '/guide/features/user-management' },
            { text: 'Security', link: '/guide/features/security' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'User Management', link: '/api/user-management' },
            { text: 'Error Handling', link: '/api/error-handling' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/mental-health-app' }
    ],

    footer: {
      message: 'Built with ❤️ for mental health and wellness',
      copyright: 'Copyright © 2024 MindWell Team'
    },

    search: {
      provider: 'local'
    }
  }
})