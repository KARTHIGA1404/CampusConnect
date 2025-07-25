import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUp,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash,
} from 'lucide-react';
import { Question } from '../contexts/QuestionContext';
import { useQuestions } from '../contexts/QuestionContext';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { upvoteQuestion, markAsResolved } = useQuestions();
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Hard':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <AlertTriangle className="h-3 w-3" />;
      case 'Hard':
        return <Clock className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const timeAgo = (date: string | Date) => {
    const now = new Date();
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - parsedDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const hasUpvoted = () => {
    const upvoted = JSON.parse(localStorage.getItem('upvotedQuestions') || '[]');
    return upvoted.includes(question.id);
  };

  const handleDelete = async () => {
  if (!window.confirm('Are you sure you want to delete this question?')) return;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/questions/${question.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const errText = await res.text();
      console.error('Failed to delete question:', errText);
    }
  } catch (err) {
    console.error('Error deleting question', err);
  }
};


  const isOwner = true; // TODO: Replace with actual user check like question.author.id === currentUser.id

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm border ${
        question.isResolved ? 'border-green-200' : 'border-gray-200'
      } hover:shadow-md transition-all duration-200`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 relative">
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                question.priority
              )}`}
            >
              {getPriorityIcon(question.priority)}
              <span>{question.priority}</span>
            </span>
            {question.isResolved && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <CheckCircle className="h-3 w-3" />
                <span>Resolved</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">{timeAgo(question.createdAt)}</span>

            {/* Dropdown menu for owner */}
            {isOwner && (
              <div className="relative group">
                <MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer group-hover:text-gray-700" />
                <div className="hidden group-hover:flex flex-col absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow z-10">
                  <button
                    onClick={() => navigate(`/edit-question/${question.id}`)}
                    className="px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/question/${question.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
            {question.title}
          </h3>
        </Link>

        {/* Content Preview */}
        <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md hover:bg-blue-100 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => !hasUpvoted() && upvoteQuestion(question.id)}
              disabled={hasUpvoted()}
              className={`flex items-center space-x-1 transition-colors ${
                hasUpvoted() ? 'text-blue-500 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium">{question.upvotes}</span>
            </button>

            <div className="flex items-center space-x-1 text-gray-500">
              <Link
                to={`/question/${question.id}`}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                
              </Link>
            </div>

            <div className="flex items-center space-x-1 text-gray-500">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{question.views}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">
              {question.author.isAnonymous ? (
                'Anonymous'
              ) : (
                <span className="flex items-center space-x-1">
                  <span>{question.author.name}</span>
                  <span className="text-blue-600">({question.author.reputation} rep)</span>
                </span>
              )}
            </div>

            {!question.isResolved && (
              <button
                onClick={() => markAsResolved(question.id)}
                className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
