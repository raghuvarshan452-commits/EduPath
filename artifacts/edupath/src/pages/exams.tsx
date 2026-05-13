import { Calendar, ExternalLink, Clock, Zap } from "lucide-react";
import { useGetExams, getGetExamsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Exams() {
  const { data: exams, isLoading } = useGetExams({
    query: { queryKey: getGetExamsQueryKey() }
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(6,182,212,0.15)" }}>
            <Calendar className="w-5 h-5" style={{ color: "#06B6D4" }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white" data-testid="text-exams-heading">Exam Calendar</h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>Track registration deadlines — never miss a cutoff</p>
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

      {!isLoading && exams && exams.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "#334155" }} />
          <p className="text-white font-semibold mb-2">No exams found</p>
          <p style={{ color: "#64748b" }}>Update your profile to see exam recommendations.</p>
        </div>
      )}

      {!isLoading && exams && exams.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="card-hover rounded-2xl p-6 flex flex-col"
              style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(6,182,212,0.2)" }}
              data-testid={`card-exam-${exam.id}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-sm leading-tight">{exam.name}</h3>
                <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(6,182,212,0.15)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.3)" }}>
                  {exam.stream}
                </span>
              </div>

              <p className="text-xs font-semibold mb-3" style={{ color: "#06B6D4" }}>{exam.conductedBy}</p>
              <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "#94a3b8" }}>{exam.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#06B6D4" }} />
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Exam: <span className="text-white font-semibold">{exam.examDate}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: "#f87171" }} />
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Register by: <span className="font-semibold" style={{ color: "#fca5a5" }}>{exam.registrationDeadline}</span></span>
                </div>
              </div>

              <div className="text-xs rounded-xl p-3 mb-4" style={{ backgroundColor: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}>
                <Zap className="w-3 h-3 inline mr-1" style={{ color: "#06B6D4" }} />
                <span className="font-semibold" style={{ color: "#67e8f9" }}>Why it matters: </span>
                <span style={{ color: "#94a3b8" }}>{exam.careerRelevance}</span>
              </div>

              <a href={exam.officialUrl} target="_blank" rel="noopener noreferrer">
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: "linear-gradient(135deg, #0891b2, #06B6D4)", boxShadow: "0 4px 15px rgba(6,182,212,0.25)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 25px rgba(6,182,212,0.45)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(6,182,212,0.25)"; }}
                  data-testid={`button-exam-${exam.id}`}
                >
                  Official Website <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
