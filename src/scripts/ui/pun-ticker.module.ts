import { ArrayHelper, DomHelper, PageData } from '../helpers';
import { BaseDomModule } from './base-dom.module';

export class PunTickerModule extends BaseDomModule {
    private puns!: Array<string>;
    private textEl!: HTMLElement;
    private interval!: number;
    private index = 0;

    constructor() {
        super('punTickerContainer');
    }

    public destroy(): void {
        clearInterval(this.interval);
    }

    protected override init(): void {
        this.puns = [...PageData.get().puns];
        ArrayHelper.shuffle(this.puns);
        this.textEl = DomHelper.el('span', { class: 'pun-text' });
        this.container.append(DomHelper.el('span', { class: 'pun-icon' }, '\uD83D\uDC3A'), this.textEl);

        this.show();
        this.interval = window.setInterval(() => this.show(), 10000);
    }

    private show(): void {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.textEl.textContent = this.puns[this.index];
            this.container.style.opacity = '1';
            this.index = (this.index + 1) % this.puns.length;
        }, 400);
    }
}
