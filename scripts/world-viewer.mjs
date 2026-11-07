import {context} from 'esbuild';
import {mkdir, copyFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2), buildOnly = args.includes('--build');
const portArg = args.indexOf('--port'), port = portArg >= 0 ? Number(args[portArg + 1]) : 4173;
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Gunakan --port 1024 sampai 65535.');
const output = path.join(root, 'out/world-viewer');
await mkdir(output, {recursive: true});
await copyFile(path.join(root, 'viewer/index.html'), path.join(output, 'index.html'));
const ctx = await context({
  absWorkingDir: root,
  entryPoints: ['src/viewer/main.tsx'], outfile: path.join(output, 'app.js'),
  bundle: true, format: 'esm', platform: 'browser', target: ['es2022'], jsx: 'automatic',
  sourcemap: true, metafile: true, logLevel: 'info',
  define: {'process.env.NODE_ENV': '"development"'},
  banner: buildOnly ? undefined : {js: "new EventSource('/esbuild').addEventListener('change', () => location.reload());"},
});
if (buildOnly) {
  try {
    const result = await ctx.rebuild();
    await writeFile(path.join(output, 'meta.json'), JSON.stringify(result.metafile, null, 2));
    console.log('PASS: standalone browser viewer compiled (no video/still render).');
  } finally {await ctx.dispose();}
} else {
  try {
    await ctx.watch();
    await ctx.serve({host: '127.0.0.1', port, servedir: output});
    console.log(`\nPulau Gobi 3D World Viewer\nhttp://localhost:${port}\nCtrl+C untuk berhenti. Source changes reload otomatis.\n`);
    for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => {await ctx.dispose(); process.exit(0);});
  } catch (error) {
    await ctx.dispose();
    console.error(`Viewer tidak dapat dimulai di port ${port}. Coba npm run viewer -- --port ${port + 1}.`);
    throw error;
  }
}
