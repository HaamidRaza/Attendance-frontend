import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

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
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/users/${u.id}`}
                    aria-label={`View ${u.name}`}
                    className="inline-flex p-2 rounded-lg text-slate hover:text-brand-600 hover:bg-brand-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {users.map((u) => (
          <Link
            key={u.id}
            to={`/users/${u.id}`}
            className="rounded-xl border border-line bg-surface p-4 flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-medium text-ink m-0">{u.name}</p>
              <p className="text-sm text-slate mt-0.5 m-0">{u.email}</p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${
                u.role === "admin"
                  ? "bg-brand-50 text-brand-600"
                  : "bg-canvas text-slate border border-line"
              }`}
            >
              {u.role}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
