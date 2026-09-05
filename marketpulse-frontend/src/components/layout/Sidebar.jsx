import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/watchlist', label: 'My Watchlist', icon: ListIcon },
  { to: '/market', label: 'Market Overview', icon: PulseIcon },
  { to: '/alerts', label: 'Alerts', icon: BellIcon },
  { to: '/settings', label: 'Settings', icon: GearIcon },
];

export default function Sidebar({ unreadAlerts = 0, open = false }) {
  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__mark">MP</span>
        <span className="sidebar__name">MarketPulse</span>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
            {to === '/alerts' && unreadAlerts > 0 && (
              <span className="sidebar__badge">{unreadAlerts}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__status">
          <span className="sidebar__status-dot" />
          Market open
        </div>
      </div>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.5" y="1.5" width="6" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="9.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.5" y="12.5" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M2 4.5h13M2 8.5h13M2 12.5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M1.5 9h3l1.8-5 3 8 2-5.5 1.5 2.5h3.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M8.5 2.2c-2 0-3.6 1.6-3.6 3.7v2.4c0 .6-.3 1.4-.8 1.9l-.6.7h10l-.6-.7c-.5-.5-.8-1.3-.8-1.9V5.9c0-2.1-1.6-3.7-3.6-3.7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 13.2a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <circle cx="8.5" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.5 1.8v1.6M8.5 13.6v1.6M15.2 8.5h-1.6M3.4 8.5H1.8M13.1 3.9l-1.1 1.1M5.5 11.5l-1.1 1.1M13.1 13.1l-1.1-1.1M5.5 5.5L4.4 4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
