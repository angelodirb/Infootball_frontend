// API-Football Types
// Documentation: https://www.api-football.com/documentation-v3

export interface APIFootballResponse<T> {
  get: string
  parameters: Record<string, string>
  errors: string[] | Record<string, string>
  results: number
  paging: {
    current: number
    total: number
  }
  response: T[]
}

export interface Team {
  id: number
  name: string
  logo: string
  winner?: boolean | null
}

export interface Goals {
  home: number | null
  away: number | null
}

export interface League {
  id: number
  name: string
  country: string
  logo: string
  flag: string | null
  season: number
  round: string
}

export interface Fixture {
  id: number
  referee: string | null
  timezone: string
  date: string
  timestamp: number
  periods: {
    first: number | null
    second: number | null
  }
  venue: {
    id: number | null
    name: string | null
    city: string | null
  }
  status: {
    long: string
    short: FixtureStatusShort
    elapsed: number | null
  }
}

export type FixtureStatusShort =
  | 'TBD'   // Time To Be Defined
  | 'NS'    // Not Started
  | '1H'    // First Half
  | 'HT'    // Halftime
  | '2H'    // Second Half
  | 'ET'    // Extra Time
  | 'P'     // Penalty In Progress
  | 'FT'    // Match Finished
  | 'AET'   // Match Finished After Extra Time
  | 'PEN'   // Match Finished After Penalty
  | 'BT'    // Break Time
  | 'SUSP'  // Match Suspended
  | 'INT'   // Match Interrupted
  | 'PST'   // Match Postponed
  | 'CANC'  // Match Cancelled
  | 'ABD'   // Match Abandoned
  | 'AWD'   // Technical Loss
  | 'WO'    // WalkOver
  | 'LIVE'  // In Progress

export interface FixtureResponse {
  fixture: Fixture
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: Goals
  score: {
    halftime: Goals
    fulltime: Goals
    extratime: Goals
    penalty: Goals
  }
}

// Simplified Match type for UI components
export interface Match {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  time: string
  competition: string
  status: 'scheduled' | 'live' | 'finished'
  homeLogo?: string
  awayLogo?: string
}