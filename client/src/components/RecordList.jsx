import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function displayLevel(level) {
  if (!level) return "";
  const normalized = level.toString().trim().toLowerCase();
  if (normalized === "intern") return "Intern";
  if (normalized === "junior") return "Junior";
  if (normalized === "senior") return "Senior";
  return level;
}

const LEVEL_STYLES = {
  Intern: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Junior: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Senior: "bg-brand-50 text-brand-700 ring-brand-600/20",
};

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function LevelBadge({ level }) {
  const label = displayLevel(level);
  if (!label) return <span className="text-slate-400">&mdash;</span>;
  const style = LEVEL_STYLES[label] || "bg-slate-50 text-slate-600 ring-slate-500/20";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  );
}
LevelBadge.propTypes = { level: PropTypes.string };

const Record = (props) => (
  <tr className="transition-colors hover:bg-slate-50">
    <td className="px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
        >
          {getInitials(props.record.name)}
        </span>
        <span className="font-medium text-slate-900">{props.record.name}</span>
      </div>
    </td>
    <td className="px-4 py-3 text-slate-600 sm:px-6">{props.record.position}</td>
    <td className="px-4 py-3 sm:px-6">
      <LevelBadge level={props.record.level} />
    </td>
    <td className="px-4 py-3 sm:px-6">
      <div className="flex justify-end gap-2">
        <Link
          className="btn btn-secondary btn-sm"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="btn btn-danger btn-sm"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);
Record.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    level: PropTypes.string,
  }).isRequired,
  deleteRecord: PropTypes.func.isRequired,
};

function LoadingRows() {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i}>
      <td colSpan={4} className="px-4 py-4 sm:px-6">
        <div className="h-5 animate-pulse rounded bg-slate-100" />
      </td>
    </tr>
  ));
}

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  // This method fetches the records from the database.
  const getRecords = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch(`/record/`);
      if (!response.ok) {
        console.error(`An error occurred: ${response.statusText}`);
        setStatus("error");
        return;
      }
      setRecords(await response.json());
      setStatus("ready");
    } catch (error) {
      console.error("Failed to load records:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  // This method will delete a record
  async function deleteRecord(id) {
    try {
      const response = await fetch(`/record/${id}`, { method: "DELETE" });
      if (!response.ok) {
        console.error(`Delete failed: ${response.statusText}`);
        return;
      }
      setRecords((prev) => prev.filter((el) => el._id !== id));
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Employee Records
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your team members, roles and seniority levels.
          </p>
        </div>
        {status === "ready" && (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
            {records.length} {records.length === 1 ? "employee" : "employees"}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium sm:px-6">Name</th>
                <th scope="col" className="px-4 py-3 font-medium sm:px-6">Position</th>
                <th scope="col" className="px-4 py-3 font-medium sm:px-6">Level</th>
                <th scope="col" className="px-4 py-3 text-right font-medium sm:px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {status === "loading" && <LoadingRows />}
              {status === "ready" &&
                records.map((record) => (
                  <Record
                    record={record}
                    deleteRecord={() => deleteRecord(record._id)}
                    key={record._id}
                  />
                ))}
            </tbody>
          </table>
        </div>

        {status === "ready" && records.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-slate-900">No employees yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Get started by adding your first employee record.
            </p>
            <Link to="/create" className="btn btn-primary mt-5">
              Add employee
            </Link>
          </div>
        )}

        {status === "error" && (
          <div role="alert" className="px-6 py-16 text-center">
            <p className="font-medium text-slate-900">Couldn&apos;t load employees</p>
            <p className="mt-1 text-sm text-slate-500">
              Please check your connection and try again.
            </p>
            <button type="button" className="btn btn-secondary mt-5" onClick={getRecords}>
              Retry
            </button>
          </div>
        )}
      </div>
    </>
  );
}
