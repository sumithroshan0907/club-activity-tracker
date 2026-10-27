import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Notification from './components/Notification.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Clubs from './pages/Clubs.jsx';
import Students from './pages/Students.jsx';
import Activities from './pages/Activities.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Reports from './pages/Reports.jsx';

/**
 * ==========================================================
 * MAIN APP COMPONENT
 * ==========================================================
 * Manages active page navigation, global notifications,
 * and base responsive layout structure.
 */
function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [notification, setNotification] = useState(null);

  // Helper to trigger notifications with auto-dismiss after 6 seconds
  const showNotification = ({ type, message }) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 6000);
  };

  return (
    <div className="app-layout">
      {/* 1. Left Fixed Navigation Bar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* 2. Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Sticky Top Header */}
        <Header activePage={activePage} />

        {/* Dynamic Page Container */}
        <main className="content-container">
          {/* Global Dismissible Notification Banner */}
          <Notification
            notification={notification}
            onClose={() => setNotification(null)}
          />

          {/* Conditional Page Rendering */}
          {activePage === 'dashboard' && (
            <Dashboard onNavigate={setActivePage} setNotification={showNotification} />
          )}

          {activePage === 'clubs' && (
            <Clubs setNotification={showNotification} />
          )}

          {activePage === 'students' && (
            <Students setNotification={showNotification} />
          )}

          {activePage === 'activities' && (
            <Activities setNotification={showNotification} />
          )}

          {activePage === 'leaderboard' && (
            <Leaderboard setNotification={showNotification} />
          )}

          {activePage === 'reports' && (
            <Reports setNotification={showNotification} />
          )}

          <footer
            className="no-print"
            style={{
              marginTop: '48px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              color: 'var(--text-muted)',
              fontSize: '12px'
            }}
          >
            <div>
              <strong>Student Club Activity Tracker</strong>
            </div>
            <div>
              Spring Boot • React • MySQL
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
