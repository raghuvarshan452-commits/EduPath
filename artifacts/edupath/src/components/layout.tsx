import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { LayoutDashboard, GraduationCap, Calendar, BookOpen, Users, User, LogOut, Sparkles, Menu, X, AlertCircle, ChevronRight, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetSavedScholarshipIds, getGetSavedScholarshipIdsQueryKey } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { href: "/my-scholarships", label: "My Scholarships", icon: BookmarkCheck },
  { href: "/exams", label: "Exam Calendar", icon: Calendar },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/mentors", label: "Mentors", icon: Users },
  { href: "/profile", label: "My Profile", icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: summary } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });

  const { data: savedIds = [] } = useGetSavedScholarshipIds({
    query: { queryKey: getGetSavedScholarshipIdsQueryKey() }
  });

  const initials = user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0F172A" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )} style={{ backgroundColor: "#0B1426", borderRight: "1px solid rgba(99,179,237,0.1)" }}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5" style={{ borderBottom: "1px solid rgba(99,179,237,0.1)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">EduPath</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)} data-testid="button-close-sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile incomplete */}
        {summary && !summary.hasProfile && (
          <Link href="/profile" onClick={() => setSidebarOpen(false)}>
            <div className="mx-4 mt-4 p-3 rounded-xl cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.3)" }}>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#60a5fa" }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#93c5fd" }}>Profile incomplete</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Complete to get personalised results</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            const showBadge = href === "/my-scholarships" && savedIds.length > 0;
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
                <div
                  className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group")}
                  style={active ? {
                    background: "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(6,182,212,0.15))",
                    border: "1px solid rgba(37,99,235,0.35)",
                    color: "#93c5fd",
                  } : {
                    color: "#94a3b8",
                    border: "1px solid transparent",
                  }}
                  data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "" : "group-hover:text-white")} style={active ? { color: "#60a5fa" } : {}} />
                  <span className={active ? "text-white font-semibold" : "group-hover:text-white transition-colors"}>{label}</span>
                  {showBadge && !active && (
                    <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(37,99,235,0.25)", color: "#93c5fd" }}>
                      {savedIds.length}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: "#60a5fa" }} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(99,179,237,0.1)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Student"}
              </p>
              <p className="text-xs truncate" style={{ color: "#64748b" }}>{user?.emailAddresses?.[0]?.emailAddress}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sm"
            style={{ color: "#64748b" }}
            onClick={() => signOut()}
            data-testid="button-sign-out"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden h-16 flex items-center px-4 gap-4" style={{ backgroundColor: "#0B1426", borderBottom: "1px solid rgba(99,179,237,0.1)" }}>
          <button onClick={() => setSidebarOpen(true)} data-testid="button-open-sidebar">
            <Menu className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white">EduPath</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
