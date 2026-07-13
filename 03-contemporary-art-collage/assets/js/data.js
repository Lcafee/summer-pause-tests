(function () {
  'use strict';

  const products = [
    {
      code: 'IT-01',
      imageStem: 'it-01',
      line: 'icedtea',
      nameFa: 'آیس‌تی اپل پارادایس',
      nameEn: 'Apple Paradise Iced Tea',
      mood: 'Clean · Crisp · Tea-led',
      description: 'چای سرد شفاف با حس سیب تازه؛ انتخابی سبک، روشن و خوش‌عطر برای وقتی که نوشیدنی‌ای خنک و ساده می‌خوای.',
      tags: ['سیب', 'شفاف', 'باغ تابستانی'],
      price: 350000,
      accent: '#9ca79f',
      ink: '#203029',
      paper: '#e9eee8'
    },
    {
      code: 'IT-02',
      imageStem: 'it-02',
      line: 'icedtea',
      nameFa: 'آیس‌تی پیچ بلک',
      nameEn: 'Peach Black Tea Iced',
      mood: 'Fruity · Balanced · Tea-led',
      description: 'ترکیب چای سرد سیاه و هلو با بافتی خنک و طعمی آشنا؛ انتخابی خوش‌عطر، متعادل و تابستانی برای کسانی که نوشیدنی‌ای امن و دلنشین می‌خواهند.',
      tags: ['هلویی', 'تابستان گرم', 'متعادل'],
      price: 350000,
      accent: '#d88b72',
      ink: '#4b261f',
      paper: '#f1ded4'
    },
    {
      code: 'RF-02',
      imageStem: 'rf-02',
      line: 'refresher',
      nameFa: 'رفرشر انبه و شاهتوت',
      nameEn: 'Mango & Blackberry Refresher',
      mood: 'Tropical · Fruity · Sparkling',
      description: 'ترکیب انبه و شاهتوت با سودا؛ نوشیدنی‌ای ملس، خنک و سرزنده با طعمی میوه‌ای، مناسب روزهای گرم و لحظه‌هایی که دنبال یک انتخاب شادتر هستی.',
      tags: ['ملس', 'انبه', 'استوایی'],
      price: 320000,
      accent: '#e8a02b',
      ink: '#4d2600',
      paper: '#f6dfac'
    },
    {
      code: 'RF-03',
      imageStem: 'rf-03',
      line: 'refresher',
      nameFa: 'رفرشر جینجر بیزل',
      nameEn: 'Ginger Basil Refresher',
      mood: 'Refresh · Ginger · Sparkling',
      description: 'ترکیب زنجبیل و ریحان ایتالیایی با سودا؛ ترکیبی تازه، طبیعی و متفاوت با تندی ملایم و طعمی سرزنده، برای کسانی که دنبال نوشیدنی‌ای خاص‌تر و خنک‌تر هستند.',
      tags: ['ریحان', 'زنجبیل', 'تازه'],
      price: 320000,
      accent: '#7a9660',
      ink: '#24351e',
      paper: '#dfe8d3'
    },
    {
      code: 'CL-01',
      imageStem: 'cl-01',
      line: 'cloudy',
      nameFa: 'کلودی پسته',
      nameEn: 'Pistachio Cloudy',
      mood: 'Soft · Creamy · Gentle Espresso',
      description: 'کلودی پسته با بافتی نرم و کرمی؛ ترکیبی از طعم اصیل پسته و حضور ملایم اسپرسو که به نوشیدنی عمق، تعادل و لطافتی آرام می‌دهد.',
      tags: ['پسته', 'کرمی', 'اسپرسو آرام'],
      price: 430000,
      accent: '#a6a87b',
      ink: '#383a22',
      paper: '#eaead8'
    },
    {
      code: 'CL-03',
      imageStem: 'cl-03',
      line: 'cloudy',
      nameFa: 'کلودی کوکی',
      nameEn: 'Cookie Cloudy',
      mood: 'Sweet · Creamy · Espresso Dessert',
      description: 'انتخابی نرم، شیرین و کرمی، با طعم کوکی در مرکز و اسپرسویی ملایم در پس‌زمینه که به نوشیدنی عمق می‌دهد.',
      tags: ['کوکی', 'کرمی', 'اسپرسو آرام'],
      price: 430000,
      accent: '#b88b6c',
      ink: '#422c21',
      paper: '#eadbce'
    },
    {
      code: 'FR-01',
      imageStem: 'fr-01',
      line: 'frappe',
      nameFa: 'فراپه کارامل نمکی',
      nameEn: 'Salted Caramel Frappe',
      mood: 'Rich · Icy · Coffee Caramel',
      description: 'نوشیدنی‌ای کرمی و یخی با ترکیب کارامل شیرین‌وشور و پایه قهوه، انتخابی کلاسیک، هارمونیک و لذت‌بخش.',
      tags: ['کارامل نمکی', 'شیرین', 'کلاسیک'],
      price: 370000,
      accent: '#b7784e',
      ink: '#3f2418',
      paper: '#ead2bf'
    },
    {
      code: 'FR-02',
      imageStem: 'fr-02',
      line: 'frappe',
      nameFa: 'فراپه ارده',
      nameEn: 'Tahini Frappe',
      mood: 'Nutty · Deep · Coffee Dessert',
      description: 'با شخصیتی متناقض میان یخ و آتش، ترکیبی از بافت یخی و طعم گرم و عمیق ارده است؛ متفاوت و مناسب کسانی که دنبال انتخابی خاص‌تر از طعم‌های کلاسیک هستند.',
      tags: ['ارده', 'اسپرسو', 'ژلاتو'],
      price: 370000,
      accent: '#c49c63',
      ink: '#49331e',
      paper: '#eee0c6'
    }
  ];

  const lines = {
    icedtea: {
      id: 'icedtea',
      nameEn: 'ICED TEA',
      nameFa: 'آیس‌تی',
      mood: 'Clean · Aromatic · Tea-led',
      index: '01',
      accent: '#9ca79f',
      background: '#dfe6df',
      ink: '#1f322a'
    },
    refresher: {
      id: 'refresher',
      nameEn: 'REFRESHER',
      nameFa: 'رفرشر',
      mood: 'Fresh · Fruity · Sparkling',
      index: '02',
      accent: '#c64957',
      background: '#f0c9ca',
      ink: '#4e1420'
    },
    cloudy: {
      id: 'cloudy',
      nameEn: 'CLOUDY',
      nameFa: 'کلودی',
      mood: 'Soft · Creamy · Gentle Espresso',
      index: '03',
      accent: '#887181',
      background: '#ded1d7',
      ink: '#38272f'
    },
    frappe: {
      id: 'frappe',
      nameEn: 'FRAPPE',
      nameFa: 'فراپه',
      mood: 'Rich · Icy · Coffee Dessert',
      index: '04',
      accent: '#9c654b',
      background: '#dfc2b3',
      ink: '#3b2218'
    }
  };

  const quiz = {
    questionOne: {
      text: 'الان از نوشیدنی‌ات چه جور حسی می‌خوای؟',
      options: [
        { id: 'q1-icedtea', text: 'خوش‌عطر و شفاف', line: 'icedtea', marker: 'A' },
        { id: 'q1-refresher', text: 'میوه‌ای و سرزنده', line: 'refresher', marker: 'B' },
        { id: 'q1-cloudy', text: 'ابری و لطیف', line: 'cloudy', marker: 'C' },
        { id: 'q1-frappe', text: 'برفی و شیرین', line: 'frappe', marker: 'D' }
      ]
    },
    questionTwo: {
      icedtea: {
        text: 'این حس خوش‌عطر چه نوتی داشته باشه؟',
        options: [
          { id: 'q2-it-01', text: 'آرام و گرم', productCode: 'IT-01' },
          { id: 'q2-it-02', text: 'پرانرژی و ملس', productCode: 'IT-02' }
        ]
      },
      refresher: {
        text: 'این حس میوه‌ای چه نوتی داشته باشه؟',
        options: [
          { id: 'q2-rf-02', text: 'پرطراوت و استوایی', productCode: 'RF-02' },
          { id: 'q2-rf-03', text: 'معطر و متفاوت', productCode: 'RF-03' }
        ]
      },
      cloudy: {
        text: 'این حس ابری چه نوتی داشته باشه؟',
        options: [
          { id: 'q2-cl-01', text: 'لوکس و اصیل', productCode: 'CL-01' },
          { id: 'q2-cl-03', text: 'تضاد لطافت و تردی', productCode: 'CL-03' }
        ]
      },
      frappe: {
        text: 'این حس برفی چه نوتی داشته باشه؟',
        options: [
          { id: 'q2-fr-01', text: 'هارمونیک و آشنا', productCode: 'FR-01' },
          { id: 'q2-fr-02', text: 'گرم و جنوبی', productCode: 'FR-02' }
        ]
      }
    }
  };

  window.LCAFE_DATA = Object.freeze({
    products: Object.freeze(products),
    lines: Object.freeze(lines),
    quiz: Object.freeze(quiz),
    defaultPrice: 350000
  });
})();
