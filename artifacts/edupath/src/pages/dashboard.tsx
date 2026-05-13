import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { GraduationCap, Calendar, BookOpen, Users, ArrowRight, UserCircle, TrendingUp, Sparkles, ChevronRight, Bell, ExternalLink, Clock } from "lucide-react";
import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetUpcomingDeadlines, getGetUpcomingDeadlinesQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

function deadlineColor(days: number): { bg: string; border: string; text: string; badge: string } {
  if (days <= 7)  return { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.35)",  text: "#f87171", badge: "rgba(239,68,68,0.2)" };
  if (days <= 30) return { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.35)", text: "#fbbf24", badge: "rgba(245,158,11,0.2)" };
  return           { bg: "rgba(37,99,235,0.08)",       border: "rgba(37,99,235,0.25)",  text: "#60a5fa", badge: "rgba(37,99,235,0.18)" };
}

export default function Dashboard() {
  const { user } = useUser();
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });
  const { data: deadlines, isLoading: deadlinesLoading } = useGetUpcomingDeadlines({
    query: { queryKey: getGetUpcomingDeadlinesQueryKey() }
  });

  const firstName = user?.firstName ?? "Student";

  const summaryCards = [
    {
      label: "Scholarships",
      value: summary?.scholarshipsCount ?? 0,
      icon: GraduationCap,
      href: "/scholarships",
      color: "#2563EB",
      glow: "rgba(37,99,235,0.3)",
      bg: "rgba(37,99,235,0.12)",
      border: "rgba(37,99,235,0.25)",
      desc: "matched to your profile",
    },
    {
      label: "Upcoming Exams",
      value: summary?.examsCount ?? 0,
      icon: Calendar,
      href: "/exams",
      color: "#06B6D4",
      glow: "rgba(6,182,212,0.3)",
      bg: "rgba(6,182,212,0.12)",
      border: "rgba(6,182,212,0.25)",
      desc: "with upcoming deadlines",
    },
    {
      label: "Free Resources",
      value: summary?.resourcesCount ?? 0,
      icon: BookOpen,
      href: "/resources",
      color: "#10b981",
      glow: "rgba(16,185,129,0.3)",
      bg: "rgba(16,185,129,0.12)",
      border: "rgba(16,185,129,0.25)",
      desc: "courses & study material",
    },
    {
      label: "Mentors",
      value: summary?.mentorsCount ?? 0,
      icon: Users,
      href: "/mentors",
      color: "#8b5cf6",
      glow: "rgba(139,92,246,0.3)",
      bg: "rgba(139,92,246,0.12)",
      border: "rgba(139,92,246,0.25)",
      desc: "first-gen success stories",
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" style={{ color: "#06B6D4" }} />
          <span className="text-sm font-medium" style={{ color: "#06B6D4" }}>Your personalised roadmap</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-1" data-testid="text-welcome-heading">
          Welcome back, <span className="gradient-text-blue">{firstName}</span>
        </h1>
        <p style={{ color: "#94a3b8" }}>Here's everything matched to your profile — scholarships, exams, resources, and mentors.</p>
      </div>

      {/* Profile setup prompt */}
      {!isLoading && summary && !summary.hasProfile && (
        <div className="mb-8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(37,99,235,0.3)" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(37,99,235,0.2)" }}>
              <UserCircle className="w-5 h-5" style={{ color: "#60a5fa" }} />
            </div>
            <div>
              <p className="font-bold text-white">Complete your profile to personalise your roadmap</p>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Tell us your stream, category, and career interest so we can match the right scholarships, exams, and mentors for you.</p>
            </div>
          </div>
          <Link href="/profile">
            <button className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all" style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }} data-testid="button-complete-profile">
              Set up profile
            </button>
          </Link>
        </div>
      )}

      {/* Deadline Alert Banner */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: "#f59e0b" }} />
          Registration Deadlines Approaching
        </h2>

        {deadlinesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl p-4" style={{ backgroundColor: "rgba(30,41,59,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Skeleton className="h-4 w-3/4 mb-3" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <Skeleton className="h-8 w-16 mb-2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <Skeleton className="h-3 w-1/2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              </div>
            ))}
          </div>
        ) : deadlines && deadlines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {deadlines.map((d) => {
              const colors = deadlineColor(d.daysRemaining);
              return (
                <a
                  key={d.examId}
                  href={d.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl p-4 transition-all duration-200 group"
                  style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="text-sm font-semibold text-white leading-snug flex-1">{d.examName}</p>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity mt-0.5" style={{ color: colors.text }} />
                  </div>

                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-black" style={{ color: colors.text }}>{d.daysRemaining}</span>
                    <span className="text-sm font-medium pb-0.5" style={{ color: colors.text }}>days left</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 shrink-0" style={{ color: "#64748b" }} />
                    <p className="text-xs" style={{ color: "#64748b" }}>
                      Reg. closes: <span className="font-medium" style={{ color: "#94a3b8" }}>{d.registrationDeadline}</span>
                    </p>
                  </div>

                  <div
                    className="mt-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: colors.badge, color: colors.text }}
                  >
                    {d.daysRemaining <= 7 ? "Urgent" : d.daysRemaining <= 30 ? "Soon" : "Upcoming"}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Calendar className="w-4 h-4 shrink-0" style={{ color: "#475569" }} />
            <p className="text-sm" style={{ color: "#64748b" }}>No upcoming registration deadlines at this time. Check back soon.</p>
          </div>
        )}

        <Link href="/exams">
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold cursor-pointer w-fit" style={{ color: "#06B6D4" }}>
            View full exam calendar <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {summaryCards.map(({ label, value, icon: Icon, href, color, bg, border, desc, glow }) => (
          <Link key={label} href={href}>
            <div
              className="card-hover rounded-2xl p-6 cursor-pointer"
              style={{ backgroundColor: "rgba(30,41,59,0.8)", border: `1px solid ${border}` }}
              data-testid={`card-summary-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-12 w-12 rounded-xl mb-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                  <Skeleton className="h-9 w-16 mb-2" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                  <Skeleton className="h-4 w-24" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="text-4xl font-black mb-1 text-white">{value}</div>
                  <div className="text-sm font-semibold text-white mb-1">{label}</div>
                  <div className="text-xs" style={{ color: "#64748b" }}>{desc}</div>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color }}>
                    View all <ArrowRight className="w-3 h-3" />
                  </div>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick links */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: "#06B6D4" }} /> Quick Access
          </h2>
          <div className="space-y-5">
            {[
              { title: "Find Scholarships", desc: "Discover scholarships matched to your category and state.", href: "/scholarships", icon: GraduationCap, color: "#2563EB" },
              { title: "Exam Calendar", desc: "Track registration deadlines for JEE, NEET, UPSC, and more.", href: "/exams", icon: Calendar, color: "#06B6D4" },
              { title: "Free Learning Resources", desc: "NPTEL, SWAYAM, Khan Academy — learn for free.", href: "/resources", icon: BookOpen, color: "#10b981" },
              { title: "Find a Mentor", desc: "Connect with first-gen students who made it.", href: "/mentors", icon: Users, color: "#8b5cf6" },
            ].map(({ title, desc, href, icon: Icon, color }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200 group" style={{ backgroundColor: "rgba(30,41,59,0.6)", border: "1px solid rgba(99,179,237,0.12)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(30,41,59,0.9)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,179,237,0.12)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(30,41,59,0.6)"; }}
                  data-testid={`quick-link-${title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <UserCircle className="w-4 h-4" style={{ color: "#2563EB" }} /> Your Profile
          </h2>
          <div className="rounded-2xl p-6" style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,179,237,0.12)" }}>
            {!isLoading && summary ? (
              <>
                {summary.hasProfile ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4" style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}>
                      {(user?.firstName?.[0] ?? "S").toUpperCase()}
                    </div>
                    <p className="text-center font-bold text-white mb-1">{user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Student"}</p>
                    <p className="text-center text-xs mb-4" style={{ color: "#64748b" }}>Profile complete</p>
                    <div className="w-full rounded-full h-1.5 mb-2" style={{ backgroundColor: "rgba(37,99,235,0.2)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: "100%", background: "linear-gradient(90deg, #2563EB, #06B6D4)" }} />
                    </div>
                    <p className="text-xs text-center" style={{ color: "#64748b" }}>Profile 100% complete</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(37,99,235,0.15)", border: "2px dashed rgba(37,99,235,0.3)" }}>
                      <UserCircle className="w-8 h-8" style={{ color: "#60a5fa" }} />
                    </div>
                    <p className="text-center font-semibold text-white mb-1">Profile not set up</p>
                    <p className="text-center text-xs mb-4" style={{ color: "#64748b" }}>Add your details to get personalised matches</p>
                    <div className="w-full rounded-full h-1.5 mb-2" style={{ backgroundColor: "rgba(37,99,235,0.2)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: "20%", backgroundColor: "#2563EB" }} />
                    </div>
                    <p className="text-xs text-center mb-4" style={{ color: "#64748b" }}>Profile 20% complete</p>
                    <Link href="/profile">
                      <button className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all btn-glow" style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }} data-testid="button-setup-profile">
                        Complete Profile
                      </button>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-16 w-16 rounded-2xl mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <Skeleton className="h-4 w-32 mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <Skeleton className="h-2 w-full rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
