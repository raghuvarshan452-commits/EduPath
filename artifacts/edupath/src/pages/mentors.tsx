import { Users, ExternalLink, Clock, Briefcase, Star } from "lucide-react";
import { useGetMentors, getGetMentorsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const domainColors: Record<string, { color: string; bg: string; border: string }> = {
  Engineering: { color: "#93c5fd", bg: "rgba(37,99,235,0.15)", border: "rgba(37,99,235,0.3)" },
  Medical: { color: "#6ee7b7", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)" },
  "Civil Services": { color: "#fcd34d", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
  Management: { color: "#c4b5fd", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" },
  Law: { color: "#fda4af", bg: "rgba(244,63,94,0.15)", border: "rgba(244,63,94,0.3)" },
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const avatarGradients = [
  "linear-gradient(135deg, #2563EB, #06B6D4)",
  "linear-gradient(135deg, #7c3aed, #2563EB)",
  "linear-gradient(135deg, #059669, #06B6D4)",
  "linear-gradient(135deg, #d97706, #ef4444)",
  "linear-gradient(135deg, #db2777, #7c3aed)",
  "linear-gradient(135deg, #0891b2, #059669)",
];

export default function Mentors() {
  const { data: mentors, isLoading } = useGetMentors({
    query: { queryKey: getGetMentorsQueryKey() }
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.15)" }}>
            <Users className="w-5 h-5" style={{ color: "#8b5cf6" }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white" data-testid="text-mentors-heading">Mentors</h1>
            <p className="text-sm" style={{ color: "#94a3b8" }}>First-gen students who made it — connect and learn from their journey</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,179,237,0.12)" }}>
              <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                  <Skeleton className="h-3 w-1/2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                </div>
              </div>
              <Skeleton className="h-4 w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Skeleton className="h-9 w-full rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && mentors && mentors.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "#334155" }} />
          <p className="text-white font-semibold mb-2">No mentors found</p>
          <p style={{ color: "#64748b" }}>Update your profile to see mentor recommendations.</p>
        </div>
      )}

      {!isLoading && mentors && mentors.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentors.map((mentor, i) => {
            const domainStyle = domainColors[mentor.careerDomain] ?? { color: "#c4b5fd", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" };
            return (
              <div
                key={mentor.id}
                className="card-hover rounded-2xl p-6 flex flex-col"
                style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(139,92,246,0.2)" }}
                data-testid={`card-mentor-${mentor.id}`}
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
                    style={{ background: avatarGradients[i % avatarGradients.length] }}
                  >
                    {getInitials(mentor.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm leading-tight">{mentor.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{mentor.title}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: "#06B6D4" }}>{mentor.college}</p>
                  </div>
                </div>

                {/* Domain + star */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: domainStyle.bg, color: domainStyle.color, border: `1px solid ${domainStyle.border}` }}>
                    {mentor.careerDomain}
                  </span>
                  <Star className="w-3.5 h-3.5 ml-auto" style={{ color: "#fbbf24" }} />
                  <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>First-gen</span>
                </div>

                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "#94a3b8" }}>{mentor.bio}</p>

                {/* Background */}
                <div className="text-xs rounded-xl p-3 mb-3" style={{ backgroundColor: "rgba(30,41,59,0.9)", border: "1px solid rgba(99,179,237,0.12)" }}>
                  <Briefcase className="w-3 h-3 inline mr-1" style={{ color: "#94a3b8" }} />
                  <span style={{ color: "#94a3b8" }}>{mentor.background}</span>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 text-xs mb-4" style={{ color: "#64748b" }}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  Available: <span className="font-semibold text-white">{mentor.availability}</span>
                </div>

                <a href={mentor.contactUrl} target="_blank" rel="noopener noreferrer">
                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                    style={{ background: "linear-gradient(135deg, #6d28d9, #8b5cf6)", boxShadow: "0 4px 15px rgba(139,92,246,0.25)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 25px rgba(139,92,246,0.45)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(139,92,246,0.25)"; }}
                    data-testid={`button-mentor-${mentor.id}`}
                  >
                    Connect on LinkedIn <ExternalLink className="w-3.5 h-3.5" />
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
