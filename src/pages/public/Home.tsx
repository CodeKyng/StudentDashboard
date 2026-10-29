import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import {
  BookOpen,
  GraduationCap,
  Globe2,
  Lightbulb,
  MapPin,
  Mail,
  Phone,
  Menu,
  X,
  ArrowRight,
  Users,
  Award,
  Building2,
  ChevronRight,
  Shield,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react"

import uniLogo from "@/assets/unijos_logo.png"
import { Button } from "@/components/ui/button"
import { HeroScene } from "@/components/landing/HeroScene"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#admissions", label: "Admissions" },
  { href: "#campus", label: "Campus" },
  { href: "#contact", label: "Contact" },
]

const marqueeItems = [
  "Engineering",
  "Medicine",
  "Computer Science",
  "Business",
  "Law",
  "Pharmacy",
  "Arts",
  "Education",
  "Natural Sciences",
  "Social Sciences",
  "Architecture",
  "Agriculture",
]

const features = [
  {
    icon: GraduationCap,
    title: "Academic excellence",
    description:
      "Accredited programs and faculty focused on producing graduates who compete globally.",
    span: "md:col-span-2",
  },
  {
    icon: Globe2,
    title: "Global network",
    description: "Exchange programs and research partnerships across continents.",
    span: "",
  },
  {
    icon: Lightbulb,
    title: "Research & innovation",
    description: "Labs and hubs that turn ideas into measurable impact.",
    span: "",
  },
  {
    icon: Shield,
    title: "Student support",
    description:
      "Mentorship, counseling, and career services from day one through graduation.",
    span: "md:col-span-2",
  },
]

const programs = [
  {
    title: "Engineering",
    items: ["Civil", "Mechanical", "Electrical", "Chemical"],
    tint: "group-hover:border-[#009BC9]/50",
  },
  {
    title: "Medicine & Health",
    items: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
    tint: "group-hover:border-[#8B1A1A]/50",
  },
  {
    title: "Business & Social",
    items: ["Business Admin", "Economics", "Accounting", "Political Science"],
    tint: "group-hover:border-[#C9A227]/50",
  },
  {
    title: "Sciences",
    items: ["Physics", "Chemistry", "Biology", "Mathematics"],
    tint: "group-hover:border-[#009BC9]/50",
  },
  {
    title: "Arts & Humanities",
    items: ["English", "History", "Philosophy", "Theatre"],
    tint: "group-hover:border-[#C9A227]/50",
  },
  {
    title: "Technology",
    items: ["Computer Science", "Software Eng.", "IT", "Cyber Security"],
    tint: "group-hover:border-[#009BC9]/50",
  },
]

const steps = [
  {
    n: "01",
    title: "Create account",
    text: "Register with a valid email on the admissions portal.",
  },
  {
    n: "02",
    title: "Complete application",
    text: "Personal details, academics, and program preferences.",
  },
  {
    n: "03",
    title: "Upload documents",
    text: "Credentials, transcripts, and supporting files.",
  },
  {
    n: "04",
    title: "Decision",
    text: "Review by admissions — then your official outcome.",
  },
]

function ShineCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.14] hover:bg-white/[0.04]",
        className
      )}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#009BC9]/10 via-transparent to-[#C9A227]/5" />
      </div>
      <div className="relative h-full">{children}</div>
    </div>
  )
}

function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      lenis.destroy()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#03070f] text-white antialiased selection:bg-[#009BC9]/30">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[70vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(0,155,201,0.18)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 right-0 h-[50vh] w-[50vw] bg-[radial-gradient(ellipse_at_bottom_right,_rgba(201,162,39,0.08)_0%,_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          className={cn(
            "flex w-full max-w-5xl items-center justify-between gap-3 rounded-full border px-3 py-2 transition-all duration-300 sm:px-4",
            scrolled
              ? "border-white/10 bg-[#03070f]/75 shadow-2xl shadow-black/40 backdrop-blur-2xl"
              : "border-white/[0.06] bg-white/[0.03] backdrop-blur-xl"
          )}
        >
          <Link to="/" className="flex shrink-0 items-center gap-2 pl-1">
            <img src={uniLogo} alt="UNIJOS" className="h-8 w-8 object-contain" />
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              UNIJOS
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="rounded-full px-3 py-1.5 text-[13px] text-white/55 transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link to="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3 text-[13px] text-white/70 hover:bg-white/5 hover:text-white"
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="h-8 rounded-full bg-white px-3.5 text-[13px] font-semibold text-[#03070f] hover:bg-white/90"
              >
                Get started
              </Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "absolute left-3 right-3 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-white/10 bg-[#03070f]/95 backdrop-blur-2xl transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col p-2">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="rounded-xl px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/5"
              >
                {l.label}
              </button>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm text-[#5ec8e8]"
            >
              Log in to dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[100svh] flex-col justify-center pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <HeroScene />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#03070f]/50 via-transparent to-[#03070f]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03070f] to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#009BC9] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#009BC9]" />
              </span>
              Applications open · 2026/27 session
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              The plateau&apos;s home for{" "}
              <span className="bg-gradient-to-r from-[#5ec8e8] via-[#009BC9] to-[#C9A227] bg-clip-text text-transparent">
                ambitious minds
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/50 sm:text-lg">
              University of Jos — discipline and dedication. One portal for
              courses, results, fees, hostel, and campus life.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/login">
                <Button className="h-11 rounded-full bg-[#009BC9] px-6 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(0,155,201,0.7)] hover:bg-[#00b0e0]">
                  Enter dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => scrollTo("#programs")}
                className="h-11 rounded-full border-white/15 bg-white/[0.03] px-6 text-sm text-white hover:bg-white/[0.07]"
              >
                Browse programs
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] sm:grid-cols-4">
            {[
              { v: "50+", l: "Programs" },
              { v: "15K+", l: "Students" },
              { v: "500+", l: "Faculty" },
              { v: "40+", l: "Years" },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-[#03070f]/60 px-4 py-5 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {s.v}
                </p>
                <p className="mt-1 text-xs text-white/40">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative border-y border-white/[0.06] bg-white/[0.015] py-4">
        <div className="flex overflow-hidden">
          <div className="flex min-w-full shrink-0 animate-[marquee_40s_linear_infinite] items-center gap-8 pr-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-8 text-sm text-white/35"
              >
                <span>{item}</span>
                <span className="h-1 w-1 rounded-full bg-[#009BC9]/60" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#009BC9]">
                Why UNIJOS
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for people who show up
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/45">
              From lecture halls to research labs — an ecosystem that rewards
              discipline and dedication.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <ShineCard key={f.title} className={cn("p-6 sm:p-7", f.span)}>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#5ec8e8]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">
                  {f.description}
                </p>
              </ShineCard>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative scroll-mt-28 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]">
                About
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                A leading institution on the Jos Plateau
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/50 sm:text-base">
                Founded to deliver world-class education, the University of Jos
                is one of Nigeria&apos;s most respected universities —
                recognized for academic rigor, research, and community.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">
                Modern facilities, experienced faculty, and a culture guided by
                our motto: Discipline and Dedication.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["Integrity", "Excellence", "Innovation", "Inclusivity"].map(
                  (v) => (
                    <span
                      key={v}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/60"
                    >
                      {v}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {[
                {
                  title: "Mission",
                  text: "Accessible, high-quality education that develops globally competitive graduates with knowledge and character.",
                  icon: Sparkles,
                },
                {
                  title: "Vision",
                  text: "A world-class institution known for excellence, innovation, and positive societal impact.",
                  icon: Award,
                },
                {
                  title: "Research",
                  text: "Solutions in health, engineering, climate, and technology through funded research and partnerships.",
                  icon: Lightbulb,
                },
                {
                  title: "Community",
                  text: "A diverse campus that values dialogue, service, and leadership beyond the classroom.",
                  icon: Users,
                },
              ].map((c) => (
                <ShineCard key={c.title} className="p-5 sm:p-6">
                  <c.icon className="mb-3 h-4 w-4 text-[#C9A227]" />
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/45 sm:text-sm">
                    {c.text}
                  </p>
                </ShineCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="relative scroll-mt-28 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#009BC9]">
              Academics
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Programs across every faculty
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/45">
              Undergraduate and postgraduate pathways designed for the modern
              world.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div
                key={p.title}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:bg-white/[0.04]",
                  p.tint
                )}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-white/20 transition group-hover:text-[#5ec8e8]" />
                </div>
                <ul className="mt-5 space-y-2">
                  {p.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/45"
                    >
                      <ChevronRight className="h-3 w-3 text-[#009BC9]/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="admissions" className="relative scroll-mt-28 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]">
                Admissions
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Clear path. Fair process.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-white/45 lg:text-right">
              Undergraduate and postgraduate entry — transparent requirements
              and a guided application flow.
            </p>
          </div>

          <div className="mb-10 grid gap-3 md:grid-cols-2">
            <ShineCard className="p-6">
              <h3 className="text-sm font-semibold text-[#5ec8e8]">
                Undergraduate
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Senior Secondary Certificate or equivalent",
                  "Acceptable JAMB / UTME score",
                  "Faculty-specific subject requirements",
                  "Complete online application",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-sm text-white/50"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#009BC9]/80" />
                    {t}
                  </li>
                ))}
              </ul>
            </ShineCard>
            <ShineCard className="p-6">
              <h3 className="text-sm font-semibold text-[#C9A227]">
                Postgraduate
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Relevant bachelor's degree (min. 2.1 or equivalent)",
                  "Transcripts and references",
                  "Statement of purpose",
                  "Program-specific requirements where applicable",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-sm text-white/50"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]/80" />
                    {t}
                  </li>
                ))}
              </ul>
            </ShineCard>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <span className="text-xs font-mono text-[#009BC9]">{s.n}</span>
                  <h4 className="mt-2 text-sm font-semibold">{s.title}</h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/signup">
              <Button className="h-11 rounded-full bg-[#C9A227] px-7 text-sm font-semibold text-[#1a1200] hover:bg-[#dbb43a]">
                Start application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="campus" className="relative scroll-mt-28 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#009BC9]/[0.08] via-white/[0.02] to-[#C9A227]/[0.06]">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5ec8e8]">
                  Campus life
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Live, learn, lead
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  Hostels, libraries, sports, clubs — and a student portal that
                  keeps courses, attendance, fees, and results in one place.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {[
                    { icon: Building2, label: "Hostel" },
                    { icon: BookOpen, label: "E-library" },
                    { icon: Award, label: "Results & GPA" },
                  ].map((i) => (
                    <span
                      key={i.label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/70"
                    >
                      <i.icon className="h-3.5 w-3.5 text-[#C9A227]" />
                      {i.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] bg-white/[0.04] lg:border-l lg:border-t-0">
                {[
                  { label: "Student portal", sub: "Courses, attendance, fees" },
                  { label: "Announcements", sub: "Campus-wide updates" },
                  { label: "Transcripts", sub: "Request online" },
                  { label: "Multi-role access", sub: "Staff, parent, admin" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="bg-[#03070f]/70 p-6 backdrop-blur-sm transition hover:bg-[#03070f]/50"
                  >
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="mt-1 text-xs text-white/40">{c.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative scroll-mt-28 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#009BC9]">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              We&apos;re here to help
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Campus",
                lines: ["University of Jos", "Jos, Plateau State, Nigeria"],
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["info@unijos.edu.ng", "admissions@unijos.edu.ng"],
              },
              {
                icon: Phone,
                title: "Phone",
                lines: ["+234 (0) 73 000 000", "Mon–Fri · 8am–4pm"],
              },
            ].map((c) => (
              <ShineCard key={c.title} className="p-7 text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#5ec8e8]">
                  <c.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">{c.title}</h3>
                <div className="mt-2 space-y-0.5 text-xs text-white/45">
                  {c.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </ShineCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] px-8 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,155,201,0.15)_0%,_transparent_70%)]" />
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                Ready when you are
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/45">
                Create an account or log in to manage courses, track progress,
                and stay connected with campus.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/signup">
                  <Button className="h-11 rounded-full bg-white px-7 text-sm font-semibold text-[#03070f] hover:bg-white/90">
                    Create account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="h-11 rounded-full border-white/15 bg-transparent px-7 text-sm text-white hover:bg-white/5"
                  >
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
            <div className="max-w-xs space-y-3">
              <div className="flex items-center gap-2">
                <img src={uniLogo} alt="" className="h-8 w-8 object-contain" />
                <span className="text-sm font-semibold">UNIJOS</span>
              </div>
              <p className="text-xs leading-relaxed text-white/35">
                University of Jos — Discipline and Dedication. Empowering the
                next generation of leaders.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Explore
                </p>
                <ul className="mt-3 space-y-2">
                  {navLinks.map((l) => (
                    <li key={l.href}>
                      <button
                        onClick={() => scrollTo(l.href)}
                        className="text-xs text-white/45 transition hover:text-white"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Portal
                </p>
                <ul className="mt-3 space-y-2 text-xs text-white/45">
                  <li>
                    <Link to="/login" className="hover:text-white">
                      Student login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-white">
                      Create account
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-white">
                      Staff / Admin
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Motto
                </p>
                <p className="mt-3 text-xs font-medium tracking-wide text-[#C9A227]">
                  Discipline and Dedication
                </p>
                <p className="mt-2 text-[11px] text-white/25">
                  © {new Date().getFullYear()} University of Jos
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default Home
