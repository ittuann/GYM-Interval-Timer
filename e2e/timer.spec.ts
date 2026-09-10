import { expect, test } from '@playwright/test'

test('renders the timer and switches rest presets', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toHaveText('Gym Interval Timer')
  await expect(page.locator('.tabular-nums')).toHaveText('01:00')
  await expect(page.getByText('Active')).toBeVisible()

  await page.getByRole('button', { name: '90s' }).click()
  await expect(page.locator('.tabular-nums')).toHaveText('01:30')

  await page.getByRole('button', { name: 'Reset All Sets' }).click()
  await expect(page.getByText('Active')).toBeVisible()
})
