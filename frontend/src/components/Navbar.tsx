import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">💰 Finance Tracker</NavLink>
      </div>
      <ul className="navbar-links">
        { [
          { to: '/',          label: '📊 Dashboard',    end: true },
          { to: '/expenses',  label: '📋 Transactions', end: false },
          { to: '/categories',label: '🏷️ Categories',   end: false },
          { to: '/budgets',   label: '🎯 Budgets',      end: false },
          { to: '/reports',   label: '📈 Reports',      end: false },
          { to: '/settings',  label: '⚙️ Settings',     end: false },
        ].map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="navbar-right">
        <NavLink to="/add" className="btn btn-nav-add">+ Add</NavLink>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}
