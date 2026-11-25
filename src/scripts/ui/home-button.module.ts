import { DomHelper, PageData } from '../helpers';
import { BaseDomModule } from './base-dom.module';

const ACCESS_CODES = [401, 403, 407, 451];

export class HomeButtonModule extends BaseDomModule {
    constructor() {
        super('homeButtonContainer');
    }

    protected override init(): void {
        const { code, shownInPlace } = PageData.get();
        const siteHasHome = shownInPlace && location.pathname !== '/' && !ACCESS_CODES.includes(code);

        if (shownInPlace && code >= 500) {
            this.addButton('Try Again', () => location.reload());
        } else if (siteHasHome) {
            this.container.append(
                DomHelper.el('a', { class: 'home-btn', href: `${location.origin}/` }, 'Take Me Home'),
            );
        } else if (history.length > 1) {
            this.addButton('Go Back', () => history.back());
        } else if (shownInPlace) {
            this.addButton('Try Again', () => location.reload());
        }
    }

    private addButton(label: string, action: () => void): void {
        const button = DomHelper.el('button', { class: 'home-btn', type: 'button' }, label);
        button.addEventListener('click', action);
        this.container.append(button);
    }
}
