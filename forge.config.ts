import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

import path from 'path';

const iconDirectory = path.join(__dirname, 'images', 'icons');

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon:
      process.platform === 'win32'
        ? path.join(iconDirectory, 'proton-mail-viewer-icon_256x256.ico')
        : process.platform === 'darwin'
        ? path.join(iconDirectory, 'proton-mail-viewer-icon_512x512.png')
        : undefined,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}),
    new MakerRpm(
      {
        options: {
          icon: path.join(iconDirectory, 'proton-mail-viewer-icon_512x512.png'),
        },
      },
      ['linux']
    ),
    new MakerDeb(
      {
        options: {
          icon: path.join(iconDirectory, 'proton-mail-viewer-icon_512x512.png'),
        },
      },
      ['linux']
    ),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
