import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [preferences, setPreferences] = useState({
        roleKeywords: '',
        preferredLocations: '',
        preferredMode: {
            Remote: false,
            Hybrid: false,
            Onsite: false
        },
        experienceLevel: 'Fresher',
        skills: '',
        minMatchScore: 40
    });

    const [toast, setToast] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('jobTrackerPreferences');
        if (saved) {
            setPreferences(JSON.parse(saved));
        }
    }, []);

    const handleChange = (field, value) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleModeChange = (mode) => {
        setPreferences(prev => ({
            ...prev,
            preferredMode: {
                ...prev.preferredMode,
                [mode]: !prev.preferredMode[mode]
            }
        }));
    };

    const handleSave = () => {
        localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));
        setToast('Preferences saved successfully!');
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-5) var(--spacing-3)' }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: '80px', right: '20px',
                    backgroundColor: 'var(--color-success)', color: 'white',
                    padding: '12px 24px', borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1000,
                    animation: 'fadeIn 0.3s'
                }}>
                    {toast}
                </div>
            )}

            <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-3xl)',
                letterSpacing: '-1px',
                marginBottom: 'var(--spacing-2)'
            }}>
                Preferences.
            </h1>
            <p style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-5)',
                maxWidth: '600px'
            }}>
                Refine your job signals to receive only what matters.
            </p>

            <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {/* Role Keywords */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Target Roles</label>
                    <input
                        type="text"
                        placeholder="e.g. Senior Frontend Engineer, Product Manager"
                        value={preferences.roleKeywords}
                        onChange={(e) => handleChange('roleKeywords', e.target.value)}
                    />
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                        Separate multiple keywords with commas. Used for +25 match score.
                    </span>
                </div>

                {/* Locations */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Preferred Locations</label>
                    <input
                        type="text"
                        placeholder="e.g. Bengaluru, Hyderabad, Pune"
                        value={preferences.preferredLocations}
                        onChange={(e) => handleChange('preferredLocations', e.target.value)}
                    />
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                        Used for +15 match score.
                    </span>
                </div>

                {/* Mode */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Work Mode</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                        {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                            <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={preferences.preferredMode[mode]}
                                    onChange={() => handleModeChange(mode)}
                                    style={{ accentColor: 'var(--color-accent)' }}
                                />
                                {mode}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Experience Level */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Experience Level</label>
                    <select
                        value={preferences.experienceLevel}
                        onChange={(e) => handleChange('experienceLevel', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-white)',
                            fontFamily: 'var(--font-sans)',
                            fontSize: 'var(--text-base)'
                        }}
                    >
                        <option value="Fresher">Fresher</option>
                        <option value="0-1">0-1 Years</option>
                        <option value="1-3">1-3 Years</option>
                        <option value="3-5">3-5 Years</option>
                        <option value="5-8">5-8 Years</option>
                        <option value="8+">8+ Years</option>
                    </select>
                </div>

                {/* Skills */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>My Skills</label>
                    <input
                        type="text"
                        placeholder="e.g. React, Python, Java, SQL"
                        value={preferences.skills}
                        onChange={(e) => handleChange('skills', e.target.value)}
                    />
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                        Comma-separated. Used for +15 match score.
                    </span>
                </div>

                {/* Min Match Score */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Minimum Match Score Threshold: <span style={{ color: 'var(--color-accent)' }}>{preferences.minMatchScore}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={preferences.minMatchScore}
                        onChange={(e) => handleChange('minMatchScore', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                    />
                </div>

                <div style={{ paddingTop: 'var(--spacing-3)' }}>
                    <button onClick={handleSave} className="btn btn-primary">
                        Save Preferences
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('jobTrackerPreferences');
                            setPreferences({
                                roleKeywords: '',
                                preferredLocations: '',
                                preferredMode: { Remote: false, Hybrid: false, Onsite: false },
                                experienceLevel: 'Fresher',
                                skills: '',
                                minMatchScore: 40
                            });
                            setToast('Preferences cleared!');
                            setTimeout(() => setToast(null), 3000);
                        }}
                        className="btn btn-secondary"
                        style={{ marginLeft: '12px', color: '#666' }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
