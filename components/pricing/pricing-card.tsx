"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

type PricingCardProps = {
  name: string
  tagline: string
  price: string
  cadence?: "/month" | "/"
  oldPrice?: string
  savings?: string
  popular?: boolean
  cta: string
  onCtaHref?: string
  oneTime?: boolean
  features: string[]
}

export function PricingCard({
  name,
  tagline,
  price,
  cadence = "/month",
  oldPrice,
  savings,
  popular,
  cta,
  onCtaHref = "#",
  oneTime,
  features,
}: PricingCardProps) {
  return (
    <Card
      className={[
        "relative h-full flex flex-col justify-between overflow-hidden",
        "bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60",
        popular ? "ring-2 ring-primary/50" : "ring-1 ring-border",
      ].join(" ")}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          {popular ? (
            <Badge variant="secondary" className="rounded-full border border-primary/30 bg-primary/10 text-primary">
              Most Popular
            </Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{tagline}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-semibold tracking-tight">${price}</span>
          <span className="text-muted-foreground">{cadence}</span>
        </div>
        {oldPrice || savings ? (
          <div className="flex flex-wrap items-center gap-3">
            {oldPrice ? <span className="text-muted-foreground line-through">${oldPrice}</span> : null}
            {savings ? (
              <span className="rounded-full border px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                {savings}
              </span>
            ) : null}
          </div>
        ) : null}
        <ul className="mt-2 grid gap-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
              <span className="text-sm">{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={onCtaHref}>{oneTime ? "Get Lifetime Access" : cta}</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
