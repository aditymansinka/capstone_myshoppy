# myShoppy (Expo) — README

This README explains how to install, run, and troubleshoot the myShoppy Expo app included in this archive.

**Important**: these instructions assume you're on Windows (PowerShell) and the project root is the folder that contains `package.json` and `db.json` (path: `New folder/myShoppy`).

**Project overview**
- React Native (Expo) app with a local json-server dataset (`db.json`).
- Uses `CartContext` for cart state, and a small `SimpleImage` component for resilient image rendering.

**Files you will use**
- `package.json` — dependency list and npm scripts.
- `db.json` — dataset used by `json-server`.
- `App.tsx` — app entry.
- `src/components/SimpleImage.tsx` — image with fallback.
- `src/context/CartContext.tsx` — cart management (shows add-to-cart message).
- `src/screens/CartScreen.tsx` — cart + checkout UI.

## Prerequisites
- Node.js LTS (recommended v18 or v20). Install from https://nodejs.org/
- Git (optional, for cloning). Install from https://git-scm.com/
- Expo Go (on your Android/iOS device) or a simulator/emulator. See https://docs.expo.dev/get-started/installation/
- (Optional) `json-server` — we use `npx` so global install is not required.

## Quick start — Unzip, install, run

1) Unzip the archive to a folder and open a PowerShell terminal in the project folder (the folder with `package.json` and `db.json`):

```powershell
cd "C:\path\to\your\extracted\folder\New folder\myShoppy"
```

2) Install dependencies:

```powershell
npm install
# or: yarn install
```

3) Start the local JSON API (json-server). The project expects port 3001 in some configs — use 3001 to be safe.

```powershell
npx json-server --watch db.json --port 3001
```

Leave that terminal running (json-server prints available endpoints: `/products`, `/categories`, ...).

4) Start Expo (Metro bundler) in a separate terminal. Use `--clear` the first time to avoid cached errors:

```powershell
npx expo start --clear
```

Expo will open a developer UI in the browser. You can:
- Scan the QR code with Expo Go (Android) or the Camera app (iOS) if using Expo Go.
- Press `w` in the terminal or click `Run in web browser` to open the web version.
- Press `a` to open on a connected Android emulator/device (or choose from the Expo UI).

## Reproduction checklist (what to try)
- Open the app → go to Categories → choose a category → Add a product (press "Add to Cart"). You should see a short success notification (Android toast or Alert on other platforms).
- Tap the BottomTab → Cart. Cart items should render with images (or fallback icon) and quantity controls.
- Press `-` on quantity 1 → you should see a confirmation prompt before the item is removed.

## Common issues & fixes

- ReferenceError: "Property 'FallbackImage' doesn't exist"
  - Cause: A stale build or an old compiled bundle referring to a removed component. Fix:
    1. Fully stop Expo.
    2. Run `npx expo start --clear` to rebuild bundles and clear Metro cache.
    3. Reload device/web.

- Port already in use for json-server (EADDRINUSE)
  - Either stop the process using the port or run json-server on a different port, and update `src/api/productsApi.ts` accordingly. Use port `3001` as shown above.

- Expo SDK / React / React Native version mismatch
  - If you get runtime red-screens that mention mismatched versions, run `npx expo doctor` to check compatibility. Two options:
    1. Upgrade your dependencies to match the Expo SDK (recommended when possible): follow the output of `expo doctor` or run `npx expo upgrade` and follow instructions.
    2. Use an Expo dev client built for your exact native dependencies. See https://docs.expo.dev/development/build/

- Image load failures on web
  - The app uses fixed Unsplash URLs for some products and a local fallback UI when a remote image fails. If an image is blank on web, open the browser console (F12) to check network failures or CORS issues. The `SimpleImage` component will show a placeholder icon when remote loading fails.

## Helpful commands (copiable)

```powershell
# Install deps
npm install

# Start json-server on port 3001
npx json-server --watch db.json --port 3001

# Start Expo dev server (clear cache)
npx expo start --clear

# Start web directly
npx expo start --web

# Check Expo project health
npx expo doctor

# Optional: run on Android emulator if configured
npx expo start
# then press 'a' in the terminal or click 'Run on Android device/emulator'
```

## Notes about the cart messages and confirmations
- The cart success message is shown from `src/context/CartContext.tsx`: Android uses `ToastAndroid`, other platforms use `Alert.alert`.
- The Cart screen (`src/screens/CartScreen.tsx`) now prompts before removing an item when decreasing quantity from 1 → 0. The trash icon still triggers a full-item confirmation.

## If something still goes blank
1. Re-run `npx expo start --clear` and open the browser devtools console (web) or watch Metro logs (terminal).
2. Copy the first red error stack you see and paste it into an issue or here — I can interpret it and apply a direct fix.

## Next steps / optional improvements
- Add a small in-app toast banner for non-blocking messages on web/iOS instead of `Alert` dialogs.
- Improve image caching / use `expo-image` for better performance.
- Add unit tests for `CartContext` behavior.

---
If you'd like, I can now: (A) add an in-app toast and wire it to `addToCart`, or (B) add a small script to launch json-server + Expo in parallel. Tell me which. 
