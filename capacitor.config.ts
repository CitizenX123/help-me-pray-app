import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.helpme.pray',
  appName: 'Help Me Pray',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
