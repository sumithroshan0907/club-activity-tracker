import React, { useState, useEffect } from 'react';
import StudentDetailsModal from '../components/StudentDetailsModal.jsx';
import { LeaderboardIcon, UsersIcon } from '../components/Icons.jsx';

/**
 * ==========================================================
 * LEADERBOARD PAGE COMPONENT
 * ==========================================================
 * Calculates and presents student engagement rankings based
 * on cumulative activity attendance.
 */
function Leaderboard({ setNotification }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Interactive Student Details Modal
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/leaderboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load leaderboard');
        return res.json();
      })
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Error connecting to backend for leaderboard.'
        });
        setLoading(false);
      });
  };

  // Top 3 students featured in podium showcase tiles
  const top3 = leaderboard.slice(0, 3);
  // Rankings table starts from 4th onwards
  const studentsFromFourth = leaderboard.slice(3);

  const filtered = studentsFromFourth.filter(
    (item) =>
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase()) ||
      item.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  const maxAttended = leaderboard.length > 0 ? Math.max(...leaderboard.map((l) => l.activitiesAttended), 1) : 1;

  return (
    <div>
      {/* Top 3 Podium Showcase */}
      {top3.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {top3.map((entry, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const title = isFirst ? 'Gold Champion' : isSecond ? 'Silver Star' : 'Bronze Achiever';
            const borderColor = isFirst ? '#f59e0b' : isSecond ? '#94a3b8' : '#ea580c';
            const bgGrad = isFirst
              ? 'linear-gradient(135deg, #fffbeb, #fef3c7)'
              : isSecond
              ? 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
              : 'linear-gradient(135deg, #fff7ed, #ffedd5)';

            return (
              <div
                key={entry.studentId}
                className="card"
                style={{
                  background: bgGrad,
                  border: `2px solid ${borderColor}`,
                  textAlign: 'center',
                  padding: '24px',
                  boxShadow: isFirst ? '0 8px 20px rgba(245, 158, 11, 0.2)' : 'var(--shadow-md)'
                }}
              >
                <div
                  className={`rank-badge ${isFirst ? 'rank-1' : isSecond ? 'rank-2' : 'rank-3'}`}
                  style={{
                    width: '44px',
                    height: '44px',
                    fontSize: '18px',
                    margin: '0 auto 12px auto'
                  }}
                >
                  #{entry.rank}
                </div>

                <span
                  className="badge"
                  style={{
                    backgroundColor: '#ffffff',
                    border: `1px solid ${borderColor}`,
                    color: isFirst ? '#b45309' : isSecond ? '#475569' : '#c2410c',
                    fontWeight: 700,
                    marginBottom: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Rank #{entry.rank} • {title}
                </span>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentId(entry.studentId);
                      setIsStudentModalOpen(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--text-main)'
                    }}
                    title="Click to view full student profile & attendance history"
                  >
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '8px 0', textDecoration: 'underline' }}>
                      {entry.studentName}
                    </h3>
                  </button>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <code>{entry.registrationNumber}</code> • {entry.department} ({entry.academicYear})
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    display: 'inline-block',
                    width: '100%'
                  }}
                >
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
                    {entry.activitiesAttended}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Activities Attended
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="card">
        <div className="card-header-row">
          <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LeaderboardIcon size={18} color="var(--primary)" /> Student Rankings Table (From Rank #4)
          </div>

          <div style={{ maxWidth: '320px', width: '100%' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search student or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Calculating student participation rankings...
          </div>
        ) : filtered.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '70px', textAlign: 'center' }}>Rank</th>
                  <th>Student Details</th>
                  <th>Department & Year</th>
                  <th style={{ width: '220px' }}>Relative Involvement</th>
                  <th style={{ textAlign: 'right' }}>Events Attended</th>
                  <th>Achievement Badge</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const percent = Math.round((item.activitiesAttended / maxAttended) * 100);

                  return (
                    <tr key={item.studentId}>
                      <td style={{ textAlign: 'center' }}>
                        <span className="rank-badge rank-other">
                          #{item.rank}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(item.studentId);
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
                            fontSize: '14px',
                            textDecoration: 'underline'
                          }}
                          title="Click to view full student profile & attendance history"
                        >
                          {item.studentName}
                        </button>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <code>{item.registrationNumber}</code>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-purple">{item.department}</span>
                        <span className="badge badge-gray" style={{ marginLeft: '6px' }}>
                          {item.academicYear}
                        </span>
                      </td>
                      <td>
                        <div className="progress-bar-bg" style={{ height: '8px' }}>
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${percent}%`,
                              backgroundColor:
                                item.rank === 1
                                    ? 'var(--warning)'
                                  : item.rank === 2
                                  ? 'var(--secondary)'
                                  : 'var(--primary)'
                            }}
                          ></div>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {percent}% participation rate
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', color: 'var(--primary)' }}>
                        {item.activitiesAttended} events
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.badge.includes('Gold')
                              ? 'badge-orange'
                              : item.badge.includes('Silver')
                              ? 'badge-blue'
                              : item.badge.includes('Bronze')
                              ? 'badge-purple'
                              : 'badge-gray'
                          }`}
                        >
                          {item.badge}
                        </span>
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
            <h3>No Records Found</h3>
            <p>No student records match your query.</p>
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

export default Leaderboard;
