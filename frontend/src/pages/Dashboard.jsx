import React, { useState, useEffect } from 'react';
import StudentDetailsModal from '../components/StudentDetailsModal.jsx';
import {
  ClubIcon,
  StudentIcon,
  ActivityIcon,
  UsersIcon,
  CalendarIcon,
  LeaderboardIcon,
  AwardIcon,
  StarIcon
} from '../components/Icons.jsx';

/**
 * ==========================================================
 * DASHBOARD PAGE COMPONENT
 * ==========================================================
 * Displays:
 * 1. Four summary cards (Clubs, Students, Activities, Active Members)
 * 2. Recent activities list
 * 3. Top five active students
 * 4. Club participation breakdown
 */
function Dashboard({ onNavigate, setNotification }) {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalStudents: 0,
    totalActivities: 0,
    activeMembers: 0,
    recentActivities: [],
    topStudents: [],
    clubSummary: []
  });

  // Interactive Student Details Modal
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from Spring Boot REST API
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/dashboard/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Unable to connect to backend on port 8080.'
        });
        setLoading(false);
      });
  };

  return (
    <div>
      {/* 1. Four Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('clubs')}>
          <div className="stat-icon-wrapper stat-blue">
            <ClubIcon size={24} color="#2563eb" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Clubs</span>
            <span className="stat-value">{stats.totalClubs}</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('students')}>
          <div className="stat-icon-wrapper stat-indigo">
            <StudentIcon size={24} color="#4f46e5" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{stats.totalStudents}</span>
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('activities')}>
          <div className="stat-icon-wrapper stat-orange">
            <CalendarIcon size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Activities</span>
            <span className="stat-value">{stats.totalActivities}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Grid (Recent Activities & Top 5 Students) */}
      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header-row">
            <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={16} color="var(--primary)" /> Recent Club Activities
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('activities')}>
              View All
            </button>
          </div>

          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Activity Name</th>
                    <th>Club</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivities.map((act) => (
                    <tr key={act.activityId}>
                      <td style={{ fontWeight: 600 }}>{act.activityName}</td>
                      <td>
                        <span className="badge badge-blue">{act.clubName}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{act.activityDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <CalendarIcon size={32} color="var(--text-muted)" />
              </div>
              <h3>No Recent Activities</h3>
              <p>Add club activities to track events and record student participations.</p>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '12px' }}
                onClick={() => onNavigate('activities')}
              >
                Add Activity
              </button>
            </div>
          )}
        </div>

        {/* Top 5 Active Students */}
        <div className="card">
          <div className="card-header-row">
            <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <LeaderboardIcon size={16} color="var(--secondary)" /> Top 5 Active Students
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('leaderboard')}>
              Full Leaderboard
            </button>
          </div>

          {stats.topStudents && stats.topStudents.length > 0 ? (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>Attended</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topStudents.map((st) => {
                    const isRank1 = st.rank === 1;
                    const isRank2 = st.rank === 2;
                    const isRank3 = st.rank === 3;

                    return (
                      <tr key={st.studentId}>
                        <td>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span className={`rank-badge ${isRank1 ? 'rank-1' : isRank2 ? 'rank-2' : isRank3 ? 'rank-3' : 'rank-other'}`}>
                              #{st.rank}
                            </span>
                            {isRank1 ? (
                              <AwardIcon size={16} color="#d97706" />
                            ) : isRank2 ? (
                              <AwardIcon size={16} color="#64748b" />
                            ) : isRank3 ? (
                              <AwardIcon size={16} color="#c2410c" />
                            ) : (
                              <StarIcon size={15} color="var(--primary)" />
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudentId(st.studentId);
                              setIsStudentModalOpen(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              textAlign: 'left',
                              cursor: 'pointer',
                              color: 'var(--primary)',
                              fontWeight: 700,
                              fontSize: '13px',
                              textDecoration: 'underline'
                            }}
                            title="Click to view full student profile & attendance history"
                          >
                            {st.studentName}
                          </button>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            <code>{st.registrationNumber}</code>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-purple">{st.department}</span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {st.activitiesAttended} events
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <UsersIcon size={32} color="var(--text-muted)" />
              </div>
              <h3>No Participation Records</h3>
              <p>Record student attendance in activities to generate the leaderboard.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Club Participation Breakdown - Visual Bar Graph */}
      <div className="card">
        <div className="card-header-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ActivityIcon size={18} color="var(--primary)" /> Club Participation Breakdown (Bar Graph)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#3b82f6', display: 'inline-block' }}></span> Technical
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#a855f7', display: 'inline-block' }}></span> Literary
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f97316', display: 'inline-block' }}></span> Cultural
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981', display: 'inline-block' }}></span> Sports
            </span>
          </div>
        </div>

        {stats.clubSummary && stats.clubSummary.length > 0 ? (
          (() => {
            const maxVal = Math.max(...stats.clubSummary.map((c) => c.participationCount), 1);
            const yMax = maxVal % 2 === 0 ? maxVal : maxVal + 1;
            const yMid = Math.round(yMax / 2);
            const totalAttendance = stats.clubSummary.reduce((acc, c) => acc + (c.participationCount || 0), 0);

            return (
              <div className="bar-chart-wrapper">
                {/* Visual Plotting Area */}
                <div className="bar-chart-area">
                  {/* Y-Axis Scale */}
                  <div className="bar-chart-y-axis">
                    <span>{yMax}</span>
                    <span>{yMid}</span>
                    <span>0</span>
                  </div>

                  {/* Horizontal Gridlines */}
                  <div className="bar-chart-gridline" style={{ top: '8%' }}></div>
                  <div className="bar-chart-gridline" style={{ top: '50%' }}></div>
                  <div className="bar-chart-gridline" style={{ bottom: '0' }}></div>

                  {/* Vertical Columns */}
                  <div className="bar-chart-columns-container">
                    {stats.clubSummary.map((c) => {
                      const count = c.participationCount || 0;
                      const heightPercent = yMax > 0 ? Math.max(Math.round((count / yMax) * 100), 5) : 5;

                      const isTech = c.category === 'Technical';
                      const isLit = c.category === 'Literary';
                      const isCult = c.category === 'Cultural';
                      const isSport = c.category === 'Sports';

                      const barGrad = isTech
                        ? 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)'
                        : isLit
                        ? 'linear-gradient(180deg, #a855f7 0%, #7e22ce 100%)'
                        : isCult
                        ? 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)'
                        : isSport
                        ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(180deg, #64748b 0%, #475569 100%)';

                      const shadowColor = isTech
                        ? 'rgba(37, 99, 235, 0.28)'
                        : isLit
                        ? 'rgba(168, 85, 247, 0.28)'
                        : isCult
                        ? 'rgba(249, 115, 22, 0.28)'
                        : isSport
                        ? 'rgba(16, 185, 129, 0.28)'
                        : 'rgba(100, 116, 139, 0.28)';

                      return (
                        <div className="bar-column-wrapper" key={c.clubId}>
                          {/* Value Tag on top */}
                          <div className="bar-pill-count">
                            {count} {count === 1 ? 'student' : 'students'}
                          </div>

                          {/* Graphical Bar */}
                          <div
                            className="bar-visual"
                            style={{
                              height: `${heightPercent}%`,
                              background: barGrad,
                              boxShadow: `0 4px 12px ${shadowColor}`
                            }}
                            title={`${c.clubName} (${c.category}): ${count} students attended`}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-Axis Labels (Club Name & Category Badge) */}
                <div className="bar-chart-x-axis">
                  {stats.clubSummary.map((c) => (
                    <div className="bar-column-labels" key={c.clubId}>
                      <span className="bar-club-title" title={c.clubName}>
                        {c.clubName}
                      </span>
                      <span
                        className={`badge ${
                          c.category === 'Technical'
                            ? 'badge-blue'
                            : c.category === 'Literary'
                            ? 'badge-purple'
                            : c.category === 'Cultural'
                            ? 'badge-orange'
                            : c.category === 'Sports'
                            ? 'badge-green'
                            : 'badge-gray'
                        }`}
                        style={{ fontSize: '10px', padding: '2px 6px', marginTop: '4px' }}
                      >
                        {c.category}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Chart Meta Stats Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '20px',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}
                >
                  <div>
                    <strong>Total Participations:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{totalAttendance} verified attendances</span>
                  </div>
                  <div>
                    <strong>Leading Club:</strong> <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{stats.clubSummary[0]?.clubName} ({stats.clubSummary[0]?.participationCount} students)</span>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ClubIcon size={32} color="var(--text-muted)" />
            </div>
            <h3>No Clubs Found</h3>
            <p>Create college clubs to organize student activities.</p>
          </div>
        )}
      </div>

      {/* Interactive Student Details & History Modal */}
      <StudentDetailsModal
        studentId={selectedStudentId}
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
