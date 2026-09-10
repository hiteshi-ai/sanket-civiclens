interface EmptyStateProps {
  title: string;
  description?: string;
  compact?: boolean;
}

export function EmptyState({ title, description, compact }: EmptyStateProps) {
  return (
    <div className={compact ? "empty-state compact" : "empty-state"}>
      <span className="empty-icon" aria-hidden="true">○</span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}