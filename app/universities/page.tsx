"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowDownRight, ArrowUpRight, BookOpen, GraduationCap, MapPin, Search, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { universities, hecRecognizedUniversitiesUrl } from "@/lib/universities"
import SiteFooter from "@/components/site-footer"

export default function UniversitiesPage() {
  const [query, setQuery] = useState("")
  const [sector, setSector] = useState("All")
  const filtered = useMemo(() => universities.filter((university) => {
    const matchesQuery = `${university.name} ${university.city} ${university.kind}`.toLowerCase().includes(query.trim().toLowerCase())
    return matchesQuery && (sector === "All" || university.kind === sector)
  }), [query, sector])

  return <main className="tayyar-marketing-page tayyar-universities-page">
    <section className="tayyar-university-hero">
      <p className="tayyar-mini-label"><span className="tayyar-live-indicator" /> UNIVERSITY GUIDE · PAKISTAN</p>
      <div className="tayyar-university-hero-grid"><div><h1>Find your next<br /><span>study destination.</span></h1><p>Explore university program catalogues and official admissions pages. Admissions dates, eligibility, and fees can change—check the university’s own site before applying.</p></div><div className="tayyar-university-hero-mark"><GraduationCap /><span>YOUR NEXT<br />CHAPTER</span></div></div>
      <div className="tayyar-university-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search university, city, or sector…" aria-label="Search universities" /><span>{filtered.length} listed</span></div>
      <div className="tayyar-university-filters"><span><SlidersHorizontal /> Filter</span>{["All", "Public", "Private"].map((value) => <button type="button" key={value} aria-pressed={sector === value} onClick={() => setSector(value)} className={sector === value ? "is-active" : ""}>{value}</button>)}</div>
    </section>

    <section className="tayyar-university-results" aria-label="University results">
      {filtered.length ? filtered.map((university, index) => <article className="tayyar-university-card" key={university.id}>
        <div className="tayyar-university-card-top"><span className="tayyar-university-number">0{index + 1}</span><span className="tayyar-university-sector">{university.kind} university</span></div>
        <div className="tayyar-university-card-icon"><GraduationCap /></div>
        <h2>{university.name}</h2><p className="tayyar-university-location"><MapPin />{university.city}, Pakistan</p>
        <p className="tayyar-university-description">{university.description}</p>
        <div className="tayyar-university-card-actions"><a href={university.programsUrl} target="_blank" rel="noreferrer">Explore programs <ArrowUpRight /></a><a href={university.admissionsUrl} target="_blank" rel="noreferrer">Admissions <ArrowUpRight /></a></div>
      </article>) : <div className="tayyar-university-empty"><BookOpen /><h2>No match found</h2><p>Try another university or use the official HEC directory to search recognized institutions across Pakistan.</p></div>}
    </section>

    <section className="tayyar-hec-note"><span><ShieldCheck /></span><div><strong>Check recognition and campus status</strong><p>Tayyar’s quick finder currently highlights six universities. For other institutions and campus recognition, verify directly with the Higher Education Commission.</p></div><a href={hecRecognizedUniversitiesUrl} target="_blank" rel="noreferrer">Open HEC directory <ArrowDownRight /></a></section>
    <SiteFooter />
  </main>
}
