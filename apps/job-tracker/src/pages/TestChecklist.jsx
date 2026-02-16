import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestChecklist = () => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState({});

    const TEST_ITEMS = [
        { id: 'prefs_persist', label: 'Preferences persist after refresh', tooltip: 'Set preferences in Settings, refresh page, verify they are still there.' },
        { id: 'match_score', label: 'Match score calculates correctly', tooltip: 'Verify a job has a score based on your keywords/location.' },
        { id: 'matches_toggle', label: '"Show only matches" toggle works', tooltip: 'Turn on toggle in Dashboard. Low scoring jobs should disappear.' },
        { id: 'save_persist', label: 'Save job persists after refresh', tooltip: 'Save a job, refresh Dashboard, check Saved tab.' },
        { id: 'apply_tab', label: 'Apply opens in new tab', tooltip: 'Click Apply. Should open a new browser tab.' },
        { id: 'status_persist', label: 'Status update persists after refresh', tooltip: 'Change status to Applied, refresh, verify it remains Applied.' },
        { id: 'status_filter', label: 'Status filter works correctly', tooltip: 'Filter by "Applied". Only applied jobs should show.' },
        { id: 'digest_logic', label: 'Digest generates top 10 by score', tooltip: 'Generate digest. Check if jobs are high scorers.' },
        { id: 'digest_persist', label: 'Digest persists for the day', tooltip: 'Refresh Digest page. The same list should appear.' },
        { id: 'console_errors', label: 'No console errors on main pages', tooltip: 'Open Developer Tools (F12) > Console. Navigate around. No red errors.' }
    ];

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('jobTrackerTestChecklist')) || {};
        setCheckedItems(saved);
    }, []);

    const handleCheck = (id) => {
        const updated = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(updated);
        localStorage.setItem('jobTrackerTestChecklist', JSON.stringify(updated));
    };

    const handleReset = () => {
        if (window.confirm('Reset all test status?')) {
            setCheckedItems({});
            localStorage.removeItem('jobTrackerTestChecklist');
        }
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const isComplete = passedCount === TEST_ITEMS.length;

    return (
        <div className="container" style={{ padding: 'var(--spacing-5) var(--spacing-3)', maxWidth: '800px' }}>
            <div style={{ marginBottom: '32px', borderBottom: '1px solid #eee', paddingBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '8px' }}>
                    Pre-Flight Checklist
                </h1>
                <p style={{ color: '#666', fontSize: '18px' }}>
                    Verify system integrity before shipping.
                </p>
            </div>

            {/* Status Header */}
            <div style={{
                backgroundColor: isComplete ? '#E8F5E9' : '#FFF3E0',
                padding: '24px',
                borderRadius: '8px',
                marginBottom: '32px',
                border: `1px solid ${isComplete ? '#C8E6C9' : '#FFE0B2'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: isComplete ? '#2E7D32' : '#EF6C00' }}>
                        Tests Passed: {passedCount} / {TEST_ITEMS.length}
                    </h2>
                    {!isComplete && (
                        <p style={{ margin: '8px 0 0 0', color: '#EF6C00', fontSize: '14px' }}>
                            Resolve all issues before shipping.
                        </p>
                    )}
                    {isComplete && (
                        <p style={{ margin: '8px 0 0 0', color: '#2E7D32', fontSize: '14px' }}>
                            All systems go. Ready for launch.
                        </p>
                    )}
                </div>

                {isComplete && (
                    <button
                        onClick={() => navigate('/jt/08-ship')}
                        className="btn btn-primary"
                        style={{ backgroundColor: '#2E7D32', border: 'none' }}
                    >
                        Proceed to Ship →
                    </button>
                )}
            </div>

            {/* Checklist */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                {TEST_ITEMS.map((item, index) => (
                    <div key={item.id} style={{
                        padding: '16px 24px',
                        borderBottom: index < TEST_ITEMS.length - 1 ? '1px solid #f5f5f5' : 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        backgroundColor: checkedItems[item.id] ? '#FAFAFA' : 'white',
                        transition: 'background-color 0.2s'
                    }}>
                        <input
                            type="checkbox"
                            checked={!!checkedItems[item.id]}
                            onChange={() => handleCheck(item.id)}
                            style={{
                                marginTop: '6px',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer',
                                accentColor: 'var(--color-success)'
                            }}
                        />
                        <div>
                            <label
                                onClick={() => handleCheck(item.id)}
                                style={{
                                    display: 'block',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    color: checkedItems[item.id] ? '#888' : '#333',
                                    textDecoration: checkedItems[item.id] ? 'line-through' : 'none',
                                    cursor: 'pointer',
                                    marginBottom: '4px'
                                }}
                            >
                                {item.label}
                            </label>
                            <div style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                                How to test: {item.tooltip}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '32px', textAlign: 'right' }}>
                <button
                    onClick={handleReset}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Reset Test Status
                </button>
            </div>
        </div>
    );
};

export default TestChecklist;
