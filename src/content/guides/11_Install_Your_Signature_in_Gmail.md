# Install Your Signature in Gmail (Web & Mobile)

> **Category:** EXPORT & INSTALLATION GUIDE • `EXPORT & INSTALLATION`  
> **Estimated Reading Time:** 2 min read  
> **Applies to:** Gmail Web, Google Workspace, iOS & Android  
> **Author:** Sig Signature Technical Support  
> **Canonical URL:** `/help/export-installation/install-signature-gmail`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Install Email Signature in Gmail Web & Mobile App | Sig Signature
* **Meta Description:** Complete instructions for installing your Sig Signature into Google Workspace and personal @gmail.com accounts with zero formatting loss.
* **Primary Target Keyword:** `install signature in gmail`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, Sig Signature documentation

---

## Why Gmail Requires Special Handling

Gmail Web uses a rich-text WYSIWYG editor that sanitizes pasted markup. When raw code is pasted improperly, Gmail can strip CSS styles, inject unwanted double line breaks, or turn signature text purple in email threads.

Following this verified procedure ensures your table structure and images remain 100% intact.

---

## Installation Walkthrough: Gmail on the Web

### Step 1: Copy the Signature from Sig Signature
1. In your Sig Signature dashboard, open your finalized signature.
2. Click **Copy Visual Signature** (or click *Copy Signature to Clipboard*).
3. **Do not copy raw HTML code for Gmail Web**; copy the rendered visual binary output directly to your clipboard.

### Step 2: Open Gmail Settings
1. Open Gmail in Chrome, Safari, or Edge.
2. Click the **Settings Gear icon (⚙️)** in the top-right corner.
3. Click **See all settings**.

### Step 3: Navigate to Signature Settings
1. On the **General** tab, scroll down to the **Signature** section.
2. Click **+ Create new**, name your signature (e.g., *Sig Signature Professional*), and click **Create**.

### Step 4: Paste and Configure Defaults
1. Click inside the empty signature text box on the right.
2. Paste your clipboard content using **Ctrl+V** (Windows) or **Cmd+V** (Mac).
3. Under **Signature defaults**:
   * Set *FOR NEW EMAILS USE:* -> Select your new signature.
   * Set *ON REPLY/FORWARD USE:* -> Select your new signature (or choose *No signature* if you prefer clean reply chains).
4. Check the box: *"Insert signature before quoted text in replies and remove the '--' line that precedes it."* (This prevents Gmail from hiding your signature inside collapsed reply quotes).
5. Scroll to the bottom of the page and click **Save Changes**.

---

## Installing on Gmail Mobile App (iPhone & Android)

The native Gmail mobile app uses a lightweight plain-text editor for mobile signatures. Depending on your account type, use one of the two verified methods below:

### Method A: Google Workspace Accounts (Server-Side Web Sync)
1. In the Gmail mobile app, tap the **Menu (≡)** -> **Settings**.
2. Tap your Google Workspace email account.
3. Locate **Mobile Signature**. Ensure this setting is **turned OFF or left empty**.
4. When the mobile signature is empty, Google Workspace servers automatically append your full web HTML signature upon sending. *(Note: The signature does not render in the mobile compose draft window, but arrives fully styled on the delivered message).*

### Method B: Personal @gmail.com Accounts (Concise Mobile Format)
1. Personal `@gmail.com` accounts do not automatically append web HTML signatures when sent from mobile apps.
2. In the Gmail app Settings -> **Mobile Signature**, enter a clean 2-line professional closing (e.g., `Sardar Nadir | thenevon.com`).
3. Alternatively, connect your Gmail account through the native iOS Apple Mail or Outlook Mobile app, both of which support rich-text visual HTML clipboard pasting.

---

## Troubleshooting Common Gmail Issues

| Symptom | Cause | Immediate Resolution |
|---|---|---|
| **Text Turns Purple in Threads** | Gmail detects identical text in previous reply history | Normal Gmail behavior; recipients see standard black text |
| **Images Display Red "X" Box** | Image URL blocked or not HTTPS | Sig Signature hosts on HTTPS CDNs; verify image links are active |
| **Signature Hidden Behind "..."** | Signature placed after quoted text | Check *"Insert signature before quoted text"* in Gmail settings |
| **Double Line Breaks Injected** | Browser rich-text formatting bug | Always use Chrome or Edge when pasting into Gmail settings |

---

## Key Takeaways
* Always copy the *Visual Signature* (not raw HTML) when installing into Gmail Web.
* Check the box to insert your signature before quoted text to keep it visible in email threads.
* For Google Workspace accounts, leave mobile text signatures empty to enable automatic server-side HTML sync.
