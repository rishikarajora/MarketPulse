import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import StockDetails from './pages/StockDetails';
import MarketOverview from './pages/MarketOverview';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import { getAlerts } from './services/api';
import './App.css';

const TITLES = {
  '/': 'Dashboard',
  '/watchlist': 'My Watchlist',
  '/market': 'Market Overview',
  '/alerts': 'Alerts',
  '/settings': 'Settings',
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const location = useLocation();

  useEffect(() => {
    getAlerts().then((list) => setUnreadAlerts(list.filter((a) => !a.read).length));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const title = TITLES[location.pathname] ?? (location.pathname.startsWith('/stock/') ? 'Stock details' : '');

  return (
    <div className="app-shell">
      <Sidebar unreadAlerts={unreadAlerts} open={menuOpen} />
      {menuOpen && <div className="app-shell__scrim" onClick={() => setMenuOpen(false)} />}
      <div className="app-shell__main">
        <Header unreadAlerts={unreadAlerts} onMenuClick={() => setMenuOpen((v) => !v)} title={title} />
        <div className="app-shell__content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/stock/:symbol" element={<StockDetails />} />
            <Route path="/market" element={<MarketOverview />} />
            <Route path="/alerts" element={<Alerts onAlertsChange={setUnreadAlerts} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
