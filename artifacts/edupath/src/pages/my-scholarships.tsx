import { GraduationCap, ExternalLink, CalendarDays, IndianRupee, BookmarkCheck, Bookmark, ArrowLeft } from "lucide-react";
import { useGetSavedScholarships, getGetSavedScholarshipsQueryKey, useGetSavedScholarshipIds, getGetSavedScholarshipIdsQueryKey, useUnsaveScholarship } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function MyScholarships() {
  const queryClient = useQueryClient();

  const { data: scholarships, isLoading } = useGetSavedScholarships({
    query: { queryKey: getGetSavedScholarshipsQueryKey() }
  });

  const { data: savedIds = [] } = useGetSavedScholarshipIds({
    query: { queryKey: getGetSavedScholarshipIdsQueryKey() }
  });

  const { mutate: unsave } = useUnsaveScholarship({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSavedScholarshipsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSavedScholarshipIdsQueryKey() });
      },
    }
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/scholarships">
          <button className="flex items-center gap-1.5 text-sm mb-4 transition-colors" style={{ color: "#64748b" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all scholarships
          </button>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(37,99,235,0.15)" }}>
            <BookmarkCheck className="w-5 h-5" style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">My Scholarships</h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>Scholarships you've bookmarked to apply for</p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,179,237,0.12)" }}>
              <Skeleton className="h-5 w-3/4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-4 w-1/2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-16 w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-9 w-full rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && (!scholarships || scholarships.length === 0) && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}>
            <Bookmark className="w-10 h-10" style={{ color: "#475569" }} />
          </div>
          <p className="text-white font-bold text-lg mb-2">No saved scholarships yet</p>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>Bookmark scholarships from the main page to track them here.</p>
          <Link href="/scholarships">
            <button
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white btn-glow transition-all"
              style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
            >
              Browse Scholarships
            </button>
          </Link>
        </div>
      )}

      {/* Count banner */}
      {!isLoading && scholarships && scholarships.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#93c5fd", border: "1px solid rgba(37,99,235,0.25)" }}>
                {scholarships.length} saved
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>Click the bookmark icon to remove</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl p-6 flex flex-col"
                style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(37,99,235,0.35)" }}
                data-testid={`card-saved-scholarship-${s.id}`}
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-white text-sm leading-tight flex-1">{s.name}</h3>
                  <button
                    onClick={() => unsave({ id: s.id })}
                    className="p-1.5 rounded-lg transition-all duration-150 shrink-0"
                    style={{ backgroundColor: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)" }}
                    title="Remove bookmark"
                    data-testid={`button-unsave-${s.id}`}
                  >
                    <BookmarkCheck className="w-4 h-4" style={{ color: "#60a5fa" }} />
                  </button>
                </div>

                <p className="text-xs font-semibold mb-3" style={{ color: "#06B6D4" }}>{s.provider}</p>
                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "#94a3b8" }}>{s.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5 shrink-0" style={{ color: "#10b981" }} />
                    <span className="text-sm font-bold text-white">{s.amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0" style={{ color: "#f87171" }} />
                    <span className="text-xs" style={{ color: "#94a3b8" }}>Deadline: <span className="text-white font-medium">{s.deadline}</span></span>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="text-xs rounded-xl p-3 mb-4" style={{ backgroundColor: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.18)" }}>
                  <span className="font-semibold" style={{ color: "#93c5fd" }}>Eligibility: </span>
                  <span style={{ color: "#94a3b8" }}>{s.eligibility}</span>
                </div>

                <a href={s.applyUrl} target="_blank" rel="noopener noreferrer">
                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all btn-glow"
                    style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
                    data-testid={`button-apply-saved-${s.id}`}
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
