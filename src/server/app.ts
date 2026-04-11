import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { errorPages } from './errors.js';

class App {
    private app = express();
    private readonly port = 3010;

    public async start(): Promise<void> {
        this.configureEngine();
        this.registerRoutes();
        this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }

    private configureEngine(): void {
        this.app.engine(
            'handlebars',
            engine({
                layoutsDir: path.join(__dirname, '../views/layouts'),
                partialsDir: path.join(__dirname, '../views/shared'),
            }),
        );
        this.app.set('view engine', 'handlebars');
        this.app.set('views', path.join(__dirname, '../views/pages'));

        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    private renderError(
        res: express.Response,
        code: number,
    ): void {
        const content = errorPages[code] ?? errorPages[500]!;
        res.status(code).render('error', {
            page: 'error',
            errorCode: code,
            ...content,
        });
    }

    private registerRoutes(): void {
        this.app.get('/:page', (req, res, next) => {
            const page = req.params['page'];
            const code = Number(page);

            if (errorPages[code]) {
                return this.renderError(res, code);
            }

            res.render(page, { page }, (err, html) => {
                if (err) return next();
                res.send(html);
            });
        });

        // Catch-all 404
        this.app.use((_req, res) => {
            this.renderError(res, 404);
        });
    }
}

new App().start();
