import { Link } from "wouter";
import { ArrowRight, CheckCircle, GraduationCap, Calendar, BookOpen, Users, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F172A", color: "#F8FAFC" }}>
      {/* Navbar */}
      <nav className="border-b sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: "rgba(15,23,42,0.85)", borderColor: "rgba(99,179,237,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">EduPath</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" data-testid="link-sign-in">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="btn-glow font-semibold" style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }} data-testid="link-get-started">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden hero-grid">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: "#2563EB" }} />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: "#06B6D4" }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-28 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-8" style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#93c5fd", border: "1px solid rgba(37,99,235,0.3)" }}>
            <Zap className="w-3.5 h-3.5" style={{ color: "#06B6D4" }} />
            Personalised for first-generation college students in India
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight text-white">
            Your personalised
            <br />
            <span className="gradient-text">education roadmap</span>
            <br />
            starts here.
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: "#CBD5E1" }}>
            Find scholarships you qualify for, track exam deadlines, access free learning resources, and connect with mentors — all matched to your stream, state, and category.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "SC / ST / OBC / BC / EWS scholarships",
              "JEE · NEET · UPSC · CLAT exam dates",
              "Free NPTEL, SWAYAM & Khan Academy",
              "First-gen student mentors",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(6,182,212,0.1)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.25)" }}>
                <CheckCircle className="w-3.5 h-3.5" /> {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up">
              <Button size="lg" className="btn-glow px-8 py-6 text-base font-bold gap-2 rounded-xl" style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }} data-testid="button-start-journey">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base rounded-xl" style={{ borderColor: "rgba(99,179,237,0.25)", color: "#CBD5E1", backgroundColor: "rgba(30,41,59,0.5)" }} data-testid="button-sign-in-hero">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y py-12" style={{ borderColor: "rgba(99,179,237,0.1)", backgroundColor: "rgba(30,41,59,0.4)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Scholarships Listed", value: "50+", color: "#2563EB" },
            { label: "Entrance Exams Tracked", value: "30+", color: "#06B6D4" },
            { label: "Free Resources", value: "100+", color: "#10b981" },
            { label: "Student Mentors", value: "20+", color: "#8b5cf6" },
          ].map((stat) => (
            <div key={stat.label} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="text-4xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm font-medium" style={{ color: "#94a3b8" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-4">Everything in one intelligent platform</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>No more searching 50 websites. Your personalised education dashboard — all matched to your unique profile.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: GraduationCap, title: "Smart Scholarships", desc: "Find scholarships filtered by your category, state, and stream — only the ones you actually qualify for.", color: "#2563EB", bg: "rgba(37,99,235,0.12)", border: "rgba(37,99,235,0.25)" },
            { icon: Calendar, title: "Exam Calendar", desc: "Never miss a registration deadline. Exam dates for JEE, NEET, UPSC, CLAT matched to your goals.", color: "#06B6D4", bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.25)" },
            { icon: BookOpen, title: "Free Resources", desc: "NPTEL, SWAYAM, Khan Academy — world-class learning at zero cost, in your language.", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
            { icon: Users, title: "Mentors Network", desc: "Connect with first-gen students who made it — IIT graduates, IAS officers, doctors from similar backgrounds.", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)" },
          ].map(({ icon: Icon, title, desc, color, bg, border }) => (
            <div key={title} className="card-hover rounded-2xl p-6" style={{ backgroundColor: "rgba(30,41,59,0.7)", border: `1px solid ${border}` }} data-testid={`feature-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why EduPath */}
      <section className="py-20" style={{ backgroundColor: "rgba(30,41,59,0.4)", borderTop: "1px solid rgba(99,179,237,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full mb-6" style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#93c5fd", border: "1px solid rgba(37,99,235,0.3)" }}>
                <Shield className="w-3.5 h-3.5" /> Built for first-gen students
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Information that was always out of reach — now at your fingertips</h2>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: "#94a3b8" }}>
                Millions of students in India are the first in their family to attend college. They have the talent, but lack the guidance. No one told them which scholarships they qualify for, which exams to target, or where to find free study material.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "#94a3b8" }}>
                EduPath closes that gap — giving every first-generation student access to the same quality of information that students from privileged backgrounds take for granted.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, title: "Personalised matching", desc: "Content filtered to your exact profile — category, state, stream, and career interest.", color: "#2563EB" },
                { icon: Shield, title: "Verified information", desc: "All scholarship and exam data sourced from official government portals.", color: "#06B6D4" },
                { icon: Users, title: "Mentor network", desc: "Real mentors from first-gen backgrounds who understand your journey.", color: "#10b981" },
                { icon: Zap, title: "Always updated", desc: "Exam dates and scholarship deadlines kept current so you never miss out.", color: "#8b5cf6" },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="rounded-2xl p-5" style={{ backgroundColor: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,179,237,0.12)" }}>
                  <Icon className="w-6 h-6 mb-3" style={{ color }} />
                  <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-16" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.1) 100%)", border: "1px solid rgba(37,99,235,0.3)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: "#2563EB" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ backgroundColor: "#06B6D4" }} />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Your roadmap is waiting</h2>
            <p className="text-xl mb-8" style={{ color: "#CBD5E1" }}>Takes 2 minutes to set up. Free forever. Built for students like you.</p>
            <Link href="/sign-up">
              <Button size="lg" className="btn-glow px-10 py-6 text-base font-bold gap-2 rounded-xl" style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }} data-testid="button-cta-bottom">
                Create your free account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: "rgba(99,179,237,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white">EduPath</span>
          </div>
          <p className="text-sm" style={{ color: "#64748b" }}>Supporting SDG 4 (Quality Education) and SDG 10 (Reduced Inequalities)</p>
        </div>
      </footer>
    </div>
  );
}
