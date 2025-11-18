import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Steding Design System',
  brandUrl: 'https://leroysteding.com',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#00f0ff',
  colorSecondary: '#b026ff',

  // UI
  appBg: '#0a0a0a',
  appContentBg: '#050505',
  appBorderColor: '#2a2a2a',
  appBorderRadius: 8,

  // Text colors
  textColor: '#e5e5e5',
  textInverseColor: '#050505',
  textMutedColor: '#888888',

  // Toolbar default and active colors
  barTextColor: '#e5e5e5',
  barSelectedColor: '#00f0ff',
  barBg: '#0a0a0a',

  // Form colors
  inputBg: '#1a1a1a',
  inputBorder: '#2a2a2a',
  inputTextColor: '#e5e5e5',
  inputBorderRadius: 4,
});

addons.setConfig({
  theme,
});
