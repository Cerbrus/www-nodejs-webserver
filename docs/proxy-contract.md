# What the reverse proxy relies on

The reverse proxy in front of every `*.cerbrus.nl` host depends on this app. Changing any of the points below breaks error pages on all hosts, not just on `error.cerbrus.nl`.

Background: [ADR-0030](https://github.com/Cerbrus/HomeAssistant/blob/master/docs/adr/0030-proxy-error-pages-in-place.md) and `docs/apps.md` in the HomeAssistant repository.

## How the proxy uses the app

- **Errors of the proxy itself, in place.** When the proxy refuses or fails a request (403 from an access list, 502 or 504 when an app is down, and the other 4xx and 5xx that Nginx raises), it fetches `/<status code>` from this app internally and shows that page. The address in the browser and the status code stay as they were. Error responses of the apps behind the proxy are passed through untouched.
- **Unknown hosts.** A request that matches no proxy host is redirected to `https://error.cerbrus.nl/404`.
- **Reaching the app.** The proxy connects to the app on the Pi's wired address, port 3010.

## What has to stay true

| Rule | Why |
|------|-----|
| `/<status code>` answers for every code from 400 to 599, with that status | The proxy asks for whatever code Nginx raised; a code without its own text gets the generic page (`fallbackError` in `src/server/errors.ts`) |
| The page for a code needs no query string | The proxy drops the query string on its internal fetch |
| Stylesheet, script and images are linked as `href="/...` and `src="/...`, root-absolute, with double quotes | The proxy rewrites exactly those two prefixes to `https://error.cerbrus.nl/`. Anything else is not rewritten: `srcset`, `url()` in inline CSS, single quotes, relative paths, paths built in script |
| `/pages/error/index.css`, `/pages/error/index.js` and `/images/...` stay valid on `error.cerbrus.nl` | A page shown in place on another host loads them from there |
| `error.cerbrus.nl` stays public | Same reason: visitors of any host load the assets from it |
| The app listens on port 3010 on the Pi's network address | The proxy runs on another machine |
| Nothing in the page assumes it is served from `error.cerbrus.nl` | In place, `location` is the other host. Client code reads `PageData.get().shownInPlace` to tell the two apart |

`url()` inside the stylesheet file itself is fine: it resolves against the stylesheet's own address.

## Checking after a change

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://error.cerbrus.nl/403    # 403
curl -s -o /dev/null -w "%{http_code}\n" https://error.cerbrus.nl/599    # 599, generic page
curl -s "https://radarr.cerbrus.nl/?a=http://x" | grep -oE '(href|src)="[^"]+"'
```

The last request is refused by the proxy (403) from inside the home network; every `href` and `src` in its output has to start with `https://error.cerbrus.nl/`.
