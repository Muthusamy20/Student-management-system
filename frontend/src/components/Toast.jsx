import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'info', message } = toast;

  const config = {
    success: {
      bg: 'var(--color-success-bg)',
      border: 'var(--color-success-border)',
      text: 'var(--color-success-text)',
      Icon: CheckCircle2,
    },
    error: {
      bg: 'var(--color-danger-bg)',
      border: 'var(--color-danger-border)',
      text: 'var(--color-danger-text)',
      Icon: AlertCircle,
    },
    info: {
      bg: 'var(--color-info-bg)',
      border: 'var(--color-info-border)',
      text: 'var(--color-info-text)',
      Icon: Info,
    },
  }[type] || {
    bg: 'var(--color-info-bg)',
    border: 'var(--color-info-border)',
    text: 'var(--color-info-text)',
    Icon: Info,
  };

  const { Icon } = config;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: '10px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        fontSize: '0.925rem',
        fontWeight: 500,
        maxWidth: '420px',
        animation: 'slideIn 0.25s ease-out',
      }}
    >
      <Icon size={20} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, wordBreak: 'break-word' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'currentColor',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.8,
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
