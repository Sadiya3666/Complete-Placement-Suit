import { generateCompanyIntel } from './companyIntel';

// ─── Skill Keyword Database ───────────────────────────────────────────────────
const SKILL_DB = {
    'Core CS': ['dsa', 'data structures', 'algorithms', 'oop', 'object oriented', 'dbms', 'database management', 'os', 'operating system', 'networks', 'computer networks', 'networking'],
    'Languages': ['java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'golang', 'go lang', 'rust', 'kotlin', 'swift'],
    'Web': ['react', 'reactjs', 'react.js', 'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'expressjs', 'rest', 'restful', 'graphql', 'angular', 'vue', 'html', 'css', 'tailwind'],
    'Data': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'firebase', 'dynamodb', 'nosql'],
    'Cloud/DevOps': ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'cicd', 'linux', 'terraform', 'jenkins', 'github actions'],
    'Testing': ['selenium', 'cypress', 'playwright', 'junit', 'pytest', 'jest', 'mocha', 'testing', 'unit test', 'integration test', 'e2e'],
};

// Canonical display names for matched keywords
const DISPLAY_NAMES = {
    'dsa': 'DSA', 'data structures': 'DSA', 'algorithms': 'DSA',
    'oop': 'OOP', 'object oriented': 'OOP',
    'dbms': 'DBMS', 'database management': 'DBMS',
    'os': 'OS', 'operating system': 'OS',
    'networks': 'Networks', 'computer networks': 'Networks', 'networking': 'Networks',
    'java': 'Java', 'python': 'Python', 'javascript': 'JavaScript', 'typescript': 'TypeScript',
    'c++': 'C++', 'c#': 'C#', 'golang': 'Go', 'go lang': 'Go', 'rust': 'Rust', 'kotlin': 'Kotlin', 'swift': 'Swift',
    'react': 'React', 'reactjs': 'React', 'react.js': 'React',
    'next.js': 'Next.js', 'nextjs': 'Next.js',
    'node.js': 'Node.js', 'nodejs': 'Node.js',
    'express': 'Express', 'expressjs': 'Express',
    'rest': 'REST', 'restful': 'REST', 'graphql': 'GraphQL',
    'angular': 'Angular', 'vue': 'Vue', 'html': 'HTML', 'css': 'CSS', 'tailwind': 'Tailwind CSS',
    'sql': 'SQL', 'mongodb': 'MongoDB', 'postgresql': 'PostgreSQL', 'mysql': 'MySQL',
    'redis': 'Redis', 'elasticsearch': 'Elasticsearch', 'firebase': 'Firebase', 'dynamodb': 'DynamoDB', 'nosql': 'NoSQL',
    'aws': 'AWS', 'azure': 'Azure', 'gcp': 'GCP', 'google cloud': 'GCP',
    'docker': 'Docker', 'kubernetes': 'Kubernetes', 'k8s': 'Kubernetes',
    'ci/cd': 'CI/CD', 'cicd': 'CI/CD', 'linux': 'Linux', 'terraform': 'Terraform', 'jenkins': 'Jenkins', 'github actions': 'GitHub Actions',
    'selenium': 'Selenium', 'cypress': 'Cypress', 'playwright': 'Playwright',
    'junit': 'JUnit', 'pytest': 'PyTest', 'jest': 'Jest', 'mocha': 'Mocha',
    'testing': 'Testing', 'unit test': 'Unit Testing', 'integration test': 'Integration Testing', 'e2e': 'E2E Testing',
};

// ─── 1. Skill Extraction ──────────────────────────────────────────────────────
export function extractSkills(jdText) {
    const text = jdText.toLowerCase();
    const results = {};
    let hasAny = false;

    for (const [category, keywords] of Object.entries(SKILL_DB)) {
        const found = new Set();
        for (const kw of keywords) {
            // Use word boundary matching for short keywords, substring for longer ones
            const regex = kw.length <= 3
                ? new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i')
                : new RegExp(escapeRegex(kw), 'i');
            if (regex.test(text)) {
                found.add(DISPLAY_NAMES[kw] || kw);
            }
        }
        if (found.size > 0) {
            results[category] = [...found];
            hasAny = true;
        }
    }

    return results;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── 2A. Round-wise Checklist ─────────────────────────────────────────────────
export function generateChecklist(skills) {
    const allSkills = Object.values(skills).flat();
    const hasCategory = (cat) => !!skills[cat] || !!skills[cat.toLowerCase()];

    const round1 = [
        'Practice quantitative aptitude (percentages, ratios, time & work)',
        'Solve 20 logical reasoning puzzles',
        'Review basic verbal ability and reading comprehension',
        'Time yourself — target 1 min per aptitude question',
        'Practice number series and pattern recognition',
    ];
    if (hasCategory('Core CS')) {
        round1.push('Revise OS basics: process scheduling, deadlocks, memory management');
        round1.push('Review DBMS: normalization, ACID properties, joins');
        round1.push('Brush up on networking: OSI model, TCP/UDP, HTTP methods');
    }

    const round2 = [
        'Solve 5 easy array/string problems daily',
        'Master sorting algorithms: quicksort, mergesort, heapsort',
        'Practice recursion and backtracking patterns',
        'Understand time & space complexity analysis (Big-O)',
        'Solve 3 medium-level linked list / tree problems',
    ];
    if (allSkills.includes('DSA')) {
        round2.push('Practice dynamic programming: knapsack, LCS, LIS patterns');
        round2.push('Review graph algorithms: BFS, DFS, Dijkstra, topological sort');
        round2.push('Solve 2 hard problems per week on competitive platforms');
    }
    if (hasCategory('Data')) {
        round2.push('Practice SQL queries: joins, subqueries, window functions');
    }

    const round3 = [
        'Prepare 2-minute pitch for each project on your resume',
        'Know your tech stack deeply — expect "why did you choose X?"',
        'Be ready to whiteboard a system design for a feature you built',
    ];
    if (hasCategory('Web')) {
        round3.push(`Deep dive into ${allSkills.includes('React') ? 'React lifecycle, hooks, and state management' : 'frontend framework internals'}`);
        round3.push(`Understand ${allSkills.includes('Node.js') ? 'Node.js event loop, middleware, and async patterns' : 'backend API design and REST conventions'}`);
    }
    if (hasCategory('Cloud/DevOps')) {
        round3.push('Explain your CI/CD pipeline and deployment workflow');
        round3.push('Discuss containerization choices (Docker) and orchestration basics');
    }
    if (hasCategory('Testing')) {
        round3.push('Describe your testing strategy: unit, integration, E2E');
    }
    round3.push('Practice live coding with someone watching — simulate pressure');
    round3.push('Prepare to discuss trade-offs in architectural decisions');

    const round4 = [
        'Prepare a strong "Tell me about yourself" (90 seconds max)',
        'Practice STAR method for behavioral questions',
        'Research the company: products, culture, recent news',
        'Prepare 3 thoughtful questions to ask the interviewer',
        'Practice "Why this company?" and "Why should we hire you?"',
        'Review your resume for any gaps or inconsistencies',
        'Be ready to discuss salary expectations professionally',
        'Practice handling stress questions and curveballs',
    ];

    return [
        { round: 'Round 1: Aptitude & Fundamentals', items: round1 },
        { round: 'Round 2: DSA & Core CS', items: round2 },
        { round: 'Round 3: Technical Interview (Projects & Stack)', items: round3 },
        { round: 'Round 4: Managerial / HR', items: round4 },
    ];
}

// ─── 2B. 7-Day Preparation Plan ──────────────────────────────────────────────
export function generatePlan(skills) {
    const allSkills = Object.values(skills).flat();
    const has = (s) => allSkills.includes(s);
    const hasCategory = (cat) => !!skills[cat] || !!skills[cat.toLowerCase()];

    const plan = [
        {
            day: 'Day 1–2',
            title: 'Fundamentals & Core CS',
            tasks: [
                'Revise OOP concepts: inheritance, polymorphism, encapsulation, abstraction',
                'Review OS: process vs thread, scheduling algorithms, virtual memory',
                'DBMS: normalization (1NF–BCNF), transactions, indexing',
                hasCategory('Data') ? 'Practice SQL: write 10 queries covering joins, aggregates, subqueries' : 'Review data modeling basics',
                'Computer Networks: OSI layers, TCP handshake, DNS resolution',
            ]
        },
        {
            day: 'Day 3–4',
            title: 'DSA & Coding Practice',
            tasks: [
                'Arrays & Strings: sliding window, two pointers, prefix sums',
                'Linked Lists: reversal, cycle detection, merge sorted lists',
                'Trees & BSTs: traversals, LCA, diameter, balanced check',
                has('DSA') ? 'Dynamic Programming: 0/1 knapsack, coin change, longest subsequence' : 'Practice 10 easy-medium problems on any coding platform',
                'Graphs: BFS, DFS, connected components, shortest path',
                'Time yourself: aim for 20–30 min per medium problem',
            ]
        },
        {
            day: 'Day 5',
            title: 'Projects & Resume Alignment',
            tasks: [
                'Update resume: quantify achievements ("reduced load time by 40%")',
                'Prepare a 2-minute walkthrough for each project',
                has('React') ? 'Review React concepts: hooks, context API, component lifecycle' : null,
                has('Node.js') ? 'Review Node.js: event loop, streams, middleware pattern' : null,
                hasCategory('Cloud/DevOps') ? 'Document your deployment pipeline and cloud architecture' : null,
                'Identify 2 technical challenges you faced and how you solved them',
                'Ensure GitHub repos are clean, documented, and have README files',
            ].filter(Boolean)
        },
        {
            day: 'Day 6',
            title: 'Mock Interview & Questions',
            tasks: [
                'Do a 45-minute mock interview with a peer or record yourself',
                'Practice "Tell me about yourself" — keep it under 90 seconds',
                'Prepare STAR stories for: teamwork, conflict, failure, leadership',
                has('SQL') ? 'Practice explaining database design decisions verbally' : null,
                has('React') ? 'Explain React state management options: useState, Redux, Context' : null,
                hasCategory('Cloud/DevOps') ? 'Walk through a deployment scenario end-to-end' : null,
                'Practice system design: design a URL shortener or chat app',
                'Review the 10 likely interview questions from your analysis',
            ].filter(Boolean)
        },
        {
            day: 'Day 7',
            title: 'Revision & Weak Areas',
            tasks: [
                'Re-solve problems you got wrong during the week',
                'Review all core concepts one final time (flashcard method)',
                'Rehearse your project pitches out loud',
                'Check all your proof links and portfolio for broken links',
                'Prepare your interview-day logistics: timing, tools, ID, etc.',
                'Get proper rest — a clear mind outperforms cramming',
            ]
        }
    ];

    return plan;
}

// ─── 2C. 10 Likely Interview Questions ───────────────────────────────────────
export function generateQuestions(skills) {
    const allSkills = Object.values(skills).flat();
    const has = (s) => allSkills.includes(s);
    const questions = [];

    // Skill-specific questions
    if (has('SQL')) questions.push('Explain database indexing — when does it help and when can it hurt performance?');
    if (has('React')) questions.push('Compare useState, useReducer, and external state managers like Redux. When would you choose each?');
    if (has('DSA')) questions.push('How would you optimize search in a sorted dataset? Walk me through the approach.');
    if (has('Node.js')) questions.push('Explain the Node.js event loop. How does it handle I/O-bound vs CPU-bound tasks?');
    if (has('Python')) questions.push('What are Python decorators? Give a real-world example of when you would use one.');
    if (has('Java')) questions.push('Explain the difference between HashMap and ConcurrentHashMap. When is thread safety critical?');
    if (has('JavaScript')) questions.push('What is the difference between var, let, and const? Explain hoisting and the temporal dead zone.');
    if (has('TypeScript')) questions.push('How does TypeScript improve code quality? Explain generics with a practical example.');
    if (has('MongoDB')) questions.push('When would you choose MongoDB over a relational database? Discuss data modeling differences.');
    if (has('PostgreSQL')) questions.push('Explain PostgreSQL MVCC and how it handles concurrent transactions.');
    if (has('MySQL')) questions.push('What is the difference between InnoDB and MyISAM storage engines?');
    if (has('Docker')) questions.push('Explain the difference between a Docker image and a container. How do layers work?');
    if (has('Kubernetes')) questions.push('What is a Kubernetes pod? How does it differ from a deployment?');
    if (has('AWS')) questions.push('Compare EC2, Lambda, and ECS. When would you use each for a web application?');
    if (has('Redis')) questions.push('How would you use Redis for caching in a web application? Discuss eviction policies.');
    if (has('GraphQL')) questions.push('Compare REST and GraphQL. What are the trade-offs of each approach?');
    if (has('Next.js')) questions.push('Explain SSR vs SSG vs ISR in Next.js. When would you use each strategy?');
    if (has('Express')) questions.push('How does middleware work in Express? Design a simple auth middleware.');
    if (has('OOP')) questions.push('Explain the SOLID principles with examples from a project you have built.');
    if (has('DBMS')) questions.push('Walk me through normalization from 1NF to BCNF with a real table example.');
    if (has('OS')) questions.push('Explain the difference between a process and a thread. What is a deadlock and how do you prevent it?');
    if (has('Networks')) questions.push('Describe what happens from the moment you type a URL into a browser until the page loads.');
    if (has('C++')) questions.push('Explain RAII in C++. How does it relate to smart pointers?');
    if (has('Go')) questions.push('How do goroutines differ from OS threads? Explain channels for concurrency.');
    if (has('Selenium')) questions.push('How do you handle dynamic elements and waits in Selenium test automation?');
    if (has('Cypress')) questions.push('What makes Cypress different from Selenium? Discuss its architecture.');
    if (has('REST')) questions.push('Design a RESTful API for a todo app. What HTTP methods and status codes would you use?');
    if (has('CI/CD')) questions.push('Walk me through your ideal CI/CD pipeline. What tools and stages would you include?');
    if (has('Linux')) questions.push('How would you debug a production server issue using only the Linux command line?');

    // Pad with universal questions
    const universal = [
        'What is your approach to debugging a complex issue you have never seen before?',
        'Describe a project you are most proud of. What technical decisions did you make and why?',
        'How do you handle disagreements with a teammate about a technical approach?',
        'Explain the concept of time complexity. Analyze the complexity of a nested loop.',
        'What is the difference between a stack and a queue? Give real-world use cases.',
        'How do you ensure code quality in a team environment?',
        'Explain caching — where can you implement it in a typical web application?',
        'What is version control? Describe your Git workflow.',
        'How would you design a URL shortening service like bit.ly?',
        'What are microservices? Compare with monolithic architecture.',
    ];

    for (const q of universal) {
        if (questions.length >= 10) break;
        if (!questions.includes(q)) questions.push(q);
    }

    return questions.slice(0, 10);
}

// ─── 3. Readiness Score ──────────────────────────────────────────────────────
export function calculateReadiness(skills, company, role, jdText) {
    let score = 35;

    const categoriesPresent = Object.keys(skills).filter(k => k !== 'General' && k !== 'Other').length;
    score += Math.min(categoriesPresent * 5, 30);

    if (company && company.trim().length > 0) score += 10;
    if (role && role.trim().length > 0) score += 10;
    if (jdText && jdText.length > 800) score += 10;

    return Math.min(score, 100);
}

// ─── Full Analysis Pipeline ──────────────────────────────────────────────────

export function analyzeJD({ company, role, jdText }) {
    const extractedSkills = extractSkills(jdText);

    // Default behavior if no skills detected
    if (Object.keys(extractedSkills).length === 0) {
        extractedSkills['Other'] = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    const checklist = generateChecklist(extractedSkills);
    const plan = generatePlan(extractedSkills);
    const questions = generateQuestions(extractedSkills);
    const baseScore = calculateReadiness(extractedSkills, company, role, jdText);
    const companyIntel = generateCompanyIntel(company, extractedSkills);

    // Standardize Categories for extractedSkills
    const standardizedSkills = {
        coreCS: extractedSkills['Core CS'] || [],
        languages: extractedSkills['Languages'] || [],
        web: extractedSkills['Web'] || [],
        data: extractedSkills['Data'] || [],
        cloud: extractedSkills['Cloud/DevOps'] || [],
        testing: extractedSkills['Testing'] || [],
        other: extractedSkills['Other'] || extractedSkills['General'] || []
    };

    const finalResult = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills: standardizedSkills,
        roundMapping: companyIntel.roundMapping.map(r => ({
            roundTitle: r.name,
            focusAreas: r.focus,
            whyItMatters: r.why
        })),
        checklist: checklist.map(c => ({
            roundTitle: c.round,
            items: c.items
        })),
        plan7Days: plan.map(p => ({
            day: p.day,
            focus: p.title,
            tasks: p.tasks
        })),
        questions,
        baseScore,
        skillConfidenceMap: {}, // Default empty
        finalScore: baseScore,
        companyIntel, // For UI metadata
    };

    return finalResult;
}
