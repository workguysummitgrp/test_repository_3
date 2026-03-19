// NavBar — [FRD-014], [US-014]

import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchInput from '../ui/SearchInput';

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/search', label: 'Search' },
  { to: '/watchlist', label: 'Watchlist' },
];

export default function NavBar() {
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  return (
    <nav className="fixed top-0 w-full h-16 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-lg font-bold text-indigo-600">
            StockPortal
          </NavLink>
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-100 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="hidden md:block" onKeyDown={handleKeyDown}>
          <SearchInput
            value={quickSearch}
            onChange={setQuickSearch}
            compact
          />
        </div>
      </div>
    </nav>
  );
}
