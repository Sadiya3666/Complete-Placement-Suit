// ─── Known Company Database ──────────────────────────────────────────────────
const ENTERPRISE_COMPANIES = [
    'amazon', 'google', 'microsoft', 'apple', 'meta', 'facebook', 'netflix',
    'infosys', 'tcs', 'wipro', 'hcl', 'cognizant', 'accenture', 'capgemini',
    'deloitte', 'ibm', 'oracle', 'sap', 'salesforce', 'adobe', 'intel',
    'cisco', 'qualcomm', 'samsung', 'lg', 'sony', 'dell', 'hp', 'lenovo',
    'walmart', 'jpmorgan', 'goldman sachs', 'morgan stanley', 'barclays',
    'hsbc', 'visa', 'mastercard', 'paypal', 'uber', 'lyft', 'airbnb',
    'twitter', 'linkedin', 'snap', 'spotify', 'zoom', 'slack',
    'vmware', 'atlassian', 'servicenow', 'workday', 'snowflake',
    'palantir', 'databricks', 'stripe', 'square', 'block',
    'tech mahindra', 'mindtree', 'ltimindtree', 'mphasis', 'persistent',
    'juspay', 'phonepe', 'paytm', 'razorpay', 'cred', 'meesho',
    'flipkart', 'swiggy', 'zomato', 'ola', 'byju', 'unacademy',
    'boeing', 'lockheed', 'general electric', 'ge', 'siemens',
    'reliance', 'tata', 'mahindra', 'bajaj',
];

const MIDSIZE_COMPANIES = [
    'freshworks', 'zoho', 'postman', 'browserstack', 'hasura',
    'cleartax', 'chargebee', 'druva', 'icertis', 'innovaccer',
    'sprinklr', 'moengage', 'leadsquared', 'yellowai', 'darwinbox',
    'notion', 'figma', 'vercel', 'supabase', 'retool',
    'twilio', 'sendgrid', 'contentful', 'algolia',
];

// ─── Industry Inference ──────────────────────────────────────────────────────
const INDUSTRY_MAP = {
    'amazon': 'E-Commerce & Cloud', 'google': 'Search & Cloud', 'microsoft': 'Software & Cloud',
    'apple': 'Consumer Electronics', 'meta': 'Social Media', 'facebook': 'Social Media',
    'netflix': 'Streaming & Entertainment', 'infosys': 'IT Consulting', 'tcs': 'IT Consulting',
    'wipro': 'IT Consulting', 'hcl': 'IT Services', 'cognizant': 'IT Consulting',
    'accenture': 'Consulting & IT', 'capgemini': 'IT Consulting', 'deloitte': 'Consulting',
    'ibm': 'Enterprise Software', 'oracle': 'Enterprise Software', 'sap': 'Enterprise Software',
    'salesforce': 'CRM & Cloud', 'adobe': 'Creative Software', 'intel': 'Semiconductors',
    'cisco': 'Networking', 'qualcomm': 'Semiconductors', 'samsung': 'Electronics',
    'walmart': 'Retail & E-Commerce', 'jpmorgan': 'Investment Banking', 'goldman sachs': 'Investment Banking',
    'morgan stanley': 'Investment Banking', 'visa': 'Fintech', 'mastercard': 'Fintech',
    'paypal': 'Fintech', 'uber': 'Ride-hailing & Logistics', 'airbnb': 'Travel & Hospitality',
    'flipkart': 'E-Commerce', 'swiggy': 'Food Delivery', 'zomato': 'Food & Delivery',
    'phonepe': 'Fintech', 'paytm': 'Fintech', 'razorpay': 'Fintech', 'cred': 'Fintech',
    'freshworks': 'SaaS', 'zoho': 'SaaS', 'postman': 'Developer Tools',
    'browserstack': 'Developer Tools', 'stripe': 'Fintech', 'spotify': 'Music Streaming',
    'slack': 'Productivity', 'zoom': 'Video Communication', 'atlassian': 'Developer Tools',
    'boeing': 'Aerospace & Defense', 'reliance': 'Conglomerate', 'tata': 'Conglomerate',
};

// ─── Classification ──────────────────────────────────────────────────────────
export function classifyCompany(companyName) {
    if (!companyName || !companyName.trim()) {
        return { name: 'Unknown', size: 'Startup', sizeLabel: 'Startup (<200)', industry: 'Technology Services' };
    }

    const normalized = companyName.trim().toLowerCase();

    // Check enterprise
    const isEnterprise = ENTERPRISE_COMPANIES.some(c => normalized.includes(c) || c.includes(normalized));
    if (isEnterprise) {
        const industry = findIndustry(normalized);
        return { name: companyName.trim(), size: 'Enterprise', sizeLabel: 'Enterprise (2000+)', industry };
    }

    // Check mid-size
    const isMidsize = MIDSIZE_COMPANIES.some(c => normalized.includes(c) || c.includes(normalized));
    if (isMidsize) {
        const industry = findIndustry(normalized);
        return { name: companyName.trim(), size: 'Mid-size', sizeLabel: 'Mid-size (200–2000)', industry };
    }

    // Default: Startup
    return { name: companyName.trim(), size: 'Startup', sizeLabel: 'Startup (<200)', industry: 'Technology Services' };
}

function findIndustry(normalized) {
    for (const [key, val] of Object.entries(INDUSTRY_MAP)) {
        if (normalized.includes(key) || key.includes(normalized)) return val;
    }
    return 'Technology Services';
}

// ─── Hiring Focus ────────────────────────────────────────────────────────────
export function getHiringFocus(size) {
    switch (size) {
        case 'Enterprise':
            return {
                title: 'Structured DSA + Core Fundamentals',
                points: [
                    'Heavy emphasis on Data Structures & Algorithms',
                    'Core CS fundamentals tested (OS, DBMS, Networks)',
                    'Multiple structured interview rounds with clear rubrics',
                    'Emphasis on problem-solving under time pressure',
                    'Behavioral rounds with STAR method expected',
                ],
            };
        case 'Mid-size':
            return {
                title: 'Balanced Technical + Practical Skills',
                points: [
                    'Mix of DSA and practical coding challenges',
                    'System design discussions for mid-senior roles',
                    'Project-based deep dives are common',
                    'Culture fit assessment alongside technical skills',
                    'Focus on ownership and initiative mindset',
                ],
            };
        case 'Startup':
        default:
            return {
                title: 'Practical Problem Solving + Stack Depth',
                points: [
                    'Focus on real-world problem solving over theory',
                    'Deep knowledge of your tech stack is critical',
                    'Take-home assignments or live pair programming common',
                    'Strong bias towards shipping velocity and adaptability',
                    'Culture and team fit weighed heavily',
                ],
            };
    }
}

// ─── Round Mapping Engine ────────────────────────────────────────────────────
export function generateRoundMapping(companyInfo, extractedSkills) {
    const { size } = companyInfo;
    const allSkills = Object.values(extractedSkills).flat();
    const has = (s) => allSkills.some(sk => sk.toLowerCase().includes(s.toLowerCase()));
    const hasCategory = (cat) => !!extractedSkills[cat];

    if (size === 'Enterprise') {
        return generateEnterpriseRounds(has, hasCategory, allSkills);
    } else if (size === 'Mid-size') {
        return generateMidsizeRounds(has, hasCategory, allSkills);
    } else {
        return generateStartupRounds(has, hasCategory, allSkills);
    }
}

function generateEnterpriseRounds(has, hasCategory, allSkills) {
    const rounds = [
        {
            name: 'Round 1: Online Assessment',
            type: 'online',
            description: has('DSA')
                ? 'Timed online test covering DSA problems, aptitude, and logical reasoning. Expect 2–3 coding questions with time constraints.'
                : 'Online aptitude test with MCQs on core CS, logical reasoning, and basic programming.',
            why: 'Companies use this to filter a large applicant pool quickly. Strong DSA fundamentals and speed are key differentiators at this stage.',
            focus: has('DSA') ? ['DSA', 'Aptitude', 'Time Management'] : ['Aptitude', 'Logical Reasoning', 'Basic CS'],
        },
        {
            name: 'Round 2: Technical Interview — DSA & Core CS',
            type: 'technical',
            description: `Live coding round focused on ${has('DSA') ? 'medium-hard DSA problems' : 'fundamental coding challenges'}. Expect questions on ${hasCategory('Core CS') ? 'OS, DBMS, and Networks' : 'data structures and algorithms'}.`,
            why: 'This round tests your depth of understanding. Interviewers evaluate not just correctness but your approach, communication, and ability to optimize.',
            focus: hasCategory('Core CS')
                ? ['DSA', 'OS', 'DBMS', 'Networks', 'Problem Solving']
                : ['DSA', 'Problem Solving', 'Code Quality'],
        },
        {
            name: 'Round 3: Technical Interview — Projects & Stack',
            type: 'project',
            description: `Deep dive into your projects and tech stack. ${hasCategory('Web') ? 'Expect questions on frontend/backend architecture, API design, and deployment.' : 'Be prepared to walk through your most impactful project end-to-end.'}`,
            why: 'This round validates that you can apply knowledge to real-world scenarios. Showing depth in your own projects demonstrates genuine engineering ability.',
            focus: hasCategory('Web')
                ? [...allSkills.filter(s => ['React', 'Node.js', 'Express', 'Next.js'].includes(s)), 'System Design', 'Architecture']
                : ['Projects', 'Tech Stack', 'Problem Solving'],
        },
        {
            name: 'Round 4: HR / Managerial',
            type: 'hr',
            description: 'Behavioral interview assessing cultural fit, communication, and career motivation. Uses STAR method for situational questions.',
            why: 'Technical skill alone is not enough. Companies want to ensure you can collaborate, handle pressure, and align with their values and mission.',
            focus: ['Communication', 'Teamwork', 'Leadership', 'Motivation'],
        },
    ];

    return rounds;
}

function generateMidsizeRounds(has, hasCategory, allSkills) {
    const rounds = [
        {
            name: 'Round 1: Coding Challenge',
            type: 'online',
            description: `${has('DSA') ? 'DSA-focused coding test with 2–3 problems of increasing difficulty' : 'Practical coding challenge emphasizing clean code and problem-solving'}. May include a take-home component.`,
            why: 'Mid-size companies balance between structured assessment and practical evaluation. They want to see clean, working code under reasonable time.',
            focus: has('DSA') ? ['DSA', 'Clean Code', 'Efficiency'] : ['Problem Solving', 'Clean Code', 'Logic'],
        },
        {
            name: 'Round 2: Technical Deep Dive',
            type: 'technical',
            description: `In-depth discussion on your tech expertise. ${hasCategory('Web') ? 'Expect system design questions and architecture discussions for fullstack roles.' : 'Focus on core concepts and how you apply them in practice.'}`,
            why: 'This evaluates both breadth and depth. Mid-size companies value engineers who can own features end-to-end and make sound technical decisions.',
            focus: hasCategory('Web')
                ? [...allSkills.filter(s => ['React', 'Node.js', 'SQL', 'MongoDB'].includes(s)), 'System Design']
                : ['Core Concepts', 'System Thinking', 'Architecture'],
        },
        {
            name: 'Round 3: Project & Culture Fit',
            type: 'project',
            description: 'Mixed round covering project walkthrough, team collaboration scenarios, and alignment with company culture and values.',
            why: 'In smaller teams, every hire significantly impacts culture. Companies assess whether you take ownership and communicate proactively.',
            focus: ['Projects', 'Ownership', 'Culture Fit', 'Communication'],
        },
    ];

    if (hasCategory('Cloud/DevOps') || hasCategory('Testing')) {
        rounds.splice(2, 0, {
            name: 'Round 3: DevOps & Infrastructure',
            type: 'technical',
            description: 'Discussion of deployment pipelines, infrastructure decisions, monitoring, and testing strategies.',
            why: 'Mid-size companies often expect engineers to manage their own infrastructure. Showing DevOps awareness is a strong differentiator.',
            focus: allSkills.filter(s => ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Jest', 'Cypress'].includes(s)),
        });
        // Renumber
        rounds.forEach((r, i) => {
            r.name = `Round ${i + 1}: ${r.name.split(': ').slice(1).join(': ')}`;
        });
    }

    return rounds;
}

function generateStartupRounds(has, hasCategory, allSkills) {
    const rounds = [
        {
            name: 'Round 1: Practical Coding',
            type: 'online',
            description: `${hasCategory('Web') ? 'Build a small feature or component — startups want to see you write real, shippable code.' : 'Coding exercise focused on real-world problem solving rather than competitive programming.'}`,
            why: 'Startups prioritize engineers who can deliver working solutions fast. This round tests your ability to write production-quality code under practical constraints.',
            focus: hasCategory('Web')
                ? allSkills.filter(s => ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Python'].includes(s))
                : ['Practical Coding', 'Problem Solving', 'Speed'],
        },
        {
            name: 'Round 2: System & Architecture Discussion',
            type: 'technical',
            description: `Discussion about how you would design or improve a system. ${has('React') ? 'May include frontend architecture, state management, and API integration design.' : 'Focus on trade-offs, scalability thinking, and practical decisions.'}`,
            why: 'Startups need versatile thinkers. This round checks if you can reason about systems holistically, not just write isolated functions.',
            focus: has('React')
                ? ['Frontend Architecture', 'API Design', 'State Management']
                : ['System Design', 'Trade-offs', 'Scalability'],
        },
        {
            name: 'Round 3: Founder / Culture Fit',
            type: 'hr',
            description: 'Informal conversation with the founder or team lead about your motivation, working style, and alignment with the startup mission.',
            why: 'In a startup, every team member shapes the culture. Founders want to ensure you are self-driven, adaptable, and genuinely excited about the problem space.',
            focus: ['Motivation', 'Adaptability', 'Initiative', 'Culture Fit'],
        },
    ];

    return rounds;
}

// ─── Full Company Intel Pipeline ─────────────────────────────────────────────
export function generateCompanyIntel(companyName, extractedSkills) {
    const companyInfo = classifyCompany(companyName);
    const hiringFocus = getHiringFocus(companyInfo.size);
    const roundMapping = generateRoundMapping(companyInfo, extractedSkills);

    return {
        companyInfo,
        hiringFocus,
        roundMapping,
    };
}
