(function () {
  'use strict';

  const data = window.LCAFE_DATA;
  if (!data) {
    document.body.innerHTML = '<p style="padding:24px;font-family:Tahoma">اطلاعات سایت بارگذاری نشد.</p>';
    return;
  }

  const productByCode = new Map(data.products.map((product) => [product.code, product]));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const state = {
    screen: 'home',
    menuReturn: 'home',
    step: 1,
    selectedLine: null,
    mainProduct: null,
    alternateProduct: null,
    transitioning: false
  };

  const elements = {
    screens: Array.from(document.querySelectorAll('[data-screen]')),
    appMain: document.getElementById('app-main'),
    announcer: document.getElementById('screen-announcer'),
    homeMark: document.getElementById('home-mark'),
    startQuiz: document.getElementById('start-quiz'),
    openMenu: document.getElementById('open-menu'),
    quizStage: document.querySelector('.quiz-stage'),
    quizBack: document.getElementById('quiz-back'),
    quizProgress: document.getElementById('quiz-progress'),
    quizStepCurrent: document.getElementById('quiz-step-current'),
    quizDecorNumber: document.getElementById('quiz-decor-number'),
    quizEyebrow: document.getElementById('quiz-eyebrow'),
    quizHeading: document.getElementById('quiz-heading'),
    quizHint: document.querySelector('.quiz-hint'),
    quizOptions: document.getElementById('quiz-options'),
    revealScreen: document.getElementById('screen-reveal'),
    revealImage: document.getElementById('reveal-image'),
    resultPoster: document.getElementById('result-poster'),
    resultHome: document.getElementById('result-home'),
    resultIndex: document.getElementById('result-index'),
    resultLineVertical: document.getElementById('result-line-vertical'),
    resultImageMain: document.getElementById('result-image-main'),
    resultImageFragment: document.getElementById('result-image-fragment'),
    resultLine: document.getElementById('result-line'),
    resultTitle: document.getElementById('result-title'),
    resultTitleEn: document.getElementById('result-title-en'),
    resultPrice: document.getElementById('result-price'),
    resultMood: document.getElementById('result-mood'),
    resultDescription: document.getElementById('result-description'),
    resultTags: document.getElementById('result-tags'),
    alternateImage: document.getElementById('alternate-image'),
    alternateCode: document.getElementById('alternate-code'),
    alternateName: document.getElementById('alternate-name'),
    alternateNameEn: document.getElementById('alternate-name-en'),
    alternatePrice: document.getElementById('alternate-price'),
    rerollAlternate: document.getElementById('reroll-alternate'),
    restartQuiz: document.getElementById('restart-quiz'),
    resultMenu: document.getElementById('result-menu'),
    menuScreen: document.getElementById('screen-menu'),
    menuClose: document.getElementById('menu-close'),
    lineNav: document.getElementById('line-nav'),
    menuCatalogue: document.getElementById('menu-catalogue'),
    menuToTop: document.getElementById('menu-to-top')
  };

  function announce(message) {
    elements.announcer.textContent = '';
    window.setTimeout(() => {
      elements.announcer.textContent = message;
    }, 30);
  }

  function focusAfterPaint(target) {
    window.requestAnimationFrame(() => {
      const node = typeof target === 'string' ? document.querySelector(target) : target;
      if (node && typeof node.focus === 'function') {
        if (!node.matches('button, a, input, select, textarea, [tabindex]')) {
          node.setAttribute('tabindex', '-1');
        }
        node.focus({ preventScroll: true });
      }
    });
  }

  function showScreen(name, focusTarget, message) {
    state.screen = name;
    document.body.classList.toggle('is-immersive', name !== 'home');

    elements.screens.forEach((screen) => {
      const isActive = screen.dataset.screen === name;
      screen.hidden = !isActive;
      screen.classList.toggle('is-active', isActive);
      screen.setAttribute('aria-hidden', String(!isActive));
    });

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    focusAfterPaint(focusTarget || elements.appMain);
    if (message) announce(message);
  }

  function formatPrice(value, withCurrency) {
    const parsedValue = Number(value);
    const hasValidPrice = value !== null && value !== undefined && value !== '' && Number.isFinite(parsedValue) && parsedValue > 0;
    const numericValue = hasValidPrice ? parsedValue : data.defaultPrice;
    const formatted = new Intl.NumberFormat('fa-IR').format(numericValue);
    return withCurrency ? `${formatted} تومان` : formatted;
  }

  function getImagePath(product, width, format) {
    return `assets/images/products/${product.imageStem}-${width}.${format}`;
  }

  function createProductPicture(product, options) {
    const settings = Object.assign({
      alt: product.nameFa,
      size: '960',
      loading: 'lazy',
      fetchPriority: 'auto',
      sizes: '(max-width: 520px) 90vw, 468px'
    }, options || {});

    const picture = document.createElement('picture');
    picture.className = 'product-picture';

    const source = document.createElement('source');
    source.type = 'image/webp';
    source.srcset = `${getImagePath(product, '480', 'webp')} 480w, ${getImagePath(product, '960', 'webp')} 960w`;
    source.sizes = settings.sizes;

    const image = document.createElement('img');
    image.src = getImagePath(product, settings.size, 'jpg');
    image.srcset = `${getImagePath(product, '480', 'jpg')} 480w, ${getImagePath(product, '960', 'jpg')} 960w`;
    image.sizes = settings.sizes;
    image.alt = settings.alt;
    image.width = Number(settings.size);
    image.height = Number(settings.size);
    image.loading = settings.loading;
    image.decoding = 'async';
    image.fetchPriority = settings.fetchPriority;
    image.addEventListener('error', () => {
      picture.classList.add('is-missing');
      picture.setAttribute('role', settings.alt ? 'img' : 'presentation');
      if (settings.alt) picture.setAttribute('aria-label', `${settings.alt} — تصویر در دسترس نیست`);
      image.remove();
    }, { once: true });

    picture.append(source, image);
    return picture;
  }

  function randomProductExcluding(excludedCodes) {
    const excluded = new Set(excludedCodes.filter(Boolean));
    const pool = data.products.filter((product) => !excluded.has(product.code));
    if (!pool.length) return null;

    let randomIndex;
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      randomIndex = array[0] % pool.length;
    } else {
      randomIndex = Math.floor(Math.random() * pool.length);
    }
    return pool[randomIndex];
  }

  function resetQuizState() {
    state.step = 1;
    state.selectedLine = null;
    state.mainProduct = null;
    state.alternateProduct = null;
    state.transitioning = false;
  }

  function applyQuizProgress(step) {
    state.step = step;
    elements.quizProgress.dataset.step = String(step);
    elements.quizProgress.setAttribute('aria-valuenow', String(step));
    elements.quizStepCurrent.textContent = String(step).padStart(2, '0');
    elements.quizDecorNumber.textContent = String(step).padStart(2, '0');
    elements.quizStage.dataset.step = String(step);
  }

  function makeQuizOption(option, index, accent, ink, onSelect) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.dataset.optionId = option.id;
    button.setAttribute('aria-pressed', 'false');
    button.style.setProperty('--option-accent', accent);
    button.style.setProperty('--option-ink', ink);

    const marker = document.createElement('span');
    marker.className = 'quiz-option__marker';
    marker.textContent = option.marker || String(index + 1).padStart(2, '0');
    marker.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'quiz-option__text';
    text.textContent = option.text;

    const arrow = document.createElement('span');
    arrow.className = 'quiz-option__arrow';
    arrow.textContent = '↙';
    arrow.setAttribute('aria-hidden', 'true');

    button.append(marker, text, arrow);
    button.addEventListener('click', () => {
      if (state.transitioning) return;
      state.transitioning = true;
      elements.quizOptions.querySelectorAll('.quiz-option').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
        item.disabled = true;
      });
      const delay = prefersReducedMotion.matches ? 0 : 190;
      window.setTimeout(() => {
        onSelect(option);
        state.transitioning = false;
      }, delay);
    });
    return button;
  }

  function renderQuestionOne() {
    applyQuizProgress(1);
    elements.quizStage.removeAttribute('data-line');
    elements.quizBack.hidden = true;
    elements.quizEyebrow.textContent = 'QUESTION 01 / FEELING';
    elements.quizHeading.textContent = data.quiz.questionOne.text;
    elements.quizHint.textContent = 'یک گزینه را لمس کن؛ انتخابت فوراً ثبت می‌شود.';
    elements.quizOptions.replaceChildren();
    elements.quizOptions.dataset.count = String(data.quiz.questionOne.options.length);

    data.quiz.questionOne.options.forEach((option, index) => {
      const line = data.lines[option.line];
      const button = makeQuizOption(option, index, line.background, line.ink, (selected) => {
        state.selectedLine = selected.line;
        renderQuestionTwo(selected.line);
      });
      elements.quizOptions.append(button);
    });

    announce('سؤال اول از دو: ' + data.quiz.questionOne.text);
    focusAfterPaint(elements.quizHeading);
  }

  function renderQuestionTwo(lineId) {
    const question = data.quiz.questionTwo[lineId];
    const line = data.lines[lineId];
    if (!question || !line) return;

    applyQuizProgress(2);
    elements.quizStage.dataset.line = lineId;
    elements.quizBack.hidden = false;
    elements.quizEyebrow.textContent = `QUESTION 02 / ${line.nameEn}`;
    elements.quizHeading.textContent = question.text;
    elements.quizHint.textContent = 'آخرین انتخاب؛ بعد از آن نتیجه مخصوص تو ظاهر می‌شود.';
    elements.quizOptions.replaceChildren();
    elements.quizOptions.dataset.count = String(question.options.length);

    question.options.forEach((option, index) => {
      const product = productByCode.get(option.productCode);
      const accent = product ? product.paper : line.background;
      const ink = product ? product.ink : line.ink;
      const button = makeQuizOption(option, index, accent, ink, (selected) => {
        selectMainProduct(selected.productCode);
      });
      elements.quizOptions.append(button);
    });

    announce('سؤال دوم از دو: ' + question.text);
    focusAfterPaint(elements.quizHeading);
  }

  function startQuiz() {
    resetQuizState();
    showScreen('quiz', elements.quizHeading, 'کوییز دو سؤالی آغاز شد.');
    renderQuestionOne();
  }

  function handleQuizBack() {
    if (state.step === 2) {
      state.selectedLine = null;
      renderQuestionOne();
    } else {
      showHome();
    }
  }

  function selectMainProduct(code) {
    const product = productByCode.get(code);
    if (!product) return;
    state.mainProduct = product;
    state.alternateProduct = randomProductExcluding([product.code]);
    renderReveal(product);
  }

  function renderReveal(product) {
    const line = data.lines[product.line];
    elements.revealScreen.style.setProperty('--reveal-accent', product.accent || line.accent);
    elements.revealImage.replaceChildren(createProductPicture(product, {
      alt: '',
      loading: 'eager',
      fetchPriority: 'high',
      sizes: '(max-width: 520px) 78vw, 405px'
    }));
    showScreen('reveal', document.getElementById('reveal-title'), 'در حال آماده‌سازی نتیجه.');
    const delay = prefersReducedMotion.matches ? 80 : 880;
    window.setTimeout(() => {
      renderResult(product);
    }, delay);
  }

  function renderTags(target, tags) {
    target.replaceChildren();
    tags.forEach((tag) => {
      const item = document.createElement('li');
      item.textContent = tag;
      target.append(item);
    });
  }

  function renderResult(product) {
    const line = data.lines[product.line];
    const productPosition = data.products.findIndex((item) => item.code === product.code) + 1;

    elements.resultPoster.style.setProperty('--result-accent', product.accent);
    elements.resultPoster.style.setProperty('--result-ink', product.ink);
    elements.resultPoster.style.setProperty('--result-paper', product.paper);
    elements.resultIndex.textContent = String(productPosition).padStart(2, '0');
    elements.resultLineVertical.textContent = line.nameEn;
    elements.resultImageMain.replaceChildren(createProductPicture(product, {
      loading: 'eager',
      fetchPriority: 'high',
      sizes: '(max-width: 520px) 87vw, 452px'
    }));
    elements.resultImageFragment.replaceChildren(createProductPicture(product, {
      alt: '',
      loading: 'eager',
      sizes: '(max-width: 520px) 38vw, 198px'
    }));
    elements.resultLine.textContent = `${line.nameFa} / ${line.nameEn}`;
    elements.resultTitle.textContent = product.nameFa;
    elements.resultTitleEn.textContent = product.nameEn;
    elements.resultPrice.textContent = formatPrice(product.price, false);
    elements.resultMood.textContent = product.mood;
    elements.resultDescription.textContent = product.description;
    renderTags(elements.resultTags, product.tags);

    if (!state.alternateProduct || state.alternateProduct.code === product.code) {
      state.alternateProduct = randomProductExcluding([product.code]);
    }
    renderAlternate(state.alternateProduct);
    showScreen('result', elements.resultTitle, `نتیجه تو: ${product.nameFa}`);
  }

  function renderAlternate(product) {
    if (!product) return;
    elements.alternateImage.replaceChildren(createProductPicture(product, {
      loading: 'lazy',
      sizes: '(max-width: 520px) 40vw, 200px'
    }));
    elements.alternateCode.textContent = product.code;
    elements.alternateName.textContent = product.nameFa;
    elements.alternateNameEn.textContent = product.nameEn;
    elements.alternatePrice.textContent = formatPrice(product.price, true);
    announce(`پیشنهاد دوم: ${product.nameFa}`);
  }

  function rerollAlternate() {
    if (!state.mainProduct) return;
    const previousCode = state.alternateProduct ? state.alternateProduct.code : null;
    state.alternateProduct = randomProductExcluding([state.mainProduct.code, previousCode]);
    if (!state.alternateProduct) {
      state.alternateProduct = randomProductExcluding([state.mainProduct.code]);
    }
    renderAlternate(state.alternateProduct);
    focusAfterPaint(elements.rerollAlternate);
  }

  function createTextElement(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  }

  function createProductPoster(product, productIndex) {
    const article = document.createElement('article');
    article.className = 'product-poster';
    article.dataset.productCode = product.code;
    article.setAttribute('aria-labelledby', `product-${product.code}`);

    const visual = document.createElement('div');
    visual.className = 'product-poster__visual';

    const figure = document.createElement('figure');
    figure.className = 'product-poster__image';
    figure.append(createProductPicture(product, {
      loading: productIndex < 2 ? 'eager' : 'lazy',
      fetchPriority: productIndex === 0 ? 'high' : 'auto',
      sizes: '(max-width: 520px) 88vw, 458px'
    }));

    const code = createTextElement('span', 'product-poster__code', product.code);
    code.setAttribute('aria-hidden', 'true');
    const ring = document.createElement('span');
    ring.className = 'product-poster__ring';
    ring.setAttribute('aria-hidden', 'true');
    visual.append(figure, code, ring);

    const title = document.createElement('header');
    title.className = 'product-poster__title';
    const heading = createTextElement('h3', '', product.nameFa);
    heading.id = `product-${product.code}`;
    const englishName = createTextElement('p', '', product.nameEn);
    englishName.lang = 'en';
    englishName.dir = 'ltr';
    title.append(heading, englishName);

    const meta = document.createElement('div');
    meta.className = 'product-poster__meta';
    const description = createTextElement('p', 'product-poster__description', product.description);
    const price = document.createElement('div');
    price.className = 'product-poster__price';
    price.append(
      createTextElement('span', '', 'قیمت'),
      createTextElement('strong', '', formatPrice(product.price, false)),
      createTextElement('small', '', 'تومان')
    );

    const tags = document.createElement('ul');
    tags.className = 'product-poster__tags';
    tags.setAttribute('aria-label', 'ویژگی‌های محصول');
    product.tags.forEach((tag) => tags.append(createTextElement('li', '', tag)));
    meta.append(description, price, tags);

    article.append(visual, title, meta);
    return article;
  }

  function renderMenu() {
    const fragment = document.createDocumentFragment();
    let globalProductIndex = 0;

    Object.values(data.lines).forEach((line) => {
      const section = document.createElement('section');
      section.className = 'catalogue-chapter';
      section.id = `line-${line.id}`;
      section.dataset.line = line.id;
      section.style.setProperty('--chapter-accent', line.accent);
      section.style.setProperty('--chapter-background', line.background);
      section.style.setProperty('--chapter-ink', line.ink);
      section.setAttribute('aria-labelledby', `line-title-${line.id}`);

      const heading = document.createElement('header');
      heading.className = 'chapter-heading';
      const index = createTextElement('span', 'chapter-heading__index', line.index);
      index.setAttribute('aria-hidden', 'true');
      const mood = createTextElement('p', 'eyebrow', line.mood);
      mood.lang = 'en';
      mood.dir = 'ltr';
      const title = createTextElement('h2', '', line.nameEn);
      title.id = `line-title-${line.id}`;
      title.lang = 'en';
      title.dir = 'ltr';
      const fa = createTextElement('span', 'chapter-heading__fa', line.nameFa);
      heading.append(index, mood, title, fa);

      const productsWrap = document.createElement('div');
      productsWrap.className = 'chapter-products';
      data.products.filter((product) => product.line === line.id).forEach((product) => {
        productsWrap.append(createProductPoster(product, globalProductIndex));
        globalProductIndex += 1;
      });

      section.append(heading, productsWrap);
      fragment.append(section);
    });

    elements.menuCatalogue.replaceChildren(fragment);
    setupChapterObserver();
  }

  function setActiveLine(lineId) {
    elements.lineNav.querySelectorAll('[data-line-target]').forEach((button) => {
      const active = button.dataset.lineTarget === lineId;
      button.setAttribute('aria-current', String(active));
      if (active) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }

  let chapterObserver = null;
  function setupChapterObserver() {
    if (chapterObserver) chapterObserver.disconnect();
    if (!('IntersectionObserver' in window)) return;

    chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveLine(visible.target.dataset.line);
    }, {
      root: null,
      rootMargin: '-64px 0px -55% 0px',
      threshold: [0.05, 0.2, 0.45]
    });

    elements.menuCatalogue.querySelectorAll('.catalogue-chapter').forEach((chapter) => chapterObserver.observe(chapter));
  }

  function openMenu(returnTo) {
    state.menuReturn = returnTo || state.screen || 'home';
    showScreen('menu', document.getElementById('menu-title'), 'کاتالوگ کامل شامل هشت نوشیدنی باز شد.');
    setActiveLine('icedtea');
  }

  function closeMenu() {
    if (state.menuReturn === 'result' && state.mainProduct) {
      showScreen('result', elements.resultTitle, 'بازگشت به نتیجه.');
    } else {
      showHome();
    }
  }

  function showHome() {
    showScreen('home', elements.startQuiz, 'صفحه شروع.');
  }

  elements.startQuiz.addEventListener('click', startQuiz);
  elements.openMenu.addEventListener('click', () => openMenu('home'));
  elements.homeMark.addEventListener('click', showHome);
  elements.quizBack.addEventListener('click', handleQuizBack);
  elements.resultHome.addEventListener('click', showHome);
  elements.rerollAlternate.addEventListener('click', rerollAlternate);
  elements.restartQuiz.addEventListener('click', startQuiz);
  elements.resultMenu.addEventListener('click', () => openMenu('result'));
  elements.menuClose.addEventListener('click', closeMenu);
  elements.menuToTop.addEventListener('click', () => {
    elements.menuScreen.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    focusAfterPaint(document.getElementById('menu-title'));
  });

  elements.lineNav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-line-target]');
    if (!button) return;
    const lineId = button.dataset.lineTarget;
    const target = document.getElementById(`line-${lineId}`);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      setActiveLine(lineId);
      focusAfterPaint(target.querySelector('h2'));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (state.screen === 'menu') closeMenu();
    else if (state.screen === 'result' || state.screen === 'quiz') showHome();
  });

  renderMenu();

  window.__LCAFE_TEST__ = Object.freeze({
    data,
    getState: () => Object.assign({}, state),
    showHome,
    startQuiz,
    openMenu,
    closeMenu,
    selectMainProduct,
    renderQuestionOne,
    renderQuestionTwo,
    randomProductExcluding,
    formatPrice
  });
})();
