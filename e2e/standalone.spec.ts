import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('isa_language', 'de'));
  await page.goto('/presentation.html');
  await expect(page.getByTestId('station-nav-project')).toBeVisible();
});

test('latest process, collapsible sidebar and Telegram section', async ({ page }) => {
  await expect(page.getByTestId('onboarding-project-visual')).toBeVisible();
  await page.getByTestId('toggle-sidebar').click();
  await expect(page.getByTestId('show-sidebar-bottom')).toBeVisible();
  await page.getByTestId('show-sidebar-bottom').click();
  await page.getByTestId('station-nav-hub').click();
  await expect(page.getByTestId('onboarding-telegram-channel')).toBeVisible();
  await expect(page.getByTestId('onboarding-hub-visual')).toBeVisible();
  await page.getByTestId('station-nav-accounts').click();
  await expect(page.getByText('Tripletex').first()).toBeVisible();
  await expect(page.getByText('Apple Developer').first()).toBeVisible();
  await expect(page.getByText('Senior-Präsentation')).toHaveCount(0);
});

test('answers remain local through reload and language change', async ({ page }) => {
  await page.getByRole('button', { name: /Wer koordiniert die Kundentests/ }).click();
  await page.getByTestId('onboarding-test-owner').fill('Testkoordinator');
  await page.getByRole('button', { name: 'Fertig' }).click();
  await page.reload();
  await page.getByRole('button', { name: /Wer koordiniert die Kundentests/ }).click();
  await expect(page.getByTestId('onboarding-test-owner')).toHaveValue('Testkoordinator');
  await page.getByRole('button', { name: 'Fertig' }).click();
  await page.getByRole('button', { name: 'RU', exact: true }).click();
  await expect(page.getByText('Три вопроса к Исе')).toBeVisible();
});
