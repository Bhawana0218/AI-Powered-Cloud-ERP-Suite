"use client";
import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-helpers";
import { AlertCircle, RefreshCw } from "lucide-react";

const STAGES = ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];

const stageColors: Record<string, string> = {
  LEAD: "bg-zinc-100 text-zinc-700",
  QUALIFIED: "bg-blue-100 text-blue-700",
  PROPOSAL: "bg-amber-100 text-amber-700",
  NEGOTIATION: "bg-purple-100 text-purple-700",
  CLOSED_WON: "bg-emerald-100 text-emerald-700",
  CLOSED_LOST: "bg-red-100 text-red-700",
};

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
}

interface PipelineData {
  stage: string;
  deals: Deal[];
}

export default function PipelinePage() {
  const [columns, setColumns] = useState<PipelineData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPipeline = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiGet("/crm/pipeline");
      const raw = result.data as any;
      const data = Array.isArray(raw) ? raw : raw?.pipeline ?? [];
      setColumns(
        STAGES.map((stage) => ({
          stage,
          deals: (data.find((c: PipelineData) => c.stage === stage)?.deals ?? []) as Deal[],
        }))
      );
    } catch (err: any) {
      setError(err?.message || "Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPipeline(); }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-zinc-800">Pipeline</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((s) => (
            <div key={s} className="min-w-[260px] bg-zinc-100 rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-zinc-200 rounded w-2/3 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-lg" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-800">Pipeline</h1>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchPipeline} className="ml-auto p-1 hover:bg-red-100 rounded"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.stage} className="min-w-[260px] bg-zinc-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold px-2 py-0.5 rounded-full ${stageColors[col.stage] || "bg-zinc-100 text-zinc-700"}`}>
                {col.stage.replace(/_/g, " ")}
              </h3>
              <span className="text-xs text-zinc-400 font-medium">{col.deals.length}</span>
            </div>
            <div className="space-y-3">
              {col.deals.length === 0 && (
                <p className="text-xs text-zinc-400 text-center py-4">No deals</p>
              )}
              {col.deals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg p-3 shadow-sm border border-zinc-200">
                  <p className="text-sm font-medium text-zinc-800">{deal.title}</p>
                  <p className="text-sm text-zinc-500 mt-1">${deal.value?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
