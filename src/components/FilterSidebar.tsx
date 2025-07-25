import React from 'react';
import { Filter, X } from 'lucide-react';
import { useQuestions } from '../contexts/QuestionContext';

const availableTags = [
  'Data Structures', 'Algorithms', 'C++', 'Java', 'Python', 'JavaScript', 'React',
  'Node.js', 'Database', 'SQL', 'Web Development', 'Machine Learning', 'AI',
  'Networking', 'Operating Systems', 'Software Engineering', 'Mathematics',
  'Physics', 'Chemistry', 'Theory', 'Practical', 'Assignment Help'
];

const priorities = ['Critical', 'Hard', 'Medium'];

export default function FilterSidebar() {
  const {
    selectedTags,
    setSelectedTags,
    selectedPriority,
    setSelectedPriority
  } = useQuestions();

  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedPriority('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {(selectedTags.length > 0 || selectedPriority) && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Priority Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Priority</h4>
        <div className="space-y-2">
          {priorities.map((priority) => (
            <label key={priority} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={selectedPriority === priority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">{priority}</span>
            </label>
          ))}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priority"
              value=""
              checked={selectedPriority === ''}
              onChange={() => setSelectedPriority('')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">All Priorities</span>
          </label>
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Tags</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableTags.map((tag) => (
            <label key={tag} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedTags.length > 0 || selectedPriority) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedPriority && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                <span>{selectedPriority}</span>
                <button
                  onClick={() => setSelectedPriority('')}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                <span>{tag}</span>
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}