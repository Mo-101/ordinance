import React from 'react';
import { getNavItems } from '../../constants';
import NotificationBell from './NotificationBell';
import '../../styles/Header.css';

interface HeaderProps {
  currentUser: {
    name: string;
    role: string;
    country?: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onProfileSettings: () => void;
  onOrderClick: (orderId: string) => void;
}

function Header({ currentUser, activeTab, setActiveTab, onLogout, onProfileSettings, onOrderClick }: HeaderProps) {
  const navItems = getNavItems(currentUser.role);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-container">
        {/* Logo & Title */}
        <div className="header-brand">
          <div className="header-logo">WHO</div>
          <div>
            <h1 className="header-title">Health Commodity Order Management</h1>
            <p className="header-subtitle">HCOMS Portal</p>
          </div>
        </div>

        {/* User Info */}
        <div className="header-user">
          <div className="header-profile-container">
            <img 
              src="https://picsum.photos/seed/user-avatar/40/40.jpg" 
              alt="Profile" 
              className="header-profile-image"
            />
            <div className="header-profile-info">
              <div className="header-profile-name">
                {currentUser.name}
                {currentUser.country && <span>, {currentUser.country}</span>}
              </div>
              <div className="header-profile-role">{currentUser.role}</div>
            </div>
          </div>
          <NotificationBell onOrderClick={onOrderClick} />
          <button onClick={onProfileSettings} className="header-profile-btn" title="Profile Settings">
            ⚙️
          </button>
          <button onClick={onLogout} className="header-logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <div className="header-nav-container">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`header-nav-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
