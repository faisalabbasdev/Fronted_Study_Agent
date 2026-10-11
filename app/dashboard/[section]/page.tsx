import { notFound } from "next/navigation"
import DashboardPage from "../page"

const sections = new Set(["subjects", "weak-topics", "mistakes", "progress", "activity"])

export default function DashboardSectionRoute({ params }: { params: { section: string } }) {
  if (!sections.has(params.section)) notFound()
  return <DashboardPage />
}
