import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const LEVELS = [
  { id: "positionIntern", value: "Intern" },
  { id: "positionJunior", value: "Junior" },
  { id: "positionSenior", value: "Senior" },
];

function normalizeLevel(level) {
  if (!level) return "";
  const normalized = level.toString().trim().toLowerCase();
  if (normalized === "intern") return "Intern";
  if (normalized === "junior") return "Junior";
  if (normalized === "senior") return "Senior";
  return level;
}

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const isNew = !params.id;

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      const response = await fetch(`/record/${id}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        setError("We couldn't load this employee record.");
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm({ ...record, level: normalizeLevel(record.level) });
    }
    fetchData();
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    setSaving(true);
    setError("");
    try {
      // New record -> POST /record, existing record -> PATCH /record/:id.
      const response = await fetch(isNew ? "/record" : `/record/${params.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/");
    } catch (err) {
      console.error("A problem occurred adding or updating a record: ", err);
      setError("Something went wrong while saving. Please try again.");
      setSaving(false);
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900">
          &larr; Back to employees
        </Link>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isNew ? "Create Employee" : "Edit Employee"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="space-y-6 p-6 sm:p-8">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              autoComplete="off"
              className="field-input"
              placeholder="First Last"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="position" className="mb-1.5 block text-sm font-medium text-slate-700">
              Position
            </label>
            <input
              type="text"
              name="position"
              id="position"
              required
              autoComplete="off"
              className="field-input"
              placeholder="Developer Advocate"
              value={form.position}
              onChange={(e) => updateForm({ position: e.target.value })}
            />
          </div>

          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-slate-700">
              Level
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map((level) => (
                <div key={level.id}>
                  <input
                    id={level.id}
                    name="positionOptions"
                    type="radio"
                    value={level.value}
                    className="peer sr-only"
                    checked={form.level === level.value}
                    onChange={(e) => updateForm({ level: e.target.value })}
                  />
                  <label
                    htmlFor={level.id}
                    className="flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:text-brand-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600"
                  >
                    {level.value}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save Employee Record"}
          </button>
        </div>
      </form>
    </>
  );
}
