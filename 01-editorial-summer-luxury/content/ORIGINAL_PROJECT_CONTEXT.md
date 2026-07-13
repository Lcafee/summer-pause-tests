# L Cafe Summer Pause

## Canonical Files

- Website and GitHub upload source: `github-upload-ready/index.html`
- Product assets: `github-upload-ready/assets/products/`
- Sole editable content workbook: `content/site-content-reference-all.xls`

Do not create duplicate HTML or workbook copies. Edit the canonical files directly.

## Product Flow

- Static single-page campaign site with a direct-menu path and a two-question recommendation path.
- The home screen offers two routes:
  - `پیدا کردن نوشیدنی من` starts the guided recommendation experience.
  - `دیدن همه نوشیدنی‌ها` opens the full summer-drinks menu.
- The home header uses `assets/lcafe-logo.svg`; the campaign copy is `FIND YOUR SUMMER PAUSE` and `مکث تابستانی‌ات رو پیدا کن`.
- Question 1 selects a line: `icedtea`, `refresher`, `cloudy`, or `frappe`.
- Question 2 selects one main item and one secondary item by product code.
- Active codes: `IT-01`, `IT-02`, `RF-02`, `RF-03`, `CL-01`, `CL-03`, `FR-01`, `FR-02`.
- Item data is embedded in the `items` object in the canonical HTML.
- Quiz data is embedded in `lineQuestion` and `flavorQuestions`.
- The result is rendered by `renderResult()`.

## Full Menu

- The full menu is the `#fullMenu` screen in the same single-page app, not a popup.
- It is opened by `openFullMenu()` and returned from with `closeFullMenu()`.
- Menu entries are rendered from the existing `items` data object; do not duplicate item data in markup.
- Cards are stacked horizontal rows and show each available product's image, name, description, tags, and formatted price.
- Menu photos use the project asset paths with a local fallback path to remain reliable after GitHub upload.

## Result Page

Inside the main result card, the order is:

1. Line visual
2. `YOUR SUMMER PAUSE`
3. English product name
4. English mood
5. Main recommendation name, description, and tags
6. Main product image and price
7. Secondary recommendation name, description, image, and price

Missing images use the inline fallback image. Missing prices use the current default price. Order codes and staff-display screens must stay removed unless explicitly requested.

## Assets

- Brand logo: `github-upload-ready/assets/lcafe-logo.svg`
- Product photos: `github-upload-ready/assets/products/`
- Product images are used by both the result screen and the full menu. Keep image fallbacks in place for missing files.

## Content Workflow

1. The user edits `content/site-content-reference-all.xls`.
2. When asked to apply changes, update the canonical HTML from that workbook.
3. Update the same workbook if the site gains a new used field such as image or price.
4. Do not generate a second export workbook.

## Deployment

Upload the contents of `github-upload-ready/` to the repository root. GitHub Pages publishes from branch `main` and folder `/(root)`; no custom Actions workflow is required.

## Required Validation

- Inline JavaScript parses.
- No duplicate or missing element IDs.
- All local asset references exist.
- Quiz mappings resolve valid main and secondary codes.
- Missing image and price fallbacks work.
- No horizontal overflow at 320 px width.
