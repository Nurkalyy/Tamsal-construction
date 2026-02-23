
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import AIConsultant from './components/AIConsultant';
import { Page, Product, CartItem, Language, EstimationResult } from './types';
import { PRODUCTS, CATEGORIES, BISHKEK_LOCATIONS } from './constants';
import { calculateMaterials } from './services/geminiService';
import { translations } from './translations';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ru'); 
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);

  const t = translations[language];

  // Estimator States
  const [projType, setProjType] = useState('');
  const [projDims, setProjDims] = useState('');
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category.en === activeCategory || p.category[language] === activeCategory;
      const matchesSearch = p.name[language].toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description[language].toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, language]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { 
        id: product.id,
        name: product.name[language],
        category: product.category[language],
        price: product.price,
        unit: product.unit[language],
        image: product.image,
        stock: product.stock,
        quantity: quantity 
      }];
    });
  };

  const addMultipleToCart = (items: Array<{id: string, quantity: number}>) => {
    items.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (product) {
        addToCart(product, item.quantity);
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleEstimate = async () => {
    if (!projType || !projDims) return;
    setIsEstimating(true);
    setEstimationResult(null);
    const res = await calculateMaterials(projType, projDims, language);
    setEstimationResult(res);
    setIsEstimating(false);
  };

  const activeLoc = BISHKEK_LOCATIONS[selectedLocationIndex];
  const gMapsEmbedUrl = `https://maps.google.com/maps?q=${activeLoc.coords.lat},${activeLoc.coords.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-grow">
        {currentPage === Page.Home && (
          <div>
            <section className="relative h-[650px] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
                  className="w-full h-full object-cover filter brightness-[0.4] scale-105" 
                  alt="Modern interior with TamSal materials"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent"></div>
              </div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl text-white">
                  <div className="inline-flex items-center gap-2 bg-orange-600/20 backdrop-blur-sm border border-orange-500/30 px-4 py-2 rounded-full mb-8">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold uppercase tracking-widest text-orange-400">{t.hero.tagline}</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-[1.1]">
                    {t.hero.title_part1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{t.hero.title_accent}</span> {t.hero.title_part2}
                  </h1>
                  <p className="text-xl md:text-2xl mb-10 text-slate-300 max-w-xl leading-relaxed">
                    {t.hero.desc}
                  </p>
                  <div className="flex flex-wrap gap-5">
                    <button 
                      onClick={() => setCurrentPage(Page.Catalog)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-orange-900/20 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                    >
                      {t.hero.cta_browse} <i className="fas fa-chevron-right text-xs"></i>
                    </button>
                    <button 
                      onClick={() => setCurrentPage(Page.Calculator)}
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-2xl font-black transition-all hover:border-white/40"
                    >
                      {t.hero.cta_ai}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 bg-slate-50">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">{t.home.core_inv}</h2>
                    <p className="text-slate-500 text-lg">{t.home.core_desc}</p>
                  </div>
                  <button onClick={() => setCurrentPage(Page.Catalog)} className="group flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                    {t.home.view_all} <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                    <div 
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setCurrentPage(Page.Catalog); }}
                      className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group text-center"
                    >
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-50 transition-colors">
                        <i className={`fas fa-${cat.includes('PVC') ? 'th-large' : cat.includes('Laminate') ? 'align-justify' : cat.includes('Linoleum') ? 'scroll' : 'tools'} text-2xl text-slate-400 group-hover:text-orange-600 transition-colors`}></i>
                      </div>
                      <span className="font-bold text-slate-800 block leading-tight">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === Page.Catalog && (
          <section className="py-12 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-28">
                  <h3 className="font-bold text-lg mb-6">{t.catalog.categories}</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                          activeCategory === cat 
                            ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-200' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-400">{t.catalog.search}</h3>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-600 transition-all"
                      />
                      <i className="fas fa-search absolute left-3 top-2.5 text-slate-400"></i>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {activeCategory} {searchQuery && `${t.catalog.results_for} "${searchQuery}"`}
                  </h2>
                  <span className="text-slate-500 text-sm font-medium">{filteredProducts.length} {t.catalog.found}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-xl transition-all">
                      <div className="h-48 relative overflow-hidden">
                        <img src={product.image} alt={product.name[language]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {product.category[language]}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-900 leading-tight">{product.name[language]}</h3>
                          <span className="text-orange-600 font-bold">{product.price} KGS</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{product.description[language]}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs text-slate-400">{product.unit[language]}</span>
                          <button onClick={() => addToCart(product)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2">
                            <i className="fas fa-plus"></i> {t.catalog.add}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6"><i className="fas fa-search text-slate-400 text-3xl"></i></div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{t.catalog.no_found}</h3>
                      <p className="text-slate-500">{t.catalog.no_found_desc}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPage === Page.Calculator && (
          <section className="py-20 bg-slate-900 text-white min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-16">
                <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">{t.calculator.tag}</span>
                <h2 className="text-4xl font-extrabold mt-4 mb-6">{t.calculator.title}</h2>
                <p className="text-slate-400 text-lg">{t.calculator.desc}</p>
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">{t.calculator.proj_type}</label>
                    <input type="text" placeholder={t.calculator.proj_type_ph} value={projType} onChange={(e) => setProjType(e.target.value)} className="w-full bg-slate-900 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">{t.calculator.dims}</label>
                    <input type="text" placeholder={t.calculator.dims_ph} value={projDims} onChange={(e) => setProjDims(e.target.value)} className="w-full bg-slate-900 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 transition-all outline-none" />
                  </div>
                </div>
                <button onClick={handleEstimate} disabled={isEstimating || !projType || !projDims} className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg">
                  {isEstimating ? <><i className="fas fa-spinner animate-spin"></i> {t.calculator.btn_loading}</> : <><i className="fas fa-calculator"></i> {t.calculator.btn}</>}
                </button>

                {estimationResult && (
                  <div className="mt-12 p-8 bg-slate-900/50 rounded-2xl border border-orange-500/30 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2 mb-6 text-orange-500"><i className="fas fa-clipboard-check"></i><h3 className="font-bold text-xl uppercase tracking-wider">{t.calculator.results}</h3></div>
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono text-sm bg-black/20 p-6 rounded-xl border border-slate-700">{estimationResult.text}</div>
                    
                    {estimationResult.suggestedItems.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <h4 className="font-bold text-orange-400 text-sm uppercase tracking-widest">{language === 'en' ? 'Calculated Shopping List' : language === 'ru' ? 'Рассчитанный список покупок' : 'Эсептелген тизме'}</h4>
                        <div className="grid gap-3">
                          {estimationResult.suggestedItems.map((item, idx) => {
                            const product = PRODUCTS.find(p => p.id === item.id);
                            if (!product) return null;
                            return (
                              <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                  <img src={product.image} className="w-12 h-12 rounded-lg object-cover" alt={product.name[language]} />
                                  <div>
                                    <p className="font-bold text-sm">{product.name[language]}</p>
                                    <p className="text-xs text-slate-400">{item.quantity} {product.unit[language]} × {product.price} KGS</p>
                                  </div>
                                </div>
                                <span className="font-black text-orange-500">{item.quantity * product.price} KGS</span>
                              </div>
                            );
                          })}
                        </div>
                        <button 
                          onClick={() => addMultipleToCart(estimationResult.suggestedItems)}
                          className="w-full mt-4 bg-white text-slate-900 hover:bg-orange-100 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-cart-plus"></i>
                          {language === 'en' ? 'Add All to Cart' : language === 'ru' ? 'Добавить всё в корзину' : 'Баарын кошуу'}
                        </button>
                      </div>
                    )}
                    
                    <p className="mt-6 text-xs text-slate-500 italic">{t.calculator.disclaimer}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {currentPage === Page.Contact && (
          <section className="py-20 bg-white min-h-screen">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div>
                  <h2 className="text-4xl font-extrabold text-slate-900 mb-8">{t.contact.title}</h2>
                  <div className="space-y-6">
                    {BISHKEK_LOCATIONS.map((loc, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedLocationIndex(idx)}
                        className={`flex gap-6 p-6 rounded-3xl border transition-all cursor-pointer ${
                          selectedLocationIndex === idx 
                            ? 'bg-orange-50 border-orange-500 shadow-md ring-1 ring-orange-500' 
                            : 'bg-slate-50 border-slate-100 hover:border-orange-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          selectedLocationIndex === idx ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <i className="fas fa-map-marker-alt text-xl"></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-900 mb-2">{loc.name[language]}</h4>
                          <p className="text-slate-600 text-sm mb-4">{loc.address[language]}</p>
                          <div className="flex flex-wrap gap-2">
                            <a href={loc.twoGisUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-2 hover:bg-green-700 transition-colors">
                              <i className="fas fa-location-arrow"></i> {t.contact.open_2gis}
                            </a>
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${loc.coords.lat},${loc.coords.lng}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-2 hover:bg-blue-700 transition-colors"
                            >
                              <i className="fab fa-google"></i> {t.contact.open_gmaps}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky top-28 space-y-6">
                  <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                     <iframe
                        src={gMapsEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="transition-opacity duration-300"
                        title="Google Maps Location"
                      ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.cart.title}</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-900"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6"><i className="fas fa-shopping-basket text-slate-300 text-3xl"></i></div>
                  <h3 className="text-xl font-bold mb-2">{t.cart.empty}</h3>
                  <p className="text-slate-400">{t.cart.empty_desc}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">Qty: {item.quantity} x {item.price} KGS</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-600">{item.price * item.quantity} KGS</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t.cart.remove}</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-600 font-medium">{t.cart.subtotal}</span>
                  <span className="text-2xl font-black text-slate-900">{cartTotal} KGS</span>
                </div>
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200">{t.cart.checkout}</button>
                <p className="mt-4 text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">{t.cart.secure}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <AIConsultant language={language} />

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-orange-600 text-white p-2 rounded-lg"><i className="fas fa-hammer"></i></div>
                <h2 className="text-2xl font-bold">TamSal Bishkek</h2>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">{t.footer.desc}</p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">{t.footer.nav}</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><button onClick={() => setCurrentPage(Page.Home)} className="hover:text-orange-500">{t.nav.home}</button></li>
                <li><button onClick={() => setCurrentPage(Page.Catalog)} className="hover:text-orange-500">{t.nav.materials}</button></li>
                <li><button onClick={() => setCurrentPage(Page.Calculator)} className="hover:text-orange-500">{t.nav.estimator}</button></li>
                <li><button onClick={() => setCurrentPage(Page.Contact)} className="hover:text-orange-500">{t.nav.locations}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">{t.footer.contact}</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><i className="fas fa-phone mr-2 text-orange-500"></i> +996 (312) 555-555</li>
                <li><i className="fas fa-envelope mr-2 text-orange-500"></i> sales@tamsal.kg</li>
                <li><i className="fas fa-map-marker-alt mr-2 text-orange-500"></i> {BISHKEK_LOCATIONS[0].address[language]}</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>{t.footer.rights}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white">{t.footer.terms}</a>
              <a href="#" className="hover:text-white">{t.footer.seismic}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
