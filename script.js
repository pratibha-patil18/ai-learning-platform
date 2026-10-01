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
  currentQuestionIndex: 0,            // Which question the user is answering
  questions: [],                      // Active list of question objects
  userAnswers: {},                    // Stores questionIndex -> selectedOptionIndex
  
  // Scoring & Diagnostics
  initialScorePercent: 0,             // e.g., 65
  topicScores: {},                    // e.g., { "Basics": 80, "Recursion": 30 }
  weakestTopic: null,          // Name of the lowest scoring topic
  
  
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
// 5. MOCK DATA: RECOMMENDED LEARNING RESOURCES
// Structured so an API endpoint can supply dynamic links later.
// ==========================================================================
const learningResourcesData = {
  "Recursion": [
    {
      title: "Recursion in 100 Seconds",
      type: "video",
      badge: "Video Tutorial",
      description: "A quick visual introduction to recursion, recursive calls, and the call stack.",
      actionText: "Watch Now",
      url: "https://www.youtube.com/watch?v=rf60MejMz3E"
    },
    {
      title: "Recursion Practice",
      type: "practice",
      badge: "Hands-on Practice",
      description: "Practice recursion problems and strengthen your understanding of base cases and recursive calls.",
      actionText: "Practice Now",
      url: "https://leetcode.com/explore/learn/card/recursion-i/"
    },
    {
      title: "How Recursion Works",
      type: "guide",
      badge: "Quick Reference",
      description: "Review recursion, call stacks, base cases, and recursive execution with visual explanations.",
      actionText: "Review Guide",
      url: "https://www.freecodecamp.org/news/how-recursion-works-explained-with-flowcharts-and-a-video-de61f40cb7f9/"
    }
  ],

  "HTML/CSS": [
    {
      title: "HTML & CSS Full Course for Beginners",
      type: "video",
      badge: "Video Tutorial",
      description: "Learn HTML and CSS fundamentals, layouts, styling, and responsive design.",
      actionText: "Watch Now",
      url: "https://www.youtube.com/watch?v=a_iQb1lnAEQ"
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
      description: "Review HTML elements, CSS properties, selectors, and web development concepts.",
      actionText: "Review Guide",
      url: "https://developer.mozilla.org/en-US/docs/Web"
    }
  ],

  "DOM Manipulation": [
    {
      title: "JavaScript DOM Manipulation",
      type: "video",
      badge: "Video Tutorial",
      description: "Learn how JavaScript interacts with HTML elements through the DOM.",
      actionText: "Watch Now",
      url: "https://www.youtube.com/watch?v=5fb2aPlgoys"
    },
    {
      title: "DOM Manipulation Practice",
      type: "practice",
      badge: "Hands-on Practice",
      description: "Practice selecting, modifying, creating, and removing DOM elements.",
      actionText: "Practice Now",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting"
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
      title: "JavaScript Async/Await and Promises",
      type: "video",
      badge: "Video Tutorial",
      description: "Learn Promises, async functions, await, and asynchronous JavaScript.",
      actionText: "Watch Now",
      url: "https://www.youtube.com/watch?v=vn3tm0quoqE"
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
      description: "Review asynchronous JavaScript, Promises, async, and await.",
      actionText: "Review Guide",
      url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS"
    }
  ],

  "Events": [
    {
      title: "JavaScript Events",
      type: "video",
      badge: "Video Tutorial",
      description: "Learn how JavaScript responds to clicks, inputs, and other user interactions.",
      actionText: "Watch Now",
      url: "https://www.youtube.com/watch?v=UVRDq-wnfgk"
    },
    {
      title: "Event Handling Practice",
      type: "practice",
      badge: "Hands-on Practice",
      description: "Practice click, input, submit, and other event handlers using addEventListener.",
      actionText: "Practice Now",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"
    },
    {
      title: "JavaScript Events Reference",
      type: "guide",
      badge: "Quick Reference",
      description: "Review event types, event objects, and event listener concepts.",
      actionText: "Review Guide",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events"
    }
  ],

  "Default": [
    {
      title: "JavaScript Full Course for Beginners",
      type: "video",
      badge: "Video Tutorial",
      description: "A beginner-friendly JavaScript course covering programming and web scripting fundamentals.",
      actionText: "Watch Now",
      url: "https://www.youtube.com/watch?v=PkZNo7MFNFg"
    },
    {
      title: "freeCodeCamp Coding Practice",
      type: "practice",
      badge: "Hands-on Practice",
      description: "Practice programming concepts through interactive coding exercises.",
      actionText: "Practice Now",
      url: "https://www.freecodecamp.org/learn/"
    },
    {
      title: "MDN Web Documentation",
      type: "guide",
      badge: "Quick Reference",
      description: "Reference web development concepts, JavaScript features, APIs, HTML, and CSS.",
      actionText: "Review Guide",
      url: "https://developer.mozilla.org/en-US/docs/Web"
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
 * @param {string} screenName - "welcome", "skills", "quiz", "results", "gap", "learning", "dashboard"
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

    const marker = document.createElement("span");
    marker.className = "option-marker";
    marker.textContent = optionLetters[optIndex];

    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = optText;

    optionBtn.appendChild(marker);
    optionBtn.appendChild(text);

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

const weakTitle =
  weakBanner.querySelector("h4");

const weakIcon =
  weakBanner.querySelector(".weak-callout-icon");


if (hasGap) {

  weakBanner.style.display = "flex";

  weakTitle.textContent =
    "Competency Gap Detected";

  weakIcon.textContent =
    "!";

  weakSummary.innerHTML =
    `We found that <strong>${weakest}</strong> is currently your weakest area (<strong>${weakestScore}% proficiency</strong>).`;

} else {

  weakBanner.style.display = "flex";

  weakTitle.textContent =
    "No Competency Gaps Detected";

  weakIcon.textContent =
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

  const gapMeterFill = document.getElementById("gap-meter-fill");
  if (gapMeterFill) {
    gapMeterFill.style.width = `${proficiency}%`;
  }

  const levelTag = document.getElementById("gap-level-tag");
  const explanationEl = document.getElementById("gap-explanation-text");
  const actionEl = document.getElementById("gap-recommended-action");

  if (proficiency < 40) {
    levelTag.textContent = "Critical Competency Gap";

    explanationEl.textContent =
      `You scored ${proficiency}% in ${topic}. Students who struggle with this area often encounter difficulties with call stack mechanics, recursion tree tracing, and base condition bounds.`;

    actionEl.textContent =
      `Focus on ${topic} fundamentals, step-by-step base cases, and problem decomposition before attempting complex challenges.`;

  } else if (proficiency < 70) {
    levelTag.textContent = "Moderate Competency Gap";

    explanationEl.textContent =
      `You have partial familiarity with ${topic} (${proficiency}%), but lack consistency on edge-case behavior and advanced patterns.`;

    actionEl.textContent =
      `Review 2-3 code walkthroughs focusing specifically on boundary cases, then test your understanding.`;

  } else {
    levelTag.textContent = "Strong Competency";

    explanationEl.textContent =
      `You scored ${proficiency}% in ${topic}, showing a strong understanding of the topic.`;

    actionEl.textContent =
      `Continue practicing ${topic} problems to maintain your understanding and improve your problem-solving speed.`;
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