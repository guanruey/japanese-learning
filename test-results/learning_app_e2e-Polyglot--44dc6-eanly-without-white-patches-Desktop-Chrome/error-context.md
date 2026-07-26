# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: learning_app_e2e.spec.js >> Polyglot AI Language Learning App E2E Test Suite >> 01. Verify Today Focus Home Screen renders cleanly without white patches
- Location: e2e/learning_app_e2e.spec.js:8:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('東京咖啡館對話').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('東京咖啡館對話').first()

```

```yaml
- text: "[plugin:vite:react-babel] /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/src/components/StatsDashboard.jsx: Missing semicolon. (215:3) 218 | }`} /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/src/components/StatsDashboard.jsx:215:3 213| </div> 214| </div> 215| ) b.unlocked | ^ 216| ? 'bg-white dark:bg-slate-800 border-[#EAEAEA] dark:border-slate-700' 217| : 'bg-slate-100/50 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-50' at constructor (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:365:19) at JSXParserMixin.raise (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:6616:19) at JSXParserMixin.semicolon (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:6912:10) at JSXParserMixin.parseReturnStatement (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13160:12) at JSXParserMixin.parseStatementContent (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12815:21) at JSXParserMixin.parseStatementLike (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12784:17) at JSXParserMixin.parseStatementListItem (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12764:17) at JSXParserMixin.parseBlockOrModuleBlockBody (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13333:61) at JSXParserMixin.parseBlockBody (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13326:10) at JSXParserMixin.parseBlock (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13314:10) at JSXParserMixin.parseFunctionBody (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12117:24) at JSXParserMixin.parseFunctionBodyAndFinish (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12103:10) at /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13462:12 at JSXParserMixin.withSmartMixTopicForbiddingContext (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12420:14) at JSXParserMixin.parseFunction (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13461:10) at JSXParserMixin.parseExportDefaultExpression (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13924:19) at JSXParserMixin.parseExport (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13845:25) at JSXParserMixin.parseStatementContent (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12895:27) at JSXParserMixin.parseStatementLike (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12784:17) at JSXParserMixin.parseModuleItem (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12761:17) at JSXParserMixin.parseBlockOrModuleBlockBody (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13333:36) at JSXParserMixin.parseBlockBody (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:13326:10) at JSXParserMixin.parseProgram (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12639:10) at JSXParserMixin.parseTopLevel (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:12629:25) at JSXParserMixin.parse (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:14505:25) at parse (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/parser/lib/index.js:14539:38) at parser (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/core/lib/parser/index.js:41:34) at parser.next (<anonymous>) at normalizeFile (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/core/lib/transformation/normalize-file.js:51:37) at normalizeFile.next (<anonymous>) at run (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/core/lib/transformation/index.js:22:50) at run.next (<anonymous>) at transform (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/core/lib/transform.js:22:33) at transform.next (<anonymous>) at step (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:261:32) at /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:273:13 at async.call.result.err.err (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:223:11) at /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:189:28 at /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/@babel/core/lib/gensync-utils/async.js:67:7 at /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:113:33 at step (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:287:14) at /Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:273:13 at async.call.result.err.err (/Users/grantpromax128g/Library/CloudStorage/GoogleDrive-guanruey@gmail.com/我的雲端硬碟/06_日語學習/japanese-learning/node_modules/gensync/index.js:223:11 Click outside, press Esc key, or fix the code to dismiss. You can also disable this overlay by setting"
- code: server.hmr.overlay
- text: to
- code: "false"
- text: in
- code: vite.config.js
- text: .
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
> 10 |     await expect(page.getByText('東京咖啡館對話').first()).toBeVisible()
     |                                                     ^ Error: expect(locator).toBeVisible() failed
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
  35 |     await page.getByRole('button', { name: /開始上課/ }).first().click()
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