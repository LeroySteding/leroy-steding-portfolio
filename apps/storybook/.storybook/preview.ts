import type { Preview } from '@storybook/react';
import React from 'react';
import './styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    layout: 'centered',
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f1419', class: 'dark' },
        { name: 'light', value: '#ffffff', class: 'light' }
      ]
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
        wide: {
          name: 'Wide',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
    },
  },

  decorators: [
    (Story, context) => {
      // Apply theme class based on background selection
      React.useEffect(() => {
        const bg = context.globals.backgrounds?.value;
        const themeClass = bg === '#ffffff' ? 'light' : 'dark';
        
        // Apply theme to document body
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(themeClass);
        
        return () => {
          document.body.classList.remove('light', 'dark');
        };
      }, [context.globals.backgrounds?.value]);

      const bg = context.globals.backgrounds?.value;
      const themeClass = bg === '#ffffff' ? 'light' : 'dark';
      
      return React.createElement('div', { 
        className: themeClass,
        style: { 
          padding: '1rem', 
          minHeight: '100vh', 
          background: bg || '#0f1419',
          color: themeClass === 'light' ? '#0a0a0a' : '#f5f5f5'
        } 
      }, React.createElement(Story));
    },
  ],

  tags: ['autodocs'],
};

export default preview;
