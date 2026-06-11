"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const typeIcon: Record<string, any> = {
  INFO: Info,
  SUCCESS: CheckCircle,
  WARNING: AlertTriangle,
  ALERT: AlertTriangle,
};

const typeColor: Record<string, string> = {
  INFO: "bg-blue-50 text-blue-600",
  SUCCESS: "bg-emerald-50 text-emerald-600",
  WARNING: "bg-amber-50 text-amber-600",
  ALERT: "bg-red-50 text-red-600",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/notifications").then((r) => setNotifications(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await api.patch("/notifications/read-all");
    load();
  };

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" />{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-20"/>)}</div>;

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" /> Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No notifications yet</CardContent></Card>
        ) : notifications.map((n) => {
          const Icon = typeIcon[n.type] || Info;
          return (
            <Card key={n.id} className={`transition-all ${!n.read ? "border-indigo-200 bg-indigo-50/30" : ""}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeColor[n.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {!n.read && <Badge variant="brand" className="text-[10px]">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} className="shrink-0 text-xs">
                    Mark read
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
