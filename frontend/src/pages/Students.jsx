import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal.jsx';
import StudentDetailsModal from '../components/StudentDetailsModal.jsx';
import {
  StudentIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  AlertIcon
} from '../components/Icons.jsx';

/**
 * ==========================================================
 * STUDENTS DIRECTORY PAGE
 * ==========================================================
 * Demonstrates:
 * 1. CRUD operations on Student entities
 * 2. Input validation & duplicate registration number checks
 * 3. Search and department filtering
 * 4. Spring Data JPA repository integration
 */
function Students({ setNotification }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Interactive Student Details Modal
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    department: 'CSE',
    academicYear: '3rd Year',
    email: '',
    phoneNumber: ''
  });

  // Modal State for Delete Confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/students')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load students');
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Unable to connect to Spring Boot backend for students data.'
        });
        setLoading(false);
      });
  };

  // Search students
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchStudents();
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8080/api/students/search?keyword=${encodeURIComponent(searchKeyword.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotification({ type: 'danger', message: 'Failed to search students.' });
        setLoading(false);
      });
  };

  // Open modal for Adding a new student
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentStudentId(null);
    setFormData({
      studentName: '',
      name: '',
      registrationNumber: '',
      department: 'CSE',
      academicYear: '1st Year',
      email: '',
      phoneNumber: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing student
  const handleOpenEditModal = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student.studentId);
    setFormData({
      studentName: student.studentName || student.name || '',
      name: student.studentName || student.name || '',
      registrationNumber: student.registrationNumber || '',
      department: student.department || 'CSE',
      academicYear: student.academicYear || '1st Year',
      email: student.email || '',
      phoneNumber: student.phoneNumber || ''
    });
    setIsModalOpen(true);
  };

  // Form Submission
  const handleSubmitForm = (e) => {
    e.preventDefault();

    const sName = (formData.studentName || formData.name || '').trim();
    if (!sName || !formData.registrationNumber.trim()) {
      setNotification({ type: 'warning', message: 'Student Name and Registration Number are required.' });
      return;
    }

    const payload = {
      studentName: sName,
      registrationNumber: formData.registrationNumber.trim(),
      email: formData.email,
      department: formData.department,
      academicYear: formData.academicYear
    };

    if (isEditing) {
      // Update student
      fetch(`http://localhost:8080/api/students/${currentStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          const body = await res.json();
          if (!res.ok) {
            throw new Error(body.message || 'Failed to update student');
          }
          return body;
        })
        .then(() => {
          setNotification({ type: 'success', message: `Student "${sName}" updated successfully!` });
          setIsModalOpen(false);
          fetchStudents();
        })
        .catch((err) => {
          console.error(err);
          setNotification({ type: 'danger', message: err.message });
        });
    } else {
      // Add new student
      fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          const body = await res.json();
          if (!res.ok) {
            throw new Error(body.message || 'Failed to create student');
          }
          return body;
        })
        .then(() => {
          setNotification({ type: 'success', message: `Student "${sName}" enrolled successfully!` });
          setIsModalOpen(false);
          fetchStudents();
        })
        .catch((err) => {
          console.error(err);
          setNotification({ type: 'danger', message: err.message });
        });
    }
  };

  // Delete Confirmation
  const handleConfirmDelete = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;
    fetch(`http://localhost:8080/api/students/${studentToDelete.studentId}`, {
      method: 'DELETE'
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        return res.json();
      })
      .then(() => {
        setNotification({ type: 'success', message: `Student "${studentToDelete.studentName || studentToDelete.name}" removed successfully!` });
        setDeleteModalOpen(false);
        setStudentToDelete(null);
        fetchStudents();
      })
      .catch((err) => {
        console.error(err);
        setNotification({
          type: 'danger',
          message: 'Cannot delete student. Student has active activity participation records.'
        });
        setDeleteModalOpen(false);
      });
  };

  // Filter students by department
  const filteredStudents = departmentFilter === 'ALL'
    ? students
    : students.filter((s) => s.department === departmentFilter);

  return (
    <div>
      {/* Top Filter and Actions Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '460px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, reg number, or email..."
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
                  fetchStudents();
                }}
              >
                Clear
              </button>
            )}
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Department Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Dept:</label>
              <select
                className="form-control"
                style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="ALL">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="AIDS">AIDS</option>
                <option value="EEE">EEE</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <PlusIcon size={15} /> Enroll New Student
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="card-header-row">
          <div className="card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <StudentIcon size={18} color="var(--primary)" /> Student Directory ({filteredStudents.length}{departmentFilter !== 'ALL' ? ` in ${departmentFilter}` : ''})
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading students directory...
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Student Name</th>
                  <th>Registration No</th>
                  <th>Department</th>
                  <th>Academic Year</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr
                    key={st.studentId}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedStudentId(st.studentId);
                      setIsStudentModalOpen(true);
                    }}
                    title="Click row to view full student details"
                  >
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{st.studentId}</td>
                    <td>
                      <span
                        style={{
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '14px',
                          textDecoration: 'underline'
                        }}
                      >
                        {st.studentName || st.name}
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
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Edit student"
                          onClick={() => handleOpenEditModal(st)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}
                        >
                          <EditIcon size={12} /> Edit
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center', padding: '3px 6px' }}
                          title="Delete student"
                          onClick={() => handleConfirmDelete(st)}
                        >
                          <TrashIcon size={12} />
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
              <UsersIcon size={32} color="var(--text-muted)" />
            </div>
            <h3>No Students Found</h3>
            <p>
              {departmentFilter !== 'ALL'
                ? `No students found in department "${departmentFilter}".`
                : 'No student records match your query.'}
            </p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={handleOpenAddModal}>
              Enroll New Student
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        title={isEditing ? 'Edit Student Details' : 'Enroll New Student'}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmitForm}>
              {isEditing ? 'Save Changes' : 'Enroll Student'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Priya Sharma, Arun Patel"
              value={formData.studentName || formData.name || ''}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Registration Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., 2024CSE0101"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                required
              />
              <span className="form-text">Must be unique per student.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="MECH">Mechanical Engineering (MECH)</option>
                <option value="CIVIL">Civil Engineering (CIVIL)</option>
                <option value="AIDS">AI & Data Science (AIDS)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select
                className="form-control"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., 9876543210"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g., priya.sharma@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Confirm Student Deletion"
        onClose={() => setDeleteModalOpen(false)}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteStudent}>
              Delete Student
            </button>
          </>
        }
      >
        <p style={{ fontSize: '15px', color: 'var(--text-main)' }}>
          Are you sure you want to remove student <strong>"{studentToDelete?.studentName || studentToDelete?.name}"</strong> (
          <code>{studentToDelete?.registrationNumber}</code>)?
        </p>
        <p style={{ fontSize: '13px', color: 'var(--danger)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertIcon size={15} color="var(--danger)" /> Deleting this student will also delete their attendance and participation history.
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

export default Students;
