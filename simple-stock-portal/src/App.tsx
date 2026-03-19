// App.tsx — Root component with React Router [FRD-014]

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import StockDetailPage from './pages/StockDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <WatchlistProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <NavBar />
          <main className="flex-1 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/stock/:ticker" element={<StockDetailPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </WatchlistProvider>
    </BrowserRouter>
  );
}
