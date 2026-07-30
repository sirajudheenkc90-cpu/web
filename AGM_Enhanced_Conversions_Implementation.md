# AGM Qatar — Enhanced Conversions Implementation Guide

**Google Ads account:** 850-424-2511 · **Google tag:** `AW-18281315101`
**Method:** Enhanced conversions for web, **manual (in-page) with the Google tag (gtag.js)**
**Scope:** site-wide (all pages served from this repo)

This guide is for the site developer. It covers the lead-form conversion (which *can* be
enhanced) and explains why the WhatsApp-click conversion cannot be, on the current design.

---

## 0. Current state (verified on the live site)

- `AW-18281315101` base tag loads site-wide. ✓
- One conversion is wired: **Submit lead form** → `AW-18281315101/lCTLCNKahMccEJ32mo1E`,
  firing on `thank-you.html` **page load** (form → web3forms → redirect → thank-you).
- **WhatsApp Click** → `AW-18281315101/zj8HCMG2p9YcEJ32mo1E` fires on click (standard, no user data).
- GA4 is still the placeholder `G-XXXXXXXXXX` (not set up).

---

## 1. Account-side prerequisites (do these first, in Google Ads)

Enhanced conversions will **silently ignore** on-page data if these don't match.

1. **Goals → Conversions → Settings → Enhanced conversions:** turn **ON**.
2. Choose method: **Google tag** (must match this gtag.js implementation — *not* GTM, *not* API).
3. Accept the customer-data terms.
4. Per action, confirm enhanced conversions is enabled for **Submit lead form** (and any others).
5. **April 2026 note:** Google is merging the separate EC methods (tag / Data Manager / API)
   into a single on/off setting and auto-migrating existing users. Re-confirm the method
   setting after that migration lands.

---

## 2. Lead form — recommended implementation (keeps accuracy, adds EC, no double-count)

**Why not just fire at submit?** `gtag('set','user_data',…)` does not survive the full-page
redirect to `thank-you.html`, where the conversion actually fires. And moving the fire to the
form page loses accuracy (it would count submits that fail delivery) and risks double-counting.

**Solution:** stash normalized data in `sessionStorage` on submit; read it on `thank-you.html`
and attach `user_data` immediately before the existing conversion fires. `sessionStorage` is
per-origin and survives the redirect chain within the same tab. Single, accurate fire.

### 2a. On every page that has the lead form — add before `</body>`

```html
<script>
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function () {
    // submit event only fires after HTML5 validation passes
    var val = function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      return el ? el.value : '';
    };
    var email = val('email').trim().toLowerCase();
    var phone = val('phone').replace(/[^\d+]/g, '');      // strip spaces/dashes/parens
    if (phone && phone[0] !== '+') phone = '+974' + phone.replace(/^0+/, ''); // → E.164 for Qatar
    var name  = val('name').trim();
    var first = name.split(' ')[0] || '';
    var last  = name.split(' ').slice(1).join(' ') || '';
    try {
      sessionStorage.setItem('agm_ud', JSON.stringify({
        email: email,
        phone_number: phone,
        address: { first_name: first, last_name: last }
      }));
    } catch (e) { /* storage blocked — conversion still fires without EC */ }
    // Do NOT console.log these values.
  });
})();
</script>
```

### 2b. On `thank-you.html` — replace the current conversion fire with

```html
<script>
(function () {
  var ud = null;
  try { ud = JSON.parse(sessionStorage.getItem('agm_ud') || 'null'); } catch (e) {}
  if (ud) {
    gtag('set', 'user_data', ud);   // enhanced conversions data (Google hashes with SHA-256)
    try { sessionStorage.removeItem('agm_ud'); } catch (e) {}
  }
  gtag('event', 'conversion', { 'send_to': 'AW-18281315101/lCTLCNKahMccEJ32mo1E' });
})();
</script>
```

> Keep the GA4 `generate_lead` event on thank-you if you use GA4 later. Do not add a second
> `send_to: …/lCTLCNKahMccEJ32mo1E` anywhere or you will double-count.

---

## 3. Normalization rules (already applied above)

| Field | Rule |
|---|---|
| Email | trim whitespace, lowercase |
| Phone | E.164: strip non-digits, prefix `+974` for local Qatar numbers |
| Name / address | trim; split into first / last |

Google hashes with SHA-256 **on its side** for the Google-tag method — send the normalized
plaintext to gtag only. **Never** send this data to any third party, and **never** log it.

---

## 4. WhatsApp Click — cannot be enhanced on the current design

Enhanced conversions requires a first-party identifier (email/phone) present **when the
conversion fires**. At a WhatsApp click, nothing is collected — the button is just a link.
So there is no data to attach; **WhatsApp Click stays a standard conversion.**

The WhatsApp click conversion itself is already wired (fires
`AW-18281315101/zj8HCMG2p9YcEJ32mo1E` before opening WhatsApp).

Only way to enhance it: capture a phone/name in a small step before the WhatsApp handoff.
That adds friction and usually lowers click volume — not recommended unless tested.

---

## 5. Testing

1. **Tag Assistant** (tagassistant.google.com): connect `www.agmqatar.com`, submit the lead
   form, and confirm on `thank-you.html` you see the conversion **with** `user_data` present.
2. **Google Ads → Goals → Conversions → Submit lead form → Diagnostics:** check the
   **Enhanced conversions coverage** report over the following days; coverage % should rise.
3. Confirm no double-counting: exactly one `lCTLCNKahMccEJ32mo1E` fire per completed lead.

---

## 6. Privacy checklist

- [ ] User data only sent to Google via gtag (first-party). No third parties.
- [ ] No PII written to console, analytics events, or URLs/query strings.
- [ ] `sessionStorage` value cleared immediately after the conversion fires.
- [ ] Privacy policy mentions use of Google Ads / enhanced conversions.
- [ ] EC enabled in Google Ads with method = **Google tag** (matches this implementation).
