import React, { useCallback, useEffect, useState } from "react";
import { Laptop, Smartphone, MapPin, Clock, LogOut, RefreshCw, MonitorSmartphone, ChevronDown, History } from "lucide-react";
import { toast } from "sonner";
import { getMySessions, logoutAllSessions, revokeSession, SessionT } from "@/graphql/session";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "---";

const sessionTitle = (s: SessionT) =>
  s.deviceName || s.deviceModel || (s.platform === "WEB" ? "Web browser" : s.platform === "IOS" ? "iOS device" : "Android device");

const sessionSubtitle = (s: SessionT) =>
  [s.deviceType, s.osVersion, s.appVersion && `v${s.appVersion}`].filter(Boolean).join(" · ");

const HISTORY_COLLAPSED_ROWS = 3;

const lastActivity = (s: SessionT) => new Date(s.lastSeenAt ?? s.createdAt).getTime();

const ActiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<SessionT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [revokingAll, setRevokingAll] = useState(false);
  const [history, setHistory] = useState<SessionT[]>([]);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getMySessions("ALL");
      const all = res.data?.mySessions ?? [];
      setSessions(
        all
          .filter((s) => s.status === "ACTIVE")
          .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent) || lastActivity(b) - lastActivity(a))
      );
      setHistory(all.filter((s) => s.status !== "ACTIVE").sort((a, b) => lastActivity(b) - lastActivity(a)));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRevoke = async (id: string) => {
    setPendingId(id);
    setConfirmId(null);
    const previous = sessions;
    const revoked = sessions.find((s) => s.id === id);
    setSessions((list) => list.filter((s) => s.id !== id));
    try {
      await revokeSession(id);
      if (revoked) setHistory((list) => [{ ...revoked, status: "REVOKED" }, ...list]);
      toast.success("Device signed out");
    } catch {
      setSessions(previous);
      toast.error("Couldn't sign out that device. Try again.");
    } finally {
      setPendingId(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    try {
      const res = await logoutAllSessions(false);
      const count = res.data?.logoutAllSessions ?? 0;
      const revoked = sessions.filter((s) => !s.isCurrent).map((s) => ({ ...s, status: "REVOKED" as const }));
      setHistory((list) => [...revoked, ...list]);
      setSessions((list) => list.filter((s) => s.isCurrent));
      toast.success(count ? `Signed out of ${count} other device${count > 1 ? "s" : ""}` : "No other devices to sign out");
    } catch {
      toast.error("Couldn't sign out other devices. Try again.");
    } finally {
      setRevokingAll(false);
      setConfirmAll(false);
    }
  };

  const others = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="p-8 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">Active Sessions</p>
          <p className="text-sm text-gray-500">Devices currently signed in to your account. Sign out any you don't recognise.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            aria-label="Refresh sessions"
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin motion-reduce:animate-none" : ""} />
          </button>
          {others > 0 && !confirmAll && (
            <button
              onClick={() => setConfirmAll(true)}
              className="bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-all shadow-sm"
            >
              Sign out other devices
            </button>
          )}
          {confirmAll && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmAll(false)}
                disabled={revokingAll}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeAll}
                disabled={revokingAll}
                className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-sm disabled:opacity-60"
              >
                {revokingAll ? "Signing out..." : `Confirm (${others})`}
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && sessions.length === 0 && (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-[76px] rounded-xl bg-gray-100 animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-red-700">Couldn't load your sessions.</p>
          <button onClick={load} className="text-sm font-bold text-red-700 hover:underline">
            Retry
          </button>
        </div>
      )}

      {!error && sessions.length > 0 && (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100">
          {sessions.map((s) => {
            const Icon = s.platform === "WEB" ? Laptop : Smartphone;
            const location = [s.city, s.country].filter(Boolean).join(", ");
            const subtitle = sessionSubtitle(s);
            return (
              <li key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Icon size={18} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 truncate">{sessionTitle(s)}</p>
                      {s.isCurrent && (
                        <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">
                          This device
                        </span>
                      )}
                    </div>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                      {location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Last active {formatDate(s.lastSeenAt ?? s.createdAt)}
                      </span>
                      <span>Signed in {formatDate(s.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {!s.isCurrent && confirmId !== s.id && (
                  <button
                    onClick={() => setConfirmId(s.id)}
                    disabled={pendingId === s.id}
                    aria-label={`Sign out ${sessionTitle(s)}`}
                    className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                )}
                {!s.isCurrent && confirmId === s.id && (
                  <div className="self-start sm:self-center flex items-center gap-2">
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRevoke(s.id)}
                      autoFocus
                      className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all"
                    >
                      Confirm sign out
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
          <MonitorSmartphone size={20} className="text-gray-400" />
          No active sessions found.
        </div>
      )}

      {!error && history.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setHistoryExpanded((v) => !v)}
            aria-expanded={historyExpanded}
            aria-controls="session-history"
            className="w-full flex items-center justify-between gap-2 py-2 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-500">
              <History size={16} className="text-gray-400" />
              Previous sessions
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">{history.length}</span>
            </span>
            {history.length > HISTORY_COLLAPSED_ROWS && (
              <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 whitespace-nowrap">
                {historyExpanded ? "Show less" : `Show all`}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 motion-reduce:transition-none ${historyExpanded ? "rotate-180" : ""}`}
                />
              </span>
            )}
          </button>
          <ul id="session-history" className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/60">
            {(historyExpanded ? history : history.slice(0, HISTORY_COLLAPSED_ROWS)).map((s) => {
              const Icon = s.platform === "WEB" ? Laptop : Smartphone;
              const location = [s.city, s.country].filter(Boolean).join(", ");
              return (
                <li key={s.id} className="px-4 py-3 flex items-center justify-between gap-3 text-gray-500">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Icon size={16} className="text-gray-400" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-gray-600 truncate">{sessionTitle(s)}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                        {location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {location}
                          </span>
                        )}
                        <span>Signed in {formatDate(s.createdAt)}</span>
                        <span>Last active {formatDate(s.lastSeenAt ?? s.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                    {s.status === "REVOKED" ? "Signed out" : "Expired"}
                  </span>
                </li>
              );
            })}
          </ul>
          {!historyExpanded && history.length > HISTORY_COLLAPSED_ROWS && (
            <button
              onClick={() => setHistoryExpanded(true)}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
            >
              Show {history.length - HISTORY_COLLAPSED_ROWS} more
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveSessions;
