import { PricingCard } from "@/components/pricing/pricing-card"
import Image from "next/image"

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Choose Your Plan</h1>
        <p className="mt-2 text-muted-foreground">Start free, upgrade when you need more power</p>
      </header>

      <section aria-label="Plans" className="mt-8 grid gap-6 md:grid-cols-3">
        <PricingCard
          name="Pro"
          tagline="Perfect for personal use"
          price="3.59"
          oldPrice="4.99"
          savings="You save $1.40 (−28%)"
          cta="Try for Free"
          features={[
            "Unlimited reminders",
            "Smart scheduling",
            "WhatsApp integration",
            "Basic analytics",
            "Email support",
            "Mobile notifications",
            "Custom integrations",
          ]}
        />
        <PricingCard
          name="Supernova"
          tagline="For power users and teams"
          price="9.99"
          oldPrice="14.99"
          savings="You save $5.00 (−33%)"
          cta="Activate Now"
          popular
          features={[
            "Everything in Pro",
            "Advanced AI insights",
            "Team collaboration",
            "Priority support",
            "Custom integrations",
            "Advanced analytics",
            "API access",
            "Unlimited team members",
          ]}
        />
        <PricingCard
          name="Supernova Lifetime"
          tagline="Best value — pay once, use forever"
          price="299"
          cadence="/"
          oldPrice="599"
          savings="You save $300 (−50%)"
          cta="Get Lifetime Access"
          oneTime
          features={[
            "Everything in Supernova",
            "Lifetime access",
            "All future updates",
            "Premium support forever",
            "Early feature access",
            "Exclusive community",
            "White‑label options",
            "Custom branding",
          ]}
        />
      </section>

      <figure className="mt-12">
        <Image
          src="/images/pricing-reference.png"
          alt="Pricing reference design"
          width={1210}
          height={768}
          className="mx-auto rounded-xl border"
        />
      </figure>
    </main>
  )
}
