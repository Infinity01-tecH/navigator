export const SKILLS = [
  'React Development', 'Python Programming', 'Data Science',
  'Machine Learning', 'Web Design', 'iOS Development',
  'TypeScript', 'Node.js', 'Docker & Kubernetes',
  'SQL Databases', 'Cloud Architecture', 'GraphQL',
  'Rust', 'Flutter', 'Vue.js', 'Next.js',
  'DevOps', 'Blockchain', 'Cybersecurity', 'UX Design',
  'Product Management', 'System Design', 'Go', 'Kotlin',
  'Angular', 'Svelte', 'Three.js', 'Figma', 'AWS',
];

export const QUESTIONS = [
  {
    key: 'q1',
    q: 'When learning something new, you prefer to…',
    opts: [
      { l: 'A', t: 'Read documentation and articles thoroughly' },
      { l: 'B', t: 'Watch video tutorials and follow along' },
      { l: 'C', t: 'Jump in and build something immediately' },
      { l: 'D', t: 'Follow a structured course from start to finish' },
    ],
  },
  {
    key: 'q2',
    q: 'When you get stuck on a problem, you first…',
    opts: [
      { l: 'A', t: 'Google the error message carefully' },
      { l: 'B', t: 'Ask a community or friend for help' },
      { l: 'C', t: 'Take a break and return with fresh eyes' },
      { l: 'D', t: 'Re-read the official docs from scratch' },
    ],
  },
  {
    key: 'q3',
    q: 'How do you prefer to practice new skills?',
    opts: [
      { l: 'A', t: 'Solve structured exercises and challenges' },
      { l: 'B', t: 'Build personal projects I actually care about' },
      { l: 'C', t: 'Replicate existing apps step by step' },
      { l: 'D', t: 'Contribute to open source projects' },
    ],
  },
  {
    key: 'q4',
    q: 'How long can you stay focused before needing a break?',
    opts: [
      { l: 'A', t: 'Less than 25 minutes (Pomodoro style)' },
      { l: 'B', t: '25–45 minutes, then a short break' },
      { l: 'C', t: '1–2 hours when I\'m in the zone' },
      { l: 'D', t: 'I lose track of time when engaged' },
    ],
  },
  {
    key: 'q5',
    q: 'When a concept doesn\'t click immediately, you…',
    opts: [
      { l: 'A', t: 'Find a completely different explanation' },
      { l: 'B', t: 'Try to implement it and learn from errors' },
      { l: 'C', t: 'Move on and come back to it later' },
      { l: 'D', t: 'Break it into smaller parts and study each' },
    ],
  },
  {
    key: 'q6',
    q: 'What motivates you to keep learning?',
    opts: [
      { l: 'A', t: 'Clear milestones and measurable progress' },
      { l: 'B', t: 'Building things people actually use' },
      { l: 'C', t: 'The intellectual thrill of "aha" moments' },
      { l: 'D', t: 'Career advancement and salary goals' },
    ],
  },
  {
    key: 'q7',
    q: 'How do you prefer resources to be structured?',
    opts: [
      { l: 'A', t: 'Short, focused tutorials under 15 minutes' },
      { l: 'B', t: 'Long-form deep dives over 1 hour' },
      { l: 'C', t: 'Project-based with practical examples only' },
      { l: 'D', t: 'Interactive playgrounds and sandboxes' },
    ],
  },
  {
    key: 'q8',
    q: 'When learning, you tend to…',
    opts: [
      { l: 'A', t: 'Master one thing deeply before moving on' },
      { l: 'B', t: 'Explore broadly and connect the dots later' },
      { l: 'C', t: 'Follow a curated path with clear next steps' },
      { l: 'D', t: 'Mix theory with frequent hands-on practice' },
    ],
  },
  {
    key: 'q9',
    q: 'What kind of feedback helps you improve most?',
    opts: [
      { l: 'A', t: 'Detailed code reviews from experienced devs' },
      { l: 'B', t: 'Automated tests that confirm correctness' },
      { l: 'C', t: 'Seeing my work deployed and actually used' },
      { l: 'D', t: 'Community reactions and positive feedback' },
    ],
  },
  {
    key: 'q10',
    q: 'When starting a brand new skill, you…',
    opts: [
      { l: 'A', t: 'Research the best resources before diving in' },
      { l: 'B', t: 'Dive in with whatever comes up first' },
      { l: 'C', t: 'Ask an expert for a recommended path' },
      { l: 'D', t: 'Follow the official documentation only' },
    ],
  },
];

export const MOCK_ROADMAP = {
  id: 'rmp_react_001',
  skill: 'React Development',
  total_duration: '8–10 weeks',
  learning_type: 'skill' as const,
  phases: [
    {
      id: 'p1', order: 1, title: 'JavaScript Foundations', duration: '1–2 weeks',
      milestone: 'Write clean ES6+ JavaScript confidently',
      steps: [
        { id: 's1', title: 'ES6+ syntax: arrows, destructuring, spread', type: 'theory' as const, duration: '3h', note: 'The language features React relies on most' },
        { id: 's2', title: 'Async JavaScript: promises and async/await', type: 'theory' as const, duration: '4h', note: 'Critical for any real-world data fetching' },
        { id: 's3', title: 'DOM manipulation without frameworks', type: 'practice' as const, duration: '2h', note: 'Understand what React is actually doing for you' },
        { id: 's4', title: 'JS30: 5 DOM projects sprint', type: 'project' as const, duration: '5h', note: "Wes Bos's JavaScript30 — pick 5 that excite you" },
      ],
    },
    {
      id: 'p2', order: 2, title: 'React Core', duration: '2–3 weeks',
      milestone: 'Build functional UIs with hooks and controlled state',
      steps: [
        { id: 's5', title: 'Components, JSX, and the render model', type: 'theory' as const, duration: '2h', note: 'How React thinks about UI as a function of state' },
        { id: 's6', title: 'useState and useEffect in depth', type: 'theory' as const, duration: '3h', note: 'The two most important hooks — master them completely' },
        { id: 's7', title: 'Forms: controlled inputs and validation', type: 'practice' as const, duration: '3h', note: 'Build a multi-step form — where React shines' },
        { id: 's8', title: 'Custom hooks: useDebounce, useFetch', type: 'theory' as const, duration: '2h', note: 'The unlock that separates intermediate from advanced' },
        { id: 's9', title: 'Project: Todo app with full CRUD + persistence', type: 'project' as const, duration: '4h', note: 'The classic for a reason — nail the fundamentals here' },
      ],
    },
    {
      id: 'p3', order: 3, title: 'Ecosystem & Data', duration: '2 weeks',
      milestone: 'Navigate multi-page apps and manage async state cleanly',
      steps: [
        { id: 's10', title: 'React Router v6: nested routes, useParams', type: 'theory' as const, duration: '3h', note: 'Client-side navigation — the basis of any real app' },
        { id: 's11', title: 'Context API and useReducer', type: 'theory' as const, duration: '3h', note: 'Global state without external libraries' },
        { id: 's12', title: 'TanStack Query for async state management', type: 'practice' as const, duration: '4h', note: 'Replace 90% of your useEffect data-fetching patterns' },
        { id: 's13', title: 'Project: Multi-page app with protected routes', type: 'project' as const, duration: '8h', note: 'Login flow, protected routes, persisted session' },
      ],
    },
    {
      id: 'p4', order: 4, title: 'Production & Ship', duration: '1 week',
      milestone: 'Deploy a production-ready React application',
      steps: [
        { id: 's14', title: 'Vite: code splitting and lazy loading', type: 'theory' as const, duration: '2h', note: 'Performance from the start, not as an afterthought' },
        { id: 's15', title: 'Testing with Vitest and Testing Library', type: 'practice' as const, duration: '3h', note: 'Write tests that give confidence, not false security' },
        { id: 's16', title: 'Deploy to Vercel with GitHub CI/CD', type: 'practice' as const, duration: '2h', note: 'Git push → automatic deploy — set it up once' },
        { id: 's17', title: 'Capstone: full-stack React application', type: 'project' as const, duration: '12h', note: 'Build and ship something real — this is what it was all for' },
      ],
    },
  ],
  daily_plan: [
    { day: 'Day 1', task: 'ES6+ syntax: arrow functions, const/let, template literals', phase: 1 },
    { day: 'Day 2', task: 'Destructuring, spread/rest, optional chaining', phase: 1 },
    { day: 'Day 3', task: 'Async JS — Promises, then/catch, async/await', phase: 1 },
    { day: 'Day 4', task: 'DOM manipulation practice (no frameworks)', phase: 1 },
    { day: 'Day 5', task: 'JS30: complete 5 DOM projects', phase: 1 },
    { day: 'Day 6', task: 'React setup, first components, JSX walkthrough', phase: 2 },
    { day: 'Day 7', task: 'useState deep dive: counter, toggle, lists', phase: 2 },
  ],
  unlearn_list: [
    { bad_habit: 'Mutating state directly', correct_approach: 'Always return a new object/array from setState' },
    { bad_habit: 'useEffect for everything', correct_approach: 'Use TanStack Query for data, derived state for computations' },
    { bad_habit: 'Index as key in lists', correct_approach: 'Always use stable unique IDs as React keys' },
    { bad_habit: 'Prop drilling beyond 2 levels', correct_approach: 'Context API or TanStack Query for shared state' },
  ],
  salary_data: {
    junior: '$70,000–$95,000',
    mid: '$95,000–$130,000',
    senior: '$130,000–$180,000+',
  },
};

export const GENERATING_MESSAGES = [
  'Analyzing your learning fingerprint…',
  'Mapping skill dependencies…',
  'Curating the best resources…',
  'Sequencing your phases…',
  'Calibrating to your schedule…',
  'Building your roadmap…',
  'Adding the finishing touches…',
  'Almost ready…',
];

export type StepType = 'theory' | 'practice' | 'project';
