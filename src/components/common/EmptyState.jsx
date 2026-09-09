export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6">
      {Icon && (
        <div className="w-11 h-11 rounded-full bg-canvas border border-line flex items-center justify-center">
          <Icon className="w-5 h-5 text-mist" strokeWidth={1.75} />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-ink m-0">{title}</p>
        {description && <p className="text-sm text-slate m-0">{description}</p>}
      </div>
      {action}
    </div>
  );
}
