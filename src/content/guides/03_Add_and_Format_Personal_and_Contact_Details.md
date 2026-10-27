# Add and Format Your Personal & Contact Details

> **Category:** GETTING STARTED GUIDE • `GETTING STARTED`  
> **Estimated Reading Time:** 2 min read  
> **Applies to:** All Plans & Templates  
> **Author:** SigSignature Deliverability Team  
> **Canonical URL:** `/help/getting-started/format-contact-details`  

---

### SEO Metadata & Discovery Tags
* **Page Meta Title:** Format Email Signature Contact Details & Phone Links | SigSignature
* **Meta Description:** Best practices for formatting job titles, international phone numbers (tel: links), company URLs, and calendar booking links in email signatures.
* **Primary Target Keyword:** `format email signature contact info`
* **Related Topics & Search Queries:** email signature help, HTML email signature setup, SigSignature documentation

---

## Overview: The Danger of Contact Clutter

When email recipients inspect your signature, they are usually hunting for one specific piece of information: your phone number, your calendar booking link, or your official job title. If that information is buried inside five lines of secondary addresses and disorganized links, the signature fails its primary objective.

Formatting your contact details correctly guarantees that mobile users can call or book meetings with a single tap, while preventing email clients from injecting ugly blue auto-links.

---

## Step-by-Step Formatting Instructions

### 1. Formatting Full Name & Professional Title
* **Full Name:** Use standard title case (e.g., `Sardar Muhammad Nadir`). Avoid all-caps typography as it appears aggressive in inbox previews.
* **Job Title:** Keep your primary title under 45 characters (e.g., `Head of Product Engineering`). If you hold dual roles, separate them with a vertical pipe `|` or a clean slash `/` (e.g., `Founder | CEO`).
* **Avoid:** Long academic qualifications or honorific strings unless strictly required by your professional governing board.

### 2. International Phone Number Protocols
Mobile operating systems (iOS and Android) automatically scan email bodies for phone patterns and turn them into hyperlinks. If improperly formatted, Apple Mail will turn your phone number into an unstyled bright blue link that clashes with your brand palette.

* **Standard Format:** Always include your international country code:  
  `+1 (555) 234-5678` or `+92 300 1234567`
* **Under the Hood:** SigSignature wraps phone numbers in explicit `tel:` protocols with inline styling:  
  `<a href="tel:+15552345678" style="color: inherit; text-decoration: none;">+1 (555) 234-5678</a>`  
  This prevents email clients from overriding your typography while enabling native 1-tap mobile dialing.

### 3. Web URLs & Verified Domains
* Display clean, human-readable domain strings (e.g., `sigsignature.com` or `thenevon.com`).
* SigSignature automatically binds the underlying `href` attribute with secure `https://` encryption.
* Never use raw URL shorteners (e.g., bit.ly) in your email signature as commercial spam filters flag shortened links as potential phishing vectors.

### 4. Direct Meeting Booking Links (Calendly, Cal.com)
Adding a calendar link accelerates meeting scheduling by eliminating back-and-forth emails:
* Use a crisp, actionable CTA label: `Book a 15-min Call` or `Schedule Discovery Session`.
* Avoid placing massive button blocks next to tiny text rows. Keep calendar links inline with a clean calendar icon badge.

---

## Contact Field Audit: Mandatory vs. Optional

| Field | Priority | Recommendation | Example |
|---|---|---|---|
| **Full Name** | Mandatory | Primary font size (14-16px), bold | `Sardar Nadir` |
| **Job Title** | Mandatory | Secondary font size (11-13px), muted tone | `Product Strategist` |
| **Company Name** | Mandatory | Bold or uppercase sub-label | `The Nevon` |
| **Direct Phone** | High | Include international country code | `+92 42 3587 0000` |
| **Official Website** | High | Clean root domain without http:// prefix | `www.sigsignature.com` |
| **Calendar Link** | Optional | High-conversion meetings link | `cal.com/sardar-thenevon` |
| **Physical Address** | Optional | Only include if client foot traffic is expected | `DHA Phase 5, Lahore` |
| **Personal Fax / 2nd Cell** | Deprecated | Remove completely to eliminate clutter | N/A |

---

## Key Takeaways
* Restrict contact rows to a maximum of 3-4 clean lines.
* Always use international telephone formats to guarantee seamless one-tap dialing on smartphones.
* Keep URLs clean and human-readable while ensuring secure HTTPS destination links.
