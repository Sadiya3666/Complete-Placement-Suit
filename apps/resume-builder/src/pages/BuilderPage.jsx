import React, { useState, useEffect, useMemo } from 'react';

const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                onAdd(input.trim());
            }
            setInput('');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: input ? '4px' : '0' }}>
                {tags.map((tag, idx) => (
                    <span key={idx} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151'
                    }}>
                        {tag}
                        <button
                            onClick={() => onRemove(tag)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontSize: '14px', lineHeight: 1, display: 'flex', alignItems: 'center', color: '#9ca3af' }}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{ padding: '8px 12px', fontSize: '13px' }}
            />
        </div>
    );
};

const BuilderPage = () => {
    // Initial State Template
    const initialState = {
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [{ id: Date.now(), school: '', degree: '', year: '' }],
        experience: [{ id: Date.now(), company: '', position: '', duration: '', description: '' }],
        projects: [{ id: Date.now(), name: '', description: '', techStack: [], liveUrl: '', githubUrl: '', isOpen: true }],
        skills: {
            technical: [],
            soft: [],
            tools: []
        },
        links: { github: '', linkedin: '' }
    };

    // 1) Load from LocalStorage or use template
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (!saved) return initialState;

        const parsed = JSON.parse(saved);
        // Migration logic for skills if it's still a string
        if (typeof parsed.skills === 'string') {
            parsed.skills = {
                technical: parsed.skills.split(',').map(s => s.trim()).filter(Boolean),
                soft: [],
                tools: []
            };
        }
        // Migration for projects to ensure new fields exist
        if (parsed.projects) {
            parsed.projects = parsed.projects.map(p => ({
                id: p.id || Math.random(),
                name: p.name || '',
                description: p.description || '',
                techStack: p.techStack || [],
                liveUrl: p.liveUrl || '',
                githubUrl: p.githubUrl || '',
                isOpen: p.isOpen !== undefined ? p.isOpen : true
            }));
        }
        return parsed;
    });

    const [activeTemplate, setActiveTemplate] = useState(() => {
        return localStorage.getItem('resumeActiveTemplate') || 'Classic';
    });

    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('resumeAccentColor') || 'hsl(168, 60%, 40%)';
    });

    const [toast, setToast] = useState(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // 2) Auto-save to LocalStorage
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    }, [resumeData]);

    useEffect(() => {
        localStorage.setItem('resumeActiveTemplate', activeTemplate);
    }, [activeTemplate]);

    useEffect(() => {
        localStorage.setItem('resumeAccentColor', accentColor);
    }, [accentColor]);

    // Action Verbs for validation
    const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated'];

    const getBulletGuidance = (text) => {
        if (!text.trim()) return null;
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
            const firstWord = line.trim().split(' ')[0].replace(/[^a-zA-Z]/g, '');
            const hasVerb = ACTION_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
            const hasNumber = /\d+/.test(line);
            if (!hasVerb) return "Start with a strong action verb.";
            if (!hasNumber) return "Add measurable impact (numbers).";
        }
        return null;
    };

    // 3) ATS Scoring Logic
    const { score, suggestions } = useMemo(() => {
        let s = 0;
        const sugs = [];
        const actionVerbs = ['built', 'led', 'designed', 'improved', 'implemented', 'developed', 'created', 'optimized', 'managed', 'developed'];

        if (resumeData.personalInfo.name.trim()) s += 10;
        else sugs.push("Add name (+10)");

        if (resumeData.personalInfo.email.trim()) s += 10;
        else sugs.push("Add email (+10)");

        if (resumeData.personalInfo.phone.trim()) s += 5;
        else sugs.push("Add phone (+5)");

        if (resumeData.links.linkedin.trim()) s += 5;
        else sugs.push("Add LinkedIn (+5)");

        if (resumeData.links.github.trim()) s += 5;
        else sugs.push("Add GitHub (+5)");

        if (resumeData.summary.trim().length > 50) s += 10;
        else sugs.push("Summary > 50 chars (+10)");

        const hasActionVerb = actionVerbs.some(verb => resumeData.summary.toLowerCase().includes(verb));
        if (hasActionVerb) s += 10;
        else sugs.push("Use action verbs (+10)");

        const hasExp = resumeData.experience.some(e =>
            e.company.trim() &&
            e.description.trim().length > 10 &&
            (e.description.includes('\n') || e.description.includes('•') || e.description.includes('-'))
        );
        if (hasExp) s += 15;
        else sugs.push("Add experience bullets (+15)");

        const hasEdu = resumeData.education.some(e => e.school.trim());
        if (hasEdu) s += 10;
        else sugs.push("Add education (+10)");

        const totalSkills = (resumeData.skills.technical?.length || 0) + (resumeData.skills.soft?.length || 0) + (resumeData.skills.tools?.length || 0);
        if (totalSkills >= 5) s += 10;
        else sugs.push("Add 5+ skills (+10)");

        const hasProj = resumeData.projects && resumeData.projects.some(p => p.name.trim());
        if (hasProj) s += 10;
        else sugs.push("Add 1+ project (+10)");

        return { score: Math.min(100, s), suggestions: sugs };
    }, [resumeData]);

    const handleSuggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setResumeData(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])],
                    soft: [...new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])],
                    tools: [...new Set([...prev.skills.tools, "Git", "Docker", "AWS"])]
                }
            }));
            setIsSuggesting(false);
        }, 1000);
    };

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const addEntry = (section) => {
        const templates = {
            education: { id: Date.now(), school: '', degree: '', year: '' },
            experience: { id: Date.now(), company: '', position: '', duration: '', description: '' },
            projects: { id: Date.now(), name: '', description: '', techStack: [], liveUrl: '', githubUrl: '', isOpen: true }
        };
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], templates[section]]
        }));
    };

    const removeEntry = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const toggleProject = (id) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, isOpen: !p.isOpen } : p)
        }));
    };

    const updateNestedField = (section, index, field, value) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [section]: newList };
        });
    };

    const handleTagChange = (category, type, value, isAdd) => {
        setResumeData(prev => {
            const currentTags = category === 'skills' ? prev.skills[type] : prev.projects[category].techStack;
            let nextTags;
            if (isAdd) {
                nextTags = [...new Set([...currentTags, value])];
            } else {
                nextTags = currentTags.filter(t => t !== value);
            }

            if (category === 'skills') {
                return { ...prev, skills: { ...prev.skills, [type]: nextTags } };
            } else {
                const newProjects = [...prev.projects];
                newProjects[category] = { ...newProjects[category], techStack: nextTags };
                return { ...prev, projects: newProjects };
            }
        });
    };

    const loadSampleData = () => {
        setResumeData({
            personalInfo: { name: 'Alex Rivera', email: 'alex.rivera@example.com', phone: '+1 (555) 012-3456', location: 'San Francisco, CA' },
            summary: 'Senior Software Engineer with 8+ years of experience in full-stack development. Specialist in React, Node.js, and cloud architecture. Passionate about building scalable, user-centric applications and mentoring junior developers.',
            education: [{ id: 1, school: 'Stanford University', degree: 'M.S. in Computer Science', year: '2016' }],
            experience: [{ id: 2, company: 'TechFlow Systems', position: 'Lead Developer', duration: '2019 - Present', description: 'Led a team of 12 engineers in the migration of legacy services to a microservices architecture. Improved system performance by 45%.' }],
            projects: [{ id: 3, name: 'SkyQuery', description: 'Built an open-source distributed database management tool with over 5k stars on GitHub.', techStack: ['Go', 'React', 'gRPC'], liveUrl: 'https://skyquery.dev', githubUrl: 'https://github.com/alex/skyquery', isOpen: true }],
            skills: { technical: ['React', 'TypeScript', 'Node.js'], soft: ['Leadership'], tools: ['Docker', 'AWS', 'Git'] },
            links: { github: 'github.com/alexrivera', linkedin: 'linkedin.com/in/alexrivera' }
        });
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--color-bg)' }}>
            <div style={{ width: '50%', padding: '40px', overflowY: 'auto', borderRight: '1px solid var(--color-border)' }}>
                {/* Scoring Header */}
                <div style={{ padding: '24px', backgroundColor: 'var(--color-white)', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>ATS Readiness</span>
                            <div style={{ fontSize: '32px', fontWeight: '600', fontFamily: 'var(--font-serif)' }}>{score}<span style={{ fontSize: '16px', color: '#999' }}>/100</span></div>
                        </div>
                        <div style={{ width: '120px', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${score}%`, height: '100%', backgroundColor: score > 80 ? '#22c55e' : score > 50 ? '#f59e0b' : '#ef4444', transition: 'width 0.5s ease' }} />
                        </div>
                    </div>
                    {suggestions.length > 0 && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #eee' }}>
                            <p style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }}>Top Improvements</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {suggestions.slice(0, 3).map((sug, i) => (
                                    <div key={i} style={{ fontSize: '12px', color: '#888', display: 'flex', gap: '6px' }}>
                                        <span style={{ color: '#f59e0b' }}>•</span> {sug}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section>
                        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', color: '#888' }}>Personal Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input type="text" placeholder="Name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} />
                            <input type="email" placeholder="Email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} />
                        </div>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', color: '#888' }}>Summary</h3>
                        <textarea value={resumeData.summary} onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))} style={{ minHeight: '100px' }} />
                    </section>

                    {/* Skills Section */}
                    <section className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: '#888' }}>Skills</h3>
                            <button
                                onClick={handleSuggestSkills}
                                disabled={isSuggesting}
                                className="btn btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                                {isSuggesting ? 'Suggesting...' : '✨ Suggest Skills'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Technical Skills ({resumeData.skills.technical.length})</label>
                                <TagInput
                                    tags={resumeData.skills.technical}
                                    onAdd={(tag) => handleTagChange('skills', 'technical', tag, true)}
                                    onRemove={(tag) => handleTagChange('skills', 'technical', tag, false)}
                                    placeholder="Add tech skill (Enter)"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Soft Skills ({resumeData.skills.soft.length})</label>
                                <TagInput
                                    tags={resumeData.skills.soft}
                                    onAdd={(tag) => handleTagChange('skills', 'soft', tag, true)}
                                    onRemove={(tag) => handleTagChange('skills', 'soft', tag, false)}
                                    placeholder="Add soft skill (Enter)"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Tools & Technologies ({resumeData.skills.tools.length})</label>
                                <TagInput
                                    tags={resumeData.skills.tools}
                                    onAdd={(tag) => handleTagChange('skills', 'tools', tag, true)}
                                    onRemove={(tag) => handleTagChange('skills', 'tools', tag, false)}
                                    placeholder="Add tool (Enter)"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', color: '#888' }}>Projects</h3>
                            <button className="btn btn-secondary" onClick={() => addEntry('projects')}>+ Add Project</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {resumeData.projects.map((proj, idx) => (
                                <div key={proj.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <div
                                        onClick={() => toggleProject(proj.id)}
                                        style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#f9fafb' }}
                                    >
                                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{proj.name || 'New Project'}</span>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeEntry('projects', proj.id); }}
                                                style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}
                                            >Delete</button>
                                            <span style={{ transform: proj.isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }}>▼</span>
                                        </div>
                                    </div>
                                    {proj.isOpen && (
                                        <div style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <input type="text" placeholder="Project Title" value={proj.name} onChange={(e) => updateNestedField('projects', idx, 'name', e.target.value)} />
                                            <div style={{ position: 'relative' }}>
                                                <textarea
                                                    placeholder="Project description..."
                                                    value={proj.description}
                                                    maxLength={200}
                                                    onChange={(e) => updateNestedField('projects', idx, 'description', e.target.value)}
                                                />
                                                <div style={{ textAlign: 'right', fontSize: '10px', color: '#999', marginTop: '4px' }}>{proj.description.length}/200</div>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '8px' }}>Tech Stack</label>
                                                <TagInput
                                                    tags={proj.techStack}
                                                    onAdd={(tag) => handleTagChange(idx, null, tag, true)}
                                                    onRemove={(tag) => handleTagChange(idx, null, tag, false)}
                                                    placeholder="Add tech (Enter)"
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <input type="text" placeholder="Live URL (Optional)" value={proj.liveUrl} onChange={(e) => updateNestedField('projects', idx, 'liveUrl', e.target.value)} />
                                                <input type="text" placeholder="GitHub URL (Optional)" value={proj.githubUrl} onChange={(e) => updateNestedField('projects', idx, 'githubUrl', e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Right: Preview Panel */}
            <div style={{ width: '50%', padding: '60px', backgroundColor: '#f3f4f6', overflowY: 'auto', position: 'relative' }}>
                {/* 1. Template Picker */}
                <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: '#666' }}>Choose Template</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {[
                            {
                                name: 'Classic', icon: <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', padding: '10px' }}>
                                    <div style={{ borderBottom: '2px solid #ddd', height: '10px', marginBottom: '8px' }} />
                                    <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '80%', marginBottom: '4px' }} />
                                    <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '90%', marginBottom: '4px' }} />
                                    <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '70%' }} />
                                </div>
                            },
                            {
                                name: 'Modern', icon: <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex' }}>
                                    <div style={{ width: '35%', backgroundColor: '#e5e7eb', height: '100%' }} />
                                    <div style={{ width: '65%', padding: '10px' }}>
                                        <div style={{ backgroundColor: '#ddd', height: '8px', width: '60%', marginBottom: '8px' }} />
                                        <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '90%', marginBottom: '4px' }} />
                                        <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '80%' }} />
                                    </div>
                                </div>
                            },
                            {
                                name: 'Minimal', icon: <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', padding: '15px' }}>
                                    <div style={{ backgroundColor: '#ddd', height: '12px', width: '40%', marginBottom: '12px' }} />
                                    <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '90%', marginBottom: '4px' }} />
                                    <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '85%', marginBottom: '4px' }} />
                                    <div style={{ backgroundColor: '#f0f0f0', height: '4px', width: '90%' }} />
                                </div>
                            }
                        ].map(t => (
                            <div
                                key={t.name}
                                onClick={() => setActiveTemplate(t.name)}
                                style={{
                                    width: '120px', height: '160px', borderRadius: '8px', border: activeTemplate === t.name ? `2px solid #2563eb` : '2px solid transparent',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: '0.2s'
                                }}
                            >
                                {t.icon}
                                <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '8px', backgroundColor: 'rgba(255,255,255,0.9)', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>{t.name}</div>
                                {activeTemplate === t.name && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '12px' }}>✓</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Color Theme Picker */}
                <div style={{ marginBottom: '40px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', color: '#666' }}>Accent Color</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                            { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
                            { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
                            { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
                            { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
                            { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' }
                        ].map(c => (
                            <button
                                key={c.name}
                                onClick={() => setAccentColor(c.value)}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '50%', backgroundColor: c.value, border: accentColor === c.value ? '2px solid #111' : '2px solid transparent',
                                    padding: 0, cursor: 'pointer', outline: accentColor === c.value ? '2px solid #fff' : 'none', transition: '0.2s'
                                }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Export / Actions */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <button
                        onClick={() => showToast("PDF export ready! Check your downloads.")}
                        className="btn btn-primary"
                        style={{ padding: '12px 24px', backgroundColor: accentColor, borderRadius: '6px', fontWeight: 'bold' }}
                    >
                        Download PDF
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.open('/preview', '_blank')} style={{ borderRadius: '6px' }}>Open Full Preview</button>
                </div>

                {/* A4 Preview Container */}
                <div style={{
                    aspectRatio: '1 / 1.414', width: '100%', backgroundColor: '#FFF', padding: '60px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    display: 'flex', flexDirection: 'column', gap: '32px', fontFamily: activeTemplate === 'Classic' ? 'serif' : 'var(--font-sans)',
                    color: '#111'
                }}>
                    {/* Template Rendering Logic */}
                    {activeTemplate === 'Classic' && (
                        <>
                            <header style={{ textAlign: 'center', borderBottom: `2px solid ${accentColor}`, paddingBottom: '20px' }}>
                                <h1 style={{ fontSize: '32px', margin: 0, textTransform: 'uppercase', letterSpacing: '4px', color: accentColor }}>{resumeData.personalInfo.name || 'YOUR NAME'}</h1>
                                <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>{resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</div>
                            </header>
                            <section>
                                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '8px', color: accentColor }}>Summary</h4>
                                <p style={{ fontSize: '12px', margin: 0 }}>{resumeData.summary}</p>
                            </section>
                            <section>
                                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '12px', color: accentColor }}>Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {[...resumeData.skills.technical, ...resumeData.skills.soft, ...resumeData.skills.tools].map(tag => (
                                        <span key={tag} style={{ padding: '3px 8px', backgroundColor: '#f9fafb', border: '1px solid #eee', borderRadius: '4px', fontSize: '11px' }}>{tag}</span>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {activeTemplate === 'Modern' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', height: '100%' }}>
                            <div style={{ backgroundColor: accentColor, color: '#fff', padding: '30px', borderRadius: '4px' }}>
                                <h1 style={{ fontSize: '24px', textTransform: 'uppercase', marginBottom: '20px' }}>{resumeData.personalInfo.name || 'NAME'}</h1>
                                <div style={{ fontSize: '11px', marginBottom: '30px' }}>{resumeData.personalInfo.email}<br />{resumeData.personalInfo.phone}</div>
                                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px', marginBottom: '12px' }}>Skills</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {[...resumeData.skills.technical, ...resumeData.skills.soft].map(tag => (<span key={tag} style={{ fontSize: '11px' }}>• {tag}</span>))}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: accentColor, marginBottom: '12px' }}>Summary</h4>
                                <p style={{ fontSize: '12px' }}>{resumeData.summary}</p>
                                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: accentColor, marginTop: '30px', marginBottom: '12px' }}>Work Experience</h4>
                                {resumeData.experience.map(e => <div key={e.id} style={{ marginBottom: '16px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{e.company}</div>
                                    <div style={{ fontSize: '11px', color: '#666' }}>{e.position}</div>
                                </div>)}
                            </div>
                        </div>
                    )}

                    {activeTemplate === 'Minimal' && (
                        <>
                            <div style={{ marginBottom: '40px' }}>
                                <h1 style={{ fontSize: '36px', margin: 0, fontWeight: '200' }}>{resumeData.personalInfo.name || 'NAME'}</h1>
                                <div style={{ fontSize: '13px', color: '#666', marginTop: '10px' }}>{resumeData.personalInfo.email} • {resumeData.personalInfo.location}</div>
                            </div>
                            <section>
                                <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#444' }}>{resumeData.summary}</p>
                            </section>
                            <section style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {[...resumeData.skills.technical, ...resumeData.skills.tools].map(tag => (
                                        <span key={tag} style={{ color: accentColor, fontSize: '12px', fontWeight: 'bold' }}>#{tag}</span>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                {/* Toast Notification */}
                {toast && (
                    <div style={{
                        position: 'fixed', bottom: '40px', right: '40px', padding: '16px 24px',
                        backgroundColor: '#111', color: '#fff', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                        fontSize: '14px', fontWeight: '500', animation: 'fadeIn 0.3s ease', zIndex: 1000,
                        borderLeft: `4px solid ${accentColor}`
                    }}>
                        {toast}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuilderPage;
