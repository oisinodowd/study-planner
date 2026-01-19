import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Layers, 
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  Shuffle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId, getSubjectColor } from '../utils';
import { Subject, ALL_SUBJECTS, FlashcardDeck, Flashcard } from '../types';

export function FlashcardsView() {
  const { state, dispatch } = useApp();
  const [showAddDeckModal, setShowAddDeckModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  const currentDeck = state.flashcardDecks.find(d => d.id === selectedDeck);

  const handleDeleteDeck = (deckId: string) => {
    if (confirm('Delete this deck and all its cards?')) {
      dispatch({ type: 'DELETE_DECK', payload: deckId });
      if (selectedDeck === deckId) setSelectedDeck(null);
    }
  };

  const handleDeleteCard = (deckId: string, cardId: string) => {
    dispatch({ type: 'DELETE_CARD', payload: { deckId, cardId } });
  };

  if (reviewMode && currentDeck) {
    return (
      <FlashcardReview
        deck={currentDeck}
        onClose={() => setReviewMode(false)}
        onUpdateCard={(card) => {
          dispatch({ type: 'UPDATE_CARD', payload: { deckId: currentDeck.id, card } });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-midnight-900">
          Flashcard Decks
        </h1>
        <button
          onClick={() => setShowAddDeckModal(true)}
          className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Deck
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Decks List */}
        <div className="col-span-1 space-y-4">
          {state.flashcardDecks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-8 text-center">
              <Layers className="w-12 h-12 text-midnight-300 mx-auto mb-3" />
              <h3 className="font-body font-semibold text-midnight-700 mb-2">No Decks Yet</h3>
              <p className="text-sm text-midnight-400 font-body mb-4">
                Create your first flashcard deck
              </p>
              <button
                onClick={() => setShowAddDeckModal(true)}
                className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors"
              >
                Create Deck
              </button>
            </div>
          ) : (
            state.flashcardDecks.map((deck) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all
                  ${selectedDeck === deck.id 
                    ? 'border-sage-500 ring-2 ring-sage-200' 
                    : 'border-midnight-100 hover:border-midnight-200'
                  }
                `}
                onClick={() => setSelectedDeck(deck.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-body font-semibold text-midnight-800">{deck.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${getSubjectColor(deck.subject)}`}>
                      {deck.subject}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDeck(deck.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-midnight-500 font-body">
                    {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
                  </span>
                  {deck.cards.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeck(deck.id);
                        setReviewMode(true);
                      }}
                      className="flex items-center gap-1 text-sm text-sage-600 font-body hover:text-sage-700"
                    >
                      <Play className="w-4 h-4" />
                      Study
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Deck Content */}
        <div className="col-span-2">
          {!selectedDeck ? (
            <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-12 text-center">
              <Layers className="w-16 h-16 text-midnight-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-midnight-800 mb-2">
                Select a Deck
              </h3>
              <p className="text-midnight-500 font-body">
                Choose a deck from the left to view and manage cards
              </p>
            </div>
          ) : currentDeck && (
            <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-midnight-900">
                    {currentDeck.name}
                  </h2>
                  <p className="text-sm text-midnight-500 font-body">
                    {currentDeck.cards.length} cards
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {currentDeck.cards.length > 0 && (
                    <button
                      onClick={() => setReviewMode(true)}
                      className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Review
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddCardModal(true)}
                    className="px-4 py-2 bg-midnight-100 text-midnight-700 rounded-xl font-body text-sm font-medium hover:bg-midnight-200 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Card
                  </button>
                </div>
              </div>
              <div className="p-6">
                {currentDeck.cards.length === 0 ? (
                  <div className="text-center py-8">
                    <Layers className="w-12 h-12 text-midnight-300 mx-auto mb-3" />
                    <p className="text-midnight-500 font-body mb-4">No cards in this deck yet</p>
                    <button
                      onClick={() => setShowAddCardModal(true)}
                      className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors"
                    >
                      Add First Card
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {currentDeck.cards.map((card) => (
                      <FlashcardPreview
                        key={card.id}
                        card={card}
                        onDelete={() => handleDeleteCard(currentDeck.id, card.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddDeckModal && (
        <AddDeckModal
          onClose={() => setShowAddDeckModal(false)}
          onAdd={(deck) => {
            dispatch({ type: 'ADD_DECK', payload: deck });
            setSelectedDeck(deck.id);
            setShowAddDeckModal(false);
          }}
        />
      )}

      {showAddCardModal && selectedDeck && (
        <AddCardModal
          onClose={() => setShowAddCardModal(false)}
          onAdd={(card) => {
            dispatch({ type: 'ADD_CARD_TO_DECK', payload: { deckId: selectedDeck, card } });
            setShowAddCardModal(false);
          }}
        />
      )}
    </div>
  );
}

function FlashcardPreview({ card, onDelete }: { card: Flashcard; onDelete: () => void }) {
  const [showBack, setShowBack] = useState(false);

  return (
    <div 
      className="bg-midnight-50 rounded-xl p-4 border border-midnight-100 cursor-pointer hover:bg-midnight-100 transition-colors"
      onClick={() => setShowBack(!showBack)}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-midnight-400 font-body">
          {showBack ? 'Back' : 'Front'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
      <p className="text-sm text-midnight-700 font-body">
        {showBack ? card.back : card.front}
      </p>
      <p className="text-xs text-midnight-400 mt-2 font-body">Click to flip</p>
    </div>
  );
}

interface AddDeckModalProps {
  onClose: () => void;
  onAdd: (deck: FlashcardDeck) => void;
}

function AddDeckModal({ onClose, onAdd }: AddDeckModalProps) {
  const [subject, setSubject] = useState<Subject>('English');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const deck: FlashcardDeck = {
      id: generateId(),
      subject,
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
      cards: [],
    };

    onAdd(deck);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
      >
        <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-midnight-900">
            New Flashcard Deck
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Deck Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., French Vocab, Physics Formulas"
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              rows={2}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-midnight-100 text-midnight-700 rounded-xl font-body font-medium hover:bg-midnight-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-sage-600 text-white rounded-xl font-body font-medium hover:bg-sage-700 transition-colors"
            >
              Create Deck
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface AddCardModalProps {
  onClose: () => void;
  onAdd: (card: Flashcard) => void;
}

function AddCardModal({ onClose, onAdd }: AddCardModalProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    const card: Flashcard = {
      id: generateId(),
      deckId: '',
      front: front.trim(),
      back: back.trim(),
      createdAt: new Date().toISOString(),
      difficulty: 'medium',
    };

    onAdd(card);
    setFront('');
    setBack('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
      >
        <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-midnight-900">
            Add New Card
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Front (Question/Term)
            </label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter the question or term..."
              rows={3}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Back (Answer/Definition)
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter the answer or definition..."
              rows={3}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-midnight-100 text-midnight-700 rounded-xl font-body font-medium hover:bg-midnight-200 transition-colors"
            >
              Done
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-sage-600 text-white rounded-xl font-body font-medium hover:bg-sage-700 transition-colors"
            >
              Add Card
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface FlashcardReviewProps {
  deck: FlashcardDeck;
  onClose: () => void;
  onUpdateCard: (card: Flashcard) => void;
}

function FlashcardReview({ deck, onClose, onUpdateCard }: FlashcardReviewProps) {
  const [cards, setCards] = useState(() => [...deck.cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(0);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const updatedCard = {
      ...currentCard,
      difficulty,
      lastReviewed: new Date().toISOString(),
    };
    onUpdateCard(updatedCard);
    setCompleted(completed + 1);
    handleNext();
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Layers className="w-16 h-16 text-midnight-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-semibold text-midnight-800 mb-2">
            No Cards to Review
          </h2>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-3 bg-sage-600 text-white rounded-xl font-body font-medium hover:bg-sage-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-midnight-900">
            {deck.name}
          </h1>
          <p className="text-midnight-500 font-body">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShuffle}
            className="p-2 hover:bg-midnight-100 rounded-lg transition-colors"
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5 text-midnight-600" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-midnight-100 text-midnight-700 rounded-xl font-body text-sm font-medium hover:bg-midnight-200 transition-colors"
          >
            Exit Review
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-midnight-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-sage-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div 
        className="relative h-80 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="absolute inset-0 bg-white rounded-2xl border border-midnight-100 shadow-lg p-8 flex items-center justify-center backface-hidden"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="text-center" style={{ backfaceVisibility: 'hidden' }}>
            <span className="text-xs text-midnight-400 font-body uppercase tracking-wider mb-4 block">
              {isFlipped ? 'Answer' : 'Question'}
            </span>
            <p className="text-xl font-body text-midnight-800">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
            <p className="text-sm text-midnight-400 mt-6 font-body">
              Click to flip
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-midnight-100 text-midnight-700 rounded-xl font-body text-sm font-medium hover:bg-midnight-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {isFlipped && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-midnight-500 font-body mr-2">How was it?</span>
            <button
              onClick={() => handleDifficulty('easy')}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-body text-sm font-medium hover:bg-emerald-200 transition-colors"
            >
              Easy
            </button>
            <button
              onClick={() => handleDifficulty('medium')}
              className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-body text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              Good
            </button>
            <button
              onClick={() => handleDifficulty('hard')}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-body text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Hard
            </button>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-midnight-100 text-midnight-700 rounded-xl font-body text-sm font-medium hover:bg-midnight-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="bg-midnight-50 rounded-xl p-4 flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-2xl font-display font-semibold text-midnight-800">{completed}</p>
          <p className="text-sm text-midnight-500 font-body">Reviewed</p>
        </div>
        <div className="w-px h-10 bg-midnight-200" />
        <div className="text-center">
          <p className="text-2xl font-display font-semibold text-midnight-800">
            {cards.length - currentIndex - 1}
          </p>
          <p className="text-sm text-midnight-500 font-body">Remaining</p>
        </div>
      </div>
    </div>
  );
}
