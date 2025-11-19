import { APIFootballResponse, FixtureResponse, Match, FixtureStatusShort } from '../types/api-football'

const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io'

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY
  if (!apiKey) {
    throw new Error('API_FOOTBALL_KEY is not set in environment variables')
  }
  return apiKey
}

// Generic fetch function for API-Football
async function fetchFromAPI<T>(endpoint: string, params?: Record<string, string>): Promise<APIFootballResponse<T>> {
  const url = new URL(`${API_FOOTBALL_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': getApiKey(),
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  })

  if (!response.ok) {
    throw new Error(`API-Football error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Convert API status to UI status
function mapStatus(status: FixtureStatusShort): 'scheduled' | 'live' | 'finished' {
  const liveStatuses: FixtureStatusShort[] = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE', 'INT']
  const finishedStatuses: FixtureStatusShort[] = ['FT', 'AET', 'PEN', 'AWD', 'WO']

  if (liveStatuses.includes(status)) return 'live'
  if (finishedStatuses.includes(status)) return 'finished'
  return 'scheduled'
}

// Format match time for display
function formatMatchTime(fixture: FixtureResponse): string {
  const { status, fixture: fixtureData } = fixture
  const statusShort = status?.short || fixtureData.status.short
  const elapsed = fixtureData.status.elapsed

  switch (statusShort) {
    case 'NS':
    case 'TBD':
      return new Date(fixtureData.date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })
    case '1H':
      return `${elapsed}' - Primer tiempo`
    case 'HT':
      return 'Descanso'
    case '2H':
      return `${elapsed}' - Segundo tiempo`
    case 'ET':
      return `${elapsed}' - Prórroga`
    case 'P':
      return 'Penales'
    case 'FT':
    case 'AET':
    case 'PEN':
      return 'Finalizado'
    case 'PST':
      return 'Aplazado'
    case 'CANC':
      return 'Cancelado'
    case 'SUSP':
      return 'Suspendido'
    default:
      return fixtureData.status.long
  }
}

// Convert API response to Match format for UI
function fixtureToMatch(fixture: FixtureResponse): Match {
  return {
    id: fixture.fixture.id,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeScore: fixture.goals.home ?? undefined,
    awayScore: fixture.goals.away ?? undefined,
    time: formatMatchTime(fixture),
    competition: fixture.league.name,
    status: mapStatus(fixture.fixture.status.short),
    homeLogo: fixture.teams.home.logo,
    awayLogo: fixture.teams.away.logo,
  }
}

// Get fixtures by date
export async function getFixturesByDate(date: string): Promise<Match[]> {
  const response = await fetchFromAPI<FixtureResponse>('/fixtures', { date })
  return response.response.map(fixtureToMatch)
}

// Get live fixtures
export async function getLiveFixtures(): Promise<Match[]> {
  const response = await fetchFromAPI<FixtureResponse>('/fixtures', { live: 'all' })
  return response.response.map(fixtureToMatch)
}

// Get fixtures by league
export async function getFixturesByLeague(leagueId: number, season: number): Promise<Match[]> {
  const response = await fetchFromAPI<FixtureResponse>('/fixtures', {
    league: leagueId.toString(),
    season: season.toString(),
  })
  return response.response.map(fixtureToMatch)
}

// Get fixtures for today
export async function getTodayFixtures(): Promise<Match[]> {
  const today = new Date().toISOString().split('T')[0]
  return getFixturesByDate(today)
}

// Get fixtures for a date range (next N days)
export async function getUpcomingFixtures(days: number = 7): Promise<Match[]> {
  const today = new Date()
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + days)

  const response = await fetchFromAPI<FixtureResponse>('/fixtures', {
    from: today.toISOString().split('T')[0],
    to: endDate.toISOString().split('T')[0],
  })
  return response.response.map(fixtureToMatch)
}

// Popular leagues IDs for filtering
export const POPULAR_LEAGUES = {
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  BUNDESLIGA: 78,
  SERIE_A: 135,
  LIGUE_1: 61,
  CHAMPIONS_LEAGUE: 2,
  EUROPA_LEAGUE: 3,
  WORLD_CUP: 1,
}

// Get fixtures for popular leagues only
export async function getPopularLeaguesFixtures(date?: string): Promise<Match[]> {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const leagueIds = Object.values(POPULAR_LEAGUES).join('-')

  const response = await fetchFromAPI<FixtureResponse>('/fixtures', {
    date: targetDate,
    league: leagueIds,
  })
  return response.response.map(fixtureToMatch)
}
