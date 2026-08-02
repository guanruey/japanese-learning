# 📱 App Store Connect 提交與元數據規格說明書 (Metadata & Privacy Manifest)

---

## 📄 1. App 基本元數據 (Basic Metadata)

| 欄位名稱 (Field) | 內容 (Content) |
| :--- | :--- |
| **App 名稱 (App Name)** | 日語學習 - JLPT N5/N4 極簡學術 AI 導師 |
| **副標題 (Subtitle)** | FSRS 記憶曲線與母語遷移診斷 |
| **主要類別 (Primary Category)** | 教育 (Education) |
| **次要類別 (Secondary Category)** | 工具 (Utilities) |
| **Bundle ID** | `com.japanese.learning` |
| **SKU** | `JLPT_SAAS_V1_2026` |
| **預設語言 (Default Language)** | 繁體中文 (zh-TW) / 英文 (en-US) |

---

## 📝 2. App 描述與關鍵字 (Description & Keywords)

### 關鍵字 (Keywords, 上限 100 字元)
`日文,JLPT,N5,N4,日語學習,單字,文法,FSRS,語音練習,日文檢定,AI對話,學術極簡`

### App 簡介描述 (App Description)
```text
專為 JLPT N5 / N4 考檢設計的高階日語學習 SaaS 平台。
我們捨棄了繁雜的遊戲化介面，採用 Academic Minimalist (極簡學術風) 設計語言，結合專業認知科學演算法，為您打造最高效的日語學習體驗。

【核心特色與科學引擎】
1. FSRS 記憶演算法：
   動態計算 Stability (記憶穩定度) 與 Difficulty (難度)，精準排定複習間隔，告別死記硬背。

2. Weakness Engine 繁體中文母語遷移弱點診斷：
   精準捕捉台灣/香港學員最常犯的助詞 (は/が、に/で) 混淆與時態錯誤，最多提供前三大精準處方，不造成認知負擔。

3. Today Decision Engine 每日最佳學習導航：
   自動綜合分析 FSRS 到期卡片、弱點處方與 TBLT (Task-Based Language Teaching) 任務進度，為您排定每日最高回報的學習行動。

4. AI 語音對話與發音即時評估：
   透過 Cloud Run 資安保護中轉層與 AI 語音互動，打造沉浸式真實情境練習。

5. 現代極簡視覺與 Haptics 觸覺回饋：
   優雅的高對比學術風格，搭配細緻的震動回饋，讓每次複習都沉穩專注。
```

---

## 🔒 3. 隱私條款與權限宣告 (Privacy & Permissions)

### App 權限宣告說明 (Info.plist Keys)
- `NSMicrophoneUsageDescription`:
  > 本應用程式需要使用您的麥克風，以進行 JLPT 日語發音練習與 AI 語音對話演練。
- `NSSpeechRecognitionUsageDescription`:
  > 本應用程式需要語音辨識權限，以實時分析您的日語發音正確度與口語流利度。
- `ITSAppUsesNonExemptEncryption`:
  > `false` (未採用非標準之豁免外加密法)。

### App 隱私權聲明 (App Privacy Details)
- **收集資料類型 (Data Collected)**:
  - 帳號識別碼 (User ID / Email) - 用於 Auth 登入與學習進度雲端同步。
  - 學習使用數據 (Product Interaction) - 用於 FSRS 記憶曲線與弱點演算法計算。
  - 語音音訊 (Audio Data) -僅於即時語音對話時傳輸，不留存於第三方資料庫。
- **資料追蹤 (Data Tracking)**:
  - 本 App **絕不**進行跨 App 或跨網站的廣告追蹤 (No Cross-App Tracking)。

---

## 🌐 4. URL 與支援連結 (URLs)

- **隱私權政策網址 (Privacy Policy URL)**: `https://lanai-40995824876.asia-east1.run.app/privacy.html`
- **技術支援網址 (Support URL)**: `https://lanai-40995824876.asia-east1.run.app/support.html`
- **行銷網址 (Marketing URL)**: `https://lanai-40995824876.asia-east1.run.app`

---

## 🎨 5. App Store 截圖規格規範 (Screenshot Specifications)

1. **6.7" iPhone Display (iPhone 16 Pro Max / 15 Pro Max)**: `1290 x 2796` pixels
2. **6.5" iPhone Display (iPhone 11 Pro Max / XS Max)**: `1242 x 2688` pixels
3. **5.5" iPhone Display (iPhone 8 Plus)**: `1242 x 2208` pixels

### 建議五張宣傳截圖主題：
- Screenshot 1: **【Today Dashboard】** 每日科學學習導航與最佳行動建議
- Screenshot 2: **【FSRS Flashcards】** 認知科學記憶曲線與難度動態調整
- Screenshot 3: **【Weakness Prescriptions】** 繁中母語遷移錯誤診斷與精準處方
- Screenshot 4: **【AI Tutor Hub】** 沉浸式情境口語對話與即時糾錯
- Screenshot 5: **【Academic Minimalist Style】** 極簡無雜訊的沉浸式學習介面
