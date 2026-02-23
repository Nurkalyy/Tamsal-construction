
import { Product, StoreLocation } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'pvc-1',
    name: {
      en: 'PVC Wall Panel - White Marble',
      ky: 'ПВХ дубал панели - Ак мрамор',
      ru: 'ПВХ панель для стен - Белый мрамор'
    },
    category: {
      en: 'PVC Panels',
      ky: 'ПВХ панелдери',
      ru: 'ПВХ панели'
    },
    price: 350,
    unit: { en: 'pcs', ky: 'даана', ru: 'шт' },
    image: 'https://images.unsplash.com/photo-1615873968403-89e068628265?auto=format&fit=crop&w=400&q=80',
    description: {
      en: 'Waterproof PVC panel, ideal for bathrooms and kitchens. Easy to clean and install.',
      ky: 'Суу өткөрбөйт ПВХ панели, жуунуучу бөлмө жана ашкана үчүн идеалдуу. Тазалоо жана орнотуу оңой.',
      ru: 'Влагостойкая ПВХ панель, идеально подходит для ванных комнат и кухонь. Легко чистится и монтируется.'
    },
    stock: 400
  },
  {
    id: 'lam-1',
    name: {
      en: 'Laminate Flooring - Natural Oak (32 Class)',
      ky: 'Ламинат - Табигый эмен (32-класс)',
      ru: 'Ламинат - Натуральный дуб (32 класс)'
    },
    category: {
      en: 'Laminate',
      ky: 'Ламинат',
      ru: 'Ламинат'
    },
    price: 850,
    unit: { en: 'sq.m', ky: 'кв.м', ru: 'кв.м' },
    image: 'https://images.unsplash.com/photo-1581850518616-bcb8188c443e?auto=format&fit=crop&w=400&q=80',
    description: {
      en: 'Durable 8mm laminate with a natural wood texture. High wear resistance.',
      ky: 'Табигый жыгач фактурасы менен бышык 8мм ламинат. Жогорку деңгээлдеги туруктуулук.',
      ru: 'Прочный ламинат 8мм с текстурой натурального дерева. Высокая износостойкость.'
    },
    stock: 120
  },
  {
    id: 'lin-1',
    name: {
      en: 'Semi-Commercial Linoleum - Grey Stone',
      ky: 'Линолеум - Боз таш',
      ru: 'Линолеум полукоммерческий - Серый камень'
    },
    category: {
      en: 'Linoleum',
      ky: 'Линолеум',
      ru: 'Линолеум'
    },
    price: 420,
    unit: { en: 'sq.m', ky: 'кв.м', ru: 'кв.м' },
    image: 'https://images.unsplash.com/photo-1562664377-709f2c337eb2?auto=format&fit=crop&w=400&q=80',
    description: {
      en: 'High-quality linoleum with felt backing for extra warmth and sound insulation.',
      ky: 'Жылуулук жана үн изоляциясы үчүн кийиз негизи бар жогорку сапаттагы линолеум.',
      ru: 'Качественный линолеум на войлочной основе для дополнительного тепла и шумоизоляции.'
    },
    stock: 200
  },
  {
    id: 'acc-1',
    name: {
      en: 'Laminate Underlayment (3mm)',
      ky: 'Ламинат астындагы төшөлмө (3мм)',
      ru: 'Подложка под ламинат (3мм)'
    },
    category: {
      en: 'Installation Materials',
      ky: 'Орнотуу материалдары',
      ru: 'Материалы для монтажа'
    },
    price: 65,
    unit: { en: 'sq.m', ky: 'кв.м', ru: 'кв.м' },
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=400&q=80',
    description: {
      en: 'Extruded polystyrene foam underlayment for floor leveling and soundproofing.',
      ky: 'Полду түздөө жана үн өткөрбөө үчүн экструдиялык пенополистирол төшөлмөсү.',
      ru: 'Подложка из экструдированного пенополистирола для выравнивания пола и шумоизоляции.'
    },
    stock: 500
  },
  {
    id: 'acc-2',
    name: {
      en: 'PVC Panel Glue (Strong Fix)',
      ky: 'ПВХ панели үчүн желим',
      ru: 'Клей для ПВХ панелей (Strong Fix)'
    },
    category: {
      en: 'Installation Materials',
      ky: 'Орнотуу материалдары',
      ru: 'Материалы для монтажа'
    },
    price: 280,
    unit: { en: 'tube', ky: 'даана', ru: 'туба' },
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80',
    description: {
      en: 'Specialized adhesive for fast and secure mounting of PVC panels to walls.',
      ky: 'ПВХ панелдерин дубалга тез жана ишенимдүү орнотуу үчүн атайын желим.',
      ru: 'Специализированный клей для быстрого и надежного монтажа ПВХ панелей на стены.'
    },
    stock: 150
  },
  {
    id: 'acc-3',
    name: {
      en: 'Floor Skirting - Modern Grey',
      ky: 'Плинтус - Заманбап боз',
      ru: 'Плинтус напольный - Модерн серый'
    },
    category: {
      en: 'Installation Materials',
      ky: 'Орнотуу материалдары',
      ru: 'Материалы для монтажа'
    },
    price: 120,
    unit: { en: 'pcs', ky: 'даана', ru: 'шт' },
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=400&q=80',
    description: {
      en: 'PVC floor skirting with a cable channel. Flexible edges for a perfect fit.',
      ky: 'Кабель каналы бар ПВХ плинтусу. Ийкемдүү четтери менен мыкты орнотулат.',
      ru: 'ПВХ плинтус с кабель-каналом. Мягкие края для плотного прилегания к стенам.'
    },
    stock: 300
  }
];

export const CATEGORIES = [
  'All',
  'PVC Panels',
  'Laminate',
  'Linoleum',
  'Installation Materials'
];

export const BISHKEK_LOCATIONS: StoreLocation[] = [
  {
    name: { en: "Main Showroom - Asanaliev", ky: "Башкы дүкөн - Асаналиев", ru: "Главный шоурум - Асаналиева" },
    address: { 
      en: "Asanaliev St, 16/7, Lenin, Bishkek, 720007", 
      ky: "Асаналиев көчөсү, 16/7, Ленин, Бишкек, 720007", 
      ru: "ул. Асаналиева, 16/7, Ленинский р-н, Бишкек, 720007" 
    },
    coords: { lat: 42.8552, lng: 74.5772 },
    twoGisUrl: "https://2gis.kg/bishkek/search/Асаналиев%2016%2F7"
  },
  {
    name: { en: "Warehouse North - Dordoi", ky: "Түндүк кампа - Дордой", ru: "Склад Север - Дордой" },
    address: { 
      en: "Dordoi Market, Sector 12, Bishkek", 
      ky: "Дордой базары, 12-сектор, Бишкек", 
      ru: "Рынок Дордой, 12-й сектор, Бишкек" 
    },
    coords: { lat: 42.9431, lng: 74.6211 },
    twoGisUrl: "https://2gis.kg/bishkek/search/Dordoi%20Market"
  }
];
