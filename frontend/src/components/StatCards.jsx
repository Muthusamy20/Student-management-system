import React from 'react';
import { Users, UserCheck, BookOpen, Building2, Award, FileSpreadsheet } from 'lucide-react';

export default function StatCards({ stats, loading }) {
  const cards = [
    {
      title: 'Total Students',
      value: stats?.total_students ?? 0,
      icon: Users,
      color: 'blue',
      change: 'Enrolled in system',
    },
    {
      title: 'Active Students',
      value: stats?.active_students ?? 0,
      icon: UserCheck,
      color: 'emerald',
      change: 'In good standing',
    },
    {
      title: 'Total Courses',
      value: stats?.total_courses ?? 0,
      icon: BookOpen,
      color: 'purple',
      change: 'Academic offerings',
    },
    {
      title: 'Departments',
      value: stats?.total_departments ?? 0,
      icon: Building2,
      color: 'amber',
      change: 'Faculties & branches',
    },
    {
      title: 'Average GPA',
      value: stats?.average_gpa ? Number(stats.average_gpa).toFixed(2) : '0.00',
      icon: Award,
      color: 'cyan',
      change: 'Across all programs',
    },
  ];

  return (
    <section className="stats-grid" aria-label="System Statistics Overview">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`stat-card ${card.color}`}>
            <div className="stat-card-header">
              <span className="stat-title">{card.title}</span>
              <div className="stat-icon-wrapper">
                <Icon size={20} />
              </div>
            </div>
            <div className="stat-value">
              {loading ? <span className="skeleton-text">--</span> : card.value}
            </div>
            <span className="stat-subtitle">{card.change}</span>
          </div>
        );
      })}
    </section>
  );
}
