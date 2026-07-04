# Primer Universal Checkout — Exercise 2

Local sandbox integration demonstrating Primer Universal Checkout with two official Web SDK approaches:

| Example | Package | Port | Style |
|---------|---------|------|-------|
| Root (`index.html`) | [`@primer-io/primer-js`](https://www.npmjs.com/package/@primer-io/primer-js) | 5173 | Web Components — `<primer-checkout>` |
| `checkout-web/` | [`@primer-io/checkout-web`](https://www.npmjs.com/package/@primer-io/checkout-web) | 5174 | Imperative — `Primer.showUniversalCheckout()` |

Both examples share the same Express backend that creates a Primer client session.

## Architecture

```
Browser (Checkout UI)
    │
    │  POST /api/client-session
    ▼
Express backend (port 3000)
    │  Server API key from .env (never sent to browser)
    │  POST https://api.sandbox.primer.io/client-session
    ▼
Primer Sandbox
    │  returns clientToken
    ▼
Browser renders Universal Checkout → user pays → transaction in Sandbox dashboard
```

**Why a backend?** The Primer Server API key must stay server-side. The backend creates a short-lived `clientToken` that the frontend passes to the SDK. No secret keys in browser code.

## Prerequisites

- Node.js **20.19+** or **22.12+** (see `.nvmrc`)
- A [Primer Sandbox](https://dashboard.primer.io) account
- Sandbox **Server API key** (`prs_sbx_...`) from Dashboard → Settings → API Keys

## Setup

```bash
nvm use          # uses .nvmrc (Node 22)
npm install
cp .env.example .env
# Edit .env and set PRIMER_API_KEY=your_sandbox_server_api_key
```

## Run

Start the backend first, then one of the frontends:

```bash
# Terminal 1 — shared backend
npm run dev:backend

# Terminal 2 — pick one frontend:

# Web Components SDK (@primer-io/primer-js)
npm run dev:frontend
# → http://localhost:5173

# Imperative Drop-in SDK (@primer-io/checkout-web)
npm run dev:checkout-web
# → http://localhost:5174
```

## Test payment (Sandbox)

Use Primer sandbox test card details:

| Field | Value |
|-------|-------|
| Card number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g. `12/30`) |
| CVV | Any 3 digits (e.g. `123`) |
| Name | Any name |

A successful payment shows in your Primer Sandbox dashboard. No real money is charged.

## Implementation choices

### Shared backend (`server/index.js`)

- Creates a client session with order `SGD 25.00` (2500 cents), currency `SGD`
- Uses Primer API v2.4 against the sandbox endpoint
- Returns only `clientToken` to the frontend

### `@primer-io/primer-js` (Web Components)

- Calls `loadPrimer()` to register custom elements
- Uses declarative `<primer-checkout>` with slots for payment methods and success UI
- Configures `redirect.returnUrl` in frontend checkout options (not in the client-session API payload)

Docs: [Primer Checkout SDK overview](https://primer.io/docs/checkout/primer-checkout/product-overview)

### `@primer-io/checkout-web` (Drop-in)

- Imports SDK CSS and calls `Primer.showUniversalCheckout(clientToken, options)`
- Renders checkout into a `#checkout-container` div
- Uses `onCheckoutComplete` / `onCheckoutFail` callbacks for payment lifecycle

Docs: [Web SDK installation](https://primer.io/docs/sdk/web/v2.x.x/installation)

## Assumptions

- Sandbox environment only; no production keys
- Local development with open CORS for simplicity

## Challenges encountered

- **Node.js version:** Vite 8 requires Node 20.19+ or 22.12+. Resolved with `nvm install 22`.
- **`.env` format:** Must be `PRIMER_API_KEY=...`, not `X-API-Key:...`.
- **Vite entry point:** `index.html` must live at the Vite project root, not inside `public/`.
- **`redirectUrl` placement:** Not valid in the Client Session API; belongs in frontend SDK options as `redirect.returnUrl`.

## Production hardening (not implemented — for reference)

These are recommended for a real food-business deployment but intentionally omitted from this exercise:

- **Validate order server-side** — compute amount from cart/DB, don't hardcode
- **Webhook handling** — listen for `payment.status.updated` to confirm payment before fulfilling orders
- **Restrict CORS** — allow only your domain instead of open `cors()`
- **Content Security Policy** — follow [Primer CSP guidance](https://primer.io/docs/checkout/advanced/content-security-policy)
- **Never commit `.env`** — use environment variables in your deployment platform

## Project structure

```
primer-exercise2/
├── server/index.js       # Shared backend — client session endpoint
├── index.html            # primer-js entry
├── main.js               # primer-js initialization
├── checkout-web/         # checkout-web variant
│   ├── index.html
│   ├── main.js
│   └── vite.config.js
├── .env.example
├── .nvmrc
└── package.json
```
