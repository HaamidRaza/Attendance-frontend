import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserTable({ users, onDelete }) {
  const { user: currentUser } = useAuth();

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
              <th className="font-medium px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-slate">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-brand-50 text-brand-600"
                        : "bg-canvas text-slate border border-line"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/users/${u.id}`}
                      aria-label={`View ${u.name}`}
                      className="p-2 rounded-lg text-slate hover:text-brand-600 hover:bg-brand-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => onDelete(u)}
                        aria-label={`Delete ${u.name}`}
                        className="p-2 rounded-lg text-slate hover:text-absent-600 hover:bg-absent-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {users.map((u) => (
          <div
            key={u.id}
            className="rounded-xl border border-line bg-surface p-4 flex items-center justify-between gap-3"
          >
            <Link to={`/users/${u.id}`} className="flex-1 min-w-0">
              <p className="font-medium text-ink m-0">{u.name}</p>
              <p className="text-sm text-slate mt-0.5 m-0">{u.email}</p>
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  u.role === "admin"
                    ? "bg-brand-50 text-brand-600"
                    : "bg-canvas text-slate border border-line"
                }`}
              >
                {u.role}
              </span>
              {u.id !== currentUser?.id && (
                <button
                  onClick={() => onDelete(u)}
                  aria-label={`Delete ${u.name}`}
                  className="p-2 rounded-lg text-slate hover:text-absent-600 hover:bg-absent-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
