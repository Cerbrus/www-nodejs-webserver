import path from 'path';

import express from 'express';
import { engine } from 'express-handlebars';

import { errorPages, fallbackError } from './errors.js';
import { punsFor } from './puns.js';

const ERROR_CODE = /^[45]\d{2}$/;

class App {
    private app = express();
    private readonly port = Number(process.env['PORT']) || 3010;

    public start(): void {
        this.configureEngine();
        this.registerRoutes();
        this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }

    private configureEngine(): void {
        this.app.disable('x-powered-by');
        this.app.engine(
            'handlebars',
            engine({
                layoutsDir: path.join(__dirname, '../views/layouts'),
                partialsDir: path.join(__dirname, '../views/shared'),
            }),
        );
        this.app.set('view engine', 'handlebars');
        this.app.set('views', path.join(__dirname, '../views/pages'));

        this.app.use(express.static(path.join(__dirname, '../public'), { maxAge: '1d' }));
    }

    private renderError(res: express.Response, code: number): void {
        const content = errorPages[code] ?? fallbackError;
        res.status(code)
            .set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' })
            .render('error', {
                page: 'error',
                errorCode: code,
                ...content,
                punsJson: JSON.stringify(punsFor(code)),
            });
    }

    private registerRoutes(): void {
        this.app.get('/:code', (req, res, next) => {
            const code = req.params['code'];

            if (!ERROR_CODE.test(code)) return next();

            this.renderError(res, Number(code));
        });

        this.app.use((_req, res) => {
            this.renderError(res, 404);
        });

        this.app.use((_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            this.renderError(res, 500);
        });
    }
}

new App().start();
