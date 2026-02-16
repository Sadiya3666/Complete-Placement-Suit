import React, { useState } from 'react';

const BuilderPage = () => {
    const [resumeData, setResumeData] = useState({
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [{ school: '', degree: '', year: '' }],
        experience: [{ company: '', position: '', duration: '', description: '' }],
        projects: [{ name: '', description: '' }],
        skills: '',
        links: { github: '', linkedin: '' }
    });

    const loadSampleData = () => {
        setResumeData({
            personalInfo: {
                name: 'Alex Rivera',
                email: 'alex.rivera@example.com',
                phone: '+1 (555) 012-3456',
                location: 'San Francisco, CA'
            },
            summary: 'Senior Software Engineer with 8+ years of experience in full-stack development. Specialist in React, Node.js, and cloud architecture. Passionate about building scalable, user-centric applications and mentoring junior developers.',
            education: [
                { school: 'Stanford University', degree: 'M.S. in Computer Science', year: '2016' },
                { school: 'UC Berkeley', degree: 'B.S. in Electrical Engineering', year: '2014' }
            ],
            experience: [
                {
                    company: 'TechFlow Systems',
                    position: 'Lead Developer',
                    duration: '2019 - Present',
                    description: 'Directing a team of 12 engineers in the migration of legacy services to a microservices architecture using AWS and Go. Reduced system latency by 45%.'
                },
                {
                    company: 'InnovaSoft',
                    position: 'Full Stack Engineer',
                    duration: '2016 - 2019',
                    description: 'Developed and maintained 15+ React-based web applications. Implemented automated testing reducing production bugs by 30%.'
                }
            ],
            projects: [
                { name: 'SkyQuery', description: 'Open-source distributed database management tool with over 5k stars on GitHub.' },
                { name: 'PulseHealth', description: 'IoT-integrated wellness platform tracking real-time health metrics for over 50k active users.' }
            ],
            skills: 'React, TypeScript, Node.js, Go, AWS, Docker, Kubernetes, GraphQL, PostgreSQL',
            links: { github: 'github.com/alexrivera', linkedin: 'linkedin.com/in/alexrivera' }
        });
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
            education: { school: '', degree: '', year: '' },
            experience: { company: '', position: '', duration: '', description: '' },
            projects: { name: '', description: '' }
        };
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], templates[section]]
        }));
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--color-bg)' }}>
            {/* Left: Form Area (50%) */}
            <div style={{
                width: '50%',
                padding: '40px',
                overflowY: 'auto',
                borderRight: '1px solid var(--color-border)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px' }}>Resume Builder</h1>
                    <button className="btn btn-secondary" onClick={loadSampleData}>Load Sample Data</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Personal Info */}
                    <section>
                        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--color-accent)' }}>Personal Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input type="text" placeholder="Full Name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} />
                            <input type="email" placeholder="Email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} />
                            <input type="text" placeholder="Phone" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} />
                            <input type="text" placeholder="Location" name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} />
                        </div>
                    </section>

                    {/* Summary */}
                    <section>
                        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--color-accent)' }}>Professional Summary</h3>
                        <textarea
                            placeholder="Brief professional overview..."
                            value={resumeData.summary}
                            onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                            style={{ minHeight: '120px' }}
                        />
                    </section>

                    {/* Experience */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-accent)' }}>Experience</h3>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => addEntry('experience')}>+ Add</button>
                        </div>
                        {resumeData.experience.map((exp, index) => (
                            <div key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-white)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <input type="text" placeholder="Company" value={exp.company} onChange={(e) => {
                                        const newExp = [...resumeData.experience];
                                        newExp[index].company = e.target.value;
                                        setResumeData(prev => ({ ...prev, experience: newExp }));
                                    }} />
                                    <input type="text" placeholder="Position" value={exp.position} onChange={(e) => {
                                        const newExp = [...resumeData.experience];
                                        newExp[index].position = e.target.value;
                                        setResumeData(prev => ({ ...prev, experience: newExp }));
                                    }} />
                                </div>
                                <input type="text" placeholder="Duration (e.g. 2019 - Present)" value={exp.duration} style={{ marginBottom: '12px' }} onChange={(e) => {
                                    const newExp = [...resumeData.experience];
                                    newExp[index].duration = e.target.value;
                                    setResumeData(prev => ({ ...prev, experience: newExp }));
                                }} />
                                <textarea placeholder="Key responsibilities and achievements..." value={exp.description} onChange={(e) => {
                                    const newExp = [...resumeData.experience];
                                    newExp[index].description = e.target.value;
                                    setResumeData(prev => ({ ...prev, experience: newExp }));
                                }} />
                            </div>
                        ))}
                    </section>

                    {/* Education */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-accent)' }}>Education</h3>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => addEntry('education')}>+ Add</button>
                        </div>
                        {resumeData.education.map((edu, index) => (
                            <div key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-white)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '12px' }}>
                                    <input type="text" placeholder="School" value={edu.school} onChange={(e) => {
                                        const newEdu = [...resumeData.education];
                                        newEdu[index].school = e.target.value;
                                        setResumeData(prev => ({ ...prev, education: newEdu }));
                                    }} />
                                    <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => {
                                        const newEdu = [...resumeData.education];
                                        newEdu[index].degree = e.target.value;
                                        setResumeData(prev => ({ ...prev, education: newEdu }));
                                    }} />
                                    <input type="text" placeholder="Year" value={edu.year} onChange={(e) => {
                                        const newEdu = [...resumeData.education];
                                        newEdu[index].year = e.target.value;
                                        setResumeData(prev => ({ ...prev, education: newEdu }));
                                    }} />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Projects */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-accent)' }}>Projects</h3>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => addEntry('projects')}>+ Add</button>
                        </div>
                        {resumeData.projects.map((proj, index) => (
                            <div key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-white)' }}>
                                <input type="text" placeholder="Project Name" value={proj.name} style={{ marginBottom: '12px' }} onChange={(e) => {
                                    const newProj = [...resumeData.projects];
                                    newProj[index].name = e.target.value;
                                    setResumeData(prev => ({ ...prev, projects: newProj }));
                                }} />
                                <textarea placeholder="Project description..." value={proj.description} onChange={(e) => {
                                    const newProj = [...resumeData.projects];
                                    newProj[index].description = e.target.value;
                                    setResumeData(prev => ({ ...prev, projects: newProj }));
                                }} />
                            </div>
                        ))}
                    </section>

                    {/* Skills */}
                    <section>
                        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--color-accent)' }}>Skills</h3>
                        <input
                            type="text"
                            placeholder="React, Node.js, Python, AWS..."
                            value={resumeData.skills}
                            onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                        />
                        <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Separate skills with commas.</p>
                    </section>

                    {/* Links */}
                    <section>
                        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--color-accent)' }}>Links</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input type="text" placeholder="GitHub URL" value={resumeData.links.github} onChange={(e) => setResumeData(prev => ({ ...prev, links: { ...prev.links, github: e.target.value } }))} />
                            <input type="text" placeholder="LinkedIn URL" value={resumeData.links.linkedin} onChange={(e) => setResumeData(prev => ({ ...prev, links: { ...prev.links, linkedin: e.target.value } }))} />
                        </div>
                    </section>
                </div>
            </div>

            {/* Right: Live Preview Panel (50%) */}
            <div style={{
                width: '50%',
                padding: '60px',
                backgroundColor: '#FFFFFF',
                overflowY: 'auto'
            }}>
                <div style={{
                    aspectRatio: '1 / 1.414',
                    width: '100%',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    border: '1px solid #f0f0f0',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    backgroundColor: '#FFF'
                }}>
                    {/* Placeholder for now as requested - but showing structured shell */}
                    <div style={{ borderBottom: '2px solid #000', paddingBottom: '16px' }}>
                        <h2 style={{ fontSize: '32px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>{resumeData.personalInfo.name || 'YOUR NAME'}</h2>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', marginTop: '8px' }}>
                            <span>{resumeData.personalInfo.email || 'email@example.com'}</span>
                            <span>•</span>
                            <span>{resumeData.personalInfo.phone || 'Phone'}</span>
                            <span>•</span>
                            <span>{resumeData.personalInfo.location || 'Location'}</span>
                        </div>
                    </div>

                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        <p style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '8px' }}>Summary</p>
                        <p>{resumeData.summary || 'Write a brief professional summary...'}</p>
                    </div>

                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        <p style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '8px' }}>Experience</p>
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                                    <span>{exp.company || 'Company Name'}</span>
                                    <span>{exp.duration || 'Duration'}</span>
                                </div>
                                <div style={{ fontStyle: 'italic' }}>{exp.position || 'Position'}</div>
                                <div style={{ color: '#555', marginTop: '4px' }}>{exp.description || 'Describe your impact...'}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        <p style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '8px' }}>Education</p>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span><strong>{edu.school || 'School Name'}</strong>, {edu.degree || 'Degree'}</span>
                                <span>{edu.year || 'Year'}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        <p style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #eee', paddingBottom: '4px', marginBottom: '8px' }}>Skills</p>
                        <p>{resumeData.skills || 'List your key skills...'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuilderPage;
