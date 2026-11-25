interface ErrorContent {
    title: string;
    subtitle: string;
}

export const fallbackError: ErrorContent = {
    title: 'Something Went Ruff',
    subtitle: "Cerbrus isn't sure what happened here.<br>He's sniffing around for clues.",
};

export const errorPages: Record<number, ErrorContent> = {
    400: {
        title: 'Bark Request',
        subtitle: "Cerbrus couldn't understand that command.<br>Try a different trick!",
    },
    401: {
        title: 'Un-paw-thorized',
        subtitle: "You'll need to show your collar tag to get in here.<br>Cerbrus doesn't let strangers in.",
    },
    402: {
        title: 'Treat Payment Required',
        subtitle: "This page costs extra treats.<br>Cerbrus doesn't work for free, you know.",
    },
    403: {
        title: 'Fur-bidden',
        subtitle: 'Cerbrus is guarding this territory.<br>No trespassing, even with puppy eyes.',
    },
    404: {
        title: 'Pawge Not Found',
        subtitle:
            "Looks like this page went <em>walkies</em> and never came back.<br>Even Cerbrus can't sniff out this trail.",
    },
    405: {
        title: 'Method Not Allowed',
        subtitle: "Cerbrus only fetches in approved ways.<br>That method isn't in his training.",
    },
    406: {
        title: 'Not Accept-a-bark',
        subtitle: "Cerbrus can't serve this in a format you'll accept.<br>Picky eater, huh?",
    },
    407: {
        title: 'Proxy Paw-thentication Required',
        subtitle: 'The proxy needs to verify your collar first.<br>Cerbrus insists.',
    },
    408: {
        title: 'Request Timed Out',
        subtitle: 'Cerbrus waited and waited, but you took too long.<br>Even a patient pup has limits.',
    },
    409: {
        title: 'Con-fur-lict',
        subtitle: "Two dogs can't bury a bone in the same spot.<br>There's a conflict with this resource.",
    },
    410: {
        title: 'Pawge Is Gone',
        subtitle: "This page has gone to the big dog park in the sky.<br>It's not coming back.",
    },
    411: {
        title: 'Length Required',
        subtitle:
            'Cerbrus needs to know how long that stick is before he fetches it.<br>Please specify a Content-Length.',
    },
    412: {
        title: 'Precondition Failed',
        subtitle: "The conditions for this trick weren't met.<br>Cerbrus can't perform without the right setup.",
    },
    413: {
        title: 'Content Too Large',
        subtitle: "That's a bigger bone than Cerbrus can carry.<br>Try sending something smaller.",
    },
    414: {
        title: 'URI Too Long',
        subtitle: 'That trail is too long for even Cerbrus to follow.<br>Shorten the path and try again.',
    },
    415: {
        title: 'Unsuppawrted Media Type',
        subtitle: "Cerbrus doesn't know what to do with that.<br>Try a different format.",
    },
    416: {
        title: 'Range Not Satisfiable',
        subtitle: "Cerbrus can't fetch that range of the yard.<br>It's out of bounds.",
    },
    417: {
        title: 'Expec-tail-tion Failed',
        subtitle: "Cerbrus couldn't meet your expectations.<br>Even good boys fall short sometimes.",
    },
    418: {
        title: "I'm a Teapup",
        subtitle: "Cerbrus refuses to brew coffee.<br>He's a teapup, short and stout.",
    },
    423: {
        title: 'Locked',
        subtitle: "This resource is on a tight leash.<br>Cerbrus can't let you in right now.",
    },
    424: {
        title: 'Failed Dependency',
        subtitle: "Another request in the pack failed first.<br>Cerbrus can't finish without it.",
    },
    425: {
        title: 'Too Early',
        subtitle: "Don't wake a sleeping dog!<br>Cerbrus isn't ready for this request yet.",
    },
    426: {
        title: 'Upgrade Required',
        subtitle: 'Cerbrus needs a better protocol to play fetch.<br>Upgrade and try again.',
    },
    429: {
        title: 'Too Many Requests',
        subtitle: 'Cerbrus needs a break from all this fetching.<br>Slow down and let him catch his breath.',
    },
    451: {
        title: 'Unavailable Fur Legal Reasons',
        subtitle: "The dog catchers have restricted access to this page.<br>Cerbrus's paws are tied.",
    },
    500: {
        title: 'Internal Server Howler',
        subtitle: 'Something went wrong in the kennel.<br>Cerbrus is howling for help.',
    },
    501: {
        title: 'Not Implemented',
        subtitle: "This trick isn't in Cerbrus's repertoire yet.<br>Check back later.",
    },
    502: {
        title: 'Bad Gatewoof',
        subtitle: 'The gate guard upstream sent back nonsense.<br>Cerbrus is confused.',
    },
    503: {
        title: 'Service Unavailable',
        subtitle: 'Cerbrus is taking a well-deserved nap.<br>Try again in a bit.',
    },
    504: {
        title: 'Gatewoof Timeout',
        subtitle: 'The upstream gate guard fell asleep on the job.<br>Cerbrus waited, but nobody answered.',
    },
    507: {
        title: 'Insuf-fur-cient Storage',
        subtitle: "The kennel is full, there's no room for more.<br>Cerbrus needs a bigger yard.",
    },
    508: {
        title: 'Loop Detected',
        subtitle: 'Cerbrus has been chasing his tail again.<br>An infinite loop was detected.',
    },
};
