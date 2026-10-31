# Install in Yahoo Mail, Mozilla Thunderbird & Custom Webmail

> **Category:** EXPORT & INSTALLATION GUIDE • `EXPORT & INSTALLATION`  
> **Estimated Reading Time:** 3 min read  
> **Applies to:** Yahoo Mail, Thunderbird, ProtonMail, Roundcube  
> **Author:** Sig Signature Webmail Support Team  
> **Canonical URL:** `/help/export-installation/install-signature-yahoo-thunderbird`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Install Signature in Yahoo Mail, Thunderbird & Webmail | Sig Signature
* **Meta Description:** How to install your HTML email signature into Yahoo Mail, Mozilla Thunderbird, ProtonMail, and cPanel Roundcube webmail without broken tables.
* **Primary Target Keyword:** `install signature yahoo mail thunderbird`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, Sig Signature documentation

---

## Overview: Universal Webmail & Desktop Client Support

While Gmail and Outlook dominate the corporate market, millions of professionals and agencies rely on independent email clients: Yahoo Mail for business, Mozilla Thunderbird for Linux/privacy workflows, ProtonMail for encrypted communications, and cPanel Roundcube for custom domain webmail.

Because Sig Signature compiles to 100% inline CSS and standard HTML tables, your signature integrates seamlessly into every platform.

---

## 1. Installing in Yahoo Mail (Web)

1. Open your signature in Sig Signature and click **Copy Visual Signature**.
2. Log into Yahoo Mail in your web browser.
3. In the top right corner, click **Settings** -> Click **More Settings** at the bottom of the tray.
4. In the left navigation, click **Writing email**.
5. Under **Signature**, toggle your account signature **ON**.
6. Click inside the text box, press **Ctrl+V** (Windows) or **Cmd+V** (Mac) to paste your visual signature.
7. Changes in Yahoo Mail save automatically. Compose a new message to verify the visual display.

---

## 2. Installing in Mozilla Thunderbird (Desktop)

Thunderbird supports direct HTML source embedding, guaranteeing pixel-perfect results:

### Method A: HTML File Attachment (Recommended)
1. In Sig Signature, click **Export HTML** -> Click **Download .html File**. Save it to a permanent folder on your computer.
2. Open Thunderbird.
3. Right-click your email account in the left sidebar -> Select **Settings**.
4. In the main *Account Settings* panel, check the box labeled:  
   **"Attach the signature from a file instead (text, HTML, or image)"**.
5. Click **Choose...**, select your downloaded `signature.html` file, and click **Open**.
6. Click **OK**. Thunderbird will now render your HTML signature natively in every outgoing message.

### Method B: Direct HTML Source Paste
1. In Sig Signature, click **Export HTML** -> **Copy Raw HTML**.
2. In Thunderbird Account Settings, check the box **"Use HTML"** in the Signature text section.
3. Paste your raw HTML code directly into the text box.

---

## 3. Installing in ProtonMail

1. In Sig Signature, click **Copy Visual Signature**.
2. Open ProtonMail Web -> Click **Settings** (gear icon) -> **All settings**.
3. In left navigation, click **Identity and addresses**.
4. Scroll to **Signature**, toggle it **ON**.
5. In the rich-text editor, paste your signature (**Ctrl+V** or **Cmd+V**).
6. Click **Save**.

---

## 4. Installing in cPanel Webmail (Roundcube)

1. In Sig Signature, click **Export HTML** -> **Copy Raw HTML**.
2. Log into your cPanel Webmail and open **Roundcube**.
3. In the top-right menu, click **Settings** -> Click **Identities** in the left column.
4. Select your email identity.
5. In the right-hand panel, check the box **HTML signature**.
6. In the signature editor toolbar, click the **HTML Source Code icon (`< >`)**.
7. Paste your raw HTML code into the popup window and click **Update**.
8. Click **Save**.

---

## Universal Webmail Compatibility Summary

| Client | Paste Method | Notes |
|---|---|---|
| **Yahoo Mail Web** | Copy Visual Signature | Rich text paste; auto-saved in settings |
| **Mozilla Thunderbird** | Attach HTML File or Raw Code | Supports full HTML markup without sanitization |
| **ProtonMail** | Copy Visual Signature | E2E encrypted; images load via Proton proxy |
| **Roundcube / cPanel** | Copy Raw HTML Code | Must enable the HTML signature toggle |

---

## Key Takeaways
* Thunderbird and Roundcube support direct raw HTML pasting via their code view tools.
* Yahoo Mail and ProtonMail require copying the "Visual Signature" directly to clipboard.
* All signatures render consistently because Sig Signature avoids unsupported external styles.
