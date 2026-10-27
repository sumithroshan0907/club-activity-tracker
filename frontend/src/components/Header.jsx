import React from 'react';

/**
 * ==========================================================
 * TOP HEADER COMPONENT
 * ==========================================================
 * Displays current page title, academic badge, and live
 * backend connectivity indicator.
 */
function Header({ activePage }) {
  const pageDetails = {
    dashboard: {
      title: 'Activity Dashboard',
      subtitle: 'Overview of campus clubs, student involvement, and recent events'
    },
    clubs: {
      title: 'College Clubs Management',
      subtitle: 'Register and manage student clubs'
    },
    students: {
      title: 'Student Directory',
      subtitle: 'Manage student directory and monitor campus involvement'
    },
    activities: {
      title: 'Activities & Attendance Tracker',
      subtitle: 'Organize club events and record student participation'
    },
    leaderboard: {
      title: 'Student Leaderboard',
      subtitle: 'Student rankings based on activity attendance'
    },
    reports: {
      title: 'Reports & File Export',
      subtitle: 'Printable summaries and Java File I/O report generation'
    }
  };

  const current = pageDetails[activePage] || {
    title: 'Student Club Activity Tracker',
    subtitle: 'Academic Activity System'
  };

  return (
    <header className="top-header">
      <div className="header-title-box">
        <h1>{current.title}</h1>
        <p>{current.subtitle}</p>
      </div>
    </header>
  );
}

export default Header;
