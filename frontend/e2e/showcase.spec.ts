import { test, expect } from '@playwright/test'

test.describe('MediaPlayer Showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main showcase page', async ({ page }) => {
    await expect(page.getByText('MediaPlayer Theme Showcase')).toBeVisible()
    await expect(page.getByText('Showcase')).toBeVisible()
  })

  test('should navigate between tabs', async ({ page }) => {
    // Test Components tab
    await page.getByText('Components').click()
    await expect(page.getByText('Buttons')).toBeVisible()

    // Test Layout tab
    await page.getByText('Layout').click()
    await expect(page.getByText('Navigation')).toBeVisible()

    // Test Design tab
    await page.getByText('Design').click()
    await expect(page.getByText('Theme', { exact: true })).toBeVisible()
  })

  test('should toggle between light and dark themes', async ({ page }) => {
    // Navigate to Design tab
    await page.getByText('Design').click()

    // Find and click the theme toggle
    const themeToggle = page.getByRole('switch')
    await expect(themeToggle).toBeVisible()

    // Toggle to dark mode
    await themeToggle.click()

    // Verify the toggle state changed
    await expect(themeToggle).toBeChecked()
  })

  test('should change theme names', async ({ page }) => {
    // Navigate to Design tab
    await page.getByText('Design').click()

    // Find theme selector
    const themeSelector = page.getByRole('combobox')
    await expect(themeSelector).toBeVisible()

    // Click to open dropdown
    await themeSelector.click()

    // Select a different theme
    await page.getByText('Neon').click()

    // Verify selection - check the select element value
    const selectElement = page.locator('select').first()
    await expect(selectElement).toHaveValue('Neon')
  })

  test('should display color palette', async ({ page }) => {
    // Navigate to Design tab
    await page.getByText('Design').click()

    // Scroll to color palette section
    await page.getByText('Color Palette').scrollIntoViewIfNeeded()

    // Verify color chips are displayed - look for hex color codes
    const colorChips = page.locator('.MuiBox-root').filter({ hasText: /#[0-9A-F]{6}/i })
    await expect(colorChips.first()).toBeVisible()
  })

  test('should display typography examples', async ({ page }) => {
    // Navigate to Design tab
    await page.getByText('Design').click()

    // Scroll to typography section
    await page.getByText('Typography').scrollIntoViewIfNeeded()

    // Verify typography examples are displayed
    await expect(page.getByText('H1 Heading')).toBeVisible()
    await expect(page.getByText('Body1 — The quick brown fox jumps over the lazy dog.')).toBeVisible()
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('MediaPlayer Theme Showcase')).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('MediaPlayer Theme Showcase')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('MediaPlayer Theme Showcase')).toBeVisible()
  })

  test('should handle logo interactions', async ({ page }) => {
    // Find the logo
    const logo = page.getByText('MediaPlayer').first()
    await expect(logo).toBeVisible()

    // Test logo click
    await logo.click()

    // Test logo hover (if animations are enabled)
    await logo.hover()
  })
})
