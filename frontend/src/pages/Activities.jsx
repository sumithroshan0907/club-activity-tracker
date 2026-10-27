import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';
import StudentDetailsModal from '../components/StudentDetailsModal.jsx';
import {
  CalendarIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  AlertIcon,
  FileIcon
} from '../components/Icons.jsx';

/**
 * ==========================================================
 * ACTIVITIES & ATTENDANCE RECORDING PAGE
 * ==========================================================
 * Allows scheduling club activities and recording student
 * participation attendance while preventing duplicates.
 */
function Activities({ setNotification }) {
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'participation'

  // Interactive Student Details Modal
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Data lists
  const [activities, setActivities] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [students, setStudents] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filter
  const [activitySearch, setActivitySearch] = useState('');
  const [participationSearch, setParticipationSearch] = useState('');
  const [clubFilter, setClubFilter] = useState('ALL');
  const [remarksFilter, setRemarksFilter] = useState('ALL');

  // Modal State for Activities
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isEditingActivity, setIsEditingActivity] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);

  // Form State: Activity
  const [activityFormData, setActivityFormData] = useState({
    activityName: '',
    clubId: '',
    activityDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Form State: Participation
  const [participationFormData, setParticipationFormData] = useState({
    studentId: '',
    activityId: '',
    participationDate: new Date().toISOString().split('T')[0],
    remarks: 'Attended'
  });

  // Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'activity' | 'participation', id, label }

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:8080/api/activities').then((r) => r.json()),
      fetch('http://localhost:8080/api/clubs').then((r) => r.json()),
      fetch('http://localhost:8080/api/students').then((r) => r.json()),
      fetch('http://localhost:8080/api/participations').then((r) => r.json())
    ])
      .then(([acts, cls, stds, parts]) => {
        setActivities(acts);
        setClubs(cls);
        setStudents(stds);
        setParticipations(parts);
        if (cls.length > 0 && !activityFormData.clubId) {
          setActivityFormData((prev) => ({ ...prev, clubId: cls[0].clubId }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Error connecting to backend for activities data.'
        });
        setLoading(false);
      });
  };

  // Open modal for Adding an Activity
  const handleOpenAddActivity = () => {
    setIsEditingActivity(false);
    setCurrentActivityId(null);
    setActivityFormData({
      activityName: '',
      clubId: clubs.length > 0 ? clubs[0].clubId : '',
      activityDate: new Date().toISOString().split('T')[0],
      description: ''
    });
    setIsActivityModalOpen(true);
  };

  // Open modal for Editing an Activity
  const handleOpenEditActivity = (act) => {
    setIsEditingActivity(true);
    setCurrentActivityId(act.activityId);
    setActivityFormData({
      activityName: act.activityName,
      clubId: act.clubId,
      activityDate: act.activityDate,
      description: act.description || ''
    });
    setIsActivityModalOpen(true);
  };

  // Submit Activity Form (Create / Update)
  const handleSubmitActivity = (e) => {
    e.preventDefault();

    if (!activityFormData.activityName.trim()) {
      setNotification({ type: 'warning', message: 'Activity name is required.' });
      return;
    }

    const payload = {
      activityName: activityFormData.activityName,
      clubId: Number(activityFormData.clubId),
      activityDate: activityFormData.activityDate,
      description: activityFormData.description
    };

    if (isEditingActivity) {
      fetch(`http://localhost:8080/api/activities/${currentActivityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to update activity');
          return res.json();
        })
        .then(() => {
          setNotification({ type: 'success', message: 'Activity updated successfully!' });
          setIsActivityModalOpen(false);
          loadAllData();
        })
        .catch((err) => {
          console.error(err);
          setNotification({ type: 'danger', message: 'Failed to update activity.' });
        });
    } else {
      fetch('http://localhost:8080/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to schedule activity');
          return res.json();
        })
        .then(() => {
          setNotification({ type: 'success', message: 'New activity scheduled successfully!' });
          setIsActivityModalOpen(false);
          loadAllData();
        })
        .catch((err) => {
          console.error(err);
          setNotification({ type: 'danger', message: 'Failed to schedule activity.' });
        });
    }
  };

  // Handle Recording Student Participation
  const handleRecordParticipation = (e) => {
    e.preventDefault();

    if (!participationFormData.studentId || !participationFormData.activityId) {
      setNotification({ type: 'warning', message: 'Please select both student and activity.' });
      return;
    }

    const payload = {
      studentId: Number(participationFormData.studentId),
      activityId: Number(participationFormData.activityId),
      participationDate: participationFormData.participationDate,
      remarks: participationFormData.remarks
    };

    fetch('http://localhost:8080/api/participations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Duplicate attendance record');
          });
        }
        return res.json();
      })
      .then(() => {
        setNotification({
          type: 'success',
          message: 'Student participation recorded successfully!'
        });
        setParticipationFormData((prev) => ({
          ...prev,
          studentId: '',
          remarks: 'Attended'
        }));
        loadAllData();
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: err.message || 'Failed to record participation.'
        });
      });
  };

  // Open Delete Modal
  const handleOpenDelete = (type, id, label) => {
    setItemToDelete({ type, id, label });
    setDeleteModalOpen(true);
  };

  // Execute Delete
  const handleExecuteDelete = () => {
    if (!itemToDelete) return;

    const url =
      itemToDelete.type === 'activity'
        ? `http://localhost:8080/api/activities/${itemToDelete.id}`
        : `http://localhost:8080/api/participations/${itemToDelete.id}`;

    fetch(url, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Deletion failed');
        return res.json();
      })
      .then(() => {
        setNotification({
          type: 'success',
          message: `${itemToDelete.type === 'activity' ? 'Activity' : 'Participation record'} deleted successfully!`
        });
        setDeleteModalOpen(false);
        setItemToDelete(null);
        loadAllData();
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Failed to delete record.'
        });
        setDeleteModalOpen(false);
      });
  };

  const filteredActivities = activities.filter((a) =>
    a.activityName.toLowerCase().includes(activitySearch.toLowerCase()) ||
    (a.clubName && a.clubName.toLowerCase().includes(activitySearch.toLowerCase()))
  );

  const filteredParticipations = participations.filter((p) => {
    // 1. Text Search across Student Name, Reg No, Activity Name, Club, Remarks
    if (participationSearch.trim()) {
      const q = participationSearch.toLowerCase().trim();
      const sName = (p.student?.studentName || p.student?.name || '').toLowerCase();
      const regNo = (p.student?.registrationNumber || '').toLowerCase();
      const actName = (p.activity?.activityName || '').toLowerCase();
      const cName = (p.activity?.clubName || '').toLowerCase();
      const rem = (p.remarks || '').toLowerCase();

      const matches = sName.includes(q) || regNo.includes(q) || actName.includes(q) || cName.includes(q) || rem.includes(q);
      if (!matches) return false;
    }

    // 2. Club Filter
    if (clubFilter !== 'ALL') {
      const pClubName = p.activity?.clubName;
      if (pClubName !== clubFilter) return false;
    }

    // 3. Remarks Filter
    if (remarksFilter !== 'ALL') {
      const rem = (p.remarks || '').toLowerCase();
      if (remarksFilter === 'WINNERS' && !(rem.includes('winner') || rem.includes('1st') || rem.includes('prize'))) return false;
      if (remarksFilter === 'RUNNERS' && !(rem.includes('runner') || rem.includes('2nd'))) return false;
      if (remarksFilter === 'ATTENDED' && (rem.includes('winner') || rem.includes('runner'))) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Sub Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          className={`btn ${activeTab === 'activities' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('activities')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <CalendarIcon size={16} /> Club Activities ({activities.length})
        </button>
        <button
          className={`btn ${activeTab === 'participation' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('participation')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <EditIcon size={15} /> Record Attendance ({participations.length})
        </button>
      </div>

      {/* ================= TAB 1: ACTIVITIES MANAGEMENT ================= */}
      {activeTab === 'activities' && (
        <div>
          {/* Top Search & Create Bar */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '420px' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Filter by activity or club name..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                />
              </div>

              <button className="btn btn-primary" onClick={handleOpenAddActivity} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <PlusIcon size={15} /> Schedule New Activity
              </button>
            </div>
          </div>

          {/* Activities Table */}
          <div className="card">
            <div className="card-header-row">
              <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={16} color="var(--primary)" /> Scheduled Club Activities ({filteredActivities.length})
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading activities...
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>ID</th>
                      <th>Activity Name</th>
                      <th>Organizing Club</th>
                      <th>Event Date</th>
                      <th>Description</th>
                      <th style={{ textAlign: 'center', width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((act) => (
                      <tr key={act.activityId}>
                        <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{act.activityId}</td>
                        <td>
                          <strong>{act.activityName}</strong>
                        </td>
                        <td>
                          <span className="badge badge-blue">{act.clubName || 'General'}</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{act.activityDate}</td>
                        <td style={{ maxWidth: '300px', fontSize: '13px', color: 'var(--text-muted)' }}>
                          {act.description || '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              title="Edit activity"
                              onClick={() => handleOpenEditActivity(act)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <EditIcon size={12} /> Edit
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--danger)', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center' }}
                              title="Delete activity"
                              onClick={() => handleOpenDelete('activity', act.activityId, act.activityName)}
                            >
                              <TrashIcon size={13} />
                            </button>
                          </div>
                        </td>
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
                <h3>No Activities Found</h3>
                <p>Create club workshops, seminars, or competitions to get started.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={handleOpenAddActivity}>
                  Schedule First Activity
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: RECORD PARTICIPATION & LOG ================= */}
      {activeTab === 'participation' && (
        <div>
          {/* Quick Attendance Recording Card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header-row">
              <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <EditIcon size={16} color="var(--primary)" /> Record Student Participation
              </div>
              <span className="badge badge-indigo">Duplicate Prevention Active</span>
            </div>

            <form onSubmit={handleRecordParticipation}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Select Student *</label>
                  <select
                    className="form-control"
                    value={participationFormData.studentId}
                    onChange={(e) => setParticipationFormData({ ...participationFormData, studentId: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map((st) => (
                      <option key={st.studentId} value={st.studentId}>
                        {st.studentName || st.name} ({st.registrationNumber} - {st.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Activity *</label>
                  <select
                    className="form-control"
                    value={participationFormData.activityId}
                    onChange={(e) => setParticipationFormData({ ...participationFormData, activityId: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Activity --</option>
                    {activities.map((act) => (
                      <option key={act.activityId} value={act.activityId}>
                        {act.activityName} ({act.clubName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Participation Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={participationFormData.participationDate}
                    onChange={(e) =>
                      setParticipationFormData({ ...participationFormData, participationDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks / Role</label>
                  <select
                    className="form-control"
                    value={participationFormData.remarks}
                    onChange={(e) => setParticipationFormData({ ...participationFormData, remarks: e.target.value })}
                  >
                    <option value="Attended">Attended</option>
                    <option value="Winner - 1st Place">Winner - 1st Place</option>
                    <option value="Runner-Up - 2nd Place">Runner-Up - 2nd Place</option>
                    <option value="Volunteer / Organizer">Volunteer / Organizer</option>
                    <option value="Active Participant">Active Participant</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <PlusIcon size={14} /> Record Attendance
                </button>
              </div>
            </form>
          </div>

          {/* Historical Participation Table */}
          <div className="card">
            <div className="card-header-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <FileIcon size={16} color="var(--primary)" /> All Participation Records ({filteredParticipations.length}{filteredParticipations.length !== participations.length ? ` of ${participations.length}` : ''})
              </div>

              {/* Filter Controls Bar */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search student, reg, activity..."
                    value={participationSearch}
                    onChange={(e) => setParticipationSearch(e.target.value)}
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  />
                </div>

                <select
                  className="form-control"
                  value={clubFilter}
                  onChange={(e) => setClubFilter(e.target.value)}
                  style={{ width: '160px', fontSize: '13px', padding: '6px 10px' }}
                >
                  <option value="ALL">All Clubs</option>
                  {clubs.map((c) => (
                    <option key={c.clubId} value={c.clubName}>
                      {c.clubName}
                    </option>
                  ))}
                </select>

                <select
                  className="form-control"
                  value={remarksFilter}
                  onChange={(e) => setRemarksFilter(e.target.value)}
                  style={{ width: '150px', fontSize: '13px', padding: '6px 10px' }}
                >
                  <option value="ALL">All Remarks / Roles</option>
                  <option value="WINNERS">Winners / 1st</option>
                  <option value="RUNNERS">Runners-Up / 2nd</option>
                  <option value="ATTENDED">Regular Attended</option>
                </select>

                {(participationSearch || clubFilter !== 'ALL' || remarksFilter !== 'ALL') && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setParticipationSearch('');
                      setClubFilter('ALL');
                      setRemarksFilter('ALL');
                    }}
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading participation history...
              </div>
            ) : filteredParticipations.length > 0 ? (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>Log #</th>
                      <th>Student Name</th>
                      <th>Registration No</th>
                      <th>Activity Name</th>
                      <th>Club</th>
                      <th>Date</th>
                      <th>Remarks</th>
                      <th style={{ textAlign: 'center', width: '100px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipations.map((p) => (
                      <tr key={p.participationId}>
                        <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{p.participationId}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              if (p.student?.studentId) {
                                setSelectedStudentId(p.student.studentId);
                                setIsStudentModalOpen(true);
                              }
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
                            {p.student ? (p.student.studentName || p.student.name || 'Unknown') : 'Unknown'}
                          </button>
                        </td>
                        <td>
                          <span className="badge badge-gray" style={{ fontFamily: 'monospace' }}>
                            {p.student ? p.student.registrationNumber : '—'}
                          </span>
                        </td>
                        <td>{p.activity ? p.activity.activityName : 'Unknown'}</td>
                        <td>
                          <span className="badge badge-blue">
                            {p.activity ? p.activity.clubName : '—'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{p.participationDate}</td>
                        <td>
                          <span
                            className={`badge ${
                              p.remarks && p.remarks.includes('Winner')
                                ? 'badge-orange'
                                : p.remarks && p.remarks.includes('Runner')
                                ? 'badge-purple'
                                : 'badge-green'
                            }`}
                          >
                            {p.remarks || 'Attended'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center' }}
                            title="Remove attendance record"
                            onClick={() =>
                              handleOpenDelete(
                                'participation',
                                p.participationId,
                                `${p.student?.studentName || p.student?.name} in ${p.activity?.activityName}`
                              )
                            }
                          >
                            <TrashIcon size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : participations.length > 0 ? (
              <div className="empty-state" style={{ padding: '36px' }}>
                <div className="empty-state-icon">
                  <FileIcon size={32} color="var(--text-muted)" />
                </div>
                <h3>No Matching Records</h3>
                <p>No participation records match the selected search or filter criteria.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '12px' }}
                  onClick={() => {
                    setParticipationSearch('');
                    setClubFilter('ALL');
                    setRemarksFilter('ALL');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FileIcon size={32} color="var(--text-muted)" />
                </div>
                <h3>No Participation Records Yet</h3>
                <p>Use the form above to record student attendance in club activities.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Activity Modal */}
      <Modal
        isOpen={isActivityModalOpen}
        title={isEditingActivity ? 'Edit Club Activity' : 'Schedule New Activity'}
        onClose={() => setIsActivityModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsActivityModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmitActivity}>
              {isEditingActivity ? 'Update Activity' : 'Create Activity'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitActivity}>
          <div className="form-group">
            <label className="form-label">Activity Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Web Development Hackathon, Debate Competition"
              value={activityFormData.activityName}
              onChange={(e) => setActivityFormData({ ...activityFormData, activityName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Organizing Club *</label>
              <select
                className="form-control"
                value={activityFormData.clubId}
                onChange={(e) => setActivityFormData({ ...activityFormData, clubId: e.target.value })}
                required
              >
                {clubs.map((c) => (
                  <option key={c.clubId} value={c.clubId}>
                    {c.clubName} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                className="form-control"
                value={activityFormData.activityDate}
                onChange={(e) => setActivityFormData({ ...activityFormData, activityDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Activity Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Summary of topics, judging criteria, or event schedule..."
              value={activityFormData.description}
              onChange={(e) => setActivityFormData({ ...activityFormData, description: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Confirm Record Deletion"
        onClose={() => setDeleteModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleExecuteDelete}>
              Confirm Delete
            </button>
          </>
        }
      >
        <p style={{ fontSize: '15px', color: 'var(--text-main)' }}>
          Are you sure you want to delete this {itemToDelete?.type === 'activity' ? 'activity' : 'participation log'}:{' '}
          <strong>"{itemToDelete?.label}"</strong>?
        </p>
        <p style={{ fontSize: '13px', color: 'var(--danger)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertIcon size={14} color="var(--danger)" /> This action cannot be undone.
        </p>
      </Modal>

      {/* Interactive Student Details & History Modal */}
      <StudentDetailsModal
        studentId={selectedStudentId}
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />
    </div>
  );
}

export default Activities;
