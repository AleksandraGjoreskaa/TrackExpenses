import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  children?: ReactNode;
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionTo,
  children,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}

