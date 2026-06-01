import { Button } from "@/components/ui/button"
import uniLogo from "@/assets/unijos_logo.png"
import { Link } from "react-router-dom"

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={uniLogo} alt="UNIJOS Logo" className="h-10 w-10" />
              <span className="text-lg font-bold text-white">UNIJOS</span>
            </Link>
            <div className="hidden gap-8 md:flex">
              <a
                href="#about"
                className="text-white transition hover:text-blue-400"
              >
                About
              </a>
              <a
                href="#programs"
                className="text-white transition hover:text-blue-400"
              >
                Programs
              </a>
              <a
                href="#admissions"
                className="text-white transition hover:text-blue-400"
              >
                Admissions
              </a>
              <a
                href="#contact"
                className="text-white transition hover:text-blue-400"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl leading-tight font-bold text-white md:text-6xl">
                Welcome to{" "}
                <span className="text-blue-400">University of Jos</span>
              </h1>
              <p className="text-xl text-slate-300">
                A premier institution of higher learning dedicated to
                excellence, innovation, and transforming lives through quality
                education.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/login">
                <Button className="rounded-lg bg-blue-600 px-8 py-6 text-lg text-white hover:bg-blue-700">
                  Log in to Dashboard
                </Button>
              </Link>
              <Button className="rounded-lg border-2 border-white bg-transparent px-8 py-6 text-lg text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-400">50+</p>
                <p className="text-slate-400">Programs</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-400">15K+</p>
                <p className="text-slate-400">Students</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-blue-400">500+</p>
                <p className="text-slate-400">Faculty</p>
              </div>
            </div>
          </div>

          {/* Right Logo */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl"></div>
              <img
                src={uniLogo}
                alt="University of Jos"
                className="relative z-10 h-96 w-96 animate-pulse object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-center text-4xl font-bold text-white">
          Why Choose UNIJOS?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-white/20 bg-white/10 p-8 backdrop-blur-md transition hover:bg-white/20">
            <div className="mb-4 text-4xl">🎓</div>
            <h3 className="mb-4 text-xl font-bold text-white">
              Quality Education
            </h3>
            <p className="text-slate-300">
              World-class curriculum and experienced faculty dedicated to
              academic excellence.
            </p>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/10 p-8 backdrop-blur-md transition hover:bg-white/20">
            <div className="mb-4 text-4xl">🌍</div>
            <h3 className="mb-4 text-xl font-bold text-white">
              Global Network
            </h3>
            <p className="text-slate-300">
              International partnerships and collaborations providing global
              opportunities.
            </p>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/10 p-8 backdrop-blur-md transition hover:bg-white/20">
            <div className="mb-4 text-4xl">💡</div>
            <h3 className="mb-4 text-xl font-bold text-white">
              Innovation Hub
            </h3>
            <p className="text-slate-300">
              Cutting-edge research facilities and innovation centers for
              groundbreaking discoveries.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white">
              About University of Jos
            </h2>
            <p className="text-lg text-slate-300">
              Founded with a vision to provide world-class education, the
              University of Jos has established itself as a leading institution
              of higher learning in Africa. Our commitment to academic
              excellence, research innovation, and student development has made
              us a beacon of hope for thousands of students.
            </p>
            <p className="text-lg text-slate-300">
              With state-of-the-art facilities, experienced faculty, and a
              supportive community, we provide an environment where students can
              thrive both academically and personally. Our holistic approach to
              education ensures that graduates are well-equipped to tackle
              real-world challenges.
            </p>
            <Button className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
              Learn More About Us
            </Button>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-2xl font-bold text-blue-400">
                  Our Mission
                </h3>
                <p className="text-slate-300">
                  To provide accessible, high-quality education that develops
                  globally-competitive graduates equipped with knowledge and
                  skills.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold text-blue-400">
                  Our Vision
                </h3>
                <p className="text-slate-300">
                  To be a world-class institution recognized for academic
                  excellence, innovation, and positive societal impact.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold text-blue-400">
                  Our Values
                </h3>
                <p className="text-slate-300">
                  Integrity, Excellence, Innovation, Inclusivity, and
                  Sustainability guide everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section
        id="programs"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Academic Programs
            </h2>
            <p className="text-lg text-slate-300">
              Explore our diverse range of undergraduate and postgraduate
              programs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-3 text-xl font-bold text-blue-400">
                Engineering
              </h3>
              <p className="mb-4 text-slate-300">
                Civil, Mechanical, Electrical, and Chemical Engineering programs
                accredited internationally.
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>• Civil Engineering</li>
                <li>• Mechanical Engineering</li>
                <li>• Electrical Engineering</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-3 text-xl font-bold text-blue-400">
                Business & Economics
              </h3>
              <p className="mb-4 text-slate-300">
                Programs designed to develop future business leaders and
                entrepreneurs.
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>• Business Administration</li>
                <li>• Economics</li>
                <li>• Accounting</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-3 text-xl font-bold text-blue-400">
                Medicine & Health Sciences
              </h3>
              <p className="mb-4 text-slate-300">
                Comprehensive healthcare education with modern teaching
                hospitals and clinics.
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>• Medicine</li>
                <li>• Nursing</li>
                <li>• Public Health</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-3 text-xl font-bold text-blue-400">Sciences</h3>
              <p className="mb-4 text-slate-300">
                Rigorous science programs with emphasis on research and
                practical application.
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>• Physics</li>
                <li>• Chemistry</li>
                <li>• Biology</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-3 text-xl font-bold text-blue-400">
                Arts & Humanities
              </h3>
              <p className="mb-4 text-slate-300">
                Programs fostering critical thinking and cultural awareness
                across disciplines.
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>• English</li>
                <li>• History</li>
                <li>• Philosophy</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-3 text-xl font-bold text-blue-400">
                Technology & Computing
              </h3>
              <p className="mb-4 text-slate-300">
                Cutting-edge IT and computer science programs for the digital
                age.
              </p>
              <ul className="space-y-2 text-slate-300">
                <li>• Computer Science</li>
                <li>• Software Engineering</li>
                <li>• IT Management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Section */}
      <section
        id="admissions"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Admissions</h2>
            <p className="text-lg text-slate-300">
              Join our community of excellence and innovation
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-blue-400">
                Admission Requirements
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <h4 className="mb-2 font-bold text-white">
                    Undergraduate Admission
                  </h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• High School Diploma or equivalent</li>
                    <li>• Minimum GPA: 3.0</li>
                    <li>• Standardized Test Scores (JAMB/UTME)</li>
                    <li>• Complete Application Form</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <h4 className="mb-2 font-bold text-white">
                    Postgraduate Admission
                  </h4>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Bachelor's Degree in Related Field</li>
                    <li>• Minimum 2.1 Grade Classification</li>
                    <li>• Professional Experience (varies)</li>
                    <li>• Statement of Purpose</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-blue-400">
                Application Steps
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Create Account</h4>
                    <p className="text-slate-300">
                      Register on our admissions portal
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white">
                      Complete Application
                    </h4>
                    <p className="text-slate-300">
                      Fill in your personal and academic details
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Submit Documents</h4>
                    <p className="text-slate-300">
                      Upload required supporting documents
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Application Review</h4>
                    <p className="text-slate-300">
                      Admissions team reviews your application
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Receive Decision</h4>
                    <p className="text-slate-300">Get your acceptance letter</p>
                  </div>
                </div>
              </div>

              <Button className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Get In Touch</h2>
            <p className="text-lg text-slate-300">
              We'd love to hear from you. Contact us today!
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
              <div className="mb-4 text-4xl">📍</div>
              <h3 className="mb-4 text-xl font-bold text-white">Location</h3>
              <div className="space-y-2 text-slate-300">
                <p>University of Jos</p>
                <p>Jos, Plateau State</p>
                <p>Nigeria</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
              <div className="mb-4 text-4xl">📞</div>
              <h3 className="mb-4 text-xl font-bold text-white">Phone</h3>
              <div className="space-y-2 text-slate-300">
                <p>Admissions: +234 (0) XXX-XXX-XXXX</p>
                <p>General: +234 (0) XXX-XXX-XXXX</p>
                <p>Mon - Fri, 8AM - 5PM</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
              <div className="mb-4 text-4xl">✉️</div>
              <h3 className="mb-4 text-xl font-bold text-white">Email</h3>
              <div className="space-y-2 text-slate-300">
                <p>admissions@unijos.edu.ng</p>
                <p>info@unijos.edu.ng</p>
                <p>support@unijos.edu.ng</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/10 p-8 backdrop-blur-md">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Send us a Message
            </h3>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
              ></textarea>
              <Button className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto mb-20 max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-12 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Join thousands of students achieving their dreams at University of
            Jos
          </p>
          <Button className="rounded-lg bg-white px-8 py-6 text-lg font-semibold text-blue-600 hover:bg-slate-100">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-slate-400 sm:px-6 lg:px-8">
          <p>&copy; 2026 University of Jos. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
