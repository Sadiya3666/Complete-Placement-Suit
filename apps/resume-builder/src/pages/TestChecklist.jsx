import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestChecklist = () => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState({});

    const TEST_ITEMS = [
        { id: 'save_data', label: 'All form sections save to localStorage', tooltip: 'Fill all sections, refresh, and verify data persists.' },
        { id: 'live_preview', label: 'Live preview updates in real-time', tooltip: 'Type in any field and ensure the preview re-renders instantly.' },
        { id: 'template_switching', label: 'Template switching preserves data', tooltip: 'Switch between Classic, Modern, and Minimal templates.' },
        { id: 'color_theme', label: 'Color theme persists after refresh', tooltip: 'Pick an accent color, refresh, and verify it stays selected.' },
        { id: 'ats_score', label: 'ATS score calculates correctly', tooltip: 'Verify score increases by 10 for name, 10 for email, etc.' },
        { id: 'score_live', label: 'Score updates live on edit', tooltip: 'Delete a skill or name and watch the score drop instantly.' },
        { id: 'export_buttons', label: 'Export buttons work (copy/download)', tooltip: 'Test "Copy as Text" and "Download PDF" (Print) functionality.' },
        { id: 'empty_states', label: 'Empty states handled gracefully', tooltip: 'Clear all fields and ensure no crashes or UI breaks.' },
        { id: 'mobile_layout', label: 'Mobile responsive layout works', tooltip: 'Shrink browser width and verify layout adjusts correctly.' },
        { id: 'no_console_errors', label: 'No console errors on any page', tooltip: 'Check DevTools Console (F12) while using the app.' }
    ];

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('rb_checklist_data')) || {};
        setCheckedItems(saved);
    }, []);

    const handleCheck = (id) => {
        const updated = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(updated);
        localStorage.setItem('rb_checklist_data', JSON.stringify(updated));
    };

    const handleReset = () => {
        if (window.confirm('Reset all test status?')) {
            setCheckedItems({});
            localStorage.removeItem('rb_checklist_data');
        }
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const isComplete = passedCount === TEST_ITEMS.length;

    return (
        <div className="container" style={{ padding: 'var(--spacing-5) var(--spacing-3)', maxWidth: '800px' }}>
            <div style={{ marginBottom: '32px', borderBottom: '1px solid #eee', paddingBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '8px' }}>
                    QA Verification Checklist
                </h1>
                <p style={{ color: '#666', fontSize: '18px' }}>
                    Final engineering verification for AI Resume Builder.
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
                            You must pass all 10 tests before moving to final proofing.
                        </p>
                    )}
                    {isComplete && (
                        <p style={{ margin: '8px 0 0 0', color: '#2E7D32', fontSize: '14px' }}>
                            All checklist tests passed. Systems ready for shipment.
                        </p>
                    )}
                </div>

                {isComplete && (
                    <button
                        onClick={() => window.location.href = 'http://localhost:5174/rb/proof'}
                        className="btn btn-primary"
                        style={{ backgroundColor: '#2E7D32', border: 'none' }}
                    >
                        Go to Build System Proof →
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
                                accentColor: '#2E7D32'
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
                                Verification: {item.tooltip}
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
                    Reset QA Status
                </button>
            </div>
        </div>
    );
};

export default TestChecklist;
