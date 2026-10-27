import React from 'react';
import {
  DashboardIcon,
  ClubIcon,
  StudentIcon,
  ActivityIcon,
  LeaderboardIcon,
  ReportIcon
} from './Icons.jsx';

/**
 * ==========================================================
 * SIDEBAR NAVIGATION COMPONENT
 * ==========================================================
 * Fixed left navigation bar displaying system branding,
 * main modules, and academic badge.
 */
function Sidebar({ activePage, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={18} /> },
    { id: 'clubs', label: 'Clubs', icon: <ClubIcon size={18} /> },
    { id: 'students', label: 'Students', icon: <StudentIcon size={18} /> },
    { id: 'activities', label: 'Activities & Attendance', icon: <ActivityIcon size={18} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <LeaderboardIcon size={18} /> },
    { id: 'reports', label: 'Reports & File I/O', icon: <ReportIcon size={18} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <StudentIcon size={20} color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">ClubTracker</div>
          <div className="brand-sub">Academic Activity System</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div style={{ marginBottom: '6px', color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>
          COLLEGE PROJECT
        </div>
        <div className="sdg-badge">
          Quality Education System
        </div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
          Spring Boot • React • MySQL
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
