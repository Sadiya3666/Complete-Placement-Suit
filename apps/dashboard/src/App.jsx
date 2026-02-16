import React from 'react';
import { Briefcase, GraduationCap, FileText, ExternalLink, Zap, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
    const modules = [
        {
            title: 'Job Notification Tracker',
            description: 'Find and track the latest job opportunities. Aggregate listings, remove duplicates, and get notified instantly.',
            url: 'http://localhost:5001',
            icon: <Briefcase size={24} className="text-sky-400" />,
            color: 'sky',
            stats: '12 Active Apps'
        },
        {
            title: 'Placement Readiness',
            description: 'Prepare for interviews with role-specific checklists. Track your progress and boost your readiness score.',
            url: 'http://localhost:5002',
            icon: <GraduationCap size={24} className="text-indigo-400" />,
            color: 'indigo',
            stats: '78% Ready'
        },
        {
            title: 'AI Resume Builder',
            description: 'Build ATS-friendly resumes with AI assistance. Tailor your resume for specific job roles and maximize impact.',
            url: 'http://localhost:5003',
            icon: <FileText size={24} className="text-emerald-400" />,
            color: 'emerald',
            stats: '3 Versions'
        }
    ];

    return (
        <div className="dashboard-container">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="header"
            >
                <h1>Complete Placement Suite</h1>
                <p>Your unified platform for career success. One profile, three powerful modules.</p>
            </motion.header>

            <motion.div
                className="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {modules.map((mod, index) => (
                    <motion.a
                        key={mod.title}
                        href={mod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                    >
                        <div className="card-icon">
                            {mod.icon}
                        </div>

                        <div className="card-content">
                            <div className="status-badge">
                                < Zap size={12} />
                                {mod.stats}
                            </div>
                            <h2>{mod.title}</h2>
                            <p>{mod.description}</p>
                        </div>

                        <div className="btn">
                            Launch Module <ExternalLink size={16} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                        </div>
                    </motion.a>
                ))}
            </motion.div>

            <motion.div
                className="footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <p>© 2026 Complete Placement Suite. All systems operational.</p>
            </motion.div>
        </div>
    );
}

export default App;
