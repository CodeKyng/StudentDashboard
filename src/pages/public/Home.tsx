import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Menu,
  X,
  ArrowRight,
  Play,
  CheckCircle2,
  Calendar,
  Laptop,
  Building2,
  Star,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Sparkles,
  Shield,
  Globe2,
} from "lucide-react"

import uniLogo from "@/assets/unijos_logo.png"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#programs", label: "Programs" },
  { href: "#testimonials", label: "Stories" },
  { href: "#contact", label: "Contact" },
]

const features = [
  {
    icon: Laptop,
    title: "Student portal",
    desc: "Courses, attendance, fees, and results in one clean dashboard.",
    color: "bg-[#E8F7FC] text-[#009BC9]",
  },
  {
    icon: Calendar,
    title: "Exam schedules",
    desc: "Never miss a paper — stay on top of exam dates and venues.",
    color: "bg-[#FFF4E5] text-[#C9A227]",
  },
  {
    icon: Building2,
    title: "Hostel & campus",
    desc: "Allocate hostel space and access campus announcements online.",
    color: "bg-[#F3EEFF] text-[#7C5CFC]",
  },
  {
    icon: BookOpen,
    title: "E-library",
    desc: "Digital resources and past questions at your fingertips.",
    color: "bg-[#E8FBF0] text-[#16A34A]",
  },
]

const programs = [
  { title: "Engineering", count: "12 programs", tint: "from-[#E8F7FC] to-white" },
  { title: "Medicine & Health", count: "8 programs", tint: "from-[#FFECEC] to-white" },
  { title: "Business & Social", count: "10 programs", tint: "from-[#FFF8E8] to-white" },
  { title: "Sciences", count: "9 programs", tint: "from-[#E8FBF0] to-white" },
  { title: "Arts & Humanities", count: "11 programs", tint: "from-[#F3EEFF] to-white" },
  { title: "Technology", count: "7 programs", tint: "from-[#E8F7FC] to-white" },
]

const testimonials = [
  {
    name: "Amina Yusuf",
    role: "Computer Science · 400L",
    text: "The student portal made tracking my results and fees so much easier. I finally feel organized.",
  },
  {
    name: "Chinedu Okafor",
    role: "Medicine · 300L",
    text: "Exam schedules and announcements in one place saved me from missing important updates.",
  },
  {
    name: "Fatima Bello",
    role: "Business Admin · Alumni",
    text: "From registration to transcript requests, everything is clearer than the old paper process.",
  },
]

function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    const onScroll = () => setScrolled(window.scrollY > 12)
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
    <div className="min-h-screen overflow-x-hidden bg-[#FFFBF7] text-slate-800 antialiased selection:bg-[#009BC9]/20">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-lg"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={uniLogo} alt="UNIJOS" className="h-9 w-9 object-contain" />
            <span className="text-base font-bold tracking-tight text-slate-900">
              UNIJOS
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                className="h-9 rounded-full px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="h-9 rounded-full bg-[#009BC9] px-4 text-sm font-semibold text-white shadow-md shadow-[#009BC9]/25 hover:bg-[#00aedf]">
                Sign up
              </Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 md:hidden",
            mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-0.5 px-3 py-3">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </button>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#009BC9]"
            >
              Log in to dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#009BC9]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-[#C9A227]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#7C5CFC]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pb-24 lg:pt-12">
          <div className="order-2 lg:order-1">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFF0D6] px-3 py-1 text-xs font-semibold text-[#9A7200]">
              <Sparkles className="h-3.5 w-3.5" />
              Discipline and Dedication
            </div>

            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Studying at{" "}
              <span className="relative inline-block text-[#009BC9]">
                UNIJOS
                <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-[#C9A227]/40" />
              </span>{" "}
              is now much easier
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg">
              Your university portal for courses, results, fees, hostel, and
              campus life — built for students, staff, and parents on the
              Plateau.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/signup">
                <Button className="h-12 w-full rounded-full bg-[#009BC9] px-7 text-sm font-semibold text-white shadow-lg shadow-[#009BC9]/30 hover:bg-[#00aedf] sm:w-auto">
                  Join for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => scrollTo("#features")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-100">
                  <Play className="h-3.5 w-3.5 fill-slate-800 text-slate-800" />
                </span>
                See how it works
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l, i) => (
                  <div
                    key={l}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white",
                      [
                        "bg-[#009BC9]",
                        "bg-[#C9A227]",
                        "bg-[#7C5CFC]",
                        "bg-[#16A34A]",
                      ][i]
                    )}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">15,000+</p>
                <p className="text-xs text-slate-500">students on the portal</p>
              </div>
            </div>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
            <div className="relative aspect-square max-h-[420px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFE8C8] via-[#FFF4E5] to-[#E8F7FC] shadow-xl shadow-slate-200/60">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#009BC9]/20" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#C9A227]/20" />

              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative rounded-3xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
                  <img
                    src={uniLogo}
                    alt="University of Jos"
                    className="mx-auto h-40 w-auto object-contain drop-shadow-md sm:h-48"
                  />
                  <p className="mt-4 text-center text-xs font-semibold tracking-widest text-[#C9A227]">
                    DISCIPLINE AND DEDICATION
                  </p>
                </div>
              </div>

              <div className="absolute left-3 top-8 rounded-2xl border border-white/60 bg-white p-3 shadow-lg sm:left-6 sm:top-12 sm:p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F7FC]">
                    <Users className="h-4 w-4 text-[#009BC9]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">15K+</p>
                    <p className="text-[10px] text-slate-500">Students</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-3 rounded-2xl border border-white/60 bg-white p-3 shadow-lg sm:bottom-14 sm:right-6 sm:p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8FBF0]">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Results live</p>
                    <p className="text-[10px] text-slate-500">Semester GPA ready</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-4 top-1/3 rounded-2xl border border-white/60 bg-white px-3 py-2 shadow-lg sm:right-8">
                <div className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[#C9A227]" />
                  <span className="text-[11px] font-semibold text-slate-700">
                    50+ Programs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
            Trusted by the UNIJOS community
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { icon: GraduationCap, label: "500+ Faculty" },
              { icon: BookOpen, label: "50+ Programs" },
              { icon: Globe2, label: "Global alumni" },
              { icon: Shield, label: "Secure portal" },
              { icon: Award, label: "40+ Years" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium text-slate-500"
              >
                <item.icon className="h-4 w-4 text-[#009BC9]" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-[#009BC9]">What is UNIJOS?</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A leading university on the Jos Plateau
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              University of Jos delivers world-class education across
              engineering, medicine, sciences, arts, and technology — guided by
              discipline and dedication.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "For students",
                text: "Register courses, track attendance, view results, pay fees, and request transcripts online.",
                icon: GraduationCap,
                bg: "bg-[#E8F7FC]",
                iconColor: "text-[#009BC9]",
              },
              {
                title: "For staff",
                text: "Manage classes, publish announcements, and support academic administration from one place.",
                icon: Users,
                bg: "bg-[#FFF4E5]",
                iconColor: "text-[#C9A227]",
              },
              {
                title: "For parents",
                text: "Stay informed about academic progress and campus updates with parent-friendly access.",
                icon: Shield,
                bg: "bg-[#F3EEFF]",
                iconColor: "text-[#7C5CFC]",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:shadow-md"
              >
                <div
                  className={cn(
                    "mb-5 flex h-12 w-12 items-center justify-center rounded-2xl",
                    c.bg,
                    c.iconColor
                  )}
                >
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold text-[#009BC9]">
                Everything you need
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A modern campus experience, online
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500">
                From lecture halls to the student portal — tools that keep your
                academic life organized without the paperwork chaos.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Course registration and timetable",
                  "Real-time attendance & results",
                  "School fees and digital receipts",
                  "Hostel allocation & announcements",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F7FC]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#009BC9]" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/login" className="mt-8 inline-block">
                <Button className="h-11 rounded-full bg-[#009BC9] px-6 text-sm font-semibold text-white hover:bg-[#00aedf]">
                  Open dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-3xl border border-slate-100 bg-[#FFFBF7] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                >
                  <div
                    className={cn(
                      "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl",
                      f.color
                    )}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#009BC9]">Academics</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Explore our programs
              </h2>
            </div>
            <p className="max-w-sm text-sm text-slate-500">
              Undergraduate and postgraduate pathways across every faculty.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div
                key={p.title}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-b p-6 shadow-sm transition hover:shadow-md",
                  p.tint
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{p.count}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition group-hover:bg-[#009BC9] group-hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#009BC9] to-[#007A9E] px-8 py-12 text-white shadow-xl shadow-[#009BC9]/20 sm:px-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { v: "15K+", l: "Active students" },
                { v: "50+", l: "Academic programs" },
                { v: "500+", l: "Faculty members" },
                { v: "40+", l: "Years of excellence" },
              ].map((s) => (
                <div key={s.l} className="text-center sm:text-left">
                  <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {s.v}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-[#009BC9]">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What our community says
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#C9A227] text-[#C9A227]"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F7FC] text-sm font-bold text-[#009BC9]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#FFF0D6] px-8 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#C9A227]/20" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-[#009BC9]/15" />
            <div className="relative">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 sm:text-base">
                Create your account or log in to access the student dashboard
                and campus services.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/signup">
                  <Button className="h-12 rounded-full bg-[#009BC9] px-8 text-sm font-semibold text-white shadow-lg shadow-[#009BC9]/25 hover:bg-[#00aedf]">
                    Create free account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-slate-300 bg-white px-8 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
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
              <div
                key={c.title}
                className="rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F7FC] text-[#009BC9]">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <div className="mt-2 space-y-0.5 text-sm text-slate-500">
                  {c.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5">
                <img src={uniLogo} alt="" className="h-8 w-8 object-contain" />
                <span className="font-bold text-slate-900">UNIJOS</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                University of Jos — Discipline and Dedication. Empowering the
                next generation of leaders.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Explore
                </p>
                <ul className="mt-3 space-y-2">
                  {navLinks.map((l) => (
                    <li key={l.href}>
                      <button
                        onClick={() => scrollTo(l.href)}
                        className="text-sm text-slate-600 hover:text-[#009BC9]"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Portal
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>
                    <Link to="/login" className="hover:text-[#009BC9]">
                      Student login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-[#009BC9]">
                      Create account
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-[#009BC9]">
                      Staff / Admin
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Motto
                </p>
                <p className="mt-3 text-sm font-semibold text-[#C9A227]">
                  Discipline and Dedication
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  © {new Date().getFullYear()} University of Jos
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
