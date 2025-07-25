import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowUp,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useQuestions } from '../contexts/QuestionContext';
import { useAuth } from '../contexts/AuthContext';

interface Answer {
  id: string;
  content: string;
  author: {
    name: string;
    isAnonymous: boolean;
    reputation: number;
    avatar?: string;
  };
  upvotes: number;
  createdAt: Date | string;
  isAccepted: boolean;
}

export default function QuestionDetails() {
  const { id } = useParams<{ id: string }>();
  const { questions, upvoteQuestion, markAsResolved } = useQuestions();
  const { user } = useAuth();
  const [newAnswer, setNewAnswer] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const question = questions.find((q) => q.id === id);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/answers/${id}`);
        if (!res.ok) throw new Error('Failed to fetch answers');
        const data = await res.json();
        // Map MongoDB _id to id for frontend consistency
        const mapped = data.map((ans: any) => ({
          ...ans,
          id: ans._id,
        }));
        setAnswers(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) fetchAnswers();
  }, [id]);

  useEffect(() => {
    if (question) {
      // You may want to update the backend with new view count here
      question.views += 1;
    }
  }, [question]);

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

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

  const timeAgo = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid date';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    const payload = {
      content: newAnswer,
      author: {
        name: isAnonymous ? 'Anonymous' : user?.name || 'Anonymous',
        isAnonymous,
        reputation: isAnonymous ? 0 : user?.reputation || 0,
        avatar: isAnonymous ? '' : user?.avatar || '',
      },
    };

    try {
      const res = await fetch(`http://localhost:5000/api/answers/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit answer');
      const saved = await res.json();
      setAnswers((prev) => [...prev, { ...saved, id: saved._id }]);
      setNewAnswer('');
    } catch (err) {
      console.error(err);
    }
  };

  const upvoteAnswer = (answerId: string) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === answerId ? { ...answer, upvotes: answer.upvotes + 1 } : answer
      )
    );
  };

  const acceptAnswer = (answerId: string) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === answerId ? { ...answer, isAccepted: !answer.isAccepted } : answer
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Questions</span>
      </Link>

      <div className={`bg-white rounded-lg shadow-sm border ${question.isResolved ? 'border-green-200' : 'border-gray-200'} mb-6`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(question.priority)}`}>
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
            <span className="text-sm text-gray-500">{timeAgo(question.createdAt)}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md hover:bg-blue-100 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button onClick={() => upvoteQuestion(question.id)} className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowUp className="h-5 w-5" />
                <span className="font-medium">{question.upvotes}</span>
              </button>

              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="h-5 w-5" />
                <span>{answers.length} answers</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="h-5 w-5" />
                <span>{question.views} views</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Asked by {question.author.isAnonymous ? (
                  'Anonymous'
                ) : (
                  <span className="flex items-center space-x-1">
                    <span className="font-medium">{question.author.name}</span>
                    <span className="text-blue-600">({question.author.reputation} rep)</span>
                  </span>
                )}
              </div>

              {!question.isResolved && (
                <button onClick={() => markAsResolved(question.id)} className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h2>
        <div className="space-y-6">
          {answers.map((answer) => (
            <div key={answer.id} className={`bg-white rounded-lg shadow-sm border ${answer.isAccepted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <div className="p-6">
                {answer.isAccepted && (
                  <div className="flex items-center space-x-2 mb-4 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Accepted Answer</span>
                  </div>
                )}

                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button onClick={() => upvoteAnswer(answer.id)} className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                      <ArrowUp className="h-4 w-4" />
                      <span className="font-medium">{answer.upvotes}</span>
                    </button>

                    {!answer.isAccepted && (
                      <button onClick={() => acceptAnswer(answer.id)} className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                        Accept Answer
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {!answer.author.isAnonymous && answer.author.avatar && (
                        <img src={answer.author.avatar} alt={answer.author.name} className="h-8 w-8 rounded-full" />
                      )}
                      <div className="text-sm text-gray-500">
                        {answer.author.isAnonymous ? (
                          'Anonymous'
                        ) : (
                          <span className="flex items-center space-x-1">
                            <span className="font-medium">{answer.author.name}</span>
                            <span className="text-blue-600">({answer.author.reputation} rep)</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{timeAgo(answer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-vertical"
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Post anonymously</span>
            </label>
            <button
              type="submit"
              disabled={!newAnswer.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Post Answer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
