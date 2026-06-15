import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useCurrencies } from '../hooks/useCurrencies';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { currencies } = useCurrencies();
  const [defaultCurrency, setDefaultCurrency] = useState(
    localStorage.getItem('defaultCurrency') ?? 'USD'
  );

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    localStorage.setItem('defaultCurrency', code);
    setDefaultCurrency(code);
    toast.success(`Default currency set to ${code} — new transactions will use it`);
  };

  const selectedCurrency = currencies.find(c => c.code === defaultCurrency);

  return (
    <div className="page settings-page">
      <div className="page-header"><h1>Settings</h1></div>

      <div className="settings-grid">
        {/* Appearance */}
        <div className="card settings-card">
          <h3>🎨 Appearance</h3>
          <div className="settings-row">
            <div>
              <p className="settings-label">Theme</p>
              <p className="settings-sub">Switch between light and dark mode</p>
            </div>
            <button onClick={toggleTheme} className={`theme-switch ${theme === 'dark' ? 'dark' : ''}`}>
              <span className="theme-switch-thumb" />
            </button>
          </div>
          <div className="settings-row">
            <span className="settings-label">Current theme</span>
            <span className="badge">{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
          </div>
        </div>

        {/* Currency */}
        <div className="card settings-card">
          <h3>💱 Currency</h3>
          <div className="settings-row">
            <div>
              <p className="settings-label">Default Currency</p>
              <p className="settings-sub">Applied to new transactions automatically</p>
            </div>
            <select value={defaultCurrency} onChange={handleCurrencyChange} className="settings-select">
              {currencies.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} – {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
          {selectedCurrency && (
            <div className="currency-preview">
              <span className="currency-preview-flag">{selectedCurrency.flag}</span>
              <div>
                <p className="settings-label">{selectedCurrency.name}</p>
                <p className="settings-sub">
                  Symbol: <strong>{selectedCurrency.symbol}</strong> &nbsp;|&nbsp;
                  Code: <strong>{selectedCurrency.code}</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="card settings-card">
          <h3>ℹ️ About</h3>
          <div className="settings-row">
            <span className="settings-label">Application</span>
            <span className="settings-sub">Personal Finance Tracker</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Version</span>
            <span className="badge">v2.0.0</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">Stack</span>
            <span className="settings-sub">ASP.NET Core 8 · React · TypeScript · SQLite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
