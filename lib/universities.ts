export type UniversityInfo = {
  id: string
  name: string
  city: string
  kind: "Public" | "Private"
  admissionsUrl: string
  programsUrl: string
  description: string
}

export const universities: UniversityInfo[] = [
  { id: "mul", name: "Minhaj University Lahore", city: "Lahore", kind: "Private", admissionsUrl: "https://www.mul.edu.pk/en/admissions-open", programsUrl: "https://www.mul.edu.pk/en/admissions-open", description: "Open current admissions, program listings, eligibility, fee packages, and application guidance from the university." },
  { id: "superior", name: "Superior University", city: "Lahore", kind: "Private", admissionsUrl: "https://www.superior.edu.pk/admissions-2/", programsUrl: "https://www.superior.edu.pk/academics/undergraduate/", description: "Browse the official admissions portal and undergraduate program finder." },
  { id: "ucp", name: "University of Central Punjab (UCP)", city: "Lahore", kind: "Private", admissionsUrl: "https://www.online-admissions.ucp.edu.pk/", programsUrl: "https://ucp.edu.pk/undergraduate/", description: "Search undergraduate degrees and continue to UCP’s online admissions portal." },
  { id: "pu", name: "University of the Punjab", city: "Lahore", kind: "Public", admissionsUrl: "https://admissions.pu.edu.pk/", programsUrl: "https://pu.edu.pk/home/admission_notice/698", description: "View current admission notices, the application portal, and program offerings by campus and faculty." },
  { id: "lums", name: "Lahore University of Management Sciences (LUMS)", city: "Lahore", kind: "Private", admissionsUrl: "https://admission.lums.edu.pk/how-apply-admission", programsUrl: "https://admission.lums.edu.pk/", description: "Review the official undergraduate admissions process and current degree program listings." },
  { id: "umt", name: "University of Management and Technology (UMT)", city: "Lahore", kind: "Private", admissionsUrl: "https://admissions.umt.edu.pk/Admissions-Schedule.aspx", programsUrl: "https://admissions.umt.edu.pk/academic/undergraduate.aspx", description: "Browse UMT’s undergraduate program catalogue and its current admissions schedule." },
]

export const hecRecognizedUniversitiesUrl = "https://www.hec.gov.pk/english/universities/Pages/DAIs/HEC-recognized-Campuses.aspx"
