# 🚀 GitHub Push Checklist

Follow these steps to successfully push your project to GitHub and avoid common errors.

### 1. Cleanup Large Files (CRITICAL)
GitHub has a 100MB limit. Your project contained two 240MB videos (`ext.mp4` and `int.mp4`) that would block your push.
- [ ] **Run the cleanup script**:
  ```bash
  python cleanup_for_github.py
  ```
  *This will remove the large videos and the redundant `SIIDSTARC-main` folder.*

### 2. Verify Your Repository
- [ ] **Initialize Git** (if not already done):
  ```bash
  git init
  ```
- [ ] **Add your files**:
  ```bash
  git add .
  ```
- [ ] **Check for hidden large files**:
  If `git add` takes a very long time, you might still have large files (like `node_modules` or `venv` if they aren't ignored). Ensure your `.gitignore` is working.

### 3. Setup GitHub Remote
- [ ] **Create a new repository** on GitHub.
- [ ] **Link it to your local project**:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/siid-flash-platform.git
  git branch -M main
  ```

### 4. Push Your Work
- [ ] **Commit your changes**:
  ```bash
  git commit -m "chore: prepare project for github deployment"
  ```
- [ ] **Push to master/main**:
  ```bash
  git push -u origin main
  ```

---

## 🛠️ Common Errors & Fixes

### Error: `File public/images/ext.mp4 is 230.16 MB; this exceeds GitHub's file size limit of 100.00 MB`
**Fix**: Ensure you ran the `cleanup_for_github.py` script. If you already committed the large file, you might need to undo the commit or use [Git LFS](https://git-lfs.com/).

### Error: `ERESOLVE unable to resolve dependency tree`
**Fix**: I have removed `pnpm-lock.yaml` to prevent conflicts with `npm`. If you see this error, run:
```bash
npm install --legacy-peer-deps
```

### Error: `Support for the experimental syntax 'importAttributes' isn't currently enabled` 
**Fix**: This is often a Next.js version mismatch. I've updated `package.json` to a stable configuration, but if it persists, try:
```bash
npm update next
```

### Deployment (Vercel/GitHub Pages)
- **Vercel**: Recommended for this project. It will automatically detect the Next.js app and deploy it.
- **Environment Variables**: Add `BACKEND_URL` and `NEXT_PUBLIC_BACKEND_URL` in the Vercel Dashboard under **Settings → Environment Variables**.
