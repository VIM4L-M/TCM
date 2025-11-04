import React from 'react'

const demoPlayers = [
  { name: 'Amit Sharma', age: 17, gender: 'Male', experience: '2 years' },
  { name: 'Priya Singh', age: 16, gender: 'Female', experience: '1 year' },
  { name: 'Rahul Verma', age: 18, gender: 'Male', experience: '3 years' },
]

export default function PlayerList() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Registered Players</h1>
      <table className="table-auto w-full card">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Experience</th>
          </tr>
        </thead>
        <tbody>
          {demoPlayers.map((p, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.age}</td>
              <td className="border px-4 py-2">{p.gender}</td>
              <td className="border px-4 py-2">{p.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
