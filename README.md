# Public Web QA

Playwright, TypeScript, and Cucumber test project for Amazon India UI flows and API order workflows. The UI tests use the public storefront without signing in, changing cart contents, or placing orders. API tests use a small in-process order API fixture; they do not call a production order service.

## Prerequisites

- Node.js and npm
- A display for headed browser tests. Local UI tests open a visible browser; CI uses Xvfb to provide a virtual display.

## Setup

Install the JavaScript dependencies and the Playwright browser binaries:

```bash
npm install
npx playwright install chromium firefox webkit
```

For Linux CI, install the browser's system dependencies with `npx playwright install --with-deps chromium`.

## Project Layout

```text
API/
	steps/                 Cucumber API step definitions
	tests/features/        API feature files
UI/
	pages/                 Amazon page objects
	steps/                 Cucumber UI step definitions
	tests/features/        Search, product, and cart features
support/
	hooks.ts               Browser/API setup, cleanup, and failure artifacts
	order-api.ts           Isolated local order API used by API scenarios
	world.ts               Per-scenario Cucumber state
cucumber.js              Feature discovery, formatters, retries, parallelism
tsconfig.json            TypeScript checks for UI, API, and support code
```

## Running Tests

```bash
npm test                    # All UI and API scenarios; headed Chromium for UI
npm run test:smoke          # Scenarios tagged @smoke
npm run test:regression     # Scenarios tagged @regression
npm run test:ui             # Amazon UI scenarios only
npm run test:api            # API scenarios only; no browser is launched
npm run test:chromium       # UI suite in headed Chromium
npm run test:webkit         # UI suite in headed WebKit
npm run test:browsers       # Chromium followed by WebKit
```

The default browser is Chromium. Select a browser with `BROWSER=firefox npm run test:ui`, or use the browser-specific scripts. Firefox is configured, although some restricted macOS environments may prevent its helper process from launching.

You can also select tests by tag directly, for example:

```bash
npx cucumber-js --tags '@api'
npx cucumber-js --tags '@amazon and @product'
```

## Coverage

There are 13 scenarios: 8 UI and 5 API.

UI modules:

- Search: matching results, changing a query, and low-to-high sorting
- Product: opening the first result, checking its title and image, and returning to the same results
- Cart: opening the cart from the header and checking the anonymous cart state

API scenarios:

- Create an order and retrieve it using the ID returned by the create response
- Create, confirm, and retrieve an order using the same response ID
- Reject an order with invalid details
- Return not found for an unknown order ID
- Reject an unsupported status and verify the stored order is unchanged

## Parallel API Chaining

Cucumber runs two scenarios at once. Each API scenario starts its own order API server on an operating-system-selected local port and owns its own order store and Cucumber World. A scenario that creates an order saves the returned `id` and passes it to later `GET` or `PATCH` requests in that same scenario. This avoids shared mutable IDs and execution-order dependencies while retaining parallel execution. Retries create a fresh scenario world and order store.

The local fixture supports:

| Request | Successful behavior | Validation behavior |
|---|---|---|
| `POST /orders` | Creates an order and returns it with an ID (`201`) | Invalid customer, item, or quantity returns `400` |
| `GET /orders/:id` | Returns the stored order (`200`) | Unknown ID returns `404` |
| `PATCH /orders/:id` | Confirms an order (`200`) | Unsupported status returns `400` without changing the order |

Example create payload:

```json
{
	"customerName": "Parallel Test",
	"item": "wireless mouse",
	"quantity": 1
}
```

The server implementation is in `support/order-api.ts`; scenario steps and assertions are in `API/steps/api.steps.ts` and `API/tests/features/api.feature`.

## Execution Settings

- Two Cucumber workers run scenarios in parallel.
- Each failed scenario is retried once.
- Cucumber step timeout: 60 seconds.
- UI action timeout: 20 seconds; navigation and browser-launch timeouts: 30 seconds.
- API request timeout: 30 seconds.
- UI tests always run headed. API scenarios use Playwright's `APIRequestContext` without opening a browser.

## Reports And Diagnostics

Each run produces:

- Console summary from Cucumber
- Allure results in `allure-results/`
- JUnit XML in `junit.xml`
- On UI failure: screenshot, video, trace, browser console errors, page errors, and failed-request details attached to the report
- Failed traces in `artifacts/traces/` and failed videos in `artifacts/videos/`; videos from passing UI scenarios are deleted
- API method, path, status, and elapsed-time logs in the test output and failure attachment

Generate and open the Allure HTML report with:

```bash
npm run report:allure
npm run open:allure
```

Open a saved trace with `npx playwright show-trace <trace-file>`. Set `DEBUG=pw:api` to enable Playwright API logs, for example `DEBUG=pw:api npm run test:api`.

The GitHub Actions workflow runs the headed Chromium UI/API suite and WebKit UI suite under Xvfb, then uploads Allure results/report, JUnit XML, traces, and videos as artifacts.

## Configuration

- `BROWSER`: `chromium`, `firefox`, or `webkit` for UI runs. Defaults to `chromium`.
- `AMAZON_BASE_URL`: optional Amazon regional storefront base URL. Defaults to `https://www.amazon.in`.

## Extending The Suite

1. Add UI features under `UI/tests/features/` or API features under `API/tests/features/`.
2. Put new UI actions/selectors in the relevant class under `UI/pages/`; keep selectors encapsulated in the page object.
3. Add step definitions under the matching module's `steps/` directory.
4. For API scenarios, create any order needed by the scenario and store the response ID in its Cucumber World. Do not share mutable IDs between scenarios; each scenario runs independently and may execute in parallel.
5. Use `@ui` or `@api`, plus `@smoke` or `@regression` as appropriate.
6. Run `npx tsc --noEmit` and the relevant npm test command before committing.

## Agent Knowledge

Workspace guidance and customizations live under `.github/`. The `knowledge-curator` agent and `knowledge-refresh` skill help capture durable, verified project learnings in the README or relevant existing instructions, skills, and agents. Repository notes are persistent context for future agents, not automatic model training; verify external facts against current sources when used. No separate knowledge index is required.