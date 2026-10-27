import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DownloadIcon,
  PrintIcon
} from '../components/Icons';

/**
 * ==========================================================
 * REPORTS & FILE EXPORT PAGE
 * ==========================================================
 * Provides official reporting, browser print functionality,
 * and high-definition PDF export.
 */
function Reports({ setNotification }) {
  const [reportType, setReportType] = useState('summary'); // 'summary' | 'clubs' | 'students' | 'activities' | 'participations' | 'leaderboard'
  
  // Data state
  const [clubs, setClubs] = useState([]);
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllReportData();
  }, []);

  const loadAllReportData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:8080/api/clubs').then((r) => r.json()),
      fetch('http://localhost:8080/api/students').then((r) => r.json()),
      fetch('http://localhost:8080/api/activities').then((r) => r.json()),
      fetch('http://localhost:8080/api/participations').then((r) => r.json()),
      fetch('http://localhost:8080/api/leaderboard').then((r) => r.json())
    ])
      .then(([cls, stds, acts, parts, ldb]) => {
        setClubs(cls);
        setStudents(stds);
        setActivities(acts);
        setParticipations(parts);
        setLeaderboard(ldb);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Unable to connect to Spring Boot backend for report data.'
        });
        setLoading(false);
      });
  };

  // Browser Print handler
  const handlePrint = () => {
    window.print();
  };

  // Official PDF Generation Handler
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Top decorative primary header bar
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 5, 'F');

      // Academic Title & Subtitle
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42);
      doc.text('COLLEGE CAMPUS ACTIVITIES & STUDENT INVOLVEMENT REPORT', pageWidth / 2, 16, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text('Academic Session 2025-2026 • Department of Computer Science & Engineering', pageWidth / 2, 22, { align: 'center' });

      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`System: Student Club Activity Tracker   |   Date Generated: ${new Date().toLocaleDateString()}   |   Status: Official Academic Record`, pageWidth / 2, 27, { align: 'center' });

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 30, pageWidth - 14, 30);

      // 1. Executive Summary Statistics Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text('1. Executive Key Statistics', 14, 37);

      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Count', 'Scope & Description']],
        body: [
          ['Registered College Clubs', `${clubs.length}`, 'Active Academic and Co-Curricular Clubs'],
          ['Enrolled Students', `${students.length}`, 'Registered Student Members in System'],
          ['Conducted Activities', `${activities.length}`, 'Workshops, Hackathons, and Contests Conducted'],
          ['Total Participations Recorded', `${participations.length}`, 'Verified Student Attendance & Participation Logs']
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8.5, cellPadding: 2.5 }
      });

      // 2. Top Performing Students (Leaderboard)
      let currentY = doc.lastAutoTable.finalY + 9;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text('2. Top Performing Students (Leaderboard)', 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Rank', 'Student Name', 'Reg No', 'Department', 'Year', 'Attended', 'Honors / Recognition']],
        body: leaderboard.map((l) => [
          `#${l.rank}`,
          l.studentName,
          l.registrationNumber,
          l.department,
          l.academicYear,
          `${l.activitiesAttended} events`,
          l.badge || 'Active Member'
        ]),
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 }
      });

      // 3. Registered College Clubs
      currentY = doc.lastAutoTable.finalY + 9;
      if (currentY > pageHeight - 45) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text('3. Registered College Clubs Directory', 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['ID', 'Club Name', 'Category', 'Faculty Coordinator', 'Description']],
        body: clubs.map((c) => [
          `#${c.clubId}`,
          c.clubName,
          c.category,
          c.facultyCoordinator || 'Not Assigned',
          c.description || '—'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 }
      });

      // 4. Conducted Activities
      currentY = doc.lastAutoTable.finalY + 9;
      if (currentY > pageHeight - 45) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text('4. Conducted Activities Record', 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['ID', 'Activity Name', 'Organizing Club', 'Date', 'Description']],
        body: activities.map((a) => [
          `#${a.activityId}`,
          a.activityName,
          a.clubName,
          a.activityDate,
          a.description || '—'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 }
      });

      // 5. Official Participation Log
      currentY = doc.lastAutoTable.finalY + 9;
      if (currentY > pageHeight - 45) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138);
      doc.text('5. Official Student Participation & Attendance Log', 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Log #', 'Student Name', 'Reg No', 'Activity Name', 'Club', 'Date', 'Remarks']],
        body: participations.map((p) => [
          `#${p.participationId}`,
          p.student?.studentName || p.student?.name || '—',
          p.student?.registrationNumber || '—',
          p.activity?.activityName || '—',
          p.activity?.clubName || '—',
          p.participationDate,
          p.remarks || 'Attended'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2 }
      });

      // 6. Signoff Footer Block
      currentY = doc.lastAutoTable.finalY + 16;
      if (currentY > pageHeight - 35) {
        doc.addPage();
        currentY = 30;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.line(14, currentY + 14, 75, currentY + 14);
      doc.text('Faculty In-Charge / Coordinator', 14, currentY + 19);

      doc.line(pageWidth - 75, currentY + 14, pageWidth - 14, currentY + 14);
      doc.text('Head of Department (Seal & Sign)', pageWidth - 75, currentY + 19);

      // Running footer page numbers
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Student Club Activity Tracker  •  Confidential Academic Document  •  Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 8,
          { align: 'center' }
        );
      }

      // Trigger automatic browser download
      doc.save('Student_Club_Activity_Report.pdf');

      setNotification({
        type: 'success',
        message: 'Official PDF report downloaded successfully as Student_Club_Activity_Report.pdf!'
      });
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'danger',
        message: 'Failed to generate PDF report.'
      });
    }
  };

  return (
    <div>

      {/* Report Selection & Print Toolbar (no-print) */}
      <div className="card no-print" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${reportType === 'summary' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setReportType('summary')}
            >
              Executive Summary
            </button>
            <button
              className={`btn btn-sm ${reportType === 'clubs' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setReportType('clubs')}
            >
              Clubs ({clubs.length})
            </button>
            <button
              className={`btn btn-sm ${reportType === 'students' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setReportType('students')}
            >
              Students ({students.length})
            </button>
            <button
              className={`btn btn-sm ${reportType === 'activities' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setReportType('activities')}
            >
              Activities ({activities.length})
            </button>
            <button
              className={`btn btn-sm ${reportType === 'participations' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setReportType('participations')}
            >
              Participation Log ({participations.length})
            </button>
            <button
              className={`btn btn-sm ${reportType === 'leaderboard' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setReportType('leaderboard')}
            >
              Leaderboard ({leaderboard.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={handleDownloadPDF}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <DownloadIcon size={16} /> Download PDF
            </button>
            <button
              className="btn btn-secondary"
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <PrintIcon size={16} /> Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="card">
        {/* Printable Academic Header */}
        <div
          style={{
            borderBottom: '2px solid var(--text-main)',
            paddingBottom: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            College Campus Activities & Student Involvement Report
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Academic Session 2025-2026 • Department of Computer Science & Engineering
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '12px'
            }}
          >
            <span><strong>System:</strong> Student Club Activity Tracker</span>
            <span><strong>Date Generated:</strong> {new Date().toLocaleDateString()}</span>
            <span><strong>Status:</strong> Official Academic Record</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading report data from MySQL...
          </div>
        ) : (
          <div>
            {/* 1. EXECUTIVE SUMMARY VIEW */}
            {reportType === 'summary' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>1. Executive Key Statistics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered Clubs</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{clubs.length}</div>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enrolled Students</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--indigo)' }}>{students.length}</div>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Conducted Activities</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{activities.length}</div>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Participations</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--success)' }}>{participations.length}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>2. Top Performing Students</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student Name</th>
                        <th>Registration No</th>
                        <th>Department</th>
                        <th>Activities Attended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.slice(0, 5).map((s) => (
                        <tr key={s.studentId}>
                          <td><strong>#{s.rank}</strong></td>
                          <td>{s.studentName}</td>
                          <td><code>{s.registrationNumber}</code></td>
                          <td>{s.department}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.activitiesAttended} events</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. CLUBS REPORT */}
            {reportType === 'clubs' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>College Clubs Directory</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Club Name</th>
                        <th>Category</th>
                        <th>Faculty Coordinator</th>
                        <th>Specialization</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs.map((c) => (
                        <tr key={c.clubId}>
                          <td>#{c.clubId}</td>
                          <td><strong>{c.clubName}</strong></td>
                          <td>{c.category}</td>
                          <td>{c.facultyCoordinator || '—'}</td>
                          <td>
                            {c.programmingLanguage
                              ? c.programmingLanguage
                              : c.magazineName
                              ? c.magazineName
                              : 'General'}
                          </td>
                          <td style={{ fontSize: '12px' }}>{c.description || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. STUDENTS REPORT */}
            {reportType === 'students' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Student Members Directory</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Registration No</th>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((st) => (
                        <tr key={st.studentId}>
                          <td>#{st.studentId}</td>
                          <td><strong>{st.studentName || st.name}</strong></td>
                          <td><code>{st.registrationNumber}</code></td>
                          <td>{st.department}</td>
                          <td>{st.academicYear}</td>
                          <td>{st.email}</td>
                          <td>{st.phoneNumber || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. ACTIVITIES REPORT */}
            {reportType === 'activities' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Conducted Club Activities</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Activity Name</th>
                        <th>Organizing Club</th>
                        <th>Date</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((act) => (
                        <tr key={act.activityId}>
                          <td>#{act.activityId}</td>
                          <td><strong>{act.activityName}</strong></td>
                          <td>{act.clubName}</td>
                          <td>{act.activityDate}</td>
                          <td style={{ fontSize: '12px' }}>{act.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. PARTICIPATIONS REPORT */}
            {reportType === 'participations' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Official Participation Log</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Log #</th>
                        <th>Student Name</th>
                        <th>Registration No</th>
                        <th>Activity Name</th>
                        <th>Club</th>
                        <th>Date</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participations.map((p) => (
                        <tr key={p.participationId}>
                          <td>#{p.participationId}</td>
                          <td><strong>{p.student?.studentName || p.student?.name}</strong></td>
                          <td><code>{p.student?.registrationNumber}</code></td>
                          <td>{p.activity?.activityName}</td>
                          <td>{p.activity?.clubName}</td>
                          <td>{p.participationDate}</td>
                          <td>{p.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. LEADERBOARD REPORT */}
            {reportType === 'leaderboard' && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Official Student Leaderboard</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student Name</th>
                        <th>Registration No</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Activities Attended</th>
                        <th>Honors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((l) => (
                        <tr key={l.studentId}>
                          <td><strong>#{l.rank}</strong></td>
                          <td>{l.studentName}</td>
                          <td><code>{l.registrationNumber}</code></td>
                          <td>{l.department}</td>
                          <td>{l.academicYear}</td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{l.activitiesAttended}</td>
                          <td>{l.badge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Printable Signoff Footer */}
            <div
              style={{
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '1px dashed var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}
            >
              <div>
                <p>Faculty In-Charge / Coordinator Signature</p>
                <div style={{ marginTop: '30px', borderTop: '1px solid #94a3b8', width: '200px' }}></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p>Head of Department Signature & Seal</p>
                <div style={{ marginTop: '30px', borderTop: '1px solid #94a3b8', width: '200px', marginLeft: 'auto' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
