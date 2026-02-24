
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
  onOpenCart: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, cartCount, onOpenCart, language, setLanguage }) => {
  const t = translations[language].nav;
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentPage(Page.Home)}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-orange-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-slate-900 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
            <div className="relative text-white flex items-center justify-center">
              <span className="font-bold text-2xl leading-none tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                T<span className="text-orange-400">S</span>
              </span>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none flex items-center gap-1">
              TAM<span className="text-orange-600">SAL</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Premium Surfaces</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { id: Page.Home, label: t.home },
            { id: Page.Catalog, label: t.materials },
            { id: Page.Calculator, label: t.estimator },
            { id: Page.Contact, label: t.locations },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentPage(link.id)}
              className={`text-sm font-bold transition-all px-2 py-1 rounded-md ${
                currentPage === link.id ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            {(['en', 'kg', 'ru'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  language === lang 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <motion.button 
            animate={isPulsing ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            onClick={onOpenCart}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <i className="fas fa-shopping-cart text-xl"></i>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          <button 
            onClick={() => setCurrentPage(Page.PartnerRegister)}
            className="hidden lg:block bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            {t.partner}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;