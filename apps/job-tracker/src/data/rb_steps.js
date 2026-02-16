export const RB_STEPS = [
  {
    id: "01-problem",
    number: 1,
    title: "Problem Definition",
    subtitle: "Identify the critical gaps in existing resume builders.",
    prompt: "I am building an AI Resume Builder. My goal is to solve the problem of generic, non-optimized resumes that fail ATS systems. Can you help me define the core problem statement and the unique value proposition for this project?",
    artifactKey: "rb_step_1_artifact"
  },
  {
    id: "02-market",
    number: 2,
    title: "Market Research",
    subtitle: "Analyze the landscape and define target personas.",
    prompt: "Based on the problem statement, identify the target market segments (e.g., tech grads, career switchers). What are the key competitors and what specific market gap are we filling?",
    artifactKey: "rb_step_2_artifact"
  },
  {
    id: "03-architecture",
    number: 3,
    title: "System Architecture",
    subtitle: "Define the tech stack and data flow.",
    prompt: "Design the system architecture for the AI Resume Builder. We need an LLM integration for resume optimization, a PDF generation engine, and a state-managed form builder. Propose a high-level architecture.",
    artifactKey: "rb_step_3_artifact"
  },
  {
    id: "04-hld",
    number: 4,
    title: "High-Level Design (HLD)",
    subtitle: "Map the user journey and system components.",
    prompt: "Create a high-level design diagram content for the user journey: Landing -> Auth -> Data Input -> AI Optimization -> Preview -> Export. Describe each component's responsibility.",
    artifactKey: "rb_step_4_artifact"
  },
  {
    id: "05-lld",
    number: 5,
    title: "Low-Level Design (LLD)",
    subtitle: "Detail the components, state, and API contracts.",
    prompt: "Detail the low-level design for the Resume Form component and the AI prompt engineering strategy. How will we handle nested state for work experience and education?",
    artifactKey: "rb_step_5_artifact"
  },
  {
    id: "06-build",
    number: 6,
    title: "Core Implementation",
    subtitle: "Build the foundational features in Lovable.",
    prompt: "Initialize the project with React and Tailwind. Implement the multi-step form for resume data collection and integrate the AI optimization logic using a mock LLM service for now.",
    artifactKey: "rb_step_6_artifact"
  },
  {
    id: "07-test",
    number: 7,
    title: "Verification & Testing",
    subtitle: "Ensure the builder is robust and ATS-friendly.",
    prompt: "Create a test plan for the resume builder. Focus on PDF export accuracy, mobile responsiveness of the preview, and AI response consistency.",
    artifactKey: "rb_step_7_artifact"
  },
  {
    id: "08-ship",
    number: 8,
    title: "Final Shipment",
    subtitle: "Deploy the application and verify live artifacts.",
    prompt: "Prepare the application for deployment. Ensure all environment variables are set for the LLM API and the PDF engine. Verify the live URL and GitHub repository.",
    artifactKey: "rb_step_8_artifact"
  }
];
