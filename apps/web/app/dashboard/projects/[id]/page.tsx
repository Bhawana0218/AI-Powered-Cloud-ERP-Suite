"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiGetOne, apiPost } from "@/lib/api-helpers";
import { useToast } from "@/lib/toast-context";
import { Plus, X, Calendar, User, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

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
  budget?: number;
  owner?: { firstName: string; lastName: string };
  tasks?: Task[];
}

const emptyTaskForm = { title: "", description: "", status: "TODO", priority: "MEDIUM", assigneeId: "", dueDate: "" };

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const proj = await apiGetOne<Project>(`/projects/${id}`);
      setProject(proj);
    } catch (err: any) {
      setError(err?.message || "Failed to load project");
      toast("error", "Error", err?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddTask = async () => {
    setSaving(true);
    try {
      await apiPost("/projects/tasks", { ...taskForm, projectId: id });
      setShowTaskModal(false);
      setTaskForm(emptyTaskForm);
      fetchData();
      toast("success", "Created", "Task added successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to add task");
      toast("error", "Error", err?.response?.data?.message || err?.message || "Failed to add task");
    } finally {
      setSaving(false);
    }
  };

  const tasks = project?.tasks || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!project && !error) return <p className="text-muted-foreground">Project not found.</p>;

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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-semibold">{project.name}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{project.description || "No description"}</p>
                </div>
                <Badge variant={project.status === "active" ? "brand" : "default"}>
                  {project.status?.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {project.startDate && (
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Start: {new Date(project.startDate).toLocaleDateString()}</span>
                )}
                {project.endDate && (
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> End: {new Date(project.endDate).toLocaleDateString()}</span>
                )}
                {project.budget && (
                  <span className="font-medium text-foreground">Budget: ${Number(project.budget).toLocaleString()}</span>
                )}
                {project.owner && (
                  <span className="flex items-center gap-1"><User className="w-4 h-4" /> {project.owner.firstName} {project.owner.lastName}</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tasks ({tasks.length})</CardTitle>
              <Button size="sm" onClick={() => setShowTaskModal(true)} className="gap-2 gradient-brand text-white border-0">
                <Plus className="w-4 h-4" /> Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No tasks yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        {["Title", "Status", "Priority", "Assignee", "Due Date"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((t) => (
                        <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{t.title}</td>
                          <td className="px-4 py-3">
                            <Badge variant={t.status === "DONE" ? "success" : t.status === "IN_PROGRESS" ? "brand" : "default"}>
                              {t.status?.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={t.priority === "HIGH" || t.priority === "URGENT" ? "destructive" : t.priority === "MEDIUM" ? "warning" : "default"}>
                              {t.priority}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Task</h2>
              <button onClick={() => setShowTaskModal(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <Input placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={3} placeholder="Description" className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/50" />
              <div className="grid grid-cols-2 gap-4">
                <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} className="h-9 rounded-lg border border-input px-3 text-sm">
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
                <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="h-9 rounded-lg border border-input px-3 text-sm">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <Input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowTaskModal(false)}>Cancel</Button>
              <Button onClick={handleAddTask} disabled={saving} className="gradient-brand text-white border-0">{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
