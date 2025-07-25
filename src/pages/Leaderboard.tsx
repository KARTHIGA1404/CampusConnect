import React from 'react';
import { Trophy, Star, ArrowUp, MessageCircle, Award, Crown } from 'lucide-react';

const leaderboardData = [
    {
    id: '688268f5b3894c6c62029b00',
    name: 'Karthiga',
    reputation: 10,
    questionsAnswered: 8,
    questionsAsked: 17,
    bestAnswers: 5,
    department: 'Computer Science',
    semester: 7,
    avatar: 'https://ui-avatars.com/api/?name=Karthiga',
    badges: []
  },
    {
    id: '68821f1a7b6b9acbb42182cd',
    name: 'Kriti',
    reputation: 9,
    questionsAnswered: 5,
    questionsAsked: 8,
    bestAnswers: 4,
    department: 'Computer Science',
    semester: 6,
    avatar: 'https://ui-avatars.com/api/?name=Kriti',
    badges: []
  },
  {
    id: '68830b9bff35e10ee0948529',
    name: 'Keerthana',
    reputation: 8,
    questionsAnswered: 2,
    questionsAsked: 5,
    bestAnswers: 3,
    department: 'Computer Science',
    semester: 7,
    avatar: 'https://ui-avatars.com/api/?name=Keerthana',
    badges: []
  },
  {
    id: '68830bdcff35e10ee094852c',
    name: 'Rupan',
    reputation: 7,
    questionsAnswered: 1,
    questionsAsked: 3,
    bestAnswers: 2,
    department: 'Electrical',
    semester: 7,
    avatar: 'https://ui-avatars.com/api/?name=Rupan',
    badges: []
  },
  {
    id: '68830c34ff35e10ee094852f',
    name: 'Sandhiya',
    reputation: 6,
    questionsAnswered: 0,
    questionsAsked: 1,
    bestAnswers: 1,
    department: 'Electrical',
    semester: 7,
    avatar: 'https://ui-avatars.com/api/?name=Sandhiya',
    badges: []
  },
  
];


export default function Leaderboard() {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 2:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      'Top Contributor': 'bg-purple-100 text-purple-800',
      'Helpful': 'bg-green-100 text-green-800',
      'Problem Solver': 'bg-blue-100 text-blue-800',
      'Rising Star': 'bg-yellow-100 text-yellow-800',
      'Active': 'bg-indigo-100 text-indigo-800',
      'Mentor': 'bg-red-100 text-red-800',
      'Consistent': 'bg-teal-100 text-teal-800'
    };
    return colors[badge as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">Top contributors in our campus community</p>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <div
              key={user.id}
              className={`${getRankBg(index)} border-2 rounded-xl p-6 text-center ${
                index === 0 ? 'md:order-2 transform md:scale-105' : 
                index === 1 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              <div className="relative mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                />
                <div className="absolute -top-2 -right-2">
                  {getRankIcon(index)}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{user.department}</p>
              <div className="text-2xl font-bold text-blue-600 mb-3">{user.reputation}</div>
              <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{user.questionsAnswered}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>{user.bestAnswers}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Contributors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reputation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Answers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Best Answers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badges
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(index)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.department} • Sem {user.semester}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-blue-600">{user.reputation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.questionsAnswered}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.questionsAsked}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {user.bestAnswers}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}