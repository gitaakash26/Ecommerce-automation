const { test, expect } = require('../../fixtures/pageFixtures');
const { shippingInfo } = require('../../utils/testData');

test.describe('Cart and checkout flow', () => {
  test('cart reflects items added on the product page', async ({ loggedInPage, inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Fleece Jacket');
    await inventoryPage.goToCart();

    expect(await cartPage.getItemCount()).toBe(2);
    const names = await cartPage.getItemNames();
    expect(names).toEqual(expect.arrayContaining(['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket']));
  });

  test('checkout requires all shipping fields', async ({ loggedInPage, inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.continueButton.click(); // submit with empty fields
    await expect(checkoutPage.errorMessage).toBeVisible();
  });

  test('completing checkout shows the correct totals and a confirmation message', async ({
    loggedInPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.addToCartByName('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillShippingInfo(shippingInfo);

    const totals = await checkoutPage.getTotals();
    expect(totals.total).toBeCloseTo(totals.itemTotal + totals.tax, 2);

    await checkoutPage.finish();
    expect(await checkoutPage.getConfirmationText()).toBe('Thank you for your order!');
  });
});
