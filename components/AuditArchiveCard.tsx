import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import MascotLoader from "@/components/MascotLoader";
import { getAuditArchiveDownloadUrl, getAuditArchives } from "@/graphql/contentEditorReview";
import { ArchiveKind } from "@/types/contentEditor.type";
import { getErrMsg } from "@/util/initData";

const KINDS: { kind: ArchiveKind; label: string; count: "auditCount" | "supplierUpdateCount" }[] = [
  { kind: "audit-logs", label: "Audit logs", count: "auditCount" },
  { kind: "supplier-updates", label: "Supplier updates", count: "supplierUpdateCount" },
];

/** Owner only: archived months of audit history, one download per kind (R12, R13). */
const AuditArchiveCard = () => {
  const [busy, setBusy] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["auditArchives"],
    queryFn: getAuditArchives,
    refetchOnWindowFocus: false,
  });

  const download = async (month: string, kind: ArchiveKind) => {
    setBusy(`${month}:${kind}`);
    try {
      const url = await getAuditArchiveDownloadUrl(month, kind);
      const a = document.createElement("a");
      a.href = url;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      toast.error(getErrMsg(err as any, "message"));
    } finally {
      setBusy("");
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5" aria-label="Audit archive">
      <h2 className="text-lg font-semibold text-gray-900">Audit archive</h2>
      <p className="mb-4 text-sm text-gray-500">Rows older than 30 days move here on the 1st of each month.</p>
      {isLoading ? (
        <MascotLoader label="Loading archive..." className="py-6" />
      ) : isError || !data ? (
        <p className="text-sm text-red-600">
          Could not load the archive.{" "}
          <button type="button" onClick={() => refetch()} className="font-medium underline">
            Retry
          </button>
        </p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500">No archived months yet</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {data.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="font-medium text-gray-900">{a.month}</span>
              <div className="flex flex-wrap gap-2">
                {KINDS.map((k) => (
                  <Button
                    key={k.kind}
                    type="button"
                    variant="outline"
                    disabled={busy !== ""}
                    onClick={() => download(a.month, k.kind)}
                  >
                    <Download size={16} />
                    {busy === `${a.month}:${k.kind}` ? "Preparing..." : `${k.label} (${a[k.count]})`}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AuditArchiveCard;
