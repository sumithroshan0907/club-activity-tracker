import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import {
  StudentIcon,
  CalendarIcon,
  ClubIcon,
  ActivityIcon,
  CheckIcon,
  CloseIcon,
  AwardIcon,
  StarIcon,
  MailIcon,
  PhoneIcon,
  LeaderboardIcon
} from './Icons';

/**
 * ==========================================================
 * INTERACTIVE STUDENT DETAILS & PROFILE MODAL
 * ==========================================================
 * Displays comprehensive attendance, events participated,
 * events won/honors, active clubs, and leaderboard rank.
 */
function StudentDetailsModal({ studentId, isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentDetails(studentId);
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, studentId]);

  const fetchStudentDetails = (id) => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/students/${id}/details`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch student details');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load student profile details.');
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  const student = data?.student;
  const participations = data?.participations || [];

  return (
    <Modal
      isOpen={isOpen}
      title={student ? `${student.studentName} — Profile & Activity History` : 'Student Details'}
      onClose={onClose}
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading student profile and attendance records...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--danger)' }}>
          {error}
        </div>
      ) : student ? (
        <div>
          {/* Student Profile Header Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(99, 102, 241, 0.07))',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {student.studentName}
                </h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-gray" style={{ fontWeight: 700 }}>
                    <code>{student.registrationNumber}</code>
                  </span>
                  <span className="badge badge-purple">
                    {student.department}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    ({student.academicYear})
                  </span>
                  {student.email && (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MailIcon size={12} color="var(--text-muted)" /> {student.email}
                    </span>
                  )}
                  {student.phoneNumber && (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <PhoneIcon size={12} color="var(--text-muted)" /> {student.phoneNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Leaderboard Badge */}
              <div style={{ textAlign: 'right' }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: data.rank === 1 ? '#fef3c7' : data.rank === 2 ? '#e2e8f0' : data.rank === 3 ? '#ffedd5' : '#e0e7ff',
                    color: data.rank === 1 ? '#b45309' : data.rank === 2 ? '#475569' : data.rank === 3 ? '#c2410c' : '#3730a3',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <AwardIcon size={14} color="currentColor" /> Rank #{data.rank} • {data.badge}
                </span>
              </div>
            </div>

            {/* 4 Performance Stat Tiles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                marginTop: '16px'
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-light)' }}>
                  <CalendarIcon size={20} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                    {data.totalEventsAttended}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Events Attended
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fef3c7' }}>
                  <AwardIcon size={20} color="#d97706" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#d97706' }}>
                    {data.eventsWon}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Events Won / Honors
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ color: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0e7ff' }}>
                  <ClubIcon size={20} color="var(--indigo)" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--indigo)' }}>
                    {data.clubsCount}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Active Clubs
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#dcfce7' }}>
                  <LeaderboardIcon size={20} color="var(--success)" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>
                    #{data.rank}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Campus Standing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Clubs Badges */}
          {data.clubsList && data.clubsList.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Clubs Involved ({data.clubsList.length})
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {data.clubsList.map((club, cIdx) => (
                  <span
                    key={cIdx}
                    className="badge badge-indigo"
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    {club}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Events Participated Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
                Participation & Attendance Log ({participations.length})
              </h4>
            </div>

            {participations.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px' }}>
                <div className="empty-state-icon">
                  <CalendarIcon size={32} color="var(--text-muted)" />
                </div>
                <h4>No Event Attendance Records</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  This student has not participated in any club activities yet.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Activity Name</th>
                      <th>Organizing Club</th>
                      <th>Date</th>
                      <th>Attendance Status</th>
                      <th>Remarks & Achievements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participations.map((p, idx) => {
                      const isWinner = p.remarks && (
                        p.remarks.toLowerCase().includes('prize') ||
                        p.remarks.toLowerCase().includes('winner') ||
                        p.remarks.toLowerCase().includes('1st') ||
                        p.remarks.toLowerCase().includes('2nd') ||
                        p.remarks.toLowerCase().includes('runner')
                      );
                      const isSpeaker = p.remarks && p.remarks.toLowerCase().includes('speaker');

                      return (
                        <tr key={p.participationId || idx}>
                          <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                          <td>
                            <strong>{p.activity?.activityName || 'Club Event'}</strong>
                            {p.activity?.description && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {p.activity.description}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="badge badge-gray">
                              {p.activity?.clubName || 'General Club'}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {p.participationDate}
                          </td>
                          <td>
                            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckIcon size={12} color="currentColor" /> Attended
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                isWinner ? 'badge-green' : isSpeaker ? 'badge-purple' : 'badge-gray'
                              }`}
                              style={{
                                fontWeight: 600,
                                fontSize: '11px',
                                padding: '3px 8px',
                                display: 'inline-block'
                              }}
                            >
                              {p.remarks || 'Active Participant'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

export default StudentDetailsModal;
