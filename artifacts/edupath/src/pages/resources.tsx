import { BookOpen, ExternalLink, Globe } from "lucide-react";
import { useGetResources, getGetResourcesQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const typeStyles: Record<string, { bg: string; color: string; border: string }> = {
  Course: { bg: "rgba(37,99,235,0.15)", color: "#93c5fd", border: "rgba(37,99,235,0.3)" },
  Video: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "rgba(239,68,68,0.3)" },
  Book: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)" },
};

export default function Resources() {
  const { data: resources, isLoading } = useGetResources({
    query: { queryKey: getGetResourcesQueryKey() }
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(16,185,129,0.15)" }}>
            <BookOpen className="w-5 h-5" style={{ color: "#10b981" }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white" data-testid="text-resources-heading">Free Resources</h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>World-class learning at zero cost — NPTEL, SWAYAM, Khan Academy and more</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,179,237,0.12)" }}>
              <Skeleton className="h-5 w-3/4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-4 w-1/2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-4 w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-9 w-full rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && resources && resources.length === 0 && (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "#334155" }} />
          <p className="text-white font-semibold mb-2">No resources found</p>
          <p style={{ color: "#64748b" }}>Update your profile to see recommendations.</p>
        </div>
      )}

      {!isLoading && resources && resources.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => {
            const typeStyle = typeStyles[res.type] ?? { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "rgba(99,102,241,0.3)" };
            return (
              <div
                key={res.id}
                className="card-hover rounded-2xl p-6 flex flex-col"
                style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(16,185,129,0.2)" }}
                data-testid={`card-resource-${res.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-white text-sm leading-tight">{res.title}</h3>
                  <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}` }}>
                    {res.type}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)" }}>
                    {res.platform}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "#64748b" }}>
                    <Globe className="w-3 h-3" />{res.language}
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "#94a3b8" }}>{res.description}</p>

                <div className="mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(30,41,59,0.9)", color: "#64748b", border: "1px solid rgba(99,179,237,0.15)" }}>
                    {res.stream}
                  </span>
                </div>

                <a href={res.url} target="_blank" rel="noopener noreferrer">
                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                    style={{ background: "linear-gradient(135deg, #059669, #10b981)", boxShadow: "0 4px 15px rgba(16,185,129,0.25)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 25px rgba(16,185,129,0.45)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(16,185,129,0.25)"; }}
                    data-testid={`button-resource-${res.id}`}
                  >
                    Access for Free <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
