import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Question {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    isAnonymous: boolean;
    reputation: number;
  };
  tags: string[];
  priority: 'Critical' | 'Medium' | 'Hard';
  upvotes: number;
  answers: number;
  views: number;
  isResolved: boolean;
  createdAt: Date;
  department: string;
  semester: number;
}

interface QuestionContextType {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'upvotes' | 'answers' | 'views' | 'createdAt'>) => void;
  upvoteQuestion: (id: string) => void;
  markAsResolved: (id: string) => void;
  filteredQuestions: Question[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export function QuestionProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState('');

  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/questions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch questions');

      const data = await res.json();
      console.log('Fetched data:', data);

      let questionsArray: any[] = [];
      if (Array.isArray(data)) {
        questionsArray = data;
      } else if (Array.isArray(data.questions)) {
        questionsArray = data.questions;
      } else {
        throw new Error('Unexpected data format from API');
      }

      const mappedWithAnswers = await Promise.all(
        questionsArray.map(async (q: any) => {
          const countRes = await fetch(`http://localhost:5000/api/answers/count/${q._id}`);
          const countData = await countRes.json();
          return {
            ...q,
            id: q._id,
            createdAt: new Date(q.createdAt),
            answersCount: countData.count || 0,
          };
        })
      );

      mappedWithAnswers.sort((a, b) => {
        if (a.isResolved === b.isResolved) return 0;
        return a.isResolved ? 1 : -1;
      });

      setQuestions(mappedWithAnswers);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  fetchQuestions();
}, []);


  const addQuestion = async (newQuestion: Omit<Question, 'id' | 'upvotes' | 'answers' | 'views' | 'createdAt'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error('Failed to post question');

      const savedQuestion = await response.json();

      setQuestions(prev => [
        {
          ...savedQuestion,
          id: savedQuestion._id,
          createdAt: new Date(savedQuestion.createdAt),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('Error adding question:', err);
    }
  };

 const upvoteQuestion = (id: string) => {
  const upvoted = JSON.parse(localStorage.getItem('upvotedQuestions') || '[]');

  if (upvoted.includes(id)) return; // Already upvoted, do nothing

  // Add to localStorage
  const updatedUpvoted = [...upvoted, id];
  localStorage.setItem('upvotedQuestions', JSON.stringify(updatedUpvoted));

  // Update local state
  setQuestions(prev =>
    prev.map(q =>
      q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q
    )
  );
};

  const markAsResolved = async (id: string) => {
  try {
    const question = questions.find(q => q.id === id);
    if (!question) return;

    const res = await fetch(`http://localhost:5000/api/questions/${id}/resolve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ isResolved: !question.isResolved }),
    });

    if (!res.ok) throw new Error('Failed to update resolved status');

    const updatedQuestion = await res.json();

    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, isResolved: updatedQuestion.isResolved } : q))
    );
  } catch (err) {
    console.error('Error marking as resolved:', err);
  }
};


  const filteredQuestions = questions.filter(question => {
    const matchesSearch =
      searchTerm === '' ||
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTags =
      selectedTags.length === 0 || selectedTags.some(tag => question.tags.includes(tag));

    const matchesPriority =
      selectedPriority === '' || question.priority === selectedPriority;

    return matchesSearch && matchesTags && matchesPriority;
  });

  return (
    <QuestionContext.Provider
      value={{
        questions,
        addQuestion,
        upvoteQuestion,
        markAsResolved,
        filteredQuestions,
        searchTerm,
        setSearchTerm,
        selectedTags,
        setSelectedTags,
        selectedPriority,
        setSelectedPriority,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionProvider');
  }
  return context;
}
