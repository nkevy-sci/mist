# mist
This is my ePortfolio for MIST. Some of the products and projects that I created to attain my MS in Instructional Science and Technology are shown here. I love applying my skills and knowledge of the science of learning to drive success and technological innovation. 

Take a look at [my portfolio](https://nkevy-sci.github.io/mist/) live online!


## Reusable pages

Copy `template.html` to a new HTML file. The marked comments identify the title,
meta description, Open Graph title/description, canonical URL, sharing URL,
banner heading/subtitle and replaceable `<main>` content. Replace the example.com
URL placeholders before publishing. No build step is needed. The template omits
the home-specific social preview image; add a suitable absolute image URL and
alt metadata if the new page has one.

Use `.prose` for text (68ch maximum), `.gallery` for a full-container image grid,
and `.wide-content` around wide tables. Main sections use h2; subsections use h3.
Supply meaningful image alt text, or `alt=""` for decorative images. Make
horizontally scrolling content keyboard reachable when it contains no controls
(e.g. `tabindex="0"` and an accessible label on the `.wide-content` wrapper).

### Paths and shared navigation

Each page's `#site-navigation` mount supplies one explicit `data-site-root`:

| Page location | Site root | Stylesheet/script examples | Fallback Home links |
| --- | --- | --- | --- |
| `article.html` | `./` | `css/standard.css`, `js/navbar.js` | `index.html` |
| `pages/article.html` | `../` | `../css/standard.css`, `../js/navbar.js` | `../index.html` |
| `pages/course/article.html` | `../../` | `../../css/standard.css`, `../../js/navbar.js` | `../../index.html` |

Update **both** stylesheet links (standard.css and navbar.css), the navbar script,
content asset paths, and both static Home links for the page's depth. jQuery's
absolute CDN URL remains the same. These relative paths work in local previews
and beneath a hosting subdirectory; no deployment domain is built into navigation.

Edit `js/navbar.js` once to update navigation across all participating pages.
When a real destination is supplied, replace ID Document's plain text with an
anchor bearing `data-site-path="pages/your-page.html"` (relative to the site
root). The script resolves that path and marks matching pages with aria-current,
ignoring query strings/fragments and treating index.html as its directory URL.
Until a destination is supplied, the original labels remain plain text.

`css/navbar.css` contains the drawer styles shared by both pages. The home page
now loads navbar.js; `js/index.js` is retired and has no handlers. Its hero and
content are preserved. `css/index.css` only loses the extracted navigation rules
and has its invalid // comment corrected. No standard.js is needed.

### Verification

Browser checks passed for the template at measured 320, 768 and 1440 CSS pixels:
no horizontal overflow, readable reflow, banner/button separation, and footer at
the viewport bottom on short pages. Checked the home page after integration and
keyboard opening/closing there. On the template, checked focus moving to Close,
Tab traversal/wrapping, native details expansion, Escape, opener focus restoration
and scroll-lock restoration. Missing-jQuery, missing-scripts and unavailable-modal
fixtures exposed the static Home fallback or inline navigation as appropriate;
a nested-page fixture loaded shared assets and resolved its Home path correctly.
Temporary fixtures were removed after checks.

The official https://releases.jquery.com/ page and its minified code integration
snippet verified jQuery 4.0.0 and the pinned SHA-256 integrity value at implementation.
Static checks confirmed local asset paths, unique document IDs, heading order,
and exact required sample text. Calculated contrast: #222 on #f8f8f8 ≈ 14.98:1,
#666 on #f8f8f8 ≈ 5.41:1, #2563EB on #f8f8f8 ≈ 4.87:1; subtitle #666 on the
darkest banner endpoint #e8effb ≈ 4.97:1.

Still requires manual review: screen readers, other browsers/devices, an actual
JavaScript-disabled browser session (the missing-scripts fixture is only a
simulation), enlarged text/zoom, reduced-motion OS settings, backdrop pointer
edge cases, and future real-link destinations/current-page states. Automated
and scoped browser checks do not establish full WCAG 2.2 AA conformance.
