interface ErrorPageData {
    code: number;
    title: string;
    puns: Array<string>;
    shownInPlace: boolean;
}

export class PageData {
    private static data?: ErrorPageData;

    public static get(): ErrorPageData {
        this.data ??= this.read();
        return this.data;
    }

    private static read(): ErrorPageData {
        const { code, title, puns } = document.getElementById('errorPage')?.dataset ?? {};
        const stylesheet = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]');

        return {
            code: Number(code) || 500,
            title: title ?? '',
            puns: JSON.parse(puns ?? '[]'),
            shownInPlace: stylesheet ? new URL(stylesheet.href).origin !== location.origin : false,
        };
    }
}
