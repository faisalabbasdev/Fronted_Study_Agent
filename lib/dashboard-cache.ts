export interface DashboardSnapshot {
  overview: any
  mistakes: any[]
  recentQuizzes: any[]
  recentSessions: any[]
}

interface CachedDashboard {
  userId: number
  snapshot: DashboardSnapshot
  cachedAt: number
}

const CACHE_TTL_MS = 15_000
let cachedDashboard: CachedDashboard | null = null

export function getDashboardSnapshot(userId: number) {
  if (!cachedDashboard || cachedDashboard.userId !== userId) return null

  return {
    snapshot: cachedDashboard.snapshot,
    isFresh: Date.now() - cachedDashboard.cachedAt < CACHE_TTL_MS,
  }
}

export function setDashboardSnapshot(userId: number, snapshot: DashboardSnapshot) {
  cachedDashboard = { userId, snapshot, cachedAt: Date.now() }
}

export function invalidateDashboardSnapshot() {
  if (cachedDashboard) cachedDashboard.cachedAt = 0
}

export function clearDashboardSnapshot() {
  cachedDashboard = null
}
