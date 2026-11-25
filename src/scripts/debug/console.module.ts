import { ArrayHelper, PageData } from '../helpers';

const WOLF_ART = [
    '                                                         :I;+i+.             ',
    '                                                       :t    ..=:            ',
    '                                                     .ii   ..:;+;=           ',
    '                                                   .=;i=t+;;:=;::I+          ',
    '                                                  ;i++tI:;;.i;+;;;+          ',
    '                                                 V+ttIi=;i;;=+=+t  X;        ',
    '                                               YIi++ii+=:;.=.+ii=  t:        ',
    '                                         ==+iI+:++=t=i+i;+=+it=i   R:        ',
    '                                ;+YVRRMBBBRY=::i=i++=tti;;==iii+.  R:        ',
    '                           =;=Itii+iIVYi=. i+i+iitiiiti+;+;+i+    +;         ',
    '                       ;===tii=;:+::IY;  .tIiiiIIYY++ii=i=+;=:.   ;.:X.:: .+ ',
    '                     =::+=t+;;.....:+=XVXYYYVYItIVItit+i=;;=..R;IY:+:  . .:;I',
    '                    =itt;+;;::;;;;===IVttt++ii++=+=iii+=;;;;;=:;:......::.;i+',
    '                  :=YI+=;:;::;:;==+t=;=ttIItItttiti++i;+=i+++=:;::;.::::.+It ',
    '               ;:ii+;.;::;::...;;:;=;=ttItttttittiii;===i=++;:=;::::.::;i=:  ',
    '        ;;;;:;;;;:;;;::.........:.:;;:::===iYV+VXXRRR=YIIiti++t+i+;.::+=:    ',
    '  :;;==;;==i+==:.:..........::::=;=VYYYRXRVVRRRRVIi;=+++=;+;+=;=itYt:        ',
    '    ;;;.;::;==::;;.:........:..=++YYtVIXYRVBYBBBRt+=++it+;i+;=;itX;          ',
    '      ::;:..;=;:;:::;.........;;;;;=;i;i;:=YIYIXRI+ii;;I:++;==iVY            ',
    '     ........:;....:..:.......:==I;tIiYIiXitIIRRXI:=tiiItIi+=IX=:            ',
    ' ...::.:....:.........:;.....:=++ItitIRIX+RVYVRRY+...YXIRY;VRRWB:            ',
    '.:;;;...::::;::.:::..........;=;ItiV;IRIYYRRBYBRYiI+.+VRRItXBWR+==           ',
];

export class ConsoleModule {
    constructor() {
        this.print();
    }

    private print(): void {
        const pad = '   ';
        const w = 77 + pad.length * 2;
        const hBorder = `${pad}\u2554${'\u2550'.repeat(w)}\u2557${pad}`;
        const fBorder = `${pad}\u255A${'\u2550'.repeat(w)}\u255D${pad}`;
        const blank = `${pad}\u2551${pad}${' '.repeat(77)}${pad}\u2551${pad}`;
        const wolf = [
            hBorder,
            blank,
            ...WOLF_ART.map((l) => `${pad}\u2551${pad}${l}${pad}\u2551${pad}`),
            blank,
            fBorder,
        ];

        const purple = 'color:#c084fc;font-weight:bold;';
        const amber = 'color:#fbbf24;font-weight:bold;';
        const gray = 'color:#9ca3af;';
        const reset = 'color:inherit;font-weight:normal;';

        console.log(
            `%c${wolf.join('\n')}`,
            'color:#ffe8cc;background:linear-gradient(90deg,#1a1a2e,#87613e);font-size:12px;font-family:monospace;line-height:1;letter-spacing:-10px;',
        );

        const { code, title, puns } = PageData.get();
        const lines = [...puns];
        ArrayHelper.shuffle(lines);
        const flavour = lines.slice(0, 3);
        const width = Math.max(...flavour.map((line) => line.length));
        const icons = ['⚡', '🦴', '🌙'];

        console.log(
            `%c  🐺 CERBRUS ${code} — ${title} 🐺  `,
            'background:linear-gradient(90deg,#87613e,#ffe8cc);color:#1a1a2e;font-size:18px;font-weight:bold;padding:8px 100px;border-radius:6px;margin-top:4px;',
        );

        console.log(
            flavour.map((line, i) => `%c${icons[i]}  %c${line.padEnd(width)}%c ${icons[i]}`).join('\n'),
            ...flavour.flatMap(() => [amber, gray, reset]),
        );

        console.log('%c🥩 Fun fact: %cCerbrus prefers his steaks rare — and his errors rarer.', purple, gray);
    }
}
