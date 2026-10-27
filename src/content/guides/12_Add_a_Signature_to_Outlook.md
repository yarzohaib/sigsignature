# Add a Signature to Outlook (Desktop, Web & Mac)

> **Category:** EXPORT & INSTALLATION GUIDE • `EXPORT & INSTALLATION`  
> **Estimated Reading Time:** 4 min read  
> **Applies to:** Outlook 2016/2019/2021, Microsoft 365, Outlook Web, Outlook Mac  
> **Author:** SigSignature Outlook Engineering Team  
> **Canonical URL:** `/help/export-installation/add-signature-outlook`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Add Signature to Outlook Desktop, Web & Mac | SigSignature
* **Meta Description:** Mastering Outlook email signature setup across Windows desktop, Microsoft 365 OWA, and macOS with perfect image rendering and MSO table support.
* **Primary Target Keyword:** `add signature outlook desktop web mac`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, SigSignature documentation

---

## The Outlook Challenge: Microsoft Word Rendering Engine

Desktop Outlook for Windows does not use a modern browser rendering engine (like Blink or WebKit). Instead, it uses **Microsoft Word** to render HTML emails. This creates notorious compatibility challenges: unsupported modern CSS (flexbox, grid, border-radius), distorted images on high-DPI screens, and ignored web fonts.

SigSignature incorporates Microsoft Office XML tags (`<!--[if mso]>`) and table constraints to guarantee your signature renders flawlessly.

---

## Method 1: Outlook on the Web (Microsoft 365 / OWA)

This is the cleanest and fastest method for Microsoft 365 enterprise users.

1. In SigSignature, click **Copy Visual Signature**.
2. Log into Outlook on the Web at `outlook.office.com`.
3. Click the **Settings Gear (⚙️)** in the top right -> Click **View all Outlook settings** (or search for *Signature*).
4. Go to **Mail** -> **Compose and reply**.
5. Click **+ New signature**, name it, and paste your clipboard content (**Ctrl+V** or **Cmd+V**) into the edit box.
6. Under **Select default signatures**, set your new signature for *New messages* and *Replies/forwards*.
7. Click **Save**.

---

## Method 2: Outlook for Windows (Desktop 2019 / 2021 / Microsoft 365)

1. In SigSignature, click **Copy Visual Signature**.
2. Open desktop Outlook.
3. Click **File** in the top-left menu -> Click **Options**.
4. In the Outlook Options window, select **Mail** from the left sidebar, then click the **Signatures...** button.
5. In the *Email Signature* tab, click **New**, type a name, and click **OK**.
6. Click inside the **Edit signature** box below.
7. Paste your signature using **Ctrl+V**.
8. In the top-right of that window, assign your signature to your desired email account under **New messages** and **Replies/forwards**.
9. Click **OK** to save.

> [!IMPORTANT]
> **Outlook High-DPI Fix:** If your logo appears oversized in Outlook Desktop, ensure you did not manually resize the image by dragging corner handles in Outlook's editor. Outlook's editor will strip SigSignature's MSO width tags. Always delete, re-copy from SigSignature, and paste cleanly.

---

## Method 3: Outlook for Mac

1. In SigSignature, click **Copy Visual Signature**.
2. Open Outlook on macOS.
3. In the top menu bar, click **Outlook** -> **Settings...** (or press `Cmd+,`).
4. Click **Signatures** (under Email).
5. Click the **+** button at the bottom of the signature list to create a new signature.
6. Paste your signature (**Cmd+V**) into the editor pane.
7. In the *Choose default signature* dropdowns at the bottom, select your signature for New messages and Replies.
8. Close the window; macOS automatically saves changes.

---

## Outlook Compatibility Troubleshooting

| Issue in Outlook | Root Cause | Fix |
|---|---|---|
| **Giant Logo on Windows** | User dragged corner handles in Outlook editor | Delete signature, re-copy from SigSignature, and paste without editing |
| **Thin Line Borders Disappear** | Outlook Word engine rounds 0.5px borders to zero | SigSignature uses explicit `1px solid` table borders natively |
| **Times New Roman Font Bug** | Outlook failed to find custom web font | SigSignature injects universal system fallbacks (Arial/Calibri) |
| **Extra Spacing Below Rows** | Outlook injected default paragraph spacing | SigSignature forces `margin: 0; padding: 0; mso-line-height-rule: exactly;` |

---

## Key Takeaways
* Never drag image corner handles inside Outlook's built-in signature editor.
* Outlook on the Web (OWA) provides the fastest, most reliable setup across corporate teams.
* SigSignature's built-in MSO tags guarantee that table borders and spacing stay locked in desktop Outlook.
