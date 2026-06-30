# AGM | The Cool Consultant — Go-Live Guide

A simple, step-by-step guide to put your website online. No coding required.
Written for someone doing this for the first time.

---

## What you have

Your website is a **static site** — about 1,058 ready-made HTML pages (homepage, services, contact, 1,000 location/service pages, legal pages) plus one stylesheet, one script, and your logo. Everything lives in the folder:

`C:\Users\User\Desktop\website`

Because it's static, hosting is **cheap, very fast, and simple**. You do **not** need a database or a complicated server (a DigitalOcean "Droplet" is more than you need).

---

## The 3 things to prepare first

Before (or during) deployment, get these ready:

1. **A Web3Forms key** — makes the quote form email you (free). *Step A below.*
2. **Your Google Analytics / Google Ads ID** — for tracking (you can add later). *Step E below.*
3. **Your domain** — agmqatar.com (you said you may already have it). *Step C below.*

---

## STEP A — Turn on the contact form email (do this first, 3 minutes)

Right now the form shows a thank-you page but does **not** email you yet. To fix that:

1. Go to **https://web3forms.com**
2. Enter your email (e.g. **info@agmqatar.com**) and click **Create Access Key**. Check your inbox and copy the **Access Key** (looks like `a1b2c3d4-....`).
3. Open these two files in Notepad (right-click → Open with → Notepad):
   - `website\contact.html`
   - `website\vrf-systems.html`
4. In each file, use **Edit → Replace** to change:
   `YOUR_WEB3FORMS_ACCESS_KEY`  →  *your real key*
   Save the file.
5. (Optional) To also copy **siraj@agmqatar.com** on every lead: in Web3Forms settings, add it as a CC, or tell me and I'll add a second-recipient field.

That's it — every quote request will now be emailed to you **and** still show the thank-you page (which records the Google Ads conversion).

> Tip: I can paste the key into all the files for you — just send me the key.

---

## STEP B — Put the site online (choose ONE host)

### Option 1 — Netlify (recommended: free, easiest, fastest)

This is the simplest way to go live — literally drag and drop.

1. Go to **https://app.netlify.com/drop**
2. Create a free account (sign in with Google or email).
3. **Drag your whole `website` folder** onto the page.
4. Wait ~30 seconds. Netlify gives you a live link like `random-name-1234.netlify.app`. **Your site is now live!** Test it.
5. To update the site later, just drag the folder again (or set up auto-deploy).

Netlify gives you free HTTPS (the padlock), a global CDN (fast everywhere), and handles your traffic automatically. The free tier is plenty for this site.

### Option 2 — DigitalOcean (if you prefer to stay with them)

DigitalOcean's easiest static option is **App Platform → Static Site**. It deploys from a code repository, so it has a couple more steps:

1. Create a free **GitHub** account (https://github.com) and a new **repository** named `agm-website`.
2. Upload your `website` folder contents to that repository (GitHub has an "upload files" button — drag the files in).
3. In DigitalOcean, go to **Create → Apps → GitHub**, pick your `agm-website` repo.
4. DigitalOcean detects it's a **static site** → choose the **Starter (free / low-cost)** plan → **Create**.
5. DigitalOcean builds and gives you a live URL with free HTTPS.

> Honest note: this needs the GitHub step, which is why Netlify (drag-and-drop) is easier. A DigitalOcean **Droplet** (full server) would also work but requires installing a web server and SSL yourself — not recommended for a static site. If you specifically want the Droplet route, tell me and I'll write the exact commands.

---

## STEP C — Connect your domain (agmqatar.com)

After the site is live on the host's temporary URL, point your real domain at it.

**If you already own agmqatar.com:**
1. In your host (Netlify: **Site → Domain management → Add a domain**), type `agmqatar.com` and `www.agmqatar.com`.
2. The host shows you DNS records to add. Log in wherever your domain is registered (GoDaddy, Namecheap, etc.) and add them. They typically look like:
   - **A record** — Host `@` → the host's IP (Netlify shows it, e.g. `75.2.60.5`)
   - **CNAME record** — Host `www` → your host's address (e.g. `your-site.netlify.app`)
   *(Or, easiest on Netlify: switch your domain to "Netlify DNS" and it sets everything up for you.)*
3. Wait for it to take effect (usually 15 minutes – a few hours). HTTPS turns on automatically.

**If you don't own it yet:** buy `agmqatar.com` from any registrar (Namecheap, GoDaddy, or even through Netlify), then follow the steps above.

> Heads-up: your other AGM site (agmglobal.co) is a different domain — this new site should use **agmqatar.com** so they don't clash.

---

## STEP D — Update the form redirect to your live domain

The forms currently redirect to `https://www.agmqatar.com/thank-you.html` after submitting. Once your domain is connected (Step C) this works perfectly. If you go live on a temporary URL first and want to test the form there, tell me and I'll adjust the redirect — otherwise leave it; it'll be correct once the domain is live.

---

## STEP E — Add your Google Analytics / Google Ads tracking

Every page has a placeholder ID: `G-XXXXXXXXXX`.

1. Create a free **Google Analytics 4** property (https://analytics.google.com) and copy your **Measurement ID** (`G-...`).
2. For **Google Ads conversions**, create a conversion action and copy its `AW-...` ID.
3. These IDs appear in the `<head>` of **every page** (1,058 of them) — too many to edit by hand. **Send me the IDs and I'll insert them across all pages in one pass.** (Also wire the Ads conversion to fire on the thank-you page.)

---

## STEP F — Final go-live checklist

- [ ] Web3Forms key pasted into `contact.html` and `vrf-systems.html` (Step A)
- [ ] Site deployed and opening on the host URL (Step B)
- [ ] Custom domain `www.agmqatar.com` connected, padlock (HTTPS) showing (Step C)
- [ ] Submitted a test quote → you received the email **and** saw the thank-you page
- [ ] Google Analytics / Ads IDs added (Step E)
- [ ] Submit your sitemap to **Google Search Console**: add `https://www.agmqatar.com/sitemap.xml` (helps Google find all 1,000+ pages)
- [ ] Open the site on your phone to confirm it looks right
- [ ] Add Microsoft Clarity (optional, free heatmaps)

---

## Rough costs

| Item | Cost |
|---|---|
| Netlify hosting (static) | **Free** |
| DigitalOcean App Platform (static) | Free tier or ~$0–5/month |
| DigitalOcean Droplet (not recommended here) | ~$4–6/month + your setup time |
| Web3Forms (contact form emails) | **Free** (up to 250/month) |
| Domain agmqatar.com | ~$10–15/year (if not already owned) |

**Bottom line:** you can be fully live for essentially **$0/month** (plus the domain) on Netlify.

---

## What I can do for you right now

Just tell me and I'll do these immediately:
1. **Paste your Web3Forms key** into the forms (send me the key).
2. **Insert your Google Analytics / Ads ID** across all 1,058 pages.
3. **Adjust the form redirect** if you want to test on a temporary URL first.
4. Write the exact **DigitalOcean Droplet** commands if you choose that route.

*Prepared for AGM | The Cool Consultant — going live.*
