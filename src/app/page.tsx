import Image from "next/image";
import { ArrowRight, Box, Cuboid, Layout, Mail, Palette, Quote, Smartphone, Star, Zap } from "lucide-react";
import { ScrollAnimation } from "@/components/scroll-animation";
import { PortfolioTabs } from "@/components/portfolio-tabs";
import { getProjects } from "@/actions/projects";

const PLACEHOLDER_IMG = "https://placehold.co/800x600/0a0a0a/8b5cf6?text=Sunkye+Builds";

export default async function Home() {
  const projectsRes = await getProjects();
  const initialProjects = projectsRes.success ? projectsRes.data : [];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_60%)] -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-20 left-[5%] w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.15)_0%,transparent_60%)] translate-y-1/4 -translate-x-1/4"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 py-16 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <ScrollAnimation direction="left">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-primary-400 font-bold tracking-widest text-xl mb-4 flex items-center uppercase">
                      <span className="inline-block w-12 h-[2px] bg-primary mr-4"></span>
                      Professional Builder
                    </h2>
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
                      Hi, I'm <br />
                      <span className="text-gradient">Sunkye</span>
                    </h1>
                  </div>

                  <p className="text-xl md:text-2xl text-neutral-400 max-w-xl font-light leading-relaxed">
                    A professional Roblox builder dedicated to bringing your ideas to another level with unique, optimized quality.
                  </p>

                  <div className="flex gap-8 pt-4">
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-white">3+</p>
                      <p className="text-sm text-primary-400 font-medium tracking-wider uppercase">Years Experience</p>
                    </div>
                    <div className="w-px bg-neutral-800"></div>
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-white">590M+</p>
                      <p className="text-sm text-primary-400 font-medium tracking-wider uppercase">Contributed</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary-600/20 to-transparent rounded-3xl blur-3xl transform scale-95 translate-y-8"></div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black">
                    <img
                      src={PLACEHOLDER_IMG}
                      alt="Sunkye Hero Build"
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* About / Expertise Section */}
        <section id="about" className="py-24 md:py-40 relative">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-0 w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_60%)] -translate-x-1/2"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 space-y-20">
            <ScrollAnimation direction="up">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-primary-400 font-mono text-sm tracking-widest uppercase flex items-center justify-center">
                  <span className="inline-block w-8 h-[1px] bg-primary-500 mr-4"></span>
                  My Specialization
                  <span className="inline-block w-8 h-[1px] bg-primary-500 ml-4"></span>
                </h2>
                <h3 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">
                  Precision & Impact
                </h3>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
                  I specialize in the <span className="text-primary-300 font-medium">stud style</span>, focusing heavily on creating immersive games and consistently improving my overall skill set.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <ScrollAnimation direction="up" delay={0.1}>
                <div className="p-10 rounded-3xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm hover:border-primary-500/50 transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-primary-950 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Cuboid className="h-8 w-8 text-primary-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Immersive Environments</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Crafting vast, detailed worlds that pull players in, ensuring every corner of the map feels alive and purposeful.
                  </p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation direction="up" delay={0.2}>
                <div className="p-10 rounded-3xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm hover:border-primary-500/50 transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-primary-950 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Layout className="h-8 w-8 text-primary-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Structural Precision</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Building structures with geometric precision and strong visual impact, optimizing performance without sacrificing quality.
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section id="quote" className="py-24 relative bg-neutral-950 border-y border-neutral-900">
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimation direction="up">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Quote className="h-16 w-16 text-primary-600/40 mx-auto" />
                <h3 className="text-3xl md:text-5xl font-light italic text-white leading-tight">
                  "All our dreams can come true if we have the courage to pursue them"
                </h3>
                <p className="text-xl text-primary-400 font-medium tracking-wide uppercase">— Walt Disney</p>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Portfolio Showcase Section */}
        <section id="portfolio" className="py-24 md:py-40 relative">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-1/4 right-0 w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_60%)] translate-x-1/3"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 space-y-16">
            <ScrollAnimation direction="up">
              <div className="max-w-3xl space-y-6">
                <h2 className="text-primary-400 font-mono text-sm tracking-widest uppercase flex items-center">
                  <span className="inline-block w-8 h-[1px] bg-primary-500 mr-4"></span>
                  Selected Works
                </h2>
                <h3 className="text-4xl sm:text-6xl font-bold tracking-tighter text-white">
                  Featured Builds
                </h3>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.1}>
              <PortfolioTabs items={initialProjects} />
            </ScrollAnimation>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 md:py-40 relative">
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimation direction="up">
              <div className="max-w-4xl mx-auto rounded-3xl bg-neutral-900/50 border border-neutral-800 p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)] pointer-events-none"></div>
                
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6 relative z-10">Ready to build something <span className="text-primary-400">amazing?</span></h2>
                <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto relative z-10">
                  Let's collaborate to make your ideas go to another level. Contact me to discuss your project.
                </p>
                
                <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors inline-flex items-center gap-3 relative z-10">
                  Get In Touch <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900 text-center">
        <p className="text-neutral-500">© {new Date().getFullYear()} Sunkye. All rights reserved.</p>
      </footer>
    </div>
  );
}
