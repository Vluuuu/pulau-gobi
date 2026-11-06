import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Dibutuhkan agar WebGL (three.js) jalan saat render di Windows
Config.setChromiumOpenGlRenderer('angle');
