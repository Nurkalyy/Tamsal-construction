
import React from 'react';
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setCurrentPage(Page.Home)}
        >
          <div className="bg-orange-600 text-white p-2 rounded-lg group-hover:bg-orange-700 transition-colors">
            <i className="fas fa-hammer text-xl"></i>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">TamSal</h1>
            <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-widest mt-1">Interior Materials</p>
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
            {(['en', 'ky', 'ru'] as Language[]).map((lang) => (
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

          <button 
            onClick={onOpenCart}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <i className="fas fa-shopping-cart text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="hidden lg:block bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
            {t.partner}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;