# StudyFlow - Smart Study Planner

A comprehensive web-based study planner built for Leaving Certificate students in Ireland. StudyFlow combines scientifically-proven study methodologies with an intuitive, modern interface to maximize learning efficiency and retention.

## Features

### 1. Dashboard & Study Calendar
- Central dashboard showing weekly/monthly view of scheduled study sessions
- Visual indicators for reviews, study sessions, and completed tasks
- Quick access to upcoming reviews and overdue sessions
- Study streak tracking for motivation

### 2. Leaving Certificate Points Calculator
- Calculate your CAO points based on Higher Level grades (H1-H8)
- Automatic identification of top 6 subjects
- **Automatic 25-point bonus** for Higher Level Maths (H6 or better)
- Real-time calculation with visual breakdown

**Points System:**
| Grade | Points |
|-------|--------|
| H1    | 100    |
| H2    | 88     |
| H3    | 77     |
| H4    | 66     |
| H5    | 56     |
| H6    | 46     |
| H7    | 37     |
| H8    | 0      |

### 3. Spaced Repetition System (SRS)
- Combat the "forgetting curve" with automated review scheduling
- Review intervals: 1 day, 3 days, 7 days, 16 days, 35 days
- Visual reminders on dashboard and calendar
- Track review count and progress for each topic

### 4. Active Recall / Retrieval Practice Tools

#### Flashcard Decks
- Create unlimited decks organized by subject
- Add, edit, and delete flashcards
- Review mode with difficulty rating (Easy/Good/Hard)
- Shuffle cards for varied practice

#### Self-Quizzing Mode
- "Test Knowledge" feature for any topic
- Write everything you remember without notes
- Save and review your quiz entries over time
- Strengthens memory through active retrieval

#### Practice Test Log
- Record practice test scores and dates
- Track progress by subject
- Visual performance charts
- Notes for areas to improve

### 5. Interleaving Session Planner
- Mix different sub-topics within study sessions
- Suggested 30-minute blocks for varied practice
- Accept, edit, or decline suggestions
- Improves understanding through topic variation

### 6. Feynman Technique Assistant
- Explain topics in simple terms
- Identify gaps in understanding
- Save and review explanations
- Deepen learning through teaching

### 7. Integrated Pomodoro Timer
- Pre-configured: 25-min work / 5-min break
- Customizable durations
- Long break after 4 sessions
- Visual and audio notifications
- Session tracking and statistics

## Technology Stack

- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Data Persistence:** Browser localStorage
- **Build Tool:** Vite

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or download the project:
```bash
cd study-planner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Guide

### Adding a Study Topic
1. Navigate to **Topics** in the sidebar
2. Click **Add Topic**
3. Select a subject and enter the topic name
4. The system automatically schedules review sessions

### Creating Flashcards
1. Go to **Flashcards** in the sidebar
2. Click **New Deck** to create a deck
3. Select the deck and click **Add Card**
4. Enter the front (question) and back (answer)
5. Click **Start Review** to study

### Scheduling Study Sessions
1. Navigate to **Calendar**
2. Click on a date or use **Add Session**
3. Select subject, topic, and duration
4. Optionally enable **Interleaving** for sub-topics

### Using the Pomodoro Timer
1. Click **Pomodoro Timer** in the sidebar
2. Press the play button to start
3. Work for 25 minutes (customizable)
4. Take a 5-minute break when prompted
5. After 4 sessions, take a longer 15-minute break

### Calculating Points
1. Go to **Points Calculator**
2. Select your expected grade for each subject
3. View your total points instantly
4. The top 6 subjects are automatically selected
5. Maths bonus is applied if H6 or better

### Logging Practice Tests
1. Navigate to **Practice Tests**
2. Click **Log Test**
3. Enter subject, topic, date, and score
4. Track your progress over time

### Using Active Recall
1. Open any topic in **Topics**
2. Click the **Brain icon** for Self-Quiz
3. Write everything you remember
4. Click the **Lightbulb icon** for Feynman Technique
5. Explain the topic in simple terms

## Design Philosophy

StudyFlow uses a calm, focused color palette built around:
- **Sage green** - Primary actions, focus states
- **Terracotta** - Breaks, highlights, bonuses
- **Midnight blue** - Text and backgrounds
- **Cream** - Accents and warmth

The interface prioritizes:
- Clean, distraction-free layouts
- Clear visual hierarchy
- Smooth animations for feedback
- Intuitive navigation

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- No account needed
- Data persists between sessions
- Data is private to your browser
- Clearing browser data will reset the app

## Subjects Supported

The app is pre-configured for 7 Higher Level subjects:
- English
- Irish
- Maths
- Computer Science
- Business
- Religion
- Physical Education (PE)

## Contributing

This is a prototype application. Feel free to fork and modify for your own use.

## License

MIT License - Feel free to use and modify for personal or educational purposes.

---

Built with care for Leaving Certificate students. Good luck with your studies!
