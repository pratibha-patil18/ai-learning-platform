/* ==========================================================================
   LUMINEX - SkillGap AI
   Frontend Application Logic (Vanilla JavaScript)
   Beginner-friendly, modular, and pre-wired for future backend API integration.
   ========================================================================== */

// ==========================================================================
// 1. APPLICATION STATE
// Keeps track of the current user session, selections, scores, and screen.
// ==========================================================================
const appState = {
  selectedSkillId: "python",          // ID of currently selected skill
  currentQuizType: "initial",         // "initial" or "retake"
  currentQuestionIndex: 0,            // Which question the user is answering
  questions: [],                      // Active list of question objects
  userAnswers: {},                    // Stores questionIndex -> selectedOptionIndex
  
  // Scoring & Diagnostics
  initialScorePercent: 0,             // e.g., 65
  topicScores: {},                    // e.g., { "Basics": 80, "Recursion": 30 }
  weakestTopic: null,          // Name of the lowest scoring topic
  
  // Targeted Retake & Improvement
  retakeScorePercent: 0,              // e.g., 75
  improvementPercent: 0,              // e.g., +45
  
  // Dashboard Metrics
  quizzesCompleted: 0,
  history: []
};

// ==========================================================================
// 2. MOCK DATA: AVAILABLE SKILLS
// ==========================================================================
const skillsData = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    description: "Core syntax, functions, lists, recursion, OOP principles, and data structures.",
    topics: ["Basics", "Functions", "Lists/Arrays", "Recursion", "OOP", "Data Structures"]
  },
  {
    id: "c",
    name: "C Programming",
    icon: "⚡",
    description: "Low-level memory management, pointers, structures, file I/O, and arrays.",
    topics: ["Basics", "Pointers", "Memory", "Structs", "Functions"]
  },
  {
    id: "cpp",
    name: "C++",
    icon: "⚙️",
    description: "Object-oriented programming, STL containers, references, and memory.",
    topics: ["OOP", "References", "STL Containers", "Memory", "Templates"]
  },
  {
    id: "webdev",
    name: "Web Development",
    icon: "🌐",
    description: "HTML5 semantic markup, CSS layouts, JavaScript DOM, events, and async APIs.",
    topics: ["HTML/CSS", "DOM Manipulation", "Async JS", "Events", "Storage"]
  },
  {
    id: "sql",
    name: "SQL & Databases",
    icon: "🗄️",
    description: "Relational queries, JOIN operations, aggregations, subqueries, and constraints.",
    topics: ["SELECT Queries", "JOINs", "Aggregations", "Subqueries", "Constraints"]
  }
];

// ==========================================================================
// 3. MOCK DATA: INITIAL QUIZ QUESTIONS (Categorized by Topic)
// ==========================================================================
const questionsData = {
  python: [
    {
      question: "Which of the following is an immutable data type in Python?",
      options: ["List", "Dictionary", "Tuple", "Set"],
      answer: 2, // 0-indexed: Tuple
      topic: "Basics"
    },
    {
      question: "What is the output of bool([]) in standard Python?",
      options: ["True", "False", "None", "SyntaxError"],
      answer: 1, // False
      topic: "Basics"
    },
    {
      question: "What does the *args parameter allow in a Python function definition?",
      options: [
        "Pass a variable number of positional arguments",
        "Pass a variable number of keyword arguments",
        "Pass only pointer references",
        "Multiply function return values"
      ],
      answer: 0,
      topic: "Functions"
    },
    {
      question: "Which keyword creates an anonymous inline function in Python?",
      options: ["def", "func", "lambda", "inline"],
      answer: 2, // lambda
      topic: "Functions"
    },
    {
      question: "What will list[1:4] return for list = [10, 20, 30, 40, 50]?",
      options: ["[20, 30, 40]", "[10, 20, 30]", "[20, 30, 40, 50]", "[30, 40]"],
      answer: 0,
      topic: "Lists/Arrays"
    },
    {
      question: "Which method adds an element to the very end of an existing list in-place?",
      options: ["list.insert()", "list.add()", "list.append()", "list.push()"],
      answer: 2, // append
      topic: "Lists/Arrays"
    },
    {
      question: "What condition is ABSOLUTELY required to prevent infinite recursion and stack overflow?",
      options: [
        "A base case condition that terminates recursion",
        "At least two recursive calls per iteration",
        "A while loop inside the function body",
        "An exception handler try/catch block"
      ],
      answer: 0,
      topic: "Recursion"
    },
    {
      question: "What data structure does the computer use internally to maintain recursive function calls?",
      options: ["Queue", "Call Stack", "Hash Table", "Binary Heap"],
      answer: 1, // Call Stack
      topic: "Recursion"
    },
    {
      question: "In Python OOP, what special method is called automatically when an object instance is created?",
      options: ["__create__()", "__init__()", "__new__()", "__main__()"],
      answer: 1, // __init__
      topic: "OOP"
    },
    {
      question: "Which Python data structure stores unique key-value pairs with average O(1) lookups?",
      options: ["Tuple", "List", "Dictionary", "Linked List"],
      answer: 2, // Dictionary
      topic: "Data Structures"
    }
  ],

  c: [
    {
      question: "Which operator is used to get the memory address of a variable in C?",
      options: ["*", "&", "->", "%"],
      answer: 1,
      topic: "Pointers"
    },
    {
      question: "What is the return type of the malloc() function in C?",
      options: ["int*", "void*", "char*", "size_t"],
      answer: 1,
      topic: "Memory"
    },
    {
      question: "Which function must be called to release dynamically allocated heap memory?",
      options: ["delete()", "free()", "dispose()", "clear()"],
      answer: 1,
      topic: "Memory"
    },
    {
      question: "What does the keyword 'struct' define in C?",
      options: ["A user-defined composite data type", "A hardware pointer", "A thread", "A loop condition"],
      answer: 0,
      topic: "Structs"
    },
    {
      question: "What is the index of the first element in a standard C array?",
      options: ["-1", "0", "1", "Depends on declaration"],
      answer: 1,
      topic: "Basics"
    }
  ],

  cpp: [
    {
      question: "What is encapsulation in C++ Object-Oriented Programming?",
      options: [
        "Bundling data and methods that operate on that data within a class",
        "Translating code into machine instructions",
        "Calling a function recursively",
        "Allocating memory on the heap"
      ],
      answer: 0,
      topic: "OOP"
    },
    {
      question: "Which C++ STL container provides dynamic contiguous array resizing?",
      options: ["std::list", "std::vector", "std::set", "std::map"],
      answer: 1,
      topic: "STL Containers"
    },
    {
      question: "How do you pass a variable by reference in C++?",
      options: ["int *x", "int &x", "int %x", "ref int x"],
      answer: 1,
      topic: "References"
    },
    {
      question: "Which operator is used to deallocate memory allocated with new?",
      options: ["free", "delete", "clear", "remove"],
      answer: 1,
      topic: "Memory"
    }
  ],

  webdev: [
    {
      question: "What HTML5 semantic element should contain the main navigation links?",
      options: ["<header>", "<menu>", "<nav>", "<section>"],
      answer: 2,
      topic: "HTML/CSS"
    },
    {
      question: "Which method is used to select an element by its ID in the DOM?",
      options: ["document.queryId()", "document.getElementById()", "document.select()", "document.find()"],
      answer: 1,
      topic: "DOM Manipulation"
    },
    {
      question: "Which JavaScript keyword is used to pause execution until a Promise resolves inside an async function?",
      options: ["wait", "pause", "await", "defer"],
      answer: 2,
      topic: "Async JS"
    },
    {
      question: "Which method attaches an event handler without overwriting existing handlers?",
      options: ["onclick = fn", "attach()", "addEventListener()", "bindEvent()"],
      answer: 2,
      topic: "Events"
    }
  ],

  sql: [
    {
      question: "Which SQL clause is used to filter records returned by a query?",
      options: ["WHERE", "ORDER BY", "GROUP BY", "LIMIT"],
      answer: 0,
      topic: "SELECT Queries"
    },
    {
      question: "Which JOIN returns all rows when there is a match in EITHER left or right table?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      answer: 3,
      topic: "JOINs"
    },
    {
      question: "Which aggregate function calculates the average value of a numeric column?",
      options: ["SUM()", "COUNT()", "AVG()", "MEDIAN()"],
      answer: 2,
      topic: "Aggregations"
    },
    {
      question: "Which constraint uniquely identifies each record in a database table?",
      options: ["FOREIGN KEY", "PRIMARY KEY", "NOT NULL", "CHECK"],
      answer: 1,
      topic: "Constraints"
    }
  ]
};

// ==========================================================================
// 4. MOCK DATA: TARGETED RETAKE QUESTIONS
// Specifically for weak topics (e.g. 5 focused questions on Recursion, OOP, etc.)
// ==========================================================================
const retakeQuestionsData = {
  Recursion: [
    {
      question: "Targeted Retake 1: What happens if a recursive function does not reach its base case?",
      options: [
        "It returns 0 automatically",
        "It leads to infinite recursion and a Stack Overflow error",
        "The compiler optimizes it into a while loop",
        "It converts into an asynchronous promise"
      ],
      answer: 1,
      topic: "Recursion"
    },
    {
      question: "Targeted Retake 2: In the classic recursive Fibonacci definition fib(n) = fib(n-1) + fib(n-2), what are the base cases?",
      options: [
        "n == 10",
        "n == 0 and n == 1",
        "n < 0 only",
        "fibonacci has no base cases"
      ],
      answer: 1,
      topic: "Recursion"
    },
    {
      question: "Targeted Retake 3: What is the main characteristic of 'Tail Recursion'?",
      options: [
        "The recursive call is the very last operation executed in the function",
        "It uses a queue instead of a stack",
        "It must run inside a loop",
        "It only works on arrays"
      ],
      answer: 0,
      topic: "Recursion"
    },
    {
      question: "Targeted Retake 4: Why does memoization dramatically speed up naive recursive algorithms like Fibonacci?",
      options: [
        "It eliminates function arguments",
        "It caches previously computed subproblem results to avoid redundant calculations",
        "It converts Python into C++ code",
        "It increases the CPU clock speed"
      ],
      answer: 1,
      topic: "Recursion"
    },
    {
      question: "Targeted Retake 5: In recursive problem solving, what is the 'unwinding' or 'backtracking' phase?",
      options: [
        "Restarting the function from line 1",
        "Popping frames off the call stack and returning values up to the caller",
        "Clearing all variables in memory",
        "Throwing a runtime exception"
      ],
      answer: 1,
      topic: "Recursion"
    }
  ],

  // Fallback targeted questions for other topics if diagnosed as weakest
  General: [
    {
      question: "Diagnostic Check 1: What is the primary purpose of breaking problems into smaller subproblems?",
      options: ["Increase memory usage", "Simplify logic and enhance readability", "Bypass syntax rules", "Create more files"],
      answer: 1,
      topic: "Fundamentals"
    },
    {
      question: "Diagnostic Check 2: Which principle ensures code can be reused without duplication?",
      options: ["DRY (Don't Repeat Yourself)", "WET (Write Everything Twice)", "Brute Force", "Hardcoding"],
      answer: 0,
      topic: "Fundamentals"
    },
    {
      question: "Diagnostic Check 3: What is time complexity used for in computer science?",
      options: ["Measuring how long a file compiles", "Describing how runtime scales relative to input size", "Checking clock frequency", "Counting code lines"],
      answer: 1,
      topic: "Fundamentals"
    },
    {
      question: "Diagnostic Check 4: When debugging an issue, what is the best initial step?",
      options: ["Delete all code", "Isolate input conditions and inspect error messages/logs", "Restart the operating system", "Guess the bug"],
      answer: 1,
      topic: "Fundamentals"
    },
    {
      question: "Diagnostic Check 5: What is the main benefit of writing modular, single-responsibility functions?",
      options: ["They execute faster on GPU", "They are significantly easier to test, debug, and maintain", "They prevent git commits", "They take no memory"],
      answer: 1,
      topic: "Fundamentals"
    }
  ]
};

// ==========================================================================
// 5. MOCK DATA: RECOMMENDED LEARNING RESOURCES
// Structured so an API endpoint can supply dynamic links later.
// ==========================================================================
const learningResourcesData = {
  Recursion: [
    {
      title: "Recursion in 100 Seconds & Visual Guide",
      type: "video",
      badge: "Video Tutorial",
      description: "A fast, beginner-friendly visualization of call stacks, base cases, and tree recursion by Fireship.",
      actionText: "Watch Now",
      url: "https://www.youtube.com/watch?v=rf60MejMz3E"
    },
    {
      title: "Interactive Base-Case & Recursion Drills",
      type: "practice",
      badge: "Hands-on Practice",
      description: "Bite-sized challenges to trace recursive calls step-by-step and write bulletproof base conditions.",
      actionText: "Practice Now",
      url: "https://leetcode.com/explore/learn/card/recursion-i/"
    },
    {
      title: "Recursion & Call Stack Cheatsheet",
      type: "guide",
      badge: "Quick Reference",
      description: "Key mental models: base cases, recursive transitions, call stack diagrams, and avoiding stack overflows.",
      actionText: "Review Guide",
      url: "https://www.freecodecamp.org/news/how-recursion-works-explained-with-flowcharts-and-a-video-de61f40cb7f9/"
    }
  ],
  "HTML/CSS": [
  {
    title: "HTML & CSS Fundamentals",
    type: "video",
    badge: "Video Tutorial",
    description: "Learn semantic HTML, CSS selectors, box model, layouts, and responsive design.",
    actionText: "Watch Now",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content"
  },
  {
    title: "CSS Layout Practice",
    type: "practice",
    badge: "Hands-on Practice",
    description: "Practice Flexbox, Grid, spacing, alignment, and responsive layouts.",
    actionText: "Practice Now",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  },
  {
    title: "HTML & CSS Reference",
    type: "guide",
    badge: "Quick Reference",
    description: "Review HTML elements, CSS properties, selectors, and layout concepts.",
    actionText: "Review Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web"
  }
],

"DOM Manipulation": [
  {
    title: "DOM Introduction",
    type: "video",
    badge: "Video Tutorial",
    description: "Understand how JavaScript interacts with HTML elements through the DOM.",
    actionText: "Watch Now",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"
  },
  {
    title: "DOM Manipulation Practice",
    type: "practice",
    badge: "Hands-on Practice",
    description: "Practice selecting, modifying, creating, and removing DOM elements.",
    actionText: "Practice Now",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Document"
  },
  {
    title: "DOM API Reference",
    type: "guide",
    badge: "Quick Reference",
    description: "Reference common DOM methods and properties used in JavaScript.",
    actionText: "Review Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Document"
  }
],

"Async JS": [
  {
    title: "JavaScript Promises & Async/Await",
    type: "video",
    badge: "Video Tutorial",
    description: "Understand Promises, async functions, await, and asynchronous JavaScript.",
    actionText: "Watch Now",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS"
  },
  {
    title: "Async JavaScript Practice",
    type: "practice",
    badge: "Hands-on Practice",
    description: "Practice working with Promises and asynchronous operations.",
    actionText: "Practice Now",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"
  },
  {
    title: "Async JavaScript Reference",
    type: "guide",
    badge: "Quick Reference",
    description: "Review Promise, async, await, and asynchronous execution concepts.",
    actionText: "Review Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"
  }
],

"Events": [
  {
    title: "JavaScript Events",
    type: "video",
    badge: "Video Tutorial",
    description: "Learn how browser events work and how JavaScript responds to user interactions.",
    actionText: "Watch Now",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events"
  },
  {
    title: "Event Handling Practice",
    type: "practice",
    badge: "Hands-on Practice",
    description: "Practice click, input, submit, and other event handlers.",
    actionText: "Practice Now",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"
  },
  {
    title: "Event Reference",
    type: "guide",
    badge: "Quick Reference",
    description: "Review event types and event listener methods.",
    actionText: "Review Guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/Events"
  }
],

  Default: [
    {
      title: "Core Fundamentals Masterclass",
      type: "video",
      badge: "Video Tutorial",
      description: "Comprehensive step-by-step explanation covering underlying logic, common pitfalls, and best practices.",
      actionText: "Watch Now",
      url: "https://www.youtube.com"
    },
    {
      title: "Targeted Interactive Drills",
      type: "practice",
      badge: "Hands-on Practice",
      description: "Guided exercises designed to reinforce core syntax, edge cases, and algorithmic thinking.",
      actionText: "Practice Now",
      url: "https://exercism.org"
    },
    {
      title: "Essential Concept Cheatsheet",
      type: "guide",
      badge: "Quick Reference",
      description: "Concise summary of patterns, syntax rules, and memory representations.",
      actionText: "Review Guide",
      url: "https://devdocs.io"
    }
  ]
};


// ==========================================================================
// 6. INITIALIZATION & SCREEN NAVIGATION (SPA)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Render skill selection cards
  renderSkillCards();
  
  // Set default initial screen
  navigateTo("welcome");
});

/**
 * Switch smoothly between screens without reloading the page.
 * @param {string} screenName - "welcome", "skills", "quiz", "results", "gap", "learning", "retake", "improvement", "dashboard"
 */
function navigateTo(screenName) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const targetScreen = document.getElementById(`screen-${screenName}`);

  if (targetScreen) {
    targetScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Refresh dashboard with the latest assessment data
  if (screenName === "dashboard") {
    renderDashboard();
  }
}

/**
 * Render the 5 technology track cards on the Skill Selection Screen.
 */
function renderSkillCards() {
  const container = document.getElementById("skills-grid");
  if (!container) return;

  container.innerHTML = "";

  skillsData.forEach((skill) => {
    const card = document.createElement("div");
    card.className = `skill-card ${skill.id === appState.selectedSkillId ? "selected" : ""}`;
    card.onclick = () => selectSkill(skill.id);

    card.innerHTML = `
      <div class="skill-card-top">
        <div class="skill-icon">${skill.icon}</div>
        <div class="skill-check">✓</div>
      </div>
      <h3 class="skill-title">${skill.name}</h3>
      <p class="skill-desc">${skill.description}</p>
      <span class="skill-topics-tag">${skill.topics.length} Core Modules</span>
    `;

    container.appendChild(card);
  });

  // Enable start button if a skill is selected
  const startBtn = document.getElementById("btn-start-assessment");
  if (startBtn) {
    startBtn.disabled = !appState.selectedSkillId;
  }
}

/**
 * Handle skill card selection.
 */
function selectSkill(skillId) {
  appState.selectedSkillId = skillId;
  renderSkillCards();
}

/**
 * Reset application state to start a clean new demo.
 */
function restartApp() {
  appState.currentQuestionIndex = 0;
  appState.userAnswers = {};
  appState.topicScores = {};
  appState.weakestTopic = null;
  
  appState.initialScorePercent = 0;
  appState.retakeScorePercent = 0;
  appState.improvementPercent = 0;
  appState.quizzesCompleted = 0;
  appState.history = [];
  appState.currentQuizType = "initial";
  
  renderSkillCards();
  navigateTo("welcome");
}


// ==========================================================================
// 7. QUIZ ENGINE: INITIAL ASSESSMENT
// ==========================================================================

/**
 * Start the initial diagnostic assessment.
 */
function startInitialQuiz() {
  appState.currentQuizType = "initial";
  appState.currentQuestionIndex = 0;
  appState.userAnswers = {};
  
  // Load questions for selected skill
  loadQuiz(appState.selectedSkillId);
  
  // Navigate to quiz screen
  navigateTo("quiz");
}

/**
 * Loads quiz questions for the selected skill.
 * === BACKEND API INTEGRATION POINT ===
 * Later, replace mock questionsData lookup with:
 *   const response = await fetch(`/api/quiz?skill=${skillId}`);
 *   appState.questions = await response.json();
 */
function loadQuiz(skillId) {
  // Use mock question bank for the selected skill
  appState.questions = questionsData[skillId] || questionsData.python;
  
  // Update header skill badge
  const currentSkillObj = skillsData.find(s => s.id === skillId) || skillsData[0];
  const skillBadge = document.getElementById("quiz-skill-name");
  if (skillBadge) {
    skillBadge.textContent = currentSkillObj.name;
  }

  // Render the first question
  renderCurrentQuestion();
}

/**
 * Render the current question, options, and progress bar for the initial quiz.
 */
function renderCurrentQuestion() {
  const q = appState.questions[appState.currentQuestionIndex];
  if (!q) return;

  const total = appState.questions.length;
  const currentNum = appState.currentQuestionIndex + 1;

  // 1. Update counter & topic badge
  document.getElementById("quiz-counter").textContent = `Question ${currentNum}/${total}`;
  document.getElementById("quiz-topic-name").textContent = `Topic: ${q.topic}`;

  // 2. Update progress bar
  const progressPercent = Math.round((currentNum / total) * 100);
  document.getElementById("quiz-progress-fill").style.width = `${progressPercent}%`;

  // 3. Update question text
  document.getElementById("quiz-question-text").textContent = q.question;

  // 4. Render options
  const optionsList = document.getElementById("quiz-options-list");
  optionsList.innerHTML = "";

  const selectedAnswer = appState.userAnswers[appState.currentQuestionIndex];
  const optionLetters = ["A", "B", "C", "D"];

  q.options.forEach((optText, optIndex) => {
    const isSelected = selectedAnswer === optIndex;
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = `option-item ${isSelected ? "selected" : ""}`;
    optionBtn.onclick = () => selectOption(optIndex);

    optionBtn.innerHTML = `
      <span class="option-marker">${optionLetters[optIndex]}</span>
      <span class="option-text">${optText}</span>
    `;

    optionsList.appendChild(optionBtn);
  });

  // 5. Update Previous & Next buttons
  const prevBtn = document.getElementById("btn-quiz-prev");
  const nextBtn = document.getElementById("btn-quiz-next");

  prevBtn.disabled = appState.currentQuestionIndex === 0;

  // Has user selected an option for this question?
  const hasSelected = selectedAnswer !== undefined;
  nextBtn.disabled = !hasSelected;

  if (currentNum === total) {
    nextBtn.textContent = "Submit Assessment ✓";
  } else {
    nextBtn.textContent = "Next →";
  }
}

/**
 * Record user's option choice for the current question.
 */
function selectOption(optionIndex) {
  appState.userAnswers[appState.currentQuestionIndex] = optionIndex;
  renderCurrentQuestion();
}

/**
 * Move to previous question.
 */
function prevQuestion() {
  if (appState.currentQuestionIndex > 0) {
    appState.currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

/**
 * Move to next question or complete initial assessment.
 */
function nextQuestion() {
  const total = appState.questions.length;
  
  if (appState.currentQuestionIndex < total - 1) {
    appState.currentQuestionIndex++;
    renderCurrentQuestion();
  } else {
    // Last question submitted -> calculate results
    submitInitialAssessment();
  }
}

/**
 * Complete assessment, compute scores and show Results screen.
 */
function submitInitialAssessment() {
  // 1. Calculate overall score
  appState.initialScorePercent = calculateScore(appState.questions, appState.userAnswers);

  // 2. Calculate topic-wise scores
  appState.topicScores = calculateTopicScores(appState.questions, appState.userAnswers);

  // 3. Identify weakest topic
  appState.weakestTopic = findWeakestTopic(appState.topicScores);

  // 4. Update session metrics
  appState.quizzesCompleted += 1;

  // 5. Render results & display screen
  showResults();
  navigateTo("results");
}


// ==========================================================================
// 8. SCORE CALCULATION & COMPETENCY GAP LOGIC
// ==========================================================================

/**
 * Calculates overall percentage score (0 - 100).
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Map of questionIndex -> optionIndex
 * @returns {number} percentage
 */
function calculateScore(questions, answers) {
  if (!questions.length) return 0;

  let correctCount = 0;
  questions.forEach((q, index) => {
    if (answers[index] === q.answer) {
      correctCount++;
    }
  });

  return Math.round((correctCount / questions.length) * 100);
}

/**
 * Groups questions by topic and calculates proficiency percentage for each topic.
 * @param {Array} questions
 * @param {Object} answers
 * @returns {Object} { "Basics": 80, "Functions": 75, "Recursion": 30, ... }
 */
function calculateTopicScores(questions, answers) {
  const topicStats = {};

  // Count total & correct per topic
  questions.forEach((q, index) => {
    const topic = q.topic || "General";
    if (!topicStats[topic]) {
      topicStats[topic] = { total: 0, correct: 0 };
    }

    topicStats[topic].total++;
    if (answers[index] === q.answer) {
      topicStats[topic].correct++;
    }
  });

  // Convert to percentages
  const topicPercentages = {};
  for (const topic in topicStats) {
    const { correct, total } = topicStats[topic];
    topicPercentages[topic] = Math.round((correct / total) * 100);
  }

  return topicPercentages;
}

/**
 * Finds the topic with the lowest percentage score.
 * If multiple have the lowest score, picks the first.
 * @param {Object} topicScores
 * @returns {string} weakestTopicName
 */
function findWeakestTopic(topicScores) {
  let weakest = null;
  let lowestScore = Infinity;

  for (const topic in topicScores) {
    if (topicScores[topic] < lowestScore) {
      lowestScore = topicScores[topic];
      weakest = topic;
    }
  }

  // A competency gap only exists below 70%
  if (lowestScore >= 70) {
    return null;
  }

  return weakest;
}


// ==========================================================================
// 9. RENDER RESULTS & COMPETENCY GAP SCREENS
// ==========================================================================

/**
 * Renders the initial diagnostic result report.
 */
function showResults() {
  const overall = appState.initialScorePercent;
  const weakest = appState.weakestTopic;

  const weakestScore =
    weakest !== null && weakest !== undefined
      ? appState.topicScores[weakest]
      : null;

  const hasGap =
    weakest !== null &&
    weakest !== undefined &&
    weakestScore < 70;


  // --------------------------------------------------
  // 1. Overall Score Display
  // --------------------------------------------------

  document.getElementById("result-overall-score").textContent =
    `${overall}%`;

  const titleEl =
    document.getElementById("result-score-title");

  const descEl =
    document.getElementById("result-score-description");


  if (!hasGap) {

    titleEl.textContent =
      "Excellent Performance!";

    descEl.textContent =
      "You demonstrated strong proficiency across all assessed topics. No major competency gaps were detected.";

  } else if (overall >= 75) {

    titleEl.textContent =
      "Strong Performance Overall";

    descEl.textContent =
      "You demonstrated strong conceptual foundations, with a few specific areas that could benefit from additional practice.";

  } else if (overall >= 50) {

    titleEl.textContent =
      "Good Baseline with Some Gaps";

    descEl.textContent =
      "You have a reasonable foundation, but targeted learning can help strengthen weaker areas.";

  } else {

    titleEl.textContent =
      "Foundational Knowledge Needed";

    descEl.textContent =
      "Several competency gaps were identified. Review the recommended learning resources for the weaker areas.";
  }


  // --------------------------------------------------
  // 2. Topic-wise Performance
  // --------------------------------------------------

  const topicsList =
    document.getElementById("result-topics-list");

  topicsList.innerHTML = "";

  for (const topic in appState.topicScores) {

    const score =
      appState.topicScores[topic];

    let statusClass = "green";
    let badgeEmoji = "🟢";

    if (score < 50) {

      statusClass = "red";
      badgeEmoji = "🔴";

    } else if (score < 70) {

      statusClass = "yellow";
      badgeEmoji = "🟡";
    }


    const row =
      document.createElement("div");

    row.className = "topic-row";

    row.innerHTML = `
      <div class="topic-row-info">
        ${topic}
      </div>

      <div class="topic-row-bar">
        <div class="progress-bar-wrapper">
          <div
            class="progress-bar-fill ${statusClass}"
            style="width: ${score}%;">
          </div>
        </div>
      </div>

      <div class="topic-row-score">
        ${score}%
      </div>

      <div
        class="topic-row-badge"
        title="${statusClass.toUpperCase()}">
        ${badgeEmoji}
      </div>
    `;

    topicsList.appendChild(row);
  }


  // --------------------------------------------------
  // 3. Competency Gap Banner
  // --------------------------------------------------

  const weakBanner =
    document.getElementById("result-weak-banner");

  const weakSummary =
    document.getElementById("result-weak-summary");


  if (hasGap) {

    weakBanner.style.display = "flex";

    weakSummary.innerHTML =
      `We found that <strong>${weakest}</strong> is currently your weakest area (<strong>${weakestScore}% proficiency</strong>).`;

  } else {

    weakBanner.style.display = "flex";

    weakBanner.querySelector("h4").textContent =
      "No Competency Gaps Detected";

    weakBanner.querySelector(".weak-callout-icon").textContent =
      "✓";

    weakSummary.innerHTML =
      "You achieved <strong>70% or above</strong> across all assessed topics. Keep building on your current knowledge.";
  }


  // --------------------------------------------------
  // 4. Inspect Competency Gap Button
  // --------------------------------------------------

  const inspectButton =
    weakBanner.nextElementSibling?.querySelector("button");


  if (inspectButton) {

    if (hasGap) {

      inspectButton.style.display =
        "inline-flex";

      inspectButton.innerHTML = `
        Inspect Competency Gap
        <span class="btn-arrow">→</span>
      `;

    } else {

      inspectButton.style.display =
        "none";
    }
  }


  // --------------------------------------------------
  // 5. Only load Gap + Learning when a gap exists
  // --------------------------------------------------

  if (hasGap) {

    loadCompetencyGap(
      weakest,
      weakestScore
    );

    loadLearningResources(
      weakest
    );
  }
}

/**
 * Populates the dedicated Competency Gap Deep-Dive screen.
 */
function loadCompetencyGap(topic, proficiency) {
  document.getElementById("gap-topic-name").textContent = topic;
  document.getElementById("gap-proficiency").textContent = `${proficiency}%`;
  document.getElementById("gap-meter-fill").style.width = `${proficiency}%`;

  const levelTag = document.getElementById("gap-level-tag");
  const explanationEl = document.getElementById("gap-explanation-text");
  const actionEl = document.getElementById("gap-recommended-action");

  if (proficiency < 40) {
    levelTag.textContent = "Critical Competency Gap";
    explanationEl.textContent = `You scored ${proficiency}% in ${topic}. Students who struggle with this area often encounter difficulties with call stack mechanics, recursion tree tracing, and base condition bounds.`;
    actionEl.textContent = `Focus on ${topic} fundamentals, step-by-step base cases, and problem decomposition before attempting complex challenges.`;
  } else if (proficiency < 70) {
    levelTag.textContent = "Moderate Competency Gap";
    explanationEl.textContent = `You have partial familiarity with ${topic} (${proficiency}%), but lack consistency on edge-case behavior and advanced patterns.`;
    actionEl.textContent = `Review 2-3 code walkthroughs focusing specifically on boundary cases, then test your understanding.`;
  } else {
    function loadCompetencyGap(topic, proficiency) {

  document.getElementById("gap-topic-name").textContent =
    topic;

  document.getElementById("gap-proficiency").textContent =
    `${proficiency}%`;

  document.getElementById("gap-meter-fill").style.width =
    `${proficiency}%`;


  const levelTag =
    document.getElementById("gap-level-tag");

  const explanationEl =
    document.getElementById("gap-explanation-text");

  const actionEl =
    document.getElementById("gap-recommended-action");


  if (proficiency < 40) {

    levelTag.textContent =
      "Critical Competency Gap";

    explanationEl.textContent =
      `You scored ${proficiency}% in ${topic}. This indicates that the fundamentals need significant reinforcement.`;

    actionEl.textContent =
      `Focus on ${topic} fundamentals, work through beginner-level examples, and use the recommended learning resources to strengthen your understanding.`;

  } else if (proficiency < 70) {

    levelTag.textContent =
      "Moderate Competency Gap";

    explanationEl.textContent =
      `You have partial familiarity with ${topic} (${proficiency}%), but some concepts need additional practice and reinforcement.`;

    actionEl.textContent =
      `Review the recommended learning materials and practice the weaker concepts before moving to more advanced problems.`;
  }
}
  }
}


// ==========================================================================
// 10. RECOMMENDED LEARNING SECTION
// ==========================================================================

/**
 * Loads curated learning resources based on the identified weak topic.
 * === BACKEND API INTEGRATION POINT ===
 * Later, replace mock resource lookup with:
 *   const response = await fetch(`/api/recommendations?topic=${topic}`);
 *   const resources = await response.json();
 */
function loadLearningResources(topic) {
  document.getElementById("learning-topic-name").textContent = topic;
  const grid = document.getElementById("learning-resources-grid");
  grid.innerHTML = "";

  // Get resources for this topic or fall back to general curated list
 const resources =
  learningResourcesData[topic] ||
  learningResourcesData.Default;

  resources.forEach((res) => {
    const card = document.createElement("div");
    card.className = "learning-card";

    card.innerHTML = `
      <span class="resource-badge ${res.type}">${res.badge}</span>
      <h3 class="learning-card-title">${res.title}</h3>
      <p class="learning-card-desc">${res.description}</p>
      <a href="${res.url}" target="_blank" rel="noopener" class="btn btn-secondary" style="margin-top:auto;">
        ${res.actionText} ↗
      </a>
    `;

    grid.appendChild(card);
  });

  // Update retake button label
  const retakeBtn = document.getElementById("btn-start-retake");
  if (retakeBtn) {
    retakeBtn.textContent = `Take ${topic} Quiz Again 🚀`;
  }
}


// ==========================================================================
// 11. TARGETED RETAKE QUIZ (Weak Topic Focused)
// ==========================================================================

/**
 * Starts the focused 5-question retake quiz on the user's weakest topic.
 */
function startTargetedRetake() {
  const weakTopic = appState.weakestTopic;
  startRetakeQuiz(weakTopic);
}

/**
 * Configures and loads the targeted retake quiz.
 * === BACKEND API INTEGRATION POINT ===
 * Later, replace mock questions with:
 *   const response = await fetch(`/api/retake?topic=${topic}&count=5`);
 *   appState.questions = await response.json();
 */
function startRetakeQuiz(topic) {
  appState.currentQuizType = "retake";
  appState.currentQuestionIndex = 0;
  appState.userAnswers = {};

  // Load focused questions for this weak topic
  appState.questions = retakeQuestionsData[topic] || retakeQuestionsData.Recursion || retakeQuestionsData.General;

  // Update header badges
  document.getElementById("retake-topic-badge").textContent = `Topic: ${topic}`;

  // Render first question
  renderCurrentRetakeQuestion();

  // Navigate to retake quiz screen
  navigateTo("retake");
}

/**
 * Render current question for the targeted retake quiz.
 */
function renderCurrentRetakeQuestion() {
  const q = appState.questions[appState.currentQuestionIndex];
  if (!q) return;

  const total = appState.questions.length;
  const currentNum = appState.currentQuestionIndex + 1;

  // 1. Update counter & progress
  document.getElementById("retake-counter").textContent = `Question ${currentNum}/${total}`;
  const progressPercent = Math.round((currentNum / total) * 100);
  document.getElementById("retake-progress-fill").style.width = `${progressPercent}%`;

  // 2. Question text
  document.getElementById("retake-question-text").textContent = q.question;

  // 3. Options
  const optionsList = document.getElementById("retake-options-list");
  optionsList.innerHTML = "";

  const selectedAnswer = appState.userAnswers[appState.currentQuestionIndex];
  const optionLetters = ["A", "B", "C", "D"];

  q.options.forEach((optText, optIndex) => {
    const isSelected = selectedAnswer === optIndex;
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = `option-item ${isSelected ? "selected" : ""}`;
    optionBtn.onclick = () => selectRetakeOption(optIndex);

    optionBtn.innerHTML = `
      <span class="option-marker">${optionLetters[optIndex]}</span>
      <span class="option-text">${optText}</span>
    `;

    optionsList.appendChild(optionBtn);
  });

  // 4. Controls
  const prevBtn = document.getElementById("btn-retake-prev");
  const nextBtn = document.getElementById("btn-retake-next");

  prevBtn.disabled = appState.currentQuestionIndex === 0;

  const hasSelected = selectedAnswer !== undefined;
  nextBtn.disabled = !hasSelected;

  if (currentNum === total) {
    nextBtn.textContent = "Submit Retake Assessment ✓";
  } else {
    nextBtn.textContent = "Next →";
  }
}

/**
 * Option selection for retake quiz.
 */
function selectRetakeOption(optionIndex) {
  appState.userAnswers[appState.currentQuestionIndex] = optionIndex;
  renderCurrentRetakeQuestion();
}

/**
 * Previous question in retake.
 */
function prevRetakeQuestion() {
  if (appState.currentQuestionIndex > 0) {
    appState.currentQuestionIndex--;
    renderCurrentRetakeQuestion();
  }
}

/**
 * Next question in retake or submit.
 */
function nextRetakeQuestion() {
  const total = appState.questions.length;
  if (appState.currentQuestionIndex < total - 1) {
    appState.currentQuestionIndex++;
    renderCurrentRetakeQuestion();
  } else {
    submitRetakeAssessment();
  }
}

/**
 * Submit retake quiz, calculate new score and improvement, show Improvement screen.
 */
function submitRetakeAssessment() {
  // 1. Calculate retake score
  const retakeScore = calculateScore(appState.questions, appState.userAnswers);
  appState.retakeScorePercent = retakeScore;

  // 2. Initial score for this weak topic
  const initialTopicScore = appState.topicScores[appState.weakestTopic] ?? 30;

  // 3. Calculate improvement percentage
  appState.improvementPercent = calculateImprovement(initialTopicScore, retakeScore);

  // 4. Update session stats
  appState.quizzesCompleted += 1;

  // Record history log
  appState.history.unshift({
    topic: appState.weakestTopic,
    before: initialTopicScore,
    after: retakeScore,
    diff: appState.improvementPercent,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });

  // 5. Render Improvement Screen
  showImprovementScreen(appState.weakestTopic, initialTopicScore, retakeScore, appState.improvementPercent);
  navigateTo("improvement");
}

/**
 * Calculate net improvement percentage.
 * @param {number} beforeScore
 * @param {number} afterScore
 * @returns {number} delta e.g. 45
 */
function calculateImprovement(beforeScore, afterScore) {
  return afterScore - beforeScore;
}


// ==========================================================================
// 12. IMPROVEMENT SCREEN DISPLAY
// ==========================================================================

/**
 * Populates before/after comparison visual on Screen 8.
 */
function showImprovementScreen(topic, beforeScore, afterScore, delta) {
  // Titles
  document.getElementById("improve-topic-name").textContent = topic;
  document.getElementById("improve-before-topic").textContent = topic;
  document.getElementById("improve-after-topic").textContent = topic;

  // Before Box
  document.getElementById("improve-before-score").textContent = `${beforeScore}%`;
  document.getElementById("improve-before-bar").style.width = `${beforeScore}%`;

  // After Box
  document.getElementById("improve-after-score").textContent = `${afterScore}%`;
  document.getElementById("improve-after-bar").style.width = `${afterScore}%`;

  // Delta Badge
  const sign = delta >= 0 ? "+" : "";
  const deltaBadge = document.getElementById("improve-delta-badge");
  deltaBadge.textContent = `${sign}${delta}%`;

  // Dynamic feedback message
  const headlineEl = document.getElementById("improvement-headline");
  const messageEl = document.getElementById("improvement-message");
  const metricDescEl = document.getElementById("improve-metric-desc");

  if (delta > 0) {
    headlineEl.textContent = "Outstanding Progress! 🎉";
    messageEl.textContent = `Great! Your proficiency improved by ${delta}%.`;
    metricDescEl.textContent = `You scored ${beforeScore}% earlier, and after focused review jumped to ${afterScore}%. Your competency gap in ${topic} has been successfully closed!`;
  } else if (delta === 0) {
    headlineEl.textContent = "Steady Performance";
    messageEl.textContent = `Your score remained consistent at ${afterScore}%.`;
    metricDescEl.textContent = `Consider reviewing the cheat sheet once more to reinforce the trickier patterns before retrying.`;
  } else {
    headlineEl.textContent = "Keep Practicing!";
    messageEl.textContent = `You scored ${afterScore}%. Keep going, mastery comes with repetition!`;
    metricDescEl.textContent = `Take some time to explore the interactive challenges before your next attempt.`;
  }

  // Pre-render dashboard
  renderDashboard();
}


// ==========================================================================
// 13. SIMPLE PROGRESS DASHBOARD
// ==========================================================================

/**
 * Populates the overall student dashboard.
 */
function renderDashboard() {
  const currentSkillObj =
    skillsData.find(s => s.id === appState.selectedSkillId) ||
    skillsData[0];

  const score = appState.initialScorePercent;
  const topicScores = appState.topicScores || {};

  // --------------------------------------------------
  // 1. Active Skill
  // --------------------------------------------------

  document.getElementById("dash-skill-name").textContent =
    currentSkillObj.name;


  // --------------------------------------------------
  // 2. Overall Score
  // --------------------------------------------------

  document.getElementById("dash-overall-score").textContent =
    `${score}%`;

  const overallStatus =
    document.getElementById("dash-overall-status");

  if (appState.quizzesCompleted === 0) {
    overallStatus.textContent = "No assessment yet";
  } else if (score >= 70) {
    overallStatus.textContent = "Strong Proficiency";
  } else if (score >= 50) {
    overallStatus.textContent = "Developing Proficiency";
  } else {
    overallStatus.textContent = "Needs Improvement";
  }


  // --------------------------------------------------
  // 3. Assessments Completed
  // --------------------------------------------------

  document.getElementById("dash-quizzes-completed").textContent =
    appState.quizzesCompleted;


  // --------------------------------------------------
  // 4. Competency Gaps
  // --------------------------------------------------

  const gapsList =
    document.getElementById("dash-gaps-list");

  const gapCount =
    document.getElementById("dash-gap-count");

  const gapStat =
    document.getElementById("dash-gap-stat");

  gapsList.innerHTML = "";

  let identifiedGaps = 0;

  if (appState.quizzesCompleted === 0) {

    gapCount.textContent = "0 Identified";
    gapStat.textContent = "0";

    gapsList.innerHTML = `
      <div class="dash-item">
        <span class="dash-item-title">
          No competency gaps yet
        </span>

        <span class="dash-item-badge">
          Complete an assessment
        </span>
      </div>
    `;

  } else {

    for (const topic in topicScores) {

      if (topicScores[topic] < 65) {

        identifiedGaps++;

        const gapRow =
          document.createElement("div");

        gapRow.className = "dash-item";

        gapRow.innerHTML = `
          <span class="dash-item-title">
            ⚠ ${topic}
          </span>

          <span
            class="dash-item-badge"
            style="color: var(--status-average);"
          >
            ${topicScores[topic]}%
          </span>
        `;

        gapsList.appendChild(gapRow);
      }
    }

    gapCount.textContent =
      `${identifiedGaps} Identified`;

    gapStat.textContent =
      identifiedGaps;

    if (identifiedGaps === 0) {

      gapsList.innerHTML = `
        <div class="dash-item">
          <span class="dash-item-title">
            ✓ No major competency gaps
          </span>

          <span class="dash-item-badge">
            Strong performance
          </span>
        </div>
      `;
    }
  }


  // --------------------------------------------------
  // 5. Assessment Summary
  // --------------------------------------------------

  const historyList =
    document.getElementById("dash-history-list");

  const summaryCount =
    document.getElementById("dash-summary-count");

  historyList.innerHTML = "";

  if (appState.quizzesCompleted === 0) {

    summaryCount.textContent = "0 Topics";

    historyList.innerHTML = `
      <div class="dash-item">
        <span class="dash-item-title">
          No assessment data yet
        </span>

        <span class="dash-item-badge">
          Complete an assessment to view results
        </span>
      </div>
    `;

  } else {

    const topics =
      Object.keys(topicScores);

    summaryCount.textContent =
      `${topics.length} Topics`;

    topics.forEach(topic => {

      const score =
        topicScores[topic];

      const summaryRow =
        document.createElement("div");

      summaryRow.className = "dash-item";

      let label = "Needs Improvement";

      if (score >= 70) {
        label = "Strong";
      } else if (score >= 50) {
        label = "Developing";
      }

      summaryRow.innerHTML = `
        <span class="dash-item-title">
          ${topic}
        </span>

        <span class="dash-item-badge">
          ${score}% · ${label}
        </span>
      `;

      historyList.appendChild(summaryRow);
    });
  }
}