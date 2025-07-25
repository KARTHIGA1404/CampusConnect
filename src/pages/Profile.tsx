import React from 'react';
import { User, Award, MessageCircle, HelpCircle, Calendar, MapPin, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuestions } from '../contexts/QuestionContext';
import { FaUserCircle } from 'react-icons/fa';
export default function Profile() {
  const { user } = useAuth();
  const { questions } = useQuestions();

  if (!user) return null;

  const userQuestions = questions.filter(q => !q.author.isAnonymous && q.author.name === user.name);
  const resolvedQuestions = userQuestions.filter(q => q.isResolved);
  const totalUpvotes = userQuestions.reduce((sum, q) => sum + q.upvotes, 0);

  const stats = [
    {
      icon: HelpCircle,
      label: 'Questions Asked',
      value: userQuestions.length,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: MessageCircle,
      label: 'Questions Answered',
      value: user.questionsAnswered || 0,
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Award,
      label: 'Best Answers',
      value: user.bestAnswers || 0,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: TrendingUp,
      label: 'Total Upvotes',
      value: totalUpvotes,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const badges = [
    { name: 'Helpful', description: 'Provided helpful answers', color: 'bg-green-100 text-green-800' },
    // { name: 'Active', description: 'Regular contributor', color: 'bg-blue-100 text-blue-800' },
    // { name: 'Problem Solver', description: 'Solved complex problems', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="min-h-screen bg-[#E3E8FF] py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden">
  {user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <FaUserCircle className="w-full h-full text-gray-400" />
  )}
</div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{user.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Semester {user.semester}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{user.reputation} Reputation</div>
            <p className="text-gray-600">
              Member since January 2024 • Rank #12 in Computer Science
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges & Achievements</h3>
          <div className="space-y-3">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                  {badge.name}
                </div>
                <span className="text-sm text-gray-600">{badge.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Questions</h3>
          <div className="space-y-3">
            {userQuestions.slice(0, 3).map((question) => (
              <div key={question.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-gray-900 text-sm mb-1">{question.title}</h4>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{question.upvotes} upvotes</span>
                  <span>{question.answers} answers</span>
                  <span className={question.isResolved ? 'text-green-600' : 'text-orange-600'}>
                    {question.isResolved ? 'Resolved' : 'Open'}
                  </span>
                </div>
              </div>
            ))}
            {userQuestions.length === 0 && (
              <p className="text-gray-500 text-sm">No questions asked yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress & Goals</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Questions Resolved</span>
              <span className="text-sm text-gray-500">{resolvedQuestions.length}/{userQuestions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${userQuestions.length > 0 ? (resolvedQuestions.length / userQuestions.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Next Reputation Milestone</span>
              <span className="text-sm text-gray-500">{user.reputation}/500</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(user.reputation / 500) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}