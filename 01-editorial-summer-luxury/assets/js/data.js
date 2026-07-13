window.LCAFE_DATA = Object.freeze({
  lines: {
    icedtea: {
      key: 'icedtea',
      name: 'ICED TEA',
      fa: 'آیس‌تی',
      index: '01',
      mood: 'Clean · Aromatic · Tea-led',
      accent: '#9b7435',
      wash: '#e8dbc1',
      ink: '#40311d'
    },
    refresher: {
      key: 'refresher',
      name: 'REFRESHER',
      fa: 'رفرشر',
      index: '02',
      mood: 'Fresh · Fruity · Sparkling',
      accent: '#9d3145',
      wash: '#e3b9c1',
      ink: '#4d1721'
    },
    cloudy: {
      key: 'cloudy',
      name: 'CLOUDY',
      fa: 'کلودی',
      index: '03',
      mood: 'Soft · Creamy · Gentle Espresso',
      accent: '#6f7b65',
      wash: '#d9ddcf',
      ink: '#34402f'
    },
    frappe: {
      key: 'frappe',
      name: 'FRAPPE',
      fa: 'فراپه',
      index: '04',
      mood: 'Rich · Icy · Coffee Dessert',
      accent: '#815a45',
      wash: '#d8c4b6',
      ink: '#40281e'
    }
  },
  products: {
    icedtea: [
      {
        line: 'icedtea',
        code: 'IT-01',
        name: 'آیس‌تی اپل پارادایس',
        en: 'Apple Paradise Iced Tea',
        moodEn: 'Clean · Crisp · Tea-led',
        desc: 'چای سرد شفاف با حس سیب تازه؛ انتخابی سبک، روشن و خوش‌عطر برای وقتی که نوشیدنی‌ای خنک و ساده می‌خوای.',
        tags: ['سیب', 'شفاف', 'باغ تابستانی'],
        image: 'assets/images/products/it-01.jpg',
        price: 350000
      },
      {
        line: 'icedtea',
        code: 'IT-02',
        name: 'آیس‌تی پیچ بلک',
        en: 'Peach Black Tea Iced',
        moodEn: 'Fruity · Balanced · Tea-led',
        desc: 'ترکیب چای سرد سیاه و هلو با بافتی خنک و طعمی آشنا؛ انتخابی خوش‌عطر، متعادل و تابستانی برای کسانی که نوشیدنی‌ای امن و دلنشین میخواهند.',
        tags: ['هلویی', 'تابستان گرم', 'متعادل'],
        image: 'assets/images/products/it-02.jpg',
        price: 350000
      }
    ],
    refresher: [
      {
        line: 'refresher',
        code: 'RF-02',
        name: 'رفرشر انبه و شاهتوت',
        en: 'Mango & Blackberry Refresher',
        moodEn: 'Tropical · Fruity · Sparkling',
        desc: 'ترکیب انبه و شاهتوت با سودا؛ نوشیدنی‌ای ملس، خنک و سرزنده با طعمی میوه‌ای، مناسب روزهای گرم و لحظه‌هایی که دنبال یک انتخاب شاد تر هستی.',
        tags: ['ملس', 'انبه', 'استوایی'],
        image: 'assets/images/products/rf-02.jpg',
        price: 320000
      },
      {
        line: 'refresher',
        code: 'RF-03',
        name: 'رفرشر جینجر بیزل',
        en: 'Ginger Basil Refresher',
        moodEn: 'Refresh · Ginger · Sparkling',
        desc: 'ترکیب زنجبیل و ریحان ایتالیایی با سودا؛ ترکیبی تازه، طبیعی و متفاوت با تندی ملایم و طعمی سرزنده، برای کسانی که دنبال نوشیدنی‌ای خاص‌تر و خنک‌تر هستند.',
        tags: ['ریحان', 'زنجبیل', 'تازه'],
        image: 'assets/images/products/rf-03.jpg',
        price: 320000
      }
    ],
    cloudy: [
      {
        line: 'cloudy',
        code: 'CL-01',
        name: 'کلودی پسته',
        en: 'Pistachio Cloudy',
        moodEn: 'Soft · Creamy · Gentle Espresso',
        desc: 'کلودی پسته با بافتی نرم و کرمی؛ ترکیبی از طعم اصیل پسته و حضور ملایم اسپرسو که به نوشیدنی عمق، تعادل و لطافتی آرام می‌دهد.',
        tags: ['پسته', 'کرمی', 'اسپرسو آرام'],
        image: 'assets/images/products/cl-01.jpg',
        price: 430000
      },
      {
        line: 'cloudy',
        code: 'CL-03',
        name: 'کلودی کوکی',
        en: 'Cookie Cloudy',
        moodEn: 'Sweet · Creamy · Espresso Dessert',
        desc: 'انتخابی نرم، شیرین و کرمی، با طعم کوکی در مرکز و اسپرسویی ملایم در پس‌زمینه که به نوشیدنی عمق می‌دهد.',
        tags: ['کوکی', 'کرمی', 'اسپرسو آرام'],
        image: 'assets/images/products/cl-03.jpg',
        price: 430000
      }
    ],
    frappe: [
      {
        line: 'frappe',
        code: 'FR-01',
        name: 'فراپه کارامل نمکی',
        en: 'Salted Caramel Frappe',
        moodEn: 'Rich · Icy · Coffee Caramel',
        desc: 'نوشیدنی ای کرمی و یخی با ترکیب کارامل شیرین‌وشور و پایه قهوه، انتخابی کلاسیک، هارمونیک و لذت‌بخش.',
        tags: ['کارامل نمکی', 'شیرین', 'کلاسیک'],
        image: 'assets/images/products/fr-01.jpg',
        price: 370000
      },
      {
        line: 'frappe',
        code: 'FR-02',
        name: 'فراپه ارده',
        en: 'Tahini Frappe',
        moodEn: 'Nutty · Deep · Coffee Dessert',
        desc: 'با شخصیتی متناقض میان یخ و آتش، ترکیبی از بافت یخی و طعم گرم و عمیق ارده است؛ متفاوت و مناسب کسانی که دنبال انتخابی خاص‌تر از طعم ‌های کلاسیک هستند.',
        tags: ['ارده', 'اسپرسو', 'ژلاتو'],
        image: 'assets/images/products/fr-02.jpg',
        price: 370000
      }
    ]
  },
  quiz: {
    first: {
      text: 'الان از نوشیدنی‌ات چه جور حسی می‌خوای؟',
      answers: [
        { text: 'خوش عطر و شفاف', line: 'icedtea' },
        { text: 'میوه ای و سرزنده', line: 'refresher' },
        { text: 'ابری و لطیف', line: 'cloudy' },
        { text: 'برفی و شیرین', line: 'frappe' }
      ]
    },
    second: {
      icedtea: {
        text: 'این حس خوش عطر چه نوتی داشته باشه؟',
        answers: [
          { text: ' آرام و گرم', main: 'IT-01' },
          { text: 'پرانرژی و ملس', main: 'IT-02' }
        ]
      },
      refresher: {
        text: 'این حس میوه ای چه نوتی داشته باشه؟',
        answers: [
          { text: 'پرطراوت و استوایی ', main: 'RF-02' },
          { text: 'معطر و متفاوت', main: 'RF-03' }
        ]
      },
      cloudy: {
        text: 'این حس ابری چه نوتی داشته باشه؟',
        answers: [
          { text: 'لوکس و اصیل', main: 'CL-01' },
          { text: 'تضاد لطافت و تردی ', main: 'CL-03' }
        ]
      },
      frappe: {
        text: 'این حس برفی چه نوتی داشته باشه؟',
        answers: [
          { text: ' هارمونیک و آشنا', main: 'FR-01' },
          { text: 'گرم و جنوبی', main: 'FR-02' }
        ]
      }
    }
  }
});
