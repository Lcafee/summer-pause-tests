# L Cafe — Find Your Summer Pause

بازطراحی موبایل‌محور کمپین تابستانی `L Cafe` با جهت هنری `Editorial Summer Luxury`.

## اجرای محلی

سایت بدون Build و بدون بک‌اند اجرا می‌شود.

روش پیشنهادی:

```bash
python -m http.server 8000
```

سپس پوشه پروژه را از مرورگر باز کنید. بازکردن مستقیم `index.html` نیز پشتیبانی می‌شود.

## انتشار روی GitHub Pages

تمام محتویات همین پوشه را در ریشه Repository قرار دهید و در تنظیمات Pages، انتشار را روی Branch اصلی و پوشه Root فعال کنید.

هیچ Workflow، Build Step، CDN یا متغیر محیطی لازم نیست.

## ساختار فایل‌ها

```text
index.html
assets/
  css/styles.css
  js/data.js
  js/app.js
  images/
    lcafe-logo.svg
    products/*.jpg
  fonts/
    *.woff2
    LICENSE-*.txt
content/
  site-content-reference-all.xls
  ORIGINAL_PROJECT_CONTEXT.md
QA_REPORT.md
README.md
```

## تغییر محصولات و قیمت‌ها

داده‌ای که سایت در زمان اجرا استفاده می‌کند در فایل زیر است:

```text
assets/js/data.js
```

در هر محصول می‌توان این موارد را تغییر داد:

- `name`
- `en`
- `moodEn`
- `desc`
- `tags`
- `image`
- `price`

فایل مرجع اصلی پروژه نیز بدون تغییر در مسیر زیر نگه داشته شده است:

```text
content/site-content-reference-all.xls
```

برای جلوگیری از ناهماهنگی، هر تغییر محتوایی باید هم در فایل مرجع و هم در `data.js` اعمال شود.

## تغییر فونت‌ها

فونت‌ها در مسیر زیر قرار دارند:

```text
assets/fonts/
```

تعریف `@font-face`ها در ابتدای فایل زیر است:

```text
assets/css/styles.css
```

فونت‌های استفاده‌شده:

- `Estedad` برای تیترهای فارسی
- `Vazirmatn` برای متن و رابط فارسی
- `Cormorant Garamond` برای تایپوگرافی ادیتوریال لاتین

هر سه با مجوز `SIL Open Font License 1.1` داخل پروژه قرار گرفته‌اند و فایل مجوزشان نیز همراه پروژه است.

## منطق کوییز

کوییز دقیقاً دو مرحله دارد:

1. سؤال اول یکی از چهار لاین را انتخاب می‌کند.
2. سؤال دوم کد محصول اصلی را مشخص می‌کند.

کدهای نتیجه اصلی قفل و مطابق فایل مرجع هستند:

- `IT-01`
- `IT-02`
- `RF-02`
- `RF-03`
- `CL-01`
- `CL-03`
- `FR-01`
- `FR-02`

پیشنهاد ثانویه **عمداً تصادفی** است. انتخاب آن از میان تمام محصولات به‌جز محصول اصلی انجام می‌شود و به فیلد `alt` فایل مرجع متصل نیست.

## نکات فنی

- بدون Framework
- بدون Dependency اجرایی
- مسیرهای کاملاً Relative
- مناسب GitHub Pages
- پشتیبانی از RTL، Safe Area و `dvh`
- پشتیبانی از `prefers-reduced-motion`
- تصویر و قیمت جایگزین برای داده مفقود
- تصاویر پایین صفحه با Lazy Loading
