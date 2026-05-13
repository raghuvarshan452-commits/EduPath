import { GraduationCap, ExternalLink, CalendarDays, IndianRupee, Search, Bookmark, BookmarkCheck } from "lucide-react";
import { useGetScholarships, getGetScholarshipsQueryKey, useGetSavedScholarshipIds, getGetSavedScholarshipIdsQueryKey, useSaveScholarship, useUnsaveScholarship } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

function BookmarkButton({ id, saved, onToggle }: { id: number; saved: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
      className="p-1.5 rounded-lg transition-all duration-150 shrink-0"
      style={{
        backgroundColor: saved ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${saved ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.1)"}`,
      }}
      title={saved ? "Remove from saved" : "Save scholarship"}
      data-testid={`button-bookmark-${id}`}
    >
      {saved
        ? <BookmarkCheck className="w-4 h-4" style={{ color: "#60a5fa" }} />
        : <Bookmark className="w-4 h-4" style={{ color: "#64748b" }} />
      }
    </button>
  );
}

export default function Scholarships() {
  const queryClient = useQueryClient();

  const { data: scholarships, isLoading } = useGetScholarships({
    query: { queryKey: getGetScholarshipsQueryKey() }
  });

  const { data: savedIds = [] } = useGetSavedScholarshipIds({
    query: { queryKey: getGetSavedScholarshipIdsQueryKey() }
  });

  const { mutate: save } = useSaveScholarship({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSavedScholarshipIdsQueryKey() });
      },
    }
  });

  const { mutate: unsave } = useUnsaveScholarship({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSavedScholarshipIdsQueryKey() });
      },
    }
  });

  const handleToggle = (id: number) => {
    if (savedIds.includes(id)) {
      unsave({ id });
    } else {
      save({ id });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(37,99,235,0.15)" }}>
            <GraduationCap className="w-5 h-5" style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white" data-testid="text-scholarships-heading">Scholarships</h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>Matched to your category, state, and stream</p>
          </div>
        </div>
        <Link href="/my-scholarships">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0"
            style={{ backgroundColor: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.3)", color: "#93c5fd" }}
          >
            <BookmarkCheck className="w-4 h-4" />
            My Saved ({savedIds.length})
          </button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,179,237,0.12)" }}>
              <Skeleton className="h-5 w-3/4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-4 w-1/2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-4 w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-4 w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-9 w-full rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && scholarships && scholarships.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(37,99,235,0.12)" }}>
            <Search className="w-8 h-8" style={{ color: "#60a5fa" }} />
          </div>
          <p className="text-white font-semibold mb-2">No scholarships found</p>
          <p style={{ color: "#64748b" }}>Complete your profile to get personalised scholarship matches.</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && scholarships && scholarships.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {scholarships.map((s) => {
            const isSaved = savedIds.includes(s.id);
            return (
              <div
                key={s.id}
                className="card-hover rounded-2xl p-6 flex flex-col"
                style={{ backgroundColor: "rgba(30,41,59,0.8)", border: `1px solid ${isSaved ? "rgba(37,99,235,0.4)" : "rgba(37,99,235,0.2)"}` }}
                data-testid={`card-scholarship-${s.id}`}
              >
                {/* Top badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-white text-sm leading-tight flex-1">{s.name}</h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(37,99,235,0.2)", color: "#93c5fd", border: "1px solid rgba(37,99,235,0.3)" }}>
                      {s.category}
                    </span>
                    <BookmarkButton id={s.id} saved={isSaved} onToggle={() => handleToggle(s.id)} />
                  </div>
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
                <div className="text-xs rounded-xl p-3 mb-4" style={{ backgroundColor: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}>
                  <span className="font-semibold" style={{ color: "#93c5fd" }}>Eligibility: </span>
                  <span style={{ color: "#94a3b8" }}>{s.eligibility}</span>
                </div>

                <a href={s.applyUrl} target="_blank" rel="noopener noreferrer">
                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all btn-glow"
                    style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}
                    data-testid={`button-apply-${s.id}`}
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
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
