// client/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiBrainLine, RiDashboardLine, RiAddLine, RiLogoutBoxLine } from 'react-icons/ri';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <RiBrainLine size={20} color="var(--blue)" />
        Interview<span className="accent">AI</span>
      </Link>

      <div className="flex gap-2">
        {location.pathname === '/dashboard' && (
          <span className="flex gap-1 hide-mobile" style={{ color: 'var(--t3)', fontSize: '.8rem', alignItems: 'center' }}>
            <RiDashboardLine size={14} /> Dashboard
          </span>
        )}

        <span className="nav-link hide-mobile flex gap-1" style={{ alignItems: 'center' }}>
          {user?.name}
        </span>

        {location.pathname === '/dashboard' && (
          <Link to="/setup" className="btn btn-primary btn-sm flex gap-1">
            <RiAddLine size={14} /> New
          </Link>
        )}

        <button onClick={handleLogout} className="btn btn-ghost btn-sm flex gap-1">
          <RiLogoutBoxLine size={14} />
          <span className="hide-mobile">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
