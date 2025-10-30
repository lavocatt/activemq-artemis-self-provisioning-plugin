import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';

const username = 'kubeadmin';
const password = process.env.KUBEADMIN_PASSWORD || 'kubeadmin';

test.describe('Console login smoke', () => {
  test('logs in and lands on console', async ({ page }) => {
    await login(page, username, password);
    await expect(page).toHaveURL(/localhost/, { timeout: 30000 });
  });
});

test.describe('Create Broker via UI', () => {
  test('logs in, navigates to brokers, creates a broker and then deletes it', async ({
    page,
  }) => {
    // Login
    await login(page, username, password);

    // Navigate to all-namespaces brokers page
    await page.goto('/k8s/all-namespaces/brokers', {
      waitUntil: 'load',
    });
    await page.waitForLoadState('domcontentloaded');

    // Ensure Brokers page loaded - wait for heading
    await expect(
      page.locator('h1, [data-test="resource-title"]', { hasText: /Brokers/i }),
    ).toBeVisible({ timeout: 30000 });

    // Click Create Broker (button or anchor)
    const createBrokerButton = page
      .locator('button, a')
      .filter({ hasText: /^Create Broker$/i })
      .first();
    await createBrokerButton.scrollIntoViewIfNeeded();
    await createBrokerButton.click();

    // Fill CR Name with a unique value
    const brokerName = `e2e-broker-${Date.now()}`;
    const nameInput = page.locator(
      '#horizontal-form-name, input[name="horizontal-form-name"]',
    );
    await expect(nameInput).toBeVisible();
    await nameInput.clear();
    await nameInput.fill(brokerName);

    // Click Create
    await page
      .locator('button')
      .filter({ hasText: /^Create$/i })
      .click();

    // Navigate to all-namespaces brokers page to check the status
    await page.goto('/k8s/all-namespaces/brokers', {
      waitUntil: 'load',
    });
    await page.waitForLoadState('domcontentloaded');

    // Wait for broker to be there
    await expect(
      page.locator('tr').filter({ hasText: brokerName }),
    ).toBeVisible({
      timeout: 300000,
    });

    // Navigate to broker details page
    await page.goto(`/k8s/ns/default/brokers/${brokerName}`, {
      waitUntil: 'load',
    });
    await page.waitForLoadState('domcontentloaded');

    // Check we are on the details page - wait for the heading containing the broker name
    await expect(page.locator('h1', { hasText: brokerName })).toBeVisible({
      timeout: 30000,
    });

    // click on the kebab toggle
    const kebabToggle = page.locator('[data-testid="broker-toggle-kebab"]');
    await expect(kebabToggle).toBeVisible();
    await kebabToggle.click();

    // click on delete broker
    const deleteLink = page
      .locator('a, button')
      .filter({ hasText: /^Delete broker$/i });
    await expect(deleteLink).toBeVisible();
    await deleteLink.click();

    // click on delete in the modal
    const deleteButton = page
      .locator('button.pf-m-danger')
      .filter({ hasText: /^Delete$/i });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Check broker is deleted. We should be on the brokers list page after deletion.
    await expect(
      page
        .locator('h1, [data-test="resource-title"]')
        .filter({ hasText: /Brokers/i }),
    ).toBeVisible();
    await expect(page.locator('body')).not.toContainText(brokerName, {
      timeout: 30000,
    });
  });
});
