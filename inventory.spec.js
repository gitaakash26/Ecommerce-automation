const { test, expect } = require('../../fixtures/pageFixtures');

test.describe('Product inventory', () => {
  test.beforeEach(async ({ loggedInPage }) => {
    // loggedInPage fixture already left us on /inventory.html
  });

  test('all six products are listed with a name and price', async ({ loggedInPage, inventoryPage }) => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);

    const names = await inventoryPage.getDisplayedNames();
    const prices = await inventoryPage.getDisplayedPrices();

    expect(names).toHaveLength(6);
    prices.forEach((price) => expect(price).toBeGreaterThan(0));
  });

  test('sorting by price low to high orders items correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getDisplayedPrices();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });

  test('sorting by name Z to A orders items correctly', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getDisplayedNames();
    const sorted = [...names].sort().reverse();

    expect(names).toEqual(sorted);
  });

  test('adding an item updates the cart badge', async ({ inventoryPage }) => {
    expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('removing an item from the product page updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeFromCartByName('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(0);
  });
});
