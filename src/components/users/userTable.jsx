function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        role === "admin"
          ? "bg-brand-50 text-brand-600"
          : "bg-canvas text-slate border border-line"
      }`}
    >
      {role}
    </span>
  );
}

export default function UserTable({ users }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-slate">
              <th className="font-medium px-4 py-3">Name</th>
              <th className="font-medium px-4 py-3">Email</th>
              <th className="font-medium px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-line last:border-0 transition-colors duration-150 hover:bg-canvas/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display text-xs font-semibold text-brand-700">
                      {initials(u.name) || "?"}
                    </div>
                    <span className="font-medium text-ink">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate">{u.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {users.map((u, index) => (
          <div
            key={u.id}
            className="rounded-xl border border-line bg-surface p-4 flex items-center gap-3 animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-semibold text-brand-700">
              {initials(u.name) || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink m-0 truncate">{u.name}</p>
              <p className="text-sm text-slate mt-0.5 m-0 truncate">
                {u.email}
              </p>
            </div>
            <RoleBadge role={u.role} />
          </div>
        ))}
      </div>
    </>
  );
}
