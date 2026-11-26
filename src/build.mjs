import { build, context } from 'esbuild';
import { compile } from 'sass';
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { watch as chokidarWatch } from 'chokidar';

const __srcDir = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(__srcDir, 'views', 'pages');
const stylesDir = join(__srcDir, 'styles');
const distDir = join(__srcDir, '..', 'dist');
const distPublicDir = join(distDir, 'public');
const watch = process.argv.includes('--watch');

const pages = readdirSync(pagesDir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => basename(f, '.ts'));

const logRebuild = {
    name: 'log-rebuild',
    setup(build) {
        let isRebuild = false;
        build.onStart(() => {
            if (isRebuild) console.log(`[esbuild] rebuilding...`);
            isRebuild = true;
        });
        build.onEnd((result) => {
            if (result.errors.length) return;
            console.log(`[esbuild] done`);
        });
    },
};

const entries = pages.map((page) => ({
    entryPoints: [join(pagesDir, `${page}.ts`)],
    outfile: join(distPublicDir, 'pages', page, 'index.js'),
    bundle: true,
    format: 'iife',
    target: 'es2020',
    plugins: [logRebuild],
}));

function compileStyles() {
    for (const page of pages) {
        const scssPath = join(pagesDir, `${page}.scss`);
        if (!existsSync(scssPath)) continue;

        const outDir = join(distPublicDir, 'pages', page);
        if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

        const result = compile(scssPath);
        writeFileSync(join(outDir, 'index.css'), result.css);
    }
    console.log('[sass] done');
}

function copyAssets() {
    cpSync(join(__srcDir, 'images'), join(distPublicDir, 'images'), { recursive: true });
    console.log('[copy] images done');
}

function copyViews() {
    cpSync(join(__srcDir, 'views'), join(distDir, 'views'), { recursive: true });
    console.log('[copy] views done');
}

copyAssets();
copyViews();
compileStyles();

if (watch) {
    const contexts = await Promise.all(entries.map((e) => context(e)));
    await Promise.all(contexts.map((c) => c.watch()));

    // Watch SCSS files for changes - recompile styles
    chokidarWatch([pagesDir, stylesDir], {
        ignoreInitial: true,
        ignored: (path, stats) => stats?.isFile() && !path.endsWith('.scss'),
    }).on('all', (event, path) => {
        console.log(`[scss] ${event}: ${path}`);
        compileStyles();
    });

    // Watch views for changes
    chokidarWatch([join(__srcDir, 'views')], {
        ignoreInitial: true,
    }).on('all', (event, path) => {
        console.log(`[views] ${event}: ${path}`);
        copyViews();
    });

    console.log('Watching for changes...');
} else {
    await Promise.all(entries.map((e) => build(e)));
}
