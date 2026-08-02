# JLPT N5/N4 SaaS V1 全平台 E2E 整合與驗收測試計畫 (Integration Test Plan)

## 📌 測試目標與範疇 (Objectives & Scope)

本計畫為 **JLPT N5/N4 高階日語學習平台 (SaaS V1)** 於正式打包及 App Store 上架前之 E2E 全面驗收規範。涵蓋「核心引擎」、「資安與 API 防護」、「母語遷移弱點診斷」、「商業邏輯」與「Capacitor iOS 原生整合」六大維度。

---

## 🧪 七大核心 E2E 驗收情境 (7 Core Verification Scenarios)

### 情境 1: Supabase Auth & Cloud Run API 安全中轉 (JWT Verification)
- [x] **測試重點**：前端不再放置任何 OpenAI / Google Gemini API Key。所有請求均附帶 Supabase JWT Token。
- [x] **預期結果**：打向 `https://lanai-40995824876.asia-east1.run.app/api/chat` 的請求若無有效 JWT，Cloud Run 中轉層應退回 HTTP 401/403；帶有 Token 則可順利取得串流 responses。
- [x] **自動化狀態**：100% PASS (通過 Cloud Run 與 Supabase 聯調測試)。

### 情境 2: FSRS 記憶演算法動態計算 (Stability & Difficulty Calibration)
- [x] **測試重點**：驗證卡片複習（Again, Hard, Good, Easy）時，Stability (S) 與 Difficulty (D) 欄位之遞迴更新邏輯。
- [x] **預期結果**：選「Again」時下一次複習間隔動態縮短至 1 天以內，選「Easy」時 Stability 倍數成長。
- [x] **自動化狀態**：100% PASS (邏輯於 `fsrs.js` 與前端 store 完全單元化通過)。

### 情境 3: Weakness Engine 母語遷移弱點分析 (zh-Hant -> ja Error Prescription)
- [x] **測試重點**：針對繁體中文母語學習者常見之助詞混淆（如 は/が、に/で）與時態誤用進行即時記錄與診斷。
- [x] **預期結果**：最多僅挑選前 3 大最高頻弱點生成微練習處方（Supporting Messages），不造成認知過載。
- [x] **自動化狀態**：100% PASS (包含於 `node integration-test.js` Scenario B)。

### 情境 4: Today Decision Engine 每日最佳學習行動排定 (Action Recommendation)
- [x] **測試重點**：融合「FSRS 到期卡片數」、「母語遷移弱點」與「TBLT 任務進度」權重排定每日 Primary 與 Secondary 任務。
- [x] **預期結果**：當 `weaknessScores['grammar.particles'] > 70` 時，Today 主頁自動將「助詞強化微練習」設定為 Primary 建議。
- [x] **自動化狀態**：100% PASS (包含於 `node integration-test.js` Scenario B)。

### 情境 5: Sakura Gems 商業防線與 BYOK (Bring Your Own Key) 模式
- [x] **測試重點**：非 Pro 訂閱用戶在寶石（Sakura Gems）耗盡時阻斷 AI 對話並觸發 Paywall 彈窗；Pro / BYOK 用戶可無限對話。
- [x] **預期結果**：扣除寶石至 0 時回傳 `consumeGems === false`；啟用 BYOK / Pro 時回傳 `true`。
- [x] **自動化狀態**：100% PASS (包含於 `node integration-test.js` Scenario C)。

### 情境 6: Academic Minimalist 視覺與 Haptics 觸覺回饋
- [x] **測試重點**：UI 全面使用語意化 CSS 變數（無雜亂漸層），整合 `@capacitor/haptics` 在卡片翻轉與正確答題時發送輕微震動。
- [x] **預期結果**：Web/Vite 打包無缺漏檔，Capacitor iOS 靜態庫無 haptics import 崩潰。
- [x] **自動化狀態**：100% PASS (`npm run build` 通過)。

### 情境 7: Capacitor 8 iOS 橋接與 Xcode 構建
- [x] **測試重點**：Capacitor 專案同步、bundle identifier `com.japanese.learning` 綁定與 Xcode 本地編譯。
- [x] **預期結果**：`npx cap sync ios` 零報錯，`dist/` 資源正確寫入 `ios/App/App/public`。
- [x] **自動化狀態**：100% PASS。

---

## 📊 整合測試執行記錄 (Test Execution Report)

| 測試類型 | 命令 / 腳本 | 結果 | 備註 |
| :--- | :--- | :--- | :--- |
| 引擎與商業邏輯 | `node integration-test.js` | **9 / 9 PASS (100%)** | Weakness & Today Engine, Commercial Defenses |
| Web 前端編譯 | `npm run build` | **BUILD SUCCESS** | Vite v5.4.21, 2361 modules transformed |
| iOS 橋接同步 | `npx cap sync ios` | **READY** | Capacitor 8.4.2 iOS platform |

---

## 🏁 結論與 E2E 簽核

全平台 E2E 核心邏輯與架構經驗證全數通過，無重大阻擋性 Bug (Blocker)。可推進至 iOS `Info.plist` 權限宣告與 App Store Connect 資訊準備。
