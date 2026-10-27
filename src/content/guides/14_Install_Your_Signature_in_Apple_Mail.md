# Install Your Signature in Apple Mail (macOS & iOS)

> **Category:** EXPORT & INSTALLATION GUIDE • `EXPORT & INSTALLATION`  
> **Estimated Reading Time:** 3 min read  
> **Applies to:** Apple Mail macOS, iPhone & iPad iOS  
> **Author:** SigSignature Apple Ecosystem Team  
> **Canonical URL:** `/help/export-installation/install-signature-apple-mail`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Install Email Signature in Apple Mail on Mac & iPhone | SigSignature
* **Meta Description:** Step-by-step setup for Apple Mail on macOS Sequoia/Sonoma and iOS 18/17. Fix font distortion and learn the shake-to-undo formatting restore trick.
* **Primary Target Keyword:** `install email signature apple mail mac iphone`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, SigSignature documentation

---

## Overview: The Apple Ecosystem Advantage

Apple Mail (both macOS and iOS) uses the modern WebKit rendering engine. WebKit provides the highest standards compliance of any email client in the world: perfect support for rounded borders, high-DPI Retina assets, and web typography.

However, Apple Mail has two specific idiosyncrasies:
1. On macOS, a default setting ("Always match my default message font") frequently overrides your custom typography.
2. On iOS (iPhone/iPad), pasting an HTML signature automatically strips font sizes and colors unless you trigger the **Shake to Undo** trick.

This guide details the exact steps to achieve flawless rendering across Mac, iPhone, and iPad.

---

## Part 1: Installing on macOS Apple Mail (Sequoia, Sonoma, Ventura)

### Step 1: Copy Visual Signature
In your SigSignature dashboard, open your finalized signature and click **Copy Visual Signature**.

### Step 2: Open Apple Mail Signatures Setting
1. Open the **Mail** app on your Mac.
2. In the top menu bar, click **Mail** -> **Settings...** (or press `Cmd+,`).
3. Click the **Signatures** tab.

### Step 3: Create and Paste
1. In the left column, select the email account you want to use.
2. Click the **+** (Plus) button at the bottom of the middle column to create a new signature. Name it (e.g., *SigSignature Work*).
3. In the right-hand edit pane, delete any default text.
4. Paste your signature (**Cmd+V**).

### Step 4: The Critical macOS Setting (CRITICAL)
Look directly below the signature edit pane. Locate the checkbox labeled:
> **"Always match my default message font"**

**UNCHECK THIS BOX IMMEDIATELY.**  
If left checked, Apple Mail will strip your custom font sizes, colors, and line-heights, forcing your entire signature into plain 12pt Helvetica. Unchecking this box preserves 100% of your visual design.

---

## Part 2: Installing on iPhone & iPad (iOS 18 & 17)

Installing an HTML signature directly on an iPhone requires a specific workaround to bypass iOS's automatic formatting strip:

### Step 1: Send the Signature to Your iPhone
1. On your desktop, compose a blank email to yourself.
2. Insert your newly created signature and send the email.
3. Open the email in the **Mail app** on your iPhone.

### Step 2: Copy the Rendered Signature
1. Tap and hold inside the signature area.
2. Drag the selection handles to highlight the entire signature (including your name, photo, and links).
3. Tap **Copy**.

### Step 3: Paste in iOS Settings
1. On your iPhone, open **Settings** -> Scroll down and tap **Apps** -> **Mail** (or directly **Mail** in older iOS versions).
2. Scroll to the bottom and tap **Signature**.
3. Select *All Accounts* or tap your specific work account.
4. Clear the box, tap and hold, then tap **Paste**.

### Step 4: The Famous "Shake to Undo" Trick (MANDATORY)
Notice that when you paste, iOS automatically distorts font sizes or shifts colors.
1. **Physically shake your iPhone** until a popup menu appears on screen.
2. The popup will say: **"Undo Change Attributes"**.
3. Tap **Undo**.
4. Instantly, iOS restores the original HTML font sizes, inline CSS weights, and color balances!
5. Tap the back arrow to save.

---

## Apple Mail Troubleshooting Matrix

| Issue | Root Cause | Fix |
|---|---|---|
| **Font Reverts to Plain Text on Mac** | "Always match my default message font" is checked | Uncheck the box in Mail -> Settings -> Signatures |
| **Phone Numbers Turn Bright Blue** | iOS auto-detects phone numbers and injects links | SigSignature wraps phone numbers in styled `tel:` tags |
| **Images Don't Load on Mobile** | Mail Privacy Protection caching issue | Toggle airplane mode or ensure images are hosted on HTTPS CDN |

---

## Key Takeaways
* On Mac: Always uncheck "Always match my default message font".
* On iPhone: Always perform the "Shake to Undo" trick immediately after pasting into iOS Settings.
* WebKit renders high-DPI Retina assets with stunning clarity when formatted at 2x resolution.
