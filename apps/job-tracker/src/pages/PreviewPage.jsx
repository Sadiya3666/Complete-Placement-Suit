import React from 'react';

const PreviewPage = () => {
    // This would normally get data from a context or props, for now, we'll use a placeholder or dummy data
    const dummyData = {
        personalInfo: {
            name: 'ALEX RIVERA',
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
        skills: 'React, TypeScript, Node.js, Go, AWS, Docker, Kubernetes, GraphQL, PostgreSQL',
        links: { github: 'github.com/alexrivera', linkedin: 'linkedin.com/in/alexrivera' }
    };

    return (
        <div style={{ padding: '60px 20px', backgroundColor: '#F9F9F9', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <div style={{
                width: '100%',
                maxWidth: '850px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '80px',
                fontFamily: 'serif', // Deep premium typography
                color: '#000',
                lineHeight: '1.5'
            }}>
                {/* Header */}
                <header style={{ borderBottom: '1px solid #000', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '38px', margin: '0 0 10px 0', letterSpacing: '4px', fontWeight: '400' }}>{dummyData.personalInfo.name}</h1>
                    <div style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {dummyData.personalInfo.location} • {dummyData.personalInfo.email} • {dummyData.personalInfo.phone}
                    </div>
                    <div style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '5px' }}>
                        {dummyData.links.linkedin} • {dummyData.links.github}
                    </div>
                </header>

                {/* Summary */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '14px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Professional Summary</h2>
                    <p style={{ fontSize: '13px' }}>{dummyData.summary}</p>
                </section>

                {/* Experience */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '14px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '15px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Professional Experience</h2>
                    {dummyData.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '14px' }}>
                                <span>{exp.company}</span>
                                <span>{exp.duration}</span>
                            </div>
                            <div style={{ fontStyle: 'italic', fontSize: '13px', marginBottom: '8px' }}>{exp.position}</div>
                            <p style={{ fontSize: '13px', margin: 0 }}>{exp.description}</p>
                        </div>
                    ))}
                </section>

                {/* Education */}
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '14px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Education</h2>
                    {dummyData.education.map((edu, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                            <span><strong>{edu.school}</strong> — {edu.degree}</span>
                            <span>{edu.year}</span>
                        </div>
                    ))}
                </section>

                {/* Skills */}
                <section>
                    <h2 style={{ fontSize: '14px', borderBottom: '1px solid #000', paddingBottom: '3px', marginBottom: '10px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Core Competencies</h2>
                    <p style={{ fontSize: '13px' }}>{dummyData.skills}</p>
                </section>
            </div>
        </div>
    );
};

export default PreviewPage;
