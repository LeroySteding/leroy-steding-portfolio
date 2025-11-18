// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const require = createRequire(import.meta.url);

// Helper function for resolving packages in monorepo
const getAbsolutePath = (packageName: string): string => {
  return path.dirname(require.resolve(path.join(packageName, 'package.json')));
};

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Import stories from portfolio app components
    '../../portfolio/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Import stories from shared UI package
    '../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Import stories from timeline-scroll package
    '../../../packages/timeline-scroll/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  
  addons: [],
  
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: false,
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      },
    },
  },
  
  core: {
    disableTelemetry: true,
  },
  
  docs: {
    defaultName: 'Documentation'
  },
  
  staticDirs: ['../public'],
};

export default config;
