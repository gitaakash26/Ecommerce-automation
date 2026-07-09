# Playwright E-Commerce Test Automation

End-to-end and API test suite for [SauceDemo](https://www.saucedemo.com), a sample
e-commerce site commonly used for QA practice. Built with Playwright and
JavaScript, using the Page Object Model to keep test logic separate from
locators and page interactions.

## What's covered

- **Login** – valid login, locked-out user, empty credentials, wrong password
- **Inventory** – product listing, sorting (price and name), add/remove from cart
- **Cart & checkout** – adding multiple items, required-field validation, full
  checkout flow with total/tax verification and order confirmation
- **API smoke tests** – GET/POST/PUT/DELETE against a REST sandbox, run
  through Playwright's `request` fixture without spinning up a browser

## Tech stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- JavaScript (CommonJS)
- Page Object Model with custom fixtures (`fixtures/pageFixtures.js`) for
  page objects and a pre-authenticated session, so specs don't repeat login
  boilerplate
- GitHub Actions for CI, with the HTML report uploaded as a build artifact

## Project structure

```
playwright-ecommerce-automation/
├── fixtures/
│   └── pageFixtures.js        # extends base test with page objects + logged-in state
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/
│   ├── ui/
│   │   ├── login.spec.js
│   │   ├── inventory.spec.js
│   │   └── cartAndCheckout.spec.js
│   └── api/
│       └── api.spec.js
├── utils/
│   └── testData.js
├── .github/workflows/playwright.yml
├── playwright.config.js
└── package.json
```

## Getting started

```bash
git clone <your-repo-url>
cd playwright-ecommerce-automation
npm install
npx playwright install
cp .env.example .env   # optional, defaults already work against SauceDemo
```

## Running tests

```bash
npm test                 # everything, all browsers defined in playwright.config.js
npm run test:ui          # UI suite only
npm run test:api         # API suite only
npm run test:chrome      # chromium project only
npm run test:headed      # watch it run in a real browser window
npm run test:debug       # step through with the Playwright inspector
npm run report           # open the last HTML report
```

## Design notes

- Page objects only expose actions and getters (`login()`, `getCartCount()`,
  etc.) — assertions live in the specs, not the page objects, so page classes
  stay reusable across different test scenarios.
- The `loggedInPage` fixture handles the login flow once per test instead of
  repeating it in every `test.beforeEach`, which was previously slowing the
  suite down and duplicating the same three lines everywhere.
- Add-to-cart/remove-from-cart locators are built from the product name
  (`add-to-cart-sauce-labs-backpack`) instead of hardcoding every button,
  since SauceDemo generates these ids predictably from the product name.
- Retries are only enabled on CI (`playwright.config.js`) — locally a failure
  should mean something broke, not get silently retried away.

## Possible next steps

- Add visual regression checks with `toHaveScreenshot()`
- Parameterize the checkout suite across all three demo users
  (`standard_user`, `problem_user`, `performance_glitch_user`)
- Wire up Allure reporting for richer CI reports

## Why SauceDemo / reqres.in

Both are public sandboxes built for practicing test automation, so the suite
can be cloned and run by anyone without needing real credentials or a backend
to stand up.
