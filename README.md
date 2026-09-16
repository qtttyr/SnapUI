<div align="center">

<br />

```
  ██████╗ ███╗   ██╗ █████╗ ██████╗ ██╗██╗   ██╗
 ██╔════╝ ████╗  ██║██╔══██╗██╔══██╗██║██║   ██║
 ╚█████╗  ██╔██╗ ██║███████║██████╔╝██║██║   ██║
  ╚═══██╗ ██║╚██╗██║██╔══██║██╔═══╝ ██║██║   ██║
 ██████╔╝ ██║ ╚████║██║  ██║██║     ██║╚██████╔╝
 ╚═════╝  ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ 
```

### **Click any element on any live website → get production code.**

*Real DOM. Real Code. Zero AI guessing.*

<br />

[![npm version](https://img.shields.io/npm/v/snapui.svg?style=for-the-badge&color=ff4d00&logo=npm)](https://www.npmjs.com/package/snapui)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=for-the-badge&color=ff4d00)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-black.svg?style=for-the-badge)](https://github.com)
[![Chrome CDP](https://img.shields.io/badge/Engine-Chrome_CDP-ff4d00.svg?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromedevtools.github.io/devtools-protocol/)

<br />

```bash
npx snapui
```

</div>

---

<br />

## ⚡ The Philosophy

Most "screenshot-to-code" AI tools hallucinate layout, guess arbitrary padding numbers (`padding: 17px`), invent inaccurate colors, and cost money per request.

**SnapUI does not guess.** It connects directly to Chrome over the **Chrome DevTools Protocol (CDP)**, extracts actual computed styles (`getComputedStyle`), strips 90% of inherited browser noise, cleans framework hashes like `.astro-73zxsoak`, and compiles the live DOM into pixel-perfect components deterministically in milliseconds.

```
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│  Live Chrome    │  CDP  │    SnapUI Engine     │  IR   │  Production Component  │
│  DOM Inspection │ ────> │ Prune Noise & Hashes │ ────> │  React / Vue / Svelte  │
└─────────────────┘       └──────────────────────┘       └────────────────────────┘
```

---

## 🎯 1-Command Execution

No global installation. No configuration ceremony. Run directly anywhere:

```bash
# Capture any live URL or open local browser
npx snapui https://stripe.com
```

### What happens when you run it:
1. **Launches Chrome** with an isolated profile (your personal logins & cookies stay 100% private).
2. **Activates live picker**: An orange signal outline tracks your cursor.
3. **Click any element**: Click a hero section, navbar, card, or button.
4. **Instant Output**: Saves clean, typed code directly into your current directory:

```
📁 components/
   ├── 📄 IconList.tsx            # Typed React component (or Vue/Svelte)
   └── 📄 icon-list.css           # 90% pruned, clean CSS
📁 storybook/
   └── 📄 IconList.stories.tsx    # Instant Storybook story
```

---

## 🆚 Why SnapUI Beats Screenshot AI

| Feature | Vision Model AI (Screenshot) | **SnapUI (Live CDP)** |
| :--- | :---: | :---: |
| **Data Source** | Flat PNG pixels (guessing) | **Live DOM Computed Styles (100% exact)** |
| **Spacing & Padding** | Hallucinated estimate | **Exact CSS Box-Model** |
| **Browser Default Noise** | Retains junk margins | **90% Pruned & Cleaned** |
| **Framework Junk Hashes** | Keeps `.astro-73zxsoak` | **Scrubbed for Semantic BEM** |
| **Speed** | 10 – 30 seconds | **< 50 milliseconds** |
| **Price & API Keys** | Requires paid AI key | **100% Free & Local Engine** |
| **Offline Execution** | Never | **Yes (100% Offline)** |

---

## 💻 Tech Stack & Output Targets

SnapUI generates zero-dependency components for all modern stacks:

- **React TSX**: Extends `React.HTMLAttributes<HTMLElement>`, spreads `{...props}`, exports typed props.
- **Vue 3 SFC**: Single-File Components with `<script setup lang="ts">` and `<style scoped>`.
- **Svelte 4/5**: Clean `.svelte` files with scoped styling.
- **Tailwind CSS Mode**: Converts inline styles directly into utility classes (`px-4 py-2 bg-neutral-900`).
- **Storybook Included**: Every component ships with a auto-generated `.stories.tsx` file.

---

## 🛠️ CLI Reference

| Command | Description |
| :--- | :--- |
| `npx snapui` | Start an interactive capture session |
| `npx snapui [url]` | Open Chrome focused immediately on `[url]` |
| `npx snapui config` | Configure LLM keys, target framework & default styling engine |
| `npx snapui doctor` | Run system diagnostics (OS, Node, Chrome detection, disk usage) |
| `npx snapui uninstall` | Purge `~/.snapui` browser cache and temporary binaries |

---

## 🔒 Security & Clean Uninstallation

- **Zero Cloud Telemetry**: Your DOM structure and code never leave your laptop.
- **Chrome Sandbox**: Operates in an isolated profile — no access to your personal cookies or logins.
- **Easy Clean Purge**: To remove all cached Chromium binaries (~150MB) and settings from your system:

```bash
npx snapui uninstall
```

---

## 📦 Monorepo Architecture

```
packages/
├── core/         # CDP connection, live overlay, DOM -> IR extractor, CSS pruner
├── generators/   # IR -> React / Vue / Svelte / HTML / Tailwind / Storybook
└── cli/          # The interactive `snapui` terminal binary
```

---

## 📄 License

[MIT License](LICENSE) — Free for personal, open-source, and commercial projects.
