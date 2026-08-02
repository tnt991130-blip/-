<div align="center">

# 王宥崴｜個人作品集

**對程式充滿熱情的高中生**

[瀏覽網站](https://wei20100818.github.io/self-introduction-website/) · [功能特色](#功能特色) · [本機開發](#本機開發) · [部署到-github-pages](#部署到-github-pages)

</div>

---

這是一個以 React、Vite 與 TypeScript 製作的單頁式個人作品集網站，展示三個已完成的網頁作品，並提供繁體中文／英文、深淺模式與可用的聯絡表單。

> 正式網站：<https://wei20100818.github.io/self-introduction-website/>

## 功能特色

- 繁體中文與英文切換，作品名稱與說明固定保留中文。
- 完整 light／dark 模式，使用者偏好會儲存在瀏覽器。
- 響應式版面與手機導覽選單，支援鍵盤操作與清楚的焦點樣式。
- 三張模擬瀏覽器視窗的作品卡片，安全地以新分頁開啟外部網站。
- 具欄位驗證的 mailto 聯絡表單；不會假稱郵件已寄出。
- 低干擾的首頁光暈與粒子效果，支援 `prefers-reduced-motion`。
- SEO、Open Graph、favicon、robots、sitemap、404 與 GitHub Pages 自動部署流程。

## 使用技術

| 類別 | 技術 |
| --- | --- |
| 前端 | React 19、Vite 8、TypeScript |
| 動畫 | Framer Motion |
| 樣式 | CSS Modules、全域設計變數 |
| 圖示 | Lucide React |
| 測試 | Vitest、Testing Library |
| 部署 | GitHub Pages、GitHub Actions |

## 本機需求

- Node.js 22 或更新版本
- npm（此專案使用 `package-lock.json`）

## 安裝與啟動

```bash
git clone https://github.com/wei20100818/self-introduction-website.git
cd self-introduction-website
npm install
npm run dev
```

開發伺服器啟動後，請開啟終端機顯示的網址；通常為：

```text
http://localhost:5173/self-introduction-website/
```

## 品質檢查與 production build

```bash
npm run lint
npm run test
npm run build
npm run preview
```

`npm run preview` 用於查看 production build；GitHub Pages 實際網站會部署在專案路徑 `/self-introduction-website/`。

## 專案結構

```text
src/
├─ animations/       # Framer Motion 動畫規格
├─ components/       # 共用、版面、UI 與背景效果元件
├─ data/             # 個人資料與作品資料
├─ hooks/            # 主題、語言、目前區塊等 hooks
├─ i18n/             # 中英文翻譯資料
├─ sections/         # 首頁、關於我、作品、聯絡區塊
├─ styles/           # 全域樣式與設計變數
├─ types/            # TypeScript 型別
└─ utils/            # mailto 與公開資源工具

public/
├─ images/profile/   # 大頭貼
├─ images/projects/  # 作品截圖
├─ images/og-preview.png
├─ 404.html
├─ favicon.svg
├─ robots.txt
└─ sitemap.xml
```

## 修改內容與圖片

| 項目 | 位置 |
| --- | --- |
| 姓名、標語、Email、作品資料 | `src/data/profile.ts` |
| 作品標題、說明、網址 | `src/data/profile.ts` |
| 中文／英文介面文案 | `src/i18n/translations.ts` |
| 色彩、間距、陰影、動畫變數 | `src/styles/tokens.css` |
| 大頭貼 | `public/images/profile/profile.png` |
| 作品截圖 | `public/images/projects/` |
| 社群分享圖 | `public/images/og-preview.png` |
| SEO、canonical、Open Graph | `index.html` |

更換圖片後，若副檔名或檔名不同，請同步更新 `src/data/profile.ts` 中對應的圖片路徑。

## 部署到 GitHub Pages

專案已包含 GitHub Actions workflow：`.github/workflows/deploy.yml`。

1. 在 GitHub 建立 repository：`self-introduction-website`。
2. 將程式推送到 `main` branch。
3. 開啟 repository 的 **Settings → Pages**。
4. 在 **Build and deployment → Source** 選擇 **GitHub Actions**。
5. 到 **Actions** 頁面等待「Deploy to GitHub Pages」workflow 成功完成。
6. 部署完成後開啟：<https://wei20100818.github.io/self-introduction-website/>。

> `vite.config.ts` 已設定 GitHub Pages 專案路徑，不要改成 `/`，否則正式網站的圖片與 JS/CSS 可能無法載入。

## 贊助付款（綠界 + Vercel）

網站前端維持部署在 GitHub Pages；付款簽章與綠界通知則由同一個專案中的 Vercel Functions 處理。正式金鑰不可放進 GitHub、前端程式或 `.env.example`。

1. 在 Vercel 匯入此 GitHub repository，先部署一次，取得固定的 `https://<project>.vercel.app` 網址。
2. 在 Vercel 專案的 Environment Variables 設定下列值後重新部署：

   ```text
   SITE_ORIGIN=https://wei20100818.github.io/self-introduction-website
   API_ORIGIN=https://<project>.vercel.app
   ECPAY_ENV=stage
   ECPAY_MERCHANT_ID=<綠界測試或正式特店編號>
   ECPAY_HASH_KEY=<綠界 HashKey>
   ECPAY_HASH_IV=<綠界 HashIV>
   ```

3. 到 GitHub repository 的 **Settings → Secrets and variables → Actions → Variables** 新增：

   ```text
   VITE_PAYMENT_API_ORIGIN=https://<project>.vercel.app
   ```

4. 重新執行 GitHub Pages 部署。完成後，贊助區塊會將表單送到 Vercel，再由 Vercel 建立綠界信用卡付款訂單。
5. 先以 `ECPAY_ENV=stage` 測試付款、回呼與感謝頁。確認綠界正式商店與信用卡付款方式已開通後，將它改為 `production`，並換成正式環境金鑰。

付款完成的最終狀態以 `api/ecpay-callback.js` 驗證過的綠界幕後通知為準；目前會寫入 Vercel log，但不會保存贊助紀錄。若未來要顯示贊助清單、寄送收據或追蹤交易，應再加入資料庫。

## 授權

本專案為王宥崴的個人作品集網站。
