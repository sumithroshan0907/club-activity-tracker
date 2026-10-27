import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';
import StudentDetailsModal from '../components/StudentDetailsModal.jsx';
import {
  ClubIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  CalendarIcon,
  AlertIcon
} from '../components/Icons.jsx';

/**
 * ==========================================================
 * CLUBS MANAGEMENT PAGE
 * ==========================================================
 * Handles club registration, directory listing, search,
 * and detailed member/activity drill-down modals.
 */
function Clubs({ setNotification }) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClubId, setCurrentClubId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    clubName: '',
    category: 'Technical',
    facultyCoordinator: '',
    description: '',
    clubType: 'General',
    programmingLanguage: '',
    magazineName: ''
  });

  // Modal State for Delete Confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);

  // Modal State for Viewing Club Details & Members
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubDetails, setClubDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsTab, setDetailsTab] = useState('students'); // 'students' | 'activities'
  const [studentSearch, setStudentSearch] = useState('');

  // Interactive Student Details Modal
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Fetch all clubs on initial render
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/clubs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load clubs');
        return res.json();
      })
      .then((data) => {
        setClubs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Error connecting to backend for clubs data.'
        });
        setLoading(false);
      });
  };

  // Handle clicking club name to view details & participating students
  const handleViewClubDetails = (club) => {
    setSelectedClub(club);
    setIsDetailsModalOpen(true);
    setDetailsLoading(true);
    setClubDetails(null);
    setDetailsTab('students');
    setStudentSearch('');

    fetch(`http://localhost:8080/api/clubs/${club.clubId}/details`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch club details');
        return res.json();
      })
      .then((data) => {
        setClubDetails(data);
        setDetailsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: `Unable to load members for ${club.clubName}.`
        });
        setDetailsLoading(false);
      });
  };

  // Search clubs
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchClubs();
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8080/api/clubs/search?keyword=${encodeURIComponent(searchKeyword.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        setClubs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({ type: 'danger', message: 'Failed to search clubs.' });
        setLoading(false);
      });
  };

  // Open modal for Adding a new club
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentClubId(null);
    setFormData({
      clubName: '',
      category: 'Technical',
      facultyCoordinator: '',
      description: '',
      clubType: 'General',
      programmingLanguage: '',
      magazineName: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing club
  const handleOpenEditModal = (club) => {
    setIsEditing(true);
    setCurrentClubId(club.clubId);
    setFormData({
      clubName: club.clubName || '',
      category: club.category || 'Technical',
      facultyCoordinator: club.facultyCoordinator || '',
      description: club.description || '',
      clubType: 'General',
      programmingLanguage: '',
      magazineName: ''
    });
    setIsModalOpen(true);
  };

  // Handle Form Submission (Add or Update)
  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!formData.clubName.trim()) {
      setNotification({ type: 'warning', message: 'Club name is required.' });
      return;
    }

    if (isEditing) {
      fetch(`http://localhost:8080/api/clubs/${currentClubId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubId: currentClubId,
          clubName: formData.clubName,
          category: formData.category,
          facultyCoordinator: formData.facultyCoordinator,
          description: formData.description
        })
      })
        .then((res) => {
          if (!res.ok) throw new Error('Update failed');
          return res.json();
        })
        .then(() => {
          setNotification({ type: 'success', message: `Club "${formData.clubName}" updated successfully!` });
          setIsModalOpen(false);
          fetchClubs();
        })
        .catch((err) => {
          console.error(err);
          setNotification({ type: 'danger', message: 'Failed to update club details.' });
        });
    } else {
      fetch('http://localhost:8080/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then((res) => {
          if (!res.ok) throw new Error('Creation failed');
          return res.json();
        })
        .then(() => {
          setNotification({ type: 'success', message: `Club "${formData.clubName}" created successfully!` });
          setIsModalOpen(false);
          fetchClubs();
        })
        .catch((err) => {
          console.error(err);
          setNotification({ type: 'danger', message: 'Failed to create new club.' });
        });
    }
  };

  // Open Delete Confirmation
  const handleConfirmDelete = (club) => {
    setClubToDelete(club);
    setDeleteModalOpen(true);
  };

  // Execute Delete
  const handleDeleteClub = () => {
    if (!clubToDelete) return;
    fetch(`http://localhost:8080/api/clubs/${clubToDelete.clubId}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        return res.json();
      })
      .then(() => {
        setNotification({ type: 'success', message: `Club "${clubToDelete.clubName}" deleted successfully!` });
        setDeleteModalOpen(false);
        setClubToDelete(null);
        fetchClubs();
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Cannot delete club with linked activities or records.'
        });
        setDeleteModalOpen(false);
      });
  };

  return (
    <div>
      {/* Top Action Bar: Search & Add Button */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '480px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by club name or category..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <SearchIcon size={14} /> Search
            </button>
            {searchKeyword && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearchKeyword('');
                  fetchClubs();
                }}
              >
                Clear
              </button>
            )}
          </form>

          <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <PlusIcon size={15} /> Register New Club
          </button>
        </div>
      </div>

      {/* Clubs Table View */}
      <div className="card">
        <div className="card-header-row">
          <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ClubIcon size={18} color="var(--primary)" /> Registered College Clubs ({clubs.length})
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading clubs...
          </div>
        ) : clubs.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Club Name</th>
                  <th>Category</th>
                  <th>Faculty Coordinator</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'center', width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => {
                  return (
                    <tr key={club.clubId}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{club.clubId}</td>
                      <td>
                        <button
                          type="button"
                          className="club-name-btn"
                          onClick={() => handleViewClubDetails(club)}
                          title="Click to view club details and enrolled students"
                        >
                          <ClubIcon size={15} color="var(--primary)" />
                          <span>{club.clubName}</span>
                        </button>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            club.category === 'Technical'
                              ? 'badge-blue'
                              : club.category === 'Literary'
                              ? 'badge-purple'
                              : club.category === 'Cultural'
                              ? 'badge-orange'
                              : club.category === 'Sports'
                              ? 'badge-green'
                              : 'badge-gray'
                          }`}
                        >
                          {club.category}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px' }}>{club.facultyCoordinator || 'Not Assigned'}</span>
                      </td>
                      <td style={{ maxWidth: '280px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {club.description || '—'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Edit club"
                            onClick={() => handleOpenEditModal(club)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <EditIcon size={12} /> Edit
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--danger)', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center' }}
                            title="Delete club"
                            onClick={() => handleConfirmDelete(club)}
                          >
                            <TrashIcon size={13} />
                          </button>
                        </div>
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
              <ClubIcon size={36} color="var(--text-muted)" />
            </div>
            <h3>No Clubs Found</h3>
            <p>No clubs match your current search or none have been added yet.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={handleOpenAddModal}>
              Register First Club
            </button>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit Club */}
      <Modal
        isOpen={isModalOpen}
        title={isEditing ? 'Edit Club Details' : 'Register New College Club'}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmitForm}>
              {isEditing ? 'Save Changes' : 'Create Club'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label className="form-label">Club Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., CodeCrafters Club, Literary Society"
              value={formData.clubName}
              onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Technical">Technical</option>
              <option value="Literary">Literary</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Faculty Coordinator</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Dr. Ramesh Kumar, Prof. Sarah Khan"
              value={formData.facultyCoordinator}
              onChange={(e) => setFormData({ ...formData, facultyCoordinator: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Brief description of the club's purpose and activities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Confirm Club Deletion"
        onClose={() => setDeleteModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteClub}>
              Delete Club
            </button>
          </>
        }
      >
        <p style={{ fontSize: '15px', color: 'var(--text-main)' }}>
          Are you sure you want to delete the club{' '}
          <strong>"{clubToDelete?.clubName}"</strong>?
        </p>
        <p style={{ fontSize: '13px', color: 'var(--danger)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertIcon size={15} color="var(--danger)" /> This action will permanently remove the club record.
        </p>
      </Modal>

      {/* Club Details & Students Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        title={selectedClub ? `${selectedClub.clubName} — Details & Members` : 'Club Details'}
        onClose={() => setIsDetailsModalOpen(false)}
        size="xl"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </button>
          </div>
        }
      >
        {detailsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading club details...
          </div>
        ) : clubDetails ? (
          <div>
            {/* Header info & 2 Clean Stat Tiles */}
            <div className="club-details-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                    {clubDetails.club.clubName}
                  </h3>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Coordinator: <strong style={{ color: 'var(--text-main)' }}>{clubDetails.club.facultyCoordinator || 'Not Assigned'}</strong>
                </div>
              </div>

              {/* Exactly 2 Stat Tiles: Student Members & Activities Hosted */}
              <div className="club-stats-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div className="club-stat-pill">
                  <div className="club-stat-pill-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                    <UsersIcon size={18} color="var(--primary)" />
                  </div>
                  <div className="club-stat-pill-content">
                    <span className="club-stat-pill-val">{clubDetails.totalStudents}</span>
                    <span className="club-stat-pill-lbl">Student Members</span>
                  </div>
                </div>

                <div className="club-stat-pill">
                  <div className="club-stat-pill-icon" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--secondary)' }}>
                    <CalendarIcon size={18} color="var(--secondary)" />
                  </div>
                  <div className="club-stat-pill-content">
                    <span className="club-stat-pill-val">{clubDetails.totalActivities}</span>
                    <span className="club-stat-pill-lbl">Activities Hosted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Internal Navigation Tabs */}
            <div className="modal-tabs">
              <button
                type="button"
                className={`modal-tab-btn ${detailsTab === 'students' ? 'active' : ''}`}
                onClick={() => setDetailsTab('students')}
              >
                <UsersIcon size={15} /> Students in this Club ({clubDetails.students?.length || 0})
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${detailsTab === 'activities' ? 'active' : ''}`}
                onClick={() => setDetailsTab('activities')}
              >
                <CalendarIcon size={15} /> Club Activities ({clubDetails.activities?.length || 0})
              </button>
            </div>

            {/* TAB 1: Students in this Club */}
            {detailsTab === 'students' && (
              <div>
                {/* Search bar inside modal for filtering students */}
                {clubDetails.students && clubDetails.students.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Filter students by name, reg. no., or department..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      style={{ fontSize: '13px', padding: '8px 12px' }}
                    />
                  </div>
                )}

                {(() => {
                  const filteredStudents = (clubDetails.students || []).filter((st) => {
                    if (!studentSearch.trim()) return true;
                    const q = studentSearch.toLowerCase();
                    return (
                      st.studentName.toLowerCase().includes(q) ||
                      st.registrationNumber.toLowerCase().includes(q) ||
                      st.department.toLowerCase().includes(q)
                    );
                  });

                  if (clubDetails.students && clubDetails.students.length === 0) {
                    return (
                      <div className="empty-state" style={{ padding: '28px' }}>
                        <div className="empty-state-icon">
                          <UsersIcon size={32} color="var(--text-muted)" />
                        </div>
                        <h4>No Students in this Club Yet</h4>
                        <p style={{ maxWidth: '440px', margin: '0 auto', fontSize: '13px', color: 'var(--text-muted)' }}>
                          Students join this club by participating in its events.
                        </p>
                      </div>
                    );
                  }

                  if (filteredStudents.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        No students match "<strong>{studentSearch}</strong>"
                      </div>
                    );
                  }

                  return (
                    <div className="table-responsive">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }}>#</th>
                            <th>Student Name</th>
                            <th>Registration No</th>
                            <th>Department</th>
                            <th>Academic Year</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((st, idx) => (
                            <tr
                              key={st.studentId}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setSelectedStudentId(st.studentId);
                                setIsStudentModalOpen(true);
                              }}
                              title="Click row to view full student details & attendance history"
                            >
                              <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                              <td>
                                <span
                                  style={{
                                    color: 'var(--primary)',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    textDecoration: 'underline'
                                  }}
                                >
                                  {st.studentName}
                                </span>
                              </td>
                              <td>
                                <span className="badge badge-gray" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                  <code>{st.registrationNumber}</code>
                                </span>
                              </td>
                              <td>
                                <span className="badge badge-purple">{st.department}</span>
                              </td>
                              <td>
                                <span className="badge badge-blue">{st.academicYear}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 2: Club Activities */}
            {detailsTab === 'activities' && (
              <div>
                {clubDetails.activities && clubDetails.activities.length > 0 ? (
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>ID</th>
                          <th>Activity Name</th>
                          <th>Date</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clubDetails.activities.map((act) => (
                          <tr key={act.activityId}>
                            <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{act.activityId}</td>
                            <td>
                              <strong>{act.activityName}</strong>
                            </td>
                            <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                              {act.activityDate}
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                              {act.description || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state" style={{ padding: '24px' }}>
                    <div className="empty-state-icon">
                      <CalendarIcon size={32} color="var(--text-muted)" />
                    </div>
                    <h4>No Activities Scheduled</h4>
                    <p style={{ fontSize: '13px' }}>
                      This club has not conducted any activities yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--danger)' }}>
            Failed to load club details.
          </div>
        )}
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

export default Clubs;
