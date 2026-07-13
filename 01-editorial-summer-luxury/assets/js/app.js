(() => {
  'use strict';

  const data = window.LCAFE_DATA;
  if (!data) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fallbackPrice = 'قیمت در کافه';
  const fallbackImage = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#4c0d17"/>
      <circle cx="256" cy="232" r="146" fill="#f4efe5" opacity=".96"/>
      <path d="M177 175h158l-22 188c-3 25-24 44-50 44h-14c-26 0-47-19-50-44z" fill="#d9cdc0"/>
      <text x="256" y="470" text-anchor="middle" fill="#f4efe5" font-family="serif" font-size="23" letter-spacing="7">L CAFE</text>
    </svg>
  `)}`;

  const $ = (id) => document.getElementById(id);
  const views = [...document.querySelectorAll('[data-view]')];
  const elements = {
    header: $('siteHeader'),
    headerBack: $('headerBack'),
    headerMenu: $('headerMenu'),
    brandHome: $('brandHome'),
    startQuiz: $('startQuiz'),
    openMenu: $('openMenu'),
    quizSheet: $('quizSheet'),
    questionTitle: $('questionTitle'),
    answerList: $('answerList'),
    quizBack: $('quizBack'),
    stepLabel: $('stepLabel'),
    stepCount: $('stepCount'),
    stepGhost: $('stepGhost'),
    progress: document.querySelector('.quiz-progress'),
    progressMarker: $('progressMarker'),
    pauseTitle: $('pauseTitle'),
    resultHero: $('resultHero'),
    resultLineIndex: $('resultLineIndex'),
    resultLineEn: $('resultLineEn'),
    resultImage: $('resultImage'),
    resultCode: $('resultCode'),
    resultName: $('resultName'),
    resultEn: $('resultEn'),
    resultPrice: $('resultPrice'),
    resultMood: $('resultMood'),
    resultDescription: $('resultDescription'),
    resultTags: $('resultTags'),
    alternateImage: $('alternateImage'),
    alternateCode: $('alternateCode'),
    alternateLine: $('alternateLine'),
    alternateName: $('alternateName'),
    alternateEn: $('alternateEn'),
    alternateDescription: $('alternateDescription'),
    alternatePrice: $('alternatePrice'),
    resultMenu: $('resultMenu'),
    restartQuiz: $('restartQuiz'),
    backHome: $('backHome'),
    menuTitle: $('menuTitle'),
    lineNav: $('lineNav'),
    menuSections: $('menuSections'),
    menuHome: $('menuHome'),
    announcer: $('announcer')
  };

  let currentView = 'home';
  let quizStep = 0;
  let selectedLine = null;
  let resultState = null;
  let menuOrigin = 'home';
  let pauseTimer = 0;
  let answerTimer = 0;
  let menuRendered = false;
  let menuObserver = null;

  const allProducts = Object.values(data.products).flat();
  const productByCode = new Map(allProducts.map((product) => [product.code, product]));

  function getProduct(code) {
    return productByCode.get(code) || null;
  }

  function formatPrice(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0
      ? `${number.toLocaleString('fa-IR')} تومان`
      : fallbackPrice;
  }

  function assignImage(image, product, { eager = false } = {}) {
    image.onerror = () => {
      image.onerror = null;
      image.src = fallbackImage;
      image.alt = 'تصویر جایگزین نوشیدنی L Cafe';
    };
    image.loading = eager ? 'eager' : 'lazy';
    image.src = product?.image || fallbackImage;
    image.alt = product?.name ? `تصویر ${product.name}` : 'تصویر جایگزین نوشیدنی L Cafe';
  }

  function randomIndex(max) {
    if (max <= 1) return 0;
    if (window.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      window.crypto.getRandomValues(value);
      return value[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function chooseRandomAlternate(mainProduct) {
    const candidates = allProducts.filter((product) => product.code !== mainProduct.code);
    return candidates[randomIndex(candidates.length)] || mainProduct;
  }

  function announce(message) {
    elements.announcer.textContent = '';
    window.requestAnimationFrame(() => {
      elements.announcer.textContent = message;
    });
  }

  function snapshot() {
    return {
      view: currentView,
      quizStep,
      selectedLine,
      menuOrigin,
      mainCode: resultState?.main?.code || null,
      alternateCode: resultState?.alternate?.code || null
    };
  }

  function writeHistory(mode = 'push') {
    const hash = currentView === 'home' ? '#home' : `#${currentView}`;
    const method = mode === 'replace' ? 'replaceState' : 'pushState';
    window.history[method](snapshot(), '', hash);
  }

  function syncHeader(viewName) {
    const showHeader = viewName !== 'home' && viewName !== 'pause';
    elements.header.hidden = !showHeader;
    elements.headerMenu.hidden = viewName === 'menu';
    elements.header.classList.toggle('on-dark', viewName === 'result' && window.scrollY < 420);
    elements.header.classList.toggle('is-solid', viewName === 'quiz' || viewName === 'menu' || (viewName === 'result' && window.scrollY >= 420));
  }

  function focusElement(target) {
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.focus({ preventScroll: true });
    });
  }

  function showView(viewName, focusTarget, { historyMode = 'push', scroll = true } = {}) {
    window.clearTimeout(pauseTimer);
    window.clearTimeout(answerTimer);

    views.forEach((view) => {
      const active = view.dataset.view === viewName;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
      view.classList.remove('is-entering');
      if (active) {
        void view.offsetWidth;
        view.classList.add('is-entering');
      }
    });

    currentView = viewName;
    document.body.dataset.currentView = viewName;
    syncHeader(viewName);

    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    if (historyMode !== 'none') {
      writeHistory(historyMode);
    }

    focusElement(focusTarget);
  }

  function setLineVariables(element, lineMeta) {
    element.style.setProperty('--line-accent', lineMeta.accent);
    element.style.setProperty('--line-wash', lineMeta.wash);
    element.style.setProperty('--line-ink', lineMeta.ink);
  }

  function startQuiz({ historyMode = 'push' } = {}) {
    quizStep = 0;
    selectedLine = null;
    resultState = null;
    renderQuestion({ historyMode });
  }

  function createAnswerButton(answer, index) {
    const lineKey = quizStep === 0 ? answer.line : selectedLine;
    const lineMeta = data.lines[lineKey];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.style.setProperty('--answer-accent', lineMeta.accent);
    button.style.setProperty('--answer-wash', lineMeta.wash);
    button.style.setProperty('--answer-ink', lineMeta.ink);

    const number = document.createElement('span');
    number.className = 'answer-number';
    number.textContent = `0${index + 1}`;

    const text = document.createElement('span');
    text.className = 'answer-text';
    text.textContent = answer.text;

    const line = document.createElement('span');
    line.className = 'answer-line';
    line.dir = 'ltr';
    line.textContent = lineMeta.name;

    button.append(number, text, line);
    button.addEventListener('click', () => selectAnswer(button, answer));
    return button;
  }

  function renderQuestion({ historyMode = 'push' } = {}) {
    const question = quizStep === 0 ? data.quiz.first : data.quiz.second[selectedLine];
    if (!question) {
      startQuiz({ historyMode: 'replace' });
      return;
    }

    const displayStep = quizStep + 1;
    elements.stepLabel.textContent = quizStep === 0 ? 'مرحله اول' : 'مرحله دوم';
    elements.stepCount.textContent = `0${displayStep} / 02`;
    elements.stepGhost.textContent = `0${displayStep}`;
    elements.questionTitle.textContent = question.text;
    elements.progress.setAttribute('aria-valuenow', String(displayStep));
    elements.progressMarker.style.width = quizStep === 0 ? '50%' : '100%';
    elements.quizBack.hidden = quizStep === 0;

    if (selectedLine && data.lines[selectedLine]) {
      const lineMeta = data.lines[selectedLine];
      elements.progressMarker.style.background = lineMeta.accent;
    } else {
      elements.progressMarker.style.background = 'var(--wine)';
    }

    elements.answerList.replaceChildren(
      ...question.answers.map((answer, index) => createAnswerButton(answer, index))
    );

    showView('quiz', elements.questionTitle, { historyMode });
    announce(`${elements.stepLabel.textContent}: ${question.text}`);
  }

  function selectAnswer(button, answer) {
    const buttons = [...elements.answerList.querySelectorAll('button')];
    buttons.forEach((item) => {
      item.disabled = true;
      item.setAttribute('aria-disabled', 'true');
    });
    button.classList.add('is-selected');

    answerTimer = window.setTimeout(() => {
      if (quizStep === 0) {
        selectedLine = answer.line;
        quizStep = 1;
        renderQuestion();
        return;
      }

      const main = getProduct(answer.main) || data.products[selectedLine]?.[0];
      if (!main) {
        startQuiz({ historyMode: 'replace' });
        return;
      }

      resultState = {
        line: main.line,
        main,
        alternate: chooseRandomAlternate(main)
      };

      showView('pause', elements.pauseTitle);
      announce('در حال آماده‌کردن مکث تابستانی شما');
      pauseTimer = window.setTimeout(() => renderResult({ historyMode: 'replace' }), reducedMotion.matches ? 80 : 1180);
    }, reducedMotion.matches ? 20 : 240);
  }

  function renderResult({ historyMode = 'push' } = {}) {
    if (!resultState?.main || !resultState?.alternate) {
      startQuiz({ historyMode: 'replace' });
      return;
    }

    const { main, alternate } = resultState;
    const mainLine = data.lines[main.line];
    const alternateLine = data.lines[alternate.line];

    setLineVariables(elements.resultHero, mainLine);
    elements.resultLineIndex.textContent = mainLine.index;
    elements.resultLineEn.textContent = mainLine.name;
    elements.resultCode.textContent = main.code;
    assignImage(elements.resultImage, main, { eager: true });
    elements.resultName.textContent = main.name;
    elements.resultEn.textContent = main.en;
    elements.resultPrice.textContent = formatPrice(main.price);
    elements.resultMood.textContent = main.moodEn || mainLine.mood;
    elements.resultDescription.textContent = main.desc;
    elements.resultTags.replaceChildren(
      ...main.tags.map((tag) => Object.assign(document.createElement('span'), { textContent: tag }))
    );

    assignImage(elements.alternateImage, alternate);
    elements.alternateCode.textContent = alternate.code;
    elements.alternateLine.textContent = alternateLine.name;
    elements.alternateName.textContent = alternate.name;
    elements.alternateEn.textContent = alternate.en;
    elements.alternateDescription.textContent = alternate.desc;
    elements.alternatePrice.textContent = formatPrice(alternate.price);

    showView('result', elements.resultName, { historyMode });
    announce(`نتیجه کوییز: ${main.name}. پیشنهاد دوم: ${alternate.name}`);
  }

  function createMenuProduct(product, index) {
    const article = document.createElement('article');
    article.className = `product-spread${index % 2 ? ' is-even' : ''}`;

    const visual = document.createElement('div');
    visual.className = 'product-visual';

    const image = document.createElement('img');
    image.width = 512;
    image.height = 512;
    assignImage(image, product);

    const code = document.createElement('span');
    code.className = 'product-code';
    code.dir = 'ltr';
    code.textContent = product.code;

    const number = document.createElement('span');
    number.className = 'product-number';
    number.textContent = `0${index + 1}`;
    number.setAttribute('aria-hidden', 'true');

    visual.append(image, code, number);

    const copy = document.createElement('div');
    copy.className = 'product-copy';

    const topLine = document.createElement('div');
    topLine.className = 'product-topline';
    const title = document.createElement('h3');
    title.textContent = product.name;
    const price = document.createElement('strong');
    price.textContent = formatPrice(product.price);
    topLine.append(title, price);

    const english = document.createElement('p');
    english.className = 'product-name-en';
    english.dir = 'ltr';
    english.textContent = product.en;

    const mood = document.createElement('p');
    mood.className = 'product-mood';
    mood.dir = 'ltr';
    mood.textContent = product.moodEn;

    const tags = document.createElement('div');
    tags.className = 'product-tags';
    tags.append(...product.tags.map((tag) => Object.assign(document.createElement('span'), { textContent: tag })));

    const disclosure = document.createElement('button');
    disclosure.type = 'button';
    disclosure.className = 'product-disclosure';
    disclosure.setAttribute('aria-expanded', 'false');
    disclosure.innerHTML = '<span>خواندن توضیحات</span><i aria-hidden="true"></i>';

    const detail = document.createElement('div');
    detail.className = 'product-detail';
    const detailInner = document.createElement('div');
    const description = document.createElement('p');
    description.textContent = product.desc;
    detailInner.append(description);
    detail.append(detailInner);

    disclosure.addEventListener('click', () => {
      const open = article.classList.toggle('is-open');
      disclosure.setAttribute('aria-expanded', String(open));
      disclosure.querySelector('span').textContent = open ? 'بستن توضیحات' : 'خواندن توضیحات';
    });

    copy.append(topLine, english, mood, tags, disclosure, detail);
    article.append(visual, copy);
    return article;
  }

  function renderMenu() {
    if (menuRendered) return;

    Object.entries(data.lines).forEach(([lineKey, lineMeta], lineIndex) => {
      const navButton = document.createElement('button');
      navButton.type = 'button';
      navButton.textContent = lineMeta.name;
      navButton.dataset.target = `menu-${lineKey}`;
      navButton.style.setProperty('--nav-accent', lineMeta.accent);
      if (lineIndex === 0) navButton.setAttribute('aria-current', 'true');
      navButton.addEventListener('click', () => {
        document.getElementById(navButton.dataset.target)?.scrollIntoView({
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
      });
      elements.lineNav.append(navButton);

      const section = document.createElement('section');
      section.className = 'menu-line';
      section.id = `menu-${lineKey}`;
      section.setAttribute('aria-labelledby', `menu-heading-${lineKey}`);
      setLineVariables(section, lineMeta);

      const opening = document.createElement('header');
      opening.className = 'line-opening';
      opening.dataset.number = lineMeta.index;

      const openingTop = document.createElement('div');
      openingTop.className = 'line-opening-top';
      const openingIndex = document.createElement('span');
      openingIndex.className = 'line-opening-index';
      openingIndex.textContent = lineMeta.index;
      const openingMood = document.createElement('p');
      openingMood.className = 'line-opening-mood';
      openingMood.dir = 'ltr';
      openingMood.textContent = lineMeta.mood;
      openingTop.append(openingIndex, openingMood);

      const openingBottom = document.createElement('div');
      openingBottom.className = 'line-opening-bottom';
      const fa = document.createElement('p');
      fa.className = 'line-opening-fa';
      fa.textContent = lineMeta.fa;
      const en = document.createElement('h2');
      en.className = 'line-opening-en';
      en.id = `menu-heading-${lineKey}`;
      en.dir = 'ltr';
      en.textContent = lineMeta.name;
      openingBottom.append(fa, en);

      opening.append(openingTop, openingBottom);
      section.append(opening, ...data.products[lineKey].map(createMenuProduct));
      elements.menuSections.append(section);
    });

    if ('IntersectionObserver' in window) {
      menuObserver = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        elements.lineNav.querySelectorAll('button').forEach((button) => {
          button.setAttribute('aria-current', String(button.dataset.target === visible.target.id));
        });
      }, { rootMargin: '-32% 0px -55% 0px', threshold: [0, .25, .5] });

      elements.menuSections.querySelectorAll('.menu-line').forEach((section) => menuObserver.observe(section));
    }

    menuRendered = true;
  }

  function openMenu({ historyMode = 'push' } = {}) {
    renderMenu();
    if (currentView !== 'menu') menuOrigin = currentView === 'result' ? 'result' : 'home';
    showView('menu', elements.menuTitle, { historyMode });
    announce('منوی کامل تابستانی باز شد');
  }

  function goHome({ historyMode = 'push' } = {}) {
    showView('home', $('homeTitle'), { historyMode });
    announce('صفحه اصلی کمپین تابستانی');
  }

  function goBack() {
    if (currentView === 'quiz') {
      if (quizStep === 1) {
        quizStep = 0;
        selectedLine = null;
        renderQuestion();
      } else {
        goHome();
      }
      return;
    }

    if (currentView === 'menu') {
      if (menuOrigin === 'result' && resultState) renderResult();
      else goHome();
      return;
    }

    if (currentView === 'result') {
      goHome();
      return;
    }

    goHome();
  }

  function restoreState(state) {
    if (!state) {
      goHome({ historyMode: 'none' });
      return;
    }

    quizStep = Number(state.quizStep) || 0;
    selectedLine = state.selectedLine || null;
    menuOrigin = state.menuOrigin || 'home';
    const main = getProduct(state.mainCode);
    const alternate = getProduct(state.alternateCode);
    resultState = main && alternate ? { line: main.line, main, alternate } : null;

    if (state.view === 'menu') {
      openMenu({ historyMode: 'none' });
    } else if (state.view === 'result' && resultState) {
      renderResult({ historyMode: 'none' });
    } else if (state.view === 'quiz') {
      renderQuestion({ historyMode: 'none' });
    } else {
      goHome({ historyMode: 'none' });
    }
  }

  elements.startQuiz.addEventListener('click', () => startQuiz());
  elements.openMenu.addEventListener('click', () => openMenu());
  elements.headerMenu.addEventListener('click', () => openMenu());
  elements.brandHome.addEventListener('click', () => goHome());
  elements.headerBack.addEventListener('click', goBack);
  elements.quizBack.addEventListener('click', () => {
    quizStep = 0;
    selectedLine = null;
    renderQuestion();
  });
  elements.resultMenu.addEventListener('click', () => openMenu());
  elements.restartQuiz.addEventListener('click', () => startQuiz());
  elements.backHome.addEventListener('click', () => goHome());
  elements.menuHome.addEventListener('click', () => goHome());

  window.addEventListener('scroll', () => {
    if (currentView === 'result') syncHeader(currentView);
  }, { passive: true });

  window.addEventListener('popstate', (event) => restoreState(event.state));

  window.history.replaceState(snapshot(), '', '#home');
})();
