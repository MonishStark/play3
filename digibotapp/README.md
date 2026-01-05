<!-- @format -->

# DigiBot App – Automated QA Suite

## 1. Project Overview

This directory contains the **Playwright Automation Suite** for
👉 **[https://digibotapp.com](https://digibotapp.com)**

It focuses on **Visual Regression & Layout Integrity** to ensure the marketing website looks perfect across **Desktop, Mobile, and Tablet** devices.

---

## 2. Architecture

The suite uses a streamlined, data-driven architecture to audit all key public pages.

| File                   | Description                                      | Scope   |
| :--------------------- | :----------------------------------------------- | :------ |
| `tests/public.spec.js` | Iterates through 12 core URLs for visual checks. | 12 URLs |
| `playwright.config.js` | Defines device viewports (iPhone 17, S25, etc.)  | Config  |

---

## 3. Configuration & Specifications

### Global Settings

- **Base URL:** `https://digibotapp.com`
- **Execution Mode:** Fully Parallel
- **Visual Tolerance:** `maxDiffPixelRatio: 0.02` (2%) to allow for minor rendering differences.

## 4. Test Scope (12 Endpoints)

The suite validates the layout of the following pages:

**Main Pages:**

- `/` – Home
- `/contact-us/` – Contact Page
- `/faq/` – Frequently Asked Questions

**Industries:**

- `/retail/` – Retail Solutions
- `/hr/` – HR Automation
- `/technology/` – Tech Stack
- `/legal/` – Legal Bots
- `/healthcare/` – Healthcare Solutions
- `/fintech/` – Financial Tech

**Information:**

- `/blog/` – Blog Index
- `/terms-of-use/` – Terms & Conditions
- `/privacy-policy/` – Privacy Policy

---

## 5. Execution Option A: Cloud (GitHub Actions)

**Schedule:** Every Sunday at 9:00 AM IST.

1.  Navigate to the **[Actions Tab](../../actions)**.
2.  Select **DigiBot: Automation** from the left sidebar.
3.  Click **Run workflow**.
4.  **To View Results:**
    - Open the completion email or the GitHub Run page.
    - Scroll to **Artifacts**.
    - Download **`digibot-report`** (Zip file).

---

## 6. Execution Option B: Local Setup (Developer Mode)

**For Developers:** Follow these steps to run the suite on your own machine.

### Prerequisites

- **Node.js** (v14 or higher)
- **NPM** (included with Node.js)

### Step 1: Clone & Install

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_FOLDER>

# Install Dependencies
npm install

# Install Browser Drivers
npx playwright install
```

````

### Step 2: Run Tests

Execute the full suite across all browsers:

```bash
npm run test

```

### Optional Commands

- **Update Snapshots:** `npm run update-snapshots` (Overwrites baseline images)
- **View Report:** `npx playwright show-report`

---

````
