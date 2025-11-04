// Seed data for demo mode when backend is unavailable

export const seedTournaments = [
  {
    id: 'evt-tca',
    title: 'TCA Championship 2025',
    slug: 'tca-2025',
    description: 'Annual TCA Championship tournament featuring top teams from across the region. This premier event showcases the best talent in competitive sports.',
    rules: '1. All teams must register before deadline\n2. Maximum 16 teams\n3. Standard elimination format\n4. Fair play policies enforced',
    start_date: '2025-11-15T09:00:00',
    end_date: '2025-11-17T18:00:00',
    timezone: 'America/New_York',
    location: 'Madison Square Garden, New York',
    max_teams: 16,
  registration_open: '2025-10-20T00:00:00',
    registration_close: '2025-11-10T23:59:59',
    status: 'draft',
    is_published: false,
    created_at: '2025-10-15T10:30:00',
    updated_at: '2025-10-28T14:22:00',
    sponsors: [
      {
        id: 'sp1',
        name: 'Tech Corp',
        url: 'https://techcorp.example.com',
        logo_url: '/placeholder-logo.png'
      },
      {
        id: 'sp2',
        name: 'Sports Gear Inc',
        url: 'https://sportsgear.example.com',
        logo_url: '/placeholder-logo.png'
      }
    ],
    fields: [
      {
        id: 'field1',
        name: 'Main Arena',
        open_time: '08:00',
        close_time: '20:00',
        buffer_minutes: 15,
        scheduled_matches: 0
      },
      {
        id: 'field2',
        name: 'Practice Court A',
        open_time: '09:00',
        close_time: '18:00',
        buffer_minutes: 10,
        scheduled_matches: 0
      }
    ],
    tournament_format: 'single_elimination',
    matches: [
      {
        id: 'm1',
        field_id: 'field1',
        start_time: '2025-11-15T09:00:00',
        status: 'completed', // upcoming | ongoing | completed
        teams: ['Thunder Strikers', 'Lightning Bolts'],
        score: { a: 13, b: 9 }
      },
      {
        id: 'm2',
        field_id: 'field2',
        start_time: '2025-11-15T10:30:00',
        status: 'ongoing',
        teams: ['Storm Warriors', 'Wind Runners'],
        score: { a: 7, b: 8 }
      },
      {
        id: 'm3',
        field_id: 'field1',
        start_time: '2025-11-15T12:00:00',
        status: 'upcoming',
        teams: ['Fire Dragons', 'Ice Phoenix'],
        score: { a: 0, b: 0 }
      }
    ],
    teams: [
      {
        id: 'team1',
        name: 'Thunder Strikers',
        captain: 'John Doe',
        contact_email: 'thunder@example.com',
        contact_phone: '+1-555-0101',
        spirit_score: 95,
        wins: 8,
        losses: 2,
        points: 24
      },
      {
        id: 'team2',
        name: 'Lightning Bolts',
        captain: 'Jane Smith',
        contact_email: 'lightning@example.com',
        contact_phone: '+1-555-0102',
        spirit_score: 92,
        wins: 7,
        losses: 3,
        points: 21
      },
      {
        id: 'team3',
        name: 'Storm Warriors',
        captain: 'Mike Johnson',
        contact_email: 'storm@example.com',
        contact_phone: '+1-555-0103',
        spirit_score: 88,
        wins: 6,
        losses: 4,
        points: 18
      },
      {
        id: 'team4',
        name: 'Wind Runners',
        captain: 'Sarah Williams',
        contact_email: 'wind@example.com',
        contact_phone: '+1-555-0104',
        spirit_score: 90,
        wins: 6,
        losses: 4,
        points: 18
      },
      {
        id: 'team5',
        name: 'Fire Dragons',
        captain: 'Alex Brown',
        contact_email: 'fire@example.com',
        contact_phone: '+1-555-0105',
        spirit_score: 85,
        wins: 5,
        losses: 5,
        points: 15
      },
      {
        id: 'team6',
        name: 'Ice Phoenix',
        captain: 'Chris Davis',
        contact_email: 'ice@example.com',
        contact_phone: '+1-555-0106',
        spirit_score: 87,
        wins: 5,
        losses: 5,
        points: 15
      },
      {
        id: 'team7',
        name: 'Earth Titans',
        captain: 'Pat Garcia',
        contact_email: 'earth@example.com',
        contact_phone: '+1-555-0107',
        spirit_score: 82,
        wins: 4,
        losses: 6,
        points: 12
      },
      {
        id: 'team8',
        name: 'Sky Hawks',
        captain: 'Jordan Lee',
        contact_email: 'sky@example.com',
        contact_phone: '+1-555-0108',
        spirit_score: 78,
        wins: 3,
        losses: 7,
        points: 9
      },
      {
        id: 'team9',
        name: 'Ocean Waves',
        captain: 'Taylor Martinez',
        contact_email: 'ocean@example.com',
        contact_phone: '+1-555-0109',
        spirit_score: 80,
        wins: 3,
        losses: 7,
        points: 9
      },
      {
        id: 'team10',
        name: 'Mountain Lions',
        captain: 'Morgan Anderson',
        contact_email: 'mountain@example.com',
        contact_phone: '+1-555-0110',
        spirit_score: 75,
        wins: 2,
        losses: 8,
        points: 6
      },
      {
        id: 'team11',
        name: 'Desert Vipers',
        captain: 'Casey White',
        contact_email: 'desert@example.com',
        contact_phone: '+1-555-0111',
        spirit_score: 73,
        wins: 2,
        losses: 8,
        points: 6
      },
      {
        id: 'team12',
        name: 'Forest Wolves',
        captain: 'Riley Taylor',
        contact_email: 'forest@example.com',
        contact_phone: '+1-555-0112',
        spirit_score: 70,
        wins: 1,
        losses: 9,
        points: 3
      }
    ],
    stats: {
      teams_registered: 12,
      matches_scheduled: 24,
      fields_count: 2
    }
  },
  {
    id: 'evt-summer',
    title: 'Summer League 2025',
    slug: 'summer-league-2025',
    description: 'Casual summer tournament for community teams.',
    rules: 'Standard rules apply. Have fun!',
    start_date: '2025-12-01T10:00:00',
    end_date: '2025-12-03T17:00:00',
    timezone: 'America/Los_Angeles',
    location: 'Community Sports Complex, LA',
    max_teams: 8,
  registration_open: '2025-11-01T00:00:00',
    registration_close: '2025-11-25T23:59:59',
    status: 'active',
    is_published: true,
    created_at: '2025-10-20T09:15:00',
    updated_at: '2025-10-29T11:40:00',
    sponsors: [],
    fields: [
      {
        id: 'field3',
        name: 'Field 1',
        open_time: '10:00',
        close_time: '18:00',
        buffer_minutes: 10,
        scheduled_matches: 0
      }
    ],
    tournament_format: 'round_robin',
    matches: [
      {
        id: 's1',
        field_id: 'field3',
        start_time: '2025-12-01T10:00:00',
        status: 'ongoing',
        teams: ['Beach Ballers', 'Sunset Squad'],
        score: { a: 11, b: 11 }
      },
      {
        id: 's2',
        field_id: 'field3',
        start_time: '2025-12-01T11:30:00',
        status: 'upcoming',
        teams: ['Coast Crushers', 'Wave Riders'],
        score: { a: 0, b: 0 }
      },
      {
        id: 's3',
        field_id: 'field3',
        start_time: '2025-12-01T13:00:00',
        status: 'completed',
        teams: ['Surf Stars', 'Sand Storm'],
        score: { a: 9, b: 13 }
      }
    ],
    teams: [
      {
        id: 'team-s1',
        name: 'Beach Ballers',
        captain: 'Sam Wilson',
        contact_email: 'beach@example.com',
        contact_phone: '+1-555-0201',
        spirit_score: 94,
        wins: 5,
        losses: 1,
        points: 15
      },
      {
        id: 'team-s2',
        name: 'Sunset Squad',
        captain: 'Dana Cooper',
        contact_email: 'sunset@example.com',
        contact_phone: '+1-555-0202',
        spirit_score: 91,
        wins: 4,
        losses: 2,
        points: 12
      },
      {
        id: 'team-s3',
        name: 'Coast Crushers',
        captain: 'Jamie Reed',
        contact_email: 'coast@example.com',
        contact_phone: '+1-555-0203',
        spirit_score: 89,
        wins: 3,
        losses: 3,
        points: 9
      },
      {
        id: 'team-s4',
        name: 'Wave Riders',
        captain: 'Taylor Brooks',
        contact_email: 'wave@example.com',
        contact_phone: '+1-555-0204',
        spirit_score: 86,
        wins: 3,
        losses: 3,
        points: 9
      },
      {
        id: 'team-s5',
        name: 'Surf Stars',
        captain: 'Jordan Hayes',
        contact_email: 'surf@example.com',
        contact_phone: '+1-555-0205',
        spirit_score: 84,
        wins: 2,
        losses: 4,
        points: 6
      },
      {
        id: 'team-s6',
        name: 'Sand Storm',
        captain: 'Alex Morgan',
        contact_email: 'sand@example.com',
        contact_phone: '+1-555-0206',
        spirit_score: 81,
        wins: 1,
        losses: 5,
        points: 3
      }
    ],
    stats: {
      teams_registered: 6,
      matches_scheduled: 14,
      fields_count: 1
    }
  }
]

export const seedSnapshots = [
  {
    id: 'snap1',
    tournament_id: 'evt-tca',
    created_at: '2025-10-28T10:00:00',
    created_by: 'admin@example.com',
    description: 'Pre-launch snapshot'
  },
  {
    id: 'snap2',
    tournament_id: 'evt-tca',
    created_at: '2025-10-25T15:30:00',
    created_by: 'admin@example.com',
    description: 'Initial setup snapshot'
  }
]

export const seedVisitors = [
  {
    id: 'vis1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0123',
    role: 'press',
    checked_in: true,
    registered_at: '2025-10-29T09:15:00'
  },
  {
    id: 'vis2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1-555-0456',
    role: 'volunteer',
    checked_in: false,
    registered_at: '2025-10-29T10:30:00'
  }
]

export const seedPlayers = [
  {
    id: 'pl-1',
    first_name: 'Alex',
    last_name: 'Morgan',
    display_name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    age: 28,
    gender: 'female',
    experience: 'Intermediate',
    teams: [
      { tournament_id: 'evt-tca', team_id: 'team5', team_name: 'Fire Dragons' }
    ],
    participation: [
      { tournament_id: 'evt-tca', matches_played: 3, spirit_avg: 12 }
    ],
    created_at: '2025-10-10T09:00:00'
  },
  {
    id: 'pl-2',
    first_name: 'Sam',
    last_name: 'Wilson',
    display_name: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    age: 24,
    gender: 'male',
    experience: 'Beginner',
    teams: [
      { tournament_id: 'evt-summer', team_id: 'team-s1', team_name: 'Beach Ballers' }
    ],
    participation: [
      { tournament_id: 'evt-summer', matches_played: 2, spirit_avg: 11 }
    ],
    created_at: '2025-10-20T11:00:00'
  }
]

// Generate unique IDs for demo
export const generateId = () => {
  return 'demo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}
