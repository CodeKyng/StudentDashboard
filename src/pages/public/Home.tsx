import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Lenis from "lenis"
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
} from "lucide-react"

import uniLogo from "@/assets/unijos_logo.png"
import { Button } from "@/components/ui/button"
import { HeroScene } from "@/components/landing/HeroScene"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#admissions", label: "Admissions" },
  { href: "#campus", label: "Campus Life" },
  { href: "#contact", label: "Contact" },
]

const stats = [
  { value: "50+", label: "Academic Programs", icon: BookOpen },
  { value: "15K+", label: "Students", icon: Users },
  { value: "500+", label: "Faculty Members", icon: GraduationCap },
  { value: "40+", label: "Years of Excellence", icon: Award },
]

const features = [
  {
    icon: GraduationCap,
    title: "Academic Excellence",
    description:
      "Rigorous curricula, accredited programs, and faculty committed to producing globally competitive graduates.",
  },
  {
    icon: Globe2,
    title: "Global Opportunities",
    description:
      "International partnerships, exchange programs, and research collaborations that open doors worldwide.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Research",
    description:
      "Modern laboratories, innovation hubs, and funded research that turn ideas into real-world impact.",
  },
  {
    icon: Shield,
    title: "Student Support",
    description:
      "Mentorship, counseling, career services, and a vibrant campus community that helps you thrive.",
  },
]

const programs = [
  {
    title: "Engineering",
    accent: "from-[#009BC9]/20 to-transparent",
    items: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering"],
  },
  {
    title: "Medicine & Health",
    accent: "from-[#8B1A1A]/20 to-transparent",
    items: ["Medicine & Surgery", "Nursing Science", "Public Health", "Pharmacy"],
  },
  {
    title: "Business & Social Sciences",
    accent: "from-[#C9A227]/20 to-transparent",
    items: ["Business Administration", "Economics", "Accounting", "Political Science"],
  },
  {
    title: "Sciences",
    accent: "from-[#009BC9]/20 to-transparent",
    items: ["Physics", "Chemistry", "Biology", "Mathematics"],
  },
  {
    title: "Arts & Humanities",
    accent: "from-[#C9A227]/20 to-transparent",
    items: ["English", "History & International Studies", "Philosophy", "Theatre Arts"],
  },
  {
    title: "Technology & Computing",
    accent: "from-[#009BC9]/20 to-transparent",
    items: ["Computer Science", "Software Engineering", "Information Technology", "Cyber Security"],
  },
]

const admissionSteps = [
  { step: "01", title: "Create Account", text: "Register on the admissions portal with a valid email." },
  { step: "02", title: "Complete Application", text: "Fill in personal, academic, and program preference details." },
  { step: "03", title: "Upload Documents", text: "Submit credentials, transcripts, and supporting documents." },
  { step: "04", title: "Review & Decision", text: "Our team reviews your file and issues an official decision." },
]

function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      lenis.destroy()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060d18] text-white selection:bg-[#009BC9]/40">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#009BC9]/15 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#C9A227]/10 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-[#8B1A1A]/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/10 bg-[#060d18]/80 shadow-lg shadow-black/20 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <img
              src={uniLogo}
              alt="University of Jos"
              className="h-9 w-9 object-contain transition group-hover:scale-105 sm:h-10 sm:w-10"
            />
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-wide sm:text-base">UNIJOS</span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/50 sm:block">
                University of Jos
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-full px-3.5 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-full bg-[#009BC9] px-4 text-white shadow-lg shadow-[#009BC9]/25 hover:bg-[#00b4e6] sm:px-5">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-white/10 bg-[#060d18]/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-white/80 hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/login"
              className="mt-2 rounded-lg px-3 py-2.5 text-sm text-[#009BC9]"
              onClick={() => setMobileOpen(false)}
            >
              Log in to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[100svh] items-center pt-16">
        <div className="absolute inset-0 opacity-90">
          <HeroScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#060d18]/40 via-transparent to-[#060d18]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#009BC9]/30 bg-[#009BC9]/10 px-3.5 py-1.5 text-xs font-medium text-[#7dd3f0] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Discipline and Dedication
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-[3.75rem]">
                Shape your future at{" "}
                <span className="bg-gradient-to-r from-[#009BC9] via-[#5ec8e8] to-[#C9A227] bg-clip-text text-transparent">
                  University of Jos
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
                A premier institution dedicated to academic excellence, innovation, and transforming
                lives through quality education across Engineering, Medicine, Sciences, Arts, and
                Technology.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/login">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-full bg-[#009BC9] px-8 text-base font-semibold text-white shadow-xl shadow-[#009BC9]/30 hover:bg-[#00b4e6] sm:w-auto"
                >
                  Log in to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("#about")}
                className="h-12 w-full rounded-full border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto"
              >
                Explore Campus
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="space-y-1">
                  <p className="text-2xl font-bold text-[#5ec8e8] sm:text-3xl">{s.value}</p>
                  <p className="text-xs text-white/50 sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden items-center justify-center lg:flex">
            <div className="relative flex h-[420px] w-full max-w-md items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#009BC9]/10 blur-3xl" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
                <img
                  src={uniLogo}
                  alt="University of Jos crest"
                  className="mx-auto h-56 w-auto object-contain drop-shadow-2xl"
                />
                <p className="mt-6 text-center text-sm font-medium tracking-wide text-[#C9A227]">
                  DISCIPLINE AND DEDICATION
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-[#009BC9] to-transparent" />
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#009BC9]">
              Why UNIJOS
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for ambitious learners
            </h2>
            <p className="mt-4 text-white/60">
              Everything you need to excel — from world-class teaching to a supportive community on
              the Plateau.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-[#009BC9]/40 hover:bg-white/[0.06]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#009BC9]/15 text-[#5ec8e8] transition group-hover:scale-110 group-hover:bg-[#009BC9]/25">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
                About us
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                A leading institution on the Jos Plateau
              </h2>
              <p className="text-base leading-relaxed text-white/65">
                Founded with a vision to provide world-class education, the University of Jos has
                grown into one of Nigeria&apos;s most respected universities. Our commitment to
                academic excellence, research innovation, and student development makes us a beacon
                for thousands of scholars.
              </p>
              <p className="text-base leading-relaxed text-white/65">
                With modern facilities, experienced faculty, and a supportive community, we create
                an environment where students thrive academically and personally — guided by our
                motto: Discipline and Dedication.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                  Integrity
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                  Excellence
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                  Innovation
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                  Inclusivity
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Our Mission",
                  text: "Provide accessible, high-quality education that develops globally competitive graduates equipped with knowledge and character.",
                  color: "border-[#009BC9]/30",
                },
                {
                  title: "Our Vision",
                  text: "To be a world-class institution recognized for academic excellence, innovation, and positive societal impact.",
                  color: "border-[#C9A227]/30",
                },
                {
                  title: "Research Focus",
                  text: "Driving solutions in health, engineering, climate, and technology through funded research and partnerships.",
                  color: "border-[#8B1A1A]/30",
                },
                {
                  title: "Community",
                  text: "A diverse campus culture that values dialogue, service, and leadership beyond the classroom.",
                  color: "border-[#009BC9]/30",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={cn(
                    "rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-sm",
                    card.color
                  )}
                >
                  <h3 className="font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#009BC9]">
              Academics
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Academic programs
            </h2>
            <p className="mt-4 text-white/60">
              Undergraduate and postgraduate pathways across faculties designed for the modern
              world.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div
                key={p.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100",
                    p.accent
                  )}
                />
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                        <ChevronRight className="h-3.5 w-3.5 text-[#009BC9]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="admissions" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
                Admissions
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Join a community of excellence
              </h2>
              <p className="mt-4 text-white/60">
                Whether you are applying for undergraduate or postgraduate study, our process is
                clear, transparent, and supportive.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h4 className="font-semibold text-[#5ec8e8]">Undergraduate</h4>
                  <ul className="mt-3 space-y-1.5 text-sm text-white/60">
                    <li>• Senior Secondary Certificate or equivalent</li>
                    <li>• Acceptable JAMB / UTME score</li>
                    <li>• Faculty-specific subject requirements</li>
                    <li>• Complete online application</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h4 className="font-semibold text-[#C9A227]">Postgraduate</h4>
                  <ul className="mt-3 space-y-1.5 text-sm text-white/60">
                    <li>• Relevant bachelor&apos;s degree (minimum 2.1 or equivalent)</li>
                    <li>• Transcripts and references</li>
                    <li>• Statement of purpose</li>
                    <li>• Program-specific requirements where applicable</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Application steps</h3>
              <div className="mt-6 space-y-4">
                {admissionSteps.map((s) => (
                  <div
                    key={s.step}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#009BC9]/30"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#009BC9] to-[#007a9e] text-sm font-bold">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="font-semibold">{s.title}</h4>
                      <p className="mt-0.5 text-sm text-white/55">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="mt-8 block">
                <Button className="h-12 w-full rounded-full bg-[#C9A227] text-base font-semibold text-[#1a1200] hover:bg-[#dbb43a]">
                  Start your application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="campus" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#009BC9]/15 via-white/[0.03] to-[#C9A227]/10 p-8 sm:p-12 lg:p-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5ec8e8]">
                  Campus life
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Live, learn, and lead on the Plateau
                </h2>
                <p className="mt-4 text-white/65">
                  Hostels, libraries, sports facilities, clubs, and a student portal that keeps your
                  academic life organized — attendance, fees, results, and more in one place.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    { icon: Building2, label: "Hostel allocation" },
                    { icon: BookOpen, label: "E-library" },
                    { icon: Award, label: "Results & GPA" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm"
                    >
                      <item.icon className="h-4 w-4 text-[#C9A227]" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Student Portal", sub: "Courses, attendance, fees" },
                  { label: "Announcements", sub: "Campus-wide updates" },
                  { label: "Transcripts", sub: "Request online" },
                  { label: "Support", sub: "Staff & parent access" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-2xl border border-white/10 bg-[#060d18]/50 p-5 backdrop-blur-sm"
                  >
                    <p className="font-semibold">{c.label}</p>
                    <p className="mt-1 text-xs text-white/50">{c.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#009BC9]">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Get in touch</h2>
            <p className="mt-4 text-white/60">
              Questions about admissions, programs, or the student portal? We are here to help.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Location",
                lines: ["University of Jos", "Jos, Plateau State", "Nigeria"],
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["info@unijos.edu.ng", "admissions@unijos.edu.ng"],
              },
              {
                icon: Phone,
                title: "Phone",
                lines: ["+234 (0) 73 000 000", "Mon – Fri, 8am – 4pm"],
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center transition hover:border-[#009BC9]/30"
              >
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#009BC9]/15 text-[#5ec8e8]">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{c.title}</h3>
                <div className="mt-3 space-y-1 text-sm text-white/55">
                  {c.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#009BC9]/20 bg-gradient-to-r from-[#009BC9]/20 via-[#0a1a2e] to-[#C9A227]/15 px-8 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-[#009BC9]/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-40 w-40 rounded-full bg-[#C9A227]/20 blur-3xl" />
            <h2 className="relative text-2xl font-bold sm:text-3xl lg:text-4xl">
              Ready to begin your journey?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/65">
              Access the student dashboard, manage courses, track progress, and stay connected with
              campus life.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-white px-8 text-base font-semibold text-[#060d18] hover:bg-white/90"
                >
                  Create account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/25 bg-transparent px-8 text-base text-white hover:bg-white/10"
                >
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#040a12]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img src={uniLogo} alt="" className="h-9 w-9 object-contain" />
                <span className="font-bold">UNIJOS</span>
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                University of Jos — Discipline and Dedication. Empowering the next generation of
                leaders and innovators.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Explore
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => scrollTo(l.href)}
                      className="transition hover:text-[#5ec8e8]"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Portal
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li>
                  <Link to="/login" className="transition hover:text-[#5ec8e8]">
                    Student login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="transition hover:text-[#5ec8e8]">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="transition hover:text-[#5ec8e8]">
                    Staff / Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Motto
              </h4>
              <p className="mt-4 text-sm font-medium tracking-wide text-[#C9A227]">
                Discipline and Dedication
              </p>
              <p className="mt-2 text-xs text-white/40">
                © {new Date().getFullYear()} University of Jos. Student portal demo.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
