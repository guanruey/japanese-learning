import { test, expect } from '@playwright/test'

test.describe('Polyglot AI Language Learning App E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('01. Verify Today Focus Home Screen renders cleanly without white patches', async ({ page }) => {
    await expect(page.locator('body')).toHaveClass(/bg-\[\#0B0C10\]/)
    await expect(page.getByText('東京咖啡館對話').first()).toBeVisible()
    await expect(page.getByRole('button', { name: /開始上課/ }).first()).toBeVisible()
  })

  test('02. Complete TBLT Task Flow & verify Multi-turn State Machine', async ({ page }) => {
    await page.getByRole('button', { name: /開始上課/ }).first().click()

    await expect(page.getByText(/TBLT 第一階段/).first()).toBeVisible()
    await expect(page.getByText(/任務：東京澀谷咖啡館/).first()).toBeVisible()

    await page.getByRole('button', { name: '開始任務' }).first().click()

    await expect(page.getByText(/いらっしゃいませ/).first()).toBeVisible()

    await page.getByText(/💡 AI 代答與跟讀示範/).first().click()

    const input = page.getByPlaceholder(/用語音跟我唸/).first()
    await expect(input).toHaveValue(/おすすめは何ですか/)

    await page.locator('button:has(svg.lucide-send)').first().click()

    await expect(page.getByText(/本日限定の抹茶タルト/).first()).toBeVisible({ timeout: 6000 })
  })

  test('03. Test Universal Breadcrumb Return navigation to Today Home & Chapter Map', async ({ page }) => {
    await page.getByRole('button', { name: /開始上課/ }).first().click()
    await page.getByRole('button', { name: '開始任務' }).first().click()

    const homeBreadcrumb = page.getByText('今日首頁').first()
    await expect(homeBreadcrumb).toBeVisible()

    const mapBreadcrumb = page.getByText('章節地圖').first()
    await expect(mapBreadcrumb).toBeVisible()

    await homeBreadcrumb.click()
    await expect(page.getByText('東京咖啡館對話').first()).toBeVisible()
  })
})
