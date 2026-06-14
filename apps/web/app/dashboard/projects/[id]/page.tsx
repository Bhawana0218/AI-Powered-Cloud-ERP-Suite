"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api-helpers";
import { Plus, X, Calendar, User, AlertCircle, RefreshCw } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee?: { firstName: string; lastName: string };
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  owner?: { firstName: string; lastName: string };
}

const emptyTaskForm = { title: "", description: "", status: "TODO", priority: "MEDIUM", assigneeId: "", dueDate: "" };

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [projRes, tasksRes] = await Promise.all([
        apiGet(`/projects/${id}`),
        apiGet(`/projects/${id}/tasks`),
      ]);
      const rawProj = (projRes as any).data;
      setProject(rawProj?.project ?? rawProj ?? null);
      setTasks(tasksRes.data as any[]);
    } catch (err: any) {
      setError(err?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

const handleAddTask = async () => {
  setSaving(true);

  try {
    await apiPost("/projects/tasks", {
      ...taskForm,
      projectId: id,
    });

    setShowTaskModal(false);
    setTaskForm(emptyTaskForm);
    fetchData();
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to add task"
    );
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <div className="h-6 bg-zinc-200 rounded w-1/3 mb-3" />
          <div className="h-4 bg-zinc-200 rounded w-2/3 mb-2" />
          <div className="h-4 bg-zinc-200 rounded w-1/4" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <div className="h-5 bg-zinc-200 rounded w-1/4 mb-4" />
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-zinc-200 rounded mb-3" />)}
        </div>
      </div>
    );
  }

  if (!project && !error) return <p className="text-zinc-500">Project not found.</p>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchData} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {project && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-zinc-800">{project.name}</h1>
                <p className="text-sm text-zinc-500 mt-1">{project.description || "No description"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                project.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                project.status === "ON_HOLD" ? "bg-amber-100 text-amber-700" :
                "bg-zinc-100 text-zinc-700"
              }`}>{project.status?.replace(/_/g, " ")}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
              {project.startDate && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Start: {new Date(project.startDate).toLocaleDateString()}</span>
              )}
              {project.endDate && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> End: {new Date(project.endDate).toLocaleDateString()}</span>
              )}
              {project.owner && (
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {project.owner.firstName} {project.owner.lastName}</span>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-zinc-800">Tasks ({tasks.length})</h2>
              <button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>
            {tasks.length === 0 ? (
              <p className="text-sm text-zinc-400 text-center py-6">No tasks yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      {["Title", "Status", "Priority", "Assignee", "Due Date"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                        <td className="px-4 py-3 font-medium">{t.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            t.status === "DONE" ? "bg-emerald-100 text-emerald-700" :
                            t.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                            "bg-zinc-100 text-zinc-600"
                          }`}>{t.status?.replace(/_/g, " ")}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            t.priority === "HIGH" || t.priority === "CRITICAL" ? "bg-red-100 text-red-700" :
                            t.priority === "MEDIUM" ? "bg-amber-100 text-amber-700" :
                            "bg-zinc-100 text-zinc-600"
                          }`}>{t.priority}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : "-"}</td>
                        <td className="px-4 py-3 text-zinc-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-800">Add Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="p-1 hover:bg-zinc-100 rounded-lg"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
                <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                  <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Priority</label>
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Assignee ID</label>
                <input value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Due Date</label>
                <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">Cancel</button>
              <button onClick={handleAddTask} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
