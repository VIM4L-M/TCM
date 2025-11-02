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
    teams: [
      {
        id: 'team1',
        name: 'Thunder Strikers',
        captain: 'John Doe',
        contact_email: 'thunder@example.com',
        contact_phone: '+1-555-0101'
      },
      {
        id: 'team2',
        name: 'Lightning Bolts',
        captain: 'Jane Smith',
        contact_email: 'lightning@example.com',
        contact_phone: '+1-555-0102'
      },
      {
        id: 'team3',
        name: 'Storm Warriors',
        captain: 'Mike Johnson',
        contact_email: 'storm@example.com',
        contact_phone: '+1-555-0103'
      },
      {
        id: 'team4',
        name: 'Wind Runners',
        captain: 'Sarah Williams',
        contact_email: 'wind@example.com',
        contact_phone: '+1-555-0104'
      },
      {
        id: 'team5',
        name: 'Fire Dragons',
        captain: 'Alex Brown',
        contact_email: 'fire@example.com',
        contact_phone: '+1-555-0105'
      },
      {
        id: 'team6',
        name: 'Ice Phoenix',
        captain: 'Chris Davis',
        contact_email: 'ice@example.com',
        contact_phone: '+1-555-0106'
      },
      {
        id: 'team7',
        name: 'Earth Titans',
        captain: 'Pat Garcia',
        contact_email: 'earth@example.com',
        contact_phone: '+1-555-0107'
      },
      {
        id: 'team8',
        name: 'Sky Hawks',
        captain: 'Jordan Lee',
        contact_email: 'sky@example.com',
        contact_phone: '+1-555-0108'
      },
      {
        id: 'team9',
        name: 'Ocean Waves',
        captain: 'Taylor Martinez',
        contact_email: 'ocean@example.com',
        contact_phone: '+1-555-0109'
      },
      {
        id: 'team10',
        name: 'Mountain Lions',
        captain: 'Morgan Anderson',
        contact_email: 'mountain@example.com',
        contact_phone: '+1-555-0110'
      },
      {
        id: 'team11',
        name: 'Desert Vipers',
        captain: 'Casey White',
        contact_email: 'desert@example.com',
        contact_phone: '+1-555-0111'
      },
      {
        id: 'team12',
        name: 'Forest Wolves',
        captain: 'Riley Taylor',
        contact_email: 'forest@example.com',
        contact_phone: '+1-555-0112'
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
    teams: [
      {
        id: 'team-s1',
        name: 'Beach Ballers',
        captain: 'Sam Wilson',
        contact_email: 'beach@example.com',
        contact_phone: '+1-555-0201'
      },
      {
        id: 'team-s2',
        name: 'Sunset Squad',
        captain: 'Dana Cooper',
        contact_email: 'sunset@example.com',
        contact_phone: '+1-555-0202'
      },
      {
        id: 'team-s3',
        name: 'Coast Crushers',
        captain: 'Jamie Reed',
        contact_email: 'coast@example.com',
        contact_phone: '+1-555-0203'
      },
      {
        id: 'team-s4',
        name: 'Wave Riders',
        captain: 'Taylor Brooks',
        contact_email: 'wave@example.com',
        contact_phone: '+1-555-0204'
      },
      {
        id: 'team-s5',
        name: 'Surf Stars',
        captain: 'Jordan Hayes',
        contact_email: 'surf@example.com',
        contact_phone: '+1-555-0205'
      },
      {
        id: 'team-s6',
        name: 'Sand Storm',
        captain: 'Alex Morgan',
        contact_email: 'sand@example.com',
        contact_phone: '+1-555-0206'
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

// Generate unique IDs for demo
export const generateId = () => {
  return 'demo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}
