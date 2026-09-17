import React from 'react';
import { GraduationCap, Users, BookOpen, Building2, Server } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiOnline }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <GraduationCap size={28} />
          </div>
          <div className="brand-text">
            <h1>EduTrack</h1>
            <span>Student Management System</span>
          </div>
        </div>

        <nav className="navbar-nav">
          <button
            className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <Users size={18} />
            <span>Students</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={18} />
            <span>Courses</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            <Building2 size={18} />
            <span>Departments</span>
          </button>
        </nav>

        <div className="navbar-status">
          <div className={`status-pill ${apiOnline ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            <Server size={14} />
            <span>API: {apiOnline ? 'Online (DRF)' : 'Disconnected'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
