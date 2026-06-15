import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ExpenseList from './pages/ExpenseList';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/"           element={<Dashboard />} />
              <Route path="/expenses"   element={<ExpenseList />} />
              <Route path="/add"        element={<AddExpense />} />
              <Route path="/edit/:id"   element={<EditExpense />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/budgets"    element={<BudgetsPage />} />
              <Route path="/reports"    element={<ReportsPage />} />
              <Route path="/settings"   element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
