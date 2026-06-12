# ronda-ci 👮‍♂️✨

> Continuous web quality optimization and guarding, running silently in your CI/CD pipelines.

[![npm version](https://img.shields.io/badge/npm-v0.0.1-green)](https://npmjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange)](https://opensource.org)

**Ronda** (derived from the Indonesian word for *"neighborhood night watch"*) is a lightweight Node.js library designed to patrol, inspect, and automatically optimize your web application's quality and performance during the CI/CD build process.

## 🚀 Key Features

*   **Automated Asset Optimization**: Automatically compresses images, minifies scripts, and optimizes critical CSS on every build.
*   **Quality Gatekeeper**: Fails the CI/CD pipeline if performance budgets (like Lighthouse scores or Web Vitals) drop below your limits.
*   **Zero Config (Almost)**: Works out of the box with sensible defaults for modern web apps.
*   **CI/CD Ready**: Built-in support for GitHub Actions, GitLab CI, and Bitbucket Pipelines.

## 📦 Installation

Install the package via npm:

```bash
npm install --save-dev ronda-ci
```

## 🛠️ Quick Start

### 1. Create a configuration file
Create a `ronda.config.json` in your root project:

```json
{
  "optimize": {
    "images": true,
    "minifyHtml": true
  },
  "budgets": {
    "performance": 90,
    "accessibility": 95
  }
}
```

### 2. Add to your CI/CD Pipeline (e.g., GitHub Actions)
Add `ronda-ci` right after your build step:

```yaml
- name: Build Project
  run: npm run build

- name: Run Quality Watch
  run: npx ronda-ci check
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
