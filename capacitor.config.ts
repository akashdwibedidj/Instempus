import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bput.instempus',
  appName: 'Instempus',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  backgroundColor: '#000000',
};

export default config;
