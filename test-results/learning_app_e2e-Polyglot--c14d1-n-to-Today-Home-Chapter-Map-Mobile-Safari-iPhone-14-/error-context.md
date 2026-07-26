# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: learning_app_e2e.spec.js >> Polyglot AI Language Learning App E2E Test Suite >> 03. Test Universal Breadcrumb Return navigation to Today Home & Chapter Map
- Location: e2e/learning_app_e2e.spec.js:34:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /開始上課/ }).first()

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Polyglot AI Language Learning App E2E Test Suite', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/')
  6  |   })
  7  | 
  8  |   test('01. Verify Today Focus Home Screen renders cleanly without white patches', async ({ page }) => {
  9  |     await expect(page.locator('body')).toHaveClass(/bg-\[\#0B0C10\]/)
  10 |     await expect(page.getByText('東京咖啡館對話').first()).toBeVisible()
  11 |     await expect(page.getByRole('button', { name: /開始上課/ }).first()).toBeVisible()
  12 |   })
  13 | 
  14 |   test('02. Complete TBLT Task Flow & verify Multi-turn State Machine', async ({ page }) => {
  15 |     await page.getByRole('button', { name: /開始上課/ }).first().click()
  16 | 
  17 |     await expect(page.getByText(/TBLT 第一階段/).first()).toBeVisible()
  18 |     await expect(page.getByText(/任務：東京澀谷咖啡館/).first()).toBeVisible()
  19 | 
  20 |     await page.getByRole('button', { name: '開始任務' }).first().click()
  21 | 
  22 |     await expect(page.getByText(/いらっしゃいませ/).first()).toBeVisible()
  23 | 
  24 |     await page.getByText(/💡 AI 代答與跟讀示範/).first().click()
  25 | 
  26 |     const input = page.getByPlaceholder(/用語音跟我唸/).first()
  27 |     await expect(input).toHaveValue(/おすすめは何ですか/)
  28 | 
  29 |     await page.locator('button:has(svg.lucide-send)').first().click()
  30 | 
  31 |     await expect(page.getByText(/本日限定の抹茶タルト/).first()).toBeVisible({ timeout: 6000 })
  32 |   })
  33 | 
  34 |   test('03. Test Universal Breadcrumb Return navigation to Today Home & Chapter Map', async ({ page }) => {
> 35 |     await page.getByRole('button', { name: /開始上課/ }).first().click()
     |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  36 |     await page.getByRole('button', { name: '開始任務' }).first().click()
  37 | 
  38 |     const homeBreadcrumb = page.getByText('今日首頁').first()
  39 |     await expect(homeBreadcrumb).toBeVisible()
  40 | 
  41 |     const mapBreadcrumb = page.getByText('章節地圖').first()
  42 |     await expect(mapBreadcrumb).toBeVisible()
  43 | 
  44 |     await homeBreadcrumb.click()
  45 |     await expect(page.getByText('東京咖啡館對話').first()).toBeVisible()
  46 |   })
  47 | })
  48 | 
```