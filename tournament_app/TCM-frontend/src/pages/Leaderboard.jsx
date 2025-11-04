import React, { useState, useEffect, useMemo } from 'react'
import { seedTournaments } from '../data/seed'
import { Trophy, Medal, Award } from 'lucide-react'

const Leaderboard = () => {
  const [selectedTournamentId, setSelectedTournamentId] = useState('')

  useEffect(() => {
    // Select first tournament by default
    if (seedTournaments.length > 0 && !selectedTournamentId) {
      setSelectedTournamentId(seedTournaments[0].id.toString())
    }
  }, [])

  // Get selected tournament and its teams sorted by spirit score
  const sortedTeams = useMemo(() => {
    if (!selectedTournamentId) return []

    const tournament = seedTournaments.find(
      (t) => t.id.toString() === selectedTournamentId
    )

    if (!tournament || !tournament.teams) return []

    // Sort teams by spirit_score in descending order (highest first)
    return [...tournament.teams].sort(
      (a, b) => (b.spirit_score || 0) - (a.spirit_score || 0)
    )
  }, [selectedTournamentId])

  const getRankIcon = (rank) => {
    if (rank === 1) {
      return <Trophy className="w-6 h-6 text-yellow-500" />
    } else if (rank === 2) {
      return <Medal className="w-6 h-6 text-gray-400" />
    } else if (rank === 3) {
      return <Award className="w-6 h-6 text-amber-600" />
    }
    return <span className="text-lg font-semibold text-gray-600">{rank}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="mt-2 text-gray-600">
              Teams ranked by Spirit Score
            </p>
          </div>

          {/* Tournament Selector */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Tournament</option>
              {seedTournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id.toString()}>
                  {tournament.name || tournament.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {sortedTeams.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {selectedTournamentId
                ? 'No teams registered yet'
                : 'Select a tournament to view leaderboard'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Captain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spirit Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    W-L
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTeams.map((team, index) => {
                  const rank = index + 1
                  return (
                    <tr
                      key={team.id}
                      className={`${
                        rank <= 3 ? 'bg-blue-50' : 'hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-10">
                          {getRankIcon(rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {team.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {team.captain}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-semibold ${
                              rank === 1
                                ? 'text-yellow-600'
                                : rank === 2
                                ? 'text-gray-600'
                                : rank === 3
                                ? 'text-amber-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {team.spirit_score || 0}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            / 100
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {team.wins || 0} - {team.losses || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {team.points || 0}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Legend */}
      {sortedTeams.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>1st Place</span>
            </div>
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-gray-400" />
              <span>2nd Place</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>3rd Place</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard