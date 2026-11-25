type PunGroup = 'missing' | 'access' | 'server' | 'request';

const MISSING_CODES = [404, 410];
const ACCESS_CODES = [401, 403, 407, 451];

const GENERIC_PUNS = [
    'This link is ruff around the edges.',
    "We've got beef with whoever linked you here.",
    'This page was too raw to serve.',
    "That's a mis-steak. Somebody is getting no dinner.",
    'Things went medium wrong. Cerbrus ordered rare.',
    'Not the pawfect outcome, we admit.',
    'Well, this is a hairy situation.',
    'Paws for a moment. Then try something else.',
];

const PUNS: Record<PunGroup, Array<string>> = {
    missing: [
        'This page has gone to the dogs.',
        'Fur-oh-fur: destination unknown.',
        'We looked everywhere... even under the couch.',
        'This URL is barking up the wrong tree.',
        'The page you seek has been re-furred elsewhere.',
        'Howl about trying a different link?',
        'No bones about it, this page is gone.',
        'Looks like someone buried this page in the yard.',
        'The server fetched nothing. Bad server.',
        'Tail not found. Neither was this page.',
        "You've been led astray — paws and reconsider.",
        'This page pulled a Houndini. Poof!',
        'Sniffed all the packets. Nothing here.',
        'Error: page chased its own tail into oblivion.',
        "Fur real though, this page doesn't exist.",
        "This page is rare. As in, it doesn't exist.",
        'Well done. You found nothing. Medium rare effort.',
        'The steaks have never been higher... or more missing.',
        'A rare occurrence. Like a well-done wolf.',
        "This page got grilled and didn't survive.",
    ],
    access: [
        'No collar, no entry. Pack rules.',
        "This yard has a fence, and you're on the wrong side of it.",
        "Beware of the wolf. The sign wasn't decoration.",
        "Puppy eyes won't open this gate.",
        'Members of the pack only, howl-ever nicely you ask.',
        'Cerbrus sniffed your credentials. Something smells off.',
        'This den is private. Kindly back away slowly.',
        'Bribes in treats are not accepted here.',
        'You shall not paws.',
        'Three heads are watching this door. All three said no.',
    ],
    server: [
        'The server rolled over and played dead.',
        'Somebody chewed through the cables again.',
        'Not your fault. The kennel is a mess right now.',
        'The pack is on it. Mostly by howling at it.',
        'Cerbrus tripped over his own tail. Give him a minute.',
        'The server is in the doghouse for this one.',
        'Something upstream is barking mad.',
        'We let sleeping servers lie. That was a mistake.',
        'Back in a wag. Probably.',
        'The hamster wheel is fine. The wolf fell off.',
    ],
    request: [
        "That's not how you play fetch.",
        'Cerbrus tilted his head at that request.',
        'Sit. Stay. Now try that again, properly.',
        'Wrong trick. No treat.',
        'That request came in tail first.',
        "Easy on the leash, you're pulling too hard.",
        "Even a good boy can't make sense of that one.",
        'Throw it again. Nicer this time.',
        'Cerbrus fetched it, sniffed it, and dropped it.',
        'Bad request. Not bad human. Just bad request.',
    ],
};

function groupOf(code: number): PunGroup {
    if (MISSING_CODES.includes(code)) return 'missing';
    if (ACCESS_CODES.includes(code)) return 'access';

    return code >= 500 ? 'server' : 'request';
}

export function punsFor(code: number): Array<string> {
    return [...PUNS[groupOf(code)], ...GENERIC_PUNS];
}
