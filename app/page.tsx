import {
  Header,
  Hero,
  SocialProof,
  ROICalculator,
  Features,
  Testimonials,
  Pricing,
  FAQ,
  FinalCTA,
  Footer,
} from '@/components/marketing'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SocialProof />
      <ROICalculator />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
