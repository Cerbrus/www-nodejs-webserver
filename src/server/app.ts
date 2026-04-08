import express from 'express';

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

    private configureEngine(): void {}

    private registerRoutes(): void {}
}

new App().start();
