import React from 'react';
import { BookOpen } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { useQuestions } from '../contexts/QuestionContext';
import FilterSidebar from '../components/FilterSidebar';

export default function Home() {
  const { filteredQuestions } = useQuestions();

  return (
    <div className="min-h-screen bg-[#E3E8FF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold text-gray-800">
                📚 Recent Questions
              </h2>
              <span className="text-sm text-gray-600">
                Total: {filteredQuestions.length}
              </span>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No questions found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or be the first to ask a question!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
