import React, { useState, useEffect, useMemo } from 'react';

const CircularProgress = ({ score, size = 120, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s <= 40) return '#ef4444'; // Red
        if (s <= 70) return '#f59e0b'; // Amber
        return '#22c55e'; // Green
    };

    const getLabel = (s) => {
        if (s <= 40) return 'Needs Work';
        if (s <= 70) return 'Getting There';
        return 'Strong Resume';
    };

    const color = getColor(score);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', fontWeight: '800', color: color, flexDirection: 'column'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                        {score}<span style={{ fontSize: '12px', color: '#999' }}>%</span>
                    </div>
                </div>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {getLabel(score)}
            </div>
        </div>
    );
};

const PreviewPage = () => {
    // 1) Load from LocalStorage
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (!saved) return null;

        const parsed = JSON.parse(saved);
        // Ensure skills is object for backward compatibility during transitions
        if (typeof parsed.skills === 'string') {
            parsed.skills = {
                technical: parsed.skills.split(',').map(s => s.trim()).filter(Boolean),
                soft: [],
                tools: []
            };
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

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // 2) Sync State
    useEffect(() => {
        localStorage.setItem('resumeActiveTemplate', activeTemplate);
    }, [activeTemplate]);

    useEffect(() => {
        localStorage.setItem('resumeAccentColor', accentColor);
    }, [accentColor]);

    // ATS Scoring Logic
    const { score, suggestions } = useMemo(() => {
        if (!resumeData) return { score: 0, suggestions: [] };

        let s = 0;
        const sugs = [];
        const actionVerbs = ['built', 'led', 'designed', 'improved', 'implemented', 'developed', 'created', 'optimized', 'managed', 'developed'];

        if (resumeData.personalInfo.name.trim()) s += 10;
        else sugs.push("Add your full name (+10 points)");

        if (resumeData.personalInfo.email.trim()) s += 10;
        else sugs.push("Add your email address (+10 points)");

        if (resumeData.personalInfo.phone.trim()) s += 5;
        else sugs.push("Add your phone number (+5 points)");

        if (resumeData.links.linkedin.trim()) s += 5;
        else sugs.push("Add LinkedIn profile (+5 points)");

        if (resumeData.links.github.trim()) s += 5;
        else sugs.push("Add GitHub profile (+5 points)");

        if (resumeData.summary.trim().length > 50) s += 10;
        else sugs.push("Make summary longer than 50 chars (+10 points)");

        const hasActionVerb = actionVerbs.some(verb => resumeData.summary.toLowerCase().includes(verb));
        if (hasActionVerb) s += 10;
        else sugs.push("Use action verbs in your summary (+10 points)");

        const hasExp = resumeData.experience.some(e =>
            e.company.trim() &&
            e.description.trim().length > 10 &&
            (e.description.includes('\n') || e.description.includes('•') || e.description.includes('-'))
        );
        if (hasExp) s += 15;
        else sugs.push("Add experience with detailed bullets (+15 points)");

        const hasEdu = resumeData.education.some(e => e.school.trim());
        if (hasEdu) s += 10;
        else sugs.push("Add education entry (+10 points)");

        const totalSkills = (resumeData.skills.technical?.length || 0) + (resumeData.skills.soft?.length || 0) + (resumeData.skills.tools?.length || 0);
        if (totalSkills >= 5) s += 10;
        else sugs.push("Add at least 5 skills (+10 points)");

        const hasProj = resumeData.projects && resumeData.projects.some(p => p.name.trim());
        if (hasProj) s += 10;
        else sugs.push("Add at least one project (+10 points)");

        return { score: Math.min(100, s), suggestions: sugs };
    }, [resumeData]);

    // Validation Check
    const isIncomplete = useMemo(() => {
        if (!resumeData) return true;
        const hasName = resumeData.personalInfo.name.trim().length > 0;
        const hasExperience = resumeData.experience.some(e => e.company.trim().length > 0);
        const hasProjects = resumeData.projects && resumeData.projects.some(p => p.name.trim().length > 0);
        return !hasName || (!hasExperience && !hasProjects);
    }, [resumeData]);

    const handleDownload = () => {
        showToast("PDF export ready! Check your downloads.");
        // Delay print dialog slightly so toast can be seen
        setTimeout(() => window.print(), 500);
    };

    const handleCopyText = () => {
        if (!resumeData) return;

        const filterEmpty = (list, key) => list.filter(item => item[key]?.trim());
        const validExp = filterEmpty(resumeData.experience, 'company');
        const validProj = filterEmpty(resumeData.projects || [], 'name');
        const validEdu = filterEmpty(resumeData.education, 'school');

        let text = `${resumeData.personalInfo.name.toUpperCase()}\n`;
        text += `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}\n`;
        if (resumeData.links.linkedin || resumeData.links.github) {
            text += `${resumeData.links.linkedin} | ${resumeData.links.github}\n`;
        }

        if (resumeData.summary) {
            text += `\nSUMMARY\n${resumeData.summary}\n`;
        }

        if (validExp.length > 0) {
            text += `\nEXPERIENCE\n` + validExp.map(exp => `
${exp.company.toUpperCase()} - ${exp.position}
${exp.duration}
${exp.description}
`).join('\n');
        }

        if (validProj.length > 0) {
            text += `\nPROJECTS\n` + validProj.map(proj => `
${proj.name.toUpperCase()}
${proj.description}
Tech Stack: ${proj.techStack.join(', ')}
${proj.liveUrl ? 'Live: ' + proj.liveUrl : ''}
${proj.githubUrl ? 'Code: ' + proj.githubUrl : ''}
`).join('\n');
        }

        if (validEdu.length > 0) {
            text += `\nEDUCATION\n` + validEdu.map(edu => `
${edu.school} - ${edu.degree} (${edu.year})
`).join('\n');
        }

        const allSkills = [];
        if (resumeData.skills.technical.length) allSkills.push(`Technical: ${resumeData.skills.technical.join(', ')}`);
        if (resumeData.skills.soft.length) allSkills.push(`Soft Skills: ${resumeData.skills.soft.join(', ')}`);
        if (resumeData.skills.tools.length) allSkills.push(`Tools: ${resumeData.skills.tools.join(', ')}`);

        if (allSkills.length > 0) {
            text += `\nSKILLS\n${allSkills.join('\n')}\n`;
        }

        navigator.clipboard.writeText(text.trim());
        alert('Resume copied to clipboard as plain text!');
    };

    if (!resumeData) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
                <h2>No resume data found.</h2>
                <p>Please go back to the Builder and add your details.</p>
            </div>
        );
    }

    const SkillBadge = ({ tag }) => (
        <span style={{
            padding: '3px 10px',
            backgroundColor: '#f9fafb',
            border: '1px solid #eee',
            borderRadius: '16px',
            fontSize: '11px',
            color: '#374151',
            fontWeight: '500'
        }}>{tag}</span>
    );

    const ProjectCard = ({ proj }) => (
        <div style={{
            border: '1px solid #f0f0f0',
            padding: '20px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: '#fff'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: '700', fontSize: '15px' }}>{proj.name}</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>🔗 Live</a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>📂 Code</a>}
                </div>
            </div>
            <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 15px 0', lineHeight: '1.6' }}>{proj.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {proj.techStack.map(t => (
                    <span key={t} style={{ fontSize: '10px', backgroundColor: '#111', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>{t}</span>
                ))}
            </div>
        </div>
    );

    const SkillsDisplay = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(resumeData.skills).map(([category, tags]) => tags.length > 0 && (
                <div key={category}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: '700' }}>{category}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {tags.map(tag => <SkillBadge key={tag} tag={tag} />)}
                    </div>
                </div>
            ))}
        </div>
    );

    const ATSReport = () => (
        <div className="no-print" style={{
            maxWidth: '850px', margin: '40px auto', padding: '40px', backgroundColor: '#fff',
            borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'grid',
            gridTemplateColumns: '200px 1fr', gap: '40px', alignItems: 'center'
        }}>
            <CircularProgress score={score} />
            <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>Improvement Suggestions</h3>
                {suggestions.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {suggestions.map((sug, i) => (
                            <div key={i} style={{ fontSize: '14px', color: '#666', display: 'flex', gap: '8px', alignItems: 'start' }}>
                                <span style={{ color: '#f59e0b' }}>•</span>
                                <span>{sug}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ color: '#22c55e', fontWeight: '600', fontSize: '14px' }}>✨ Your resume is fully optimized!</div>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '60px 20px', backgroundColor: '#F3F4F6', minHeight: '100vh', position: 'relative' }}>
            {/* Warning Banner */}
            {isIncomplete && (
                <div className="no-print" style={{
                    maxWidth: '850px',
                    margin: '0 auto 24px auto',
                    padding: '12px 20px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#92400e',
                    fontSize: '14px'
                }}>
                    <span style={{ fontSize: '18px' }}>⚠️</span>
                    <span><strong>Your resume may look incomplete.</strong> Consider adding your name and at least one experience or project.</span>
                </div>
            )}

            {/* ATS Score Display */}
            <ATSReport />

            {/* Actions */}
            <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }} className="template-switcher">
                    {['Classic', 'Modern', 'Minimal'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTemplate(t)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                backgroundColor: activeTemplate === t ? '#111' : '#fff',
                                color: activeTemplate === t ? '#fff' : '#111',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleCopyText} style={{
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: '1px solid #111',
                        backgroundColor: 'white',
                        color: '#111',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        Copy as Text
                    </button>
                    <button onClick={handleDownload} style={{
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: accentColor,
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Resume UI */}
            <div className="resume-container" style={{
                width: '100%',
                maxWidth: '850px',
                margin: '0 auto',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 40px 100px rgba(0,0,0,0.06)',
                padding: activeTemplate === 'Minimal' ? '100px 80px' : '80px',
                color: '#000',
                lineHeight: '1.6',
                minHeight: '1100px',
                fontFamily: activeTemplate === 'Classic' ? 'serif' : 'var(--font-sans)',
            }}>

                {/* CLASSIC TEMPLATE */}
                {activeTemplate === 'Classic' && (
                    <>
                        <header style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '42px', margin: '0 0 10px 0', letterSpacing: '4px', fontWeight: '400', textTransform: 'uppercase', color: accentColor }}>{resumeData.personalInfo.name || 'YOUR NAME'}</h1>
                            <div style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#444' }}>
                                {resumeData.personalInfo.location} {resumeData.personalInfo.location && '•'} {resumeData.personalInfo.email} {resumeData.personalInfo.email && '•'} {resumeData.personalInfo.phone}
                            </div>
                            {(resumeData.links.github || resumeData.links.linkedin) && (
                                <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '8px', color: '#666' }}>
                                    {resumeData.links.linkedin} {resumeData.links.linkedin && resumeData.links.github && '•'} {resumeData.links.github}
                                </div>
                            )}
                        </header>

                        {resumeData.summary && (
                            <section className="resume-section" style={{ marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '14px', borderBottom: `1px solid ${accentColor}`, color: accentColor, paddingBottom: '3px', marginBottom: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Professional Summary</h2>
                                <p style={{ fontSize: '13px', margin: 0 }}>{resumeData.summary}</p>
                            </section>
                        )}

                        <section className="resume-section" style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '14px', borderBottom: `1px solid ${accentColor}`, color: accentColor, paddingBottom: '3px', marginBottom: '15px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Core Competencies</h2>
                            <SkillsDisplay />
                        </section>

                        {resumeData.experience.some(e => e.company.trim()) && (
                            <section className="resume-section" style={{ marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '14px', borderBottom: `1px solid ${accentColor}`, color: accentColor, paddingBottom: '3px', marginBottom: '15px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Professional Experience</h2>
                                {resumeData.experience.map((exp, i) => exp.company && (
                                    <div key={i} style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '14px' }}>
                                            <span>{exp.company}</span>
                                            <span style={{ fontWeight: '400' }}>{exp.duration}</span>
                                        </div>
                                        <div style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '8px' }}>{exp.position}</div>
                                        <p style={{ fontSize: '13px', margin: 0, whiteSpace: 'pre-line' }}>{exp.description}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {resumeData.projects.some(p => p.name.trim()) && (
                            <section className="resume-section" style={{ marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '14px', borderBottom: `1px solid ${accentColor}`, color: accentColor, paddingBottom: '3px', marginBottom: '20px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Key Projects</h2>
                                {resumeData.projects.map((proj, i) => proj.name && <ProjectCard key={i} proj={proj} />)}
                            </section>
                        )}

                        {resumeData.education.some(e => e.school.trim()) && (
                            <section className="resume-section" style={{ marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '14px', borderBottom: `1px solid ${accentColor}`, color: accentColor, paddingBottom: '3px', marginBottom: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Education</h2>
                                {resumeData.education.map((edu, i) => edu.school && (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                        <span><strong>{edu.school}</strong> — {edu.degree}</span>
                                        <span>{edu.year}</span>
                                    </div>
                                ))}
                            </section>
                        )}
                    </>
                )}

                {/* MODERN TEMPLATE */}
                {activeTemplate === 'Modern' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '60px' }}>
                        <aside style={{ borderRight: '1px solid #eee', paddingRight: '40px', position: 'relative' }}>
                            {/* Accent Sidebar background effect for modern look */}
                            <div style={{ position: 'absolute', top: '-80px', left: '-80px', right: 0, bottom: '-80px', backgroundColor: accentColor, opacity: 0.05, zIndex: 0 }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 40px 0', textTransform: 'uppercase', color: accentColor }}>
                                    {resumeData.personalInfo.name ? resumeData.personalInfo.name.split(' ').map((n, i) => <React.Fragment key={i}>{n}<br /></React.Fragment>) : 'YOUR NAME'}
                                </h1>

                                {(resumeData.personalInfo.email || resumeData.personalInfo.phone || resumeData.personalInfo.location) && (
                                    <div style={{ fontSize: '12px', marginBottom: '40px' }}>
                                        <h4 style={{ color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', opacity: 0.8 }}>Contact</h4>
                                        <div style={{ marginBottom: '8px' }}>{resumeData.personalInfo.email}</div>
                                        <div style={{ marginBottom: '8px' }}>{resumeData.personalInfo.phone}</div>
                                        <div>{resumeData.personalInfo.location}</div>
                                    </div>
                                )}

                                <div style={{ marginBottom: '40px' }}>
                                    <h4 style={{ color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', fontSize: '12px', opacity: 0.8 }}>Expertise</h4>
                                    <SkillsDisplay />
                                </div>

                                {resumeData.education.some(e => e.school.trim()) && (
                                    <div style={{ fontSize: '12px' }}>
                                        <h4 style={{ color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', opacity: 0.8 }}>Education</h4>
                                        {resumeData.education.map((edu, i) => edu.school && (
                                            <div key={i} style={{ marginBottom: '16px' }}>
                                                <div style={{ fontWeight: '700' }}>{edu.school}</div>
                                                <div>{edu.degree}</div>
                                                <div style={{ color: '#888', marginTop: '2px' }}>{edu.year}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </aside>

                        <main>
                            {resumeData.summary && (
                                <section className="resume-section" style={{ marginBottom: '50px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', color: accentColor }}>Profile</h4>
                                    <p style={{ fontSize: '14px', margin: 0 }}>{resumeData.summary}</p>
                                </section>
                            )}

                            {resumeData.experience.some(e => e.company.trim()) && (
                                <section className="resume-section" style={{ marginBottom: '50px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '25px', color: accentColor }}>Experience</h4>
                                    {resumeData.experience.map((exp, i) => exp.company && (
                                        <div key={i} style={{ marginBottom: '32px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '16px', fontWeight: '700' }}>{exp.company}</span>
                                                <span style={{ fontSize: '13px', color: '#888' }}>{exp.duration}</span>
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#555', marginBottom: '12px', fontWeight: '500' }}>{exp.position}</div>
                                            <p style={{ fontSize: '13px', color: '#333', whiteSpace: 'pre-line' }}>{exp.description}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {resumeData.projects.some(p => p.name.trim()) && (
                                <section className="resume-section">
                                    <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '25px', color: accentColor }}>Selected Work</h4>
                                    {resumeData.projects.map((proj, i) => proj.name && <ProjectCard key={i} proj={proj} />)}
                                </section>
                            )}
                        </main>
                    </div>
                )}

                {/* MINIMAL TEMPLATE */}
                {activeTemplate === 'Minimal' && (
                    <div>
                        <header style={{ marginBottom: '60px' }}>
                            <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', letterSpacing: '-1px' }}>{resumeData.personalInfo.name || 'NAME'}</h1>
                            <div style={{ display: 'flex', gap: '30px', fontSize: '14px', color: '#666' }}>
                                <span>{resumeData.personalInfo.email}</span>
                                <span>{resumeData.personalInfo.location}</span>
                                {resumeData.links.github && <span style={{ color: accentColor }}>{resumeData.links.github}</span>}
                            </div>
                        </header>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                            {resumeData.summary && (
                                <section className="resume-section">
                                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
                                        <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', color: accentColor }}>Profile</h3>
                                        <p style={{ fontSize: '15px', margin: 0 }}>{resumeData.summary}</p>
                                    </div>
                                </section>
                            )}

                            <section className="resume-section">
                                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
                                    <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: accentColor }}>Expertise</h3>
                                    <SkillsDisplay />
                                </div>
                            </section>

                            {resumeData.experience.some(e => e.company.trim()) && (
                                <section className="resume-section">
                                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
                                        <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: accentColor }}>Experience</h3>
                                        <div>
                                            {resumeData.experience.map((exp, i) => exp.company && (
                                                <div key={i} style={{ marginBottom: '40px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: '18px', fontWeight: '700' }}>{exp.company}</span>
                                                        <span style={{ fontSize: '14px', color: '#999' }}>{exp.duration}</span>
                                                    </div>
                                                    <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', color: accentColor, fontWeight: 'bold' }}>{exp.position}</div>
                                                    <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {resumeData.projects.some(p => p.name.trim()) && (
                                <section className="resume-section">
                                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
                                        <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: accentColor }}>Work Samples</h3>
                                        <div>
                                            {resumeData.projects.map((proj, i) => proj.name && <ProjectCard key={i} proj={proj} />)}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
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
    );
};

export default PreviewPage;
