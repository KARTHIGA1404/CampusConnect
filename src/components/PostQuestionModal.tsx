import React, { useState } from 'react';
import { X, Tag, AlertTriangle, HelpCircle, Clock } from 'lucide-react';
import { useQuestions } from '../contexts/QuestionContext';
import { useAuth } from '../contexts/AuthContext';

interface PostQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableTags = [
  'Data Structures', 'Algorithms', 'C++', 'Java', 'Python', 'JavaScript', 'React',
  'Node.js', 'Database', 'SQL', 'Web Development', 'Machine Learning', 'AI',
  'Networking', 'Operating Systems', 'Software Engineering', 'Mathematics',
  'Physics', 'Chemistry', 'Theory', 'Practical', 'Assignment Help'
];

const departments = [
  'Computer Science', 'Information Technology', 'Electronics', 'Mechanical',
  'Civil', 'Electrical', 'Chemical', 'Biotechnology', 'Mathematics', 'Physics'
];

export default function PostQuestionModal({ isOpen, onClose }: PostQuestionModalProps) {
  const { addQuestion } = useQuestions();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    priority: 'Medium' as 'Critical' | 'Medium' | 'Hard',
    isAnonymous: false,
    department: user?.department || '',
    semester: user?.semester || 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    addQuestion({
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      priority: formData.priority,
      author: {
        name: formData.isAnonymous ? 'Anonymous' : user?.name || 'Anonymous',
        isAnonymous: formData.isAnonymous,
        reputation: formData.isAnonymous ? 0 : user?.reputation || 0
      },
      isResolved: false,
      department: formData.department,
      semester: formData.semester
    });

    // Reset form
    setFormData({
      title: '',
      content: '',
      tags: [],
      priority: 'Medium',
      isAnonymous: false,
      department: user?.department || '',
      semester: user?.semester || 1
    });

    onClose();
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'border-red-500 text-red-700';
      case 'Hard':
        return 'border-orange-500 text-orange-700';
      case 'Medium':
        return 'border-yellow-500 text-yellow-700';
      default:
        return 'border-gray-300 text-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Hard':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Ask a Question</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's your programming question? Be specific..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Description *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Provide more details about your question. Include any code, error messages, or specific context..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-vertical"
              required
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Critical', 'Hard', 'Medium'] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority }))}
                  className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                    formData.priority === priority
                      ? `${getPriorityColor(priority)} bg-opacity-10`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {getPriorityIcon(priority)}
                  <span className="font-medium">{priority}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags (Select relevant topics)
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {formData.tags.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {formData.tags.join(', ')}
              </p>
            )}
          </div>

          {/* Department and Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Post anonymously (your identity will not be shown)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.content.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}