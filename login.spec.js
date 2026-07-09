const { test, expect } = require('../../fixtures/pageFixtures');
const { users } = require('../../utils/testData');

test.describe('Login', () => {
  test('standard user can log in and lands on the inventory page', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('locked out user sees an error and stays on the login page', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('locked out');
  });

  test('empty credentials are rejected', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain('Username is required');
  });

  test('wrong password shows a generic error, not which field was wrong', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, 'not_the_real_password');

    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('do not match');
  });
});
