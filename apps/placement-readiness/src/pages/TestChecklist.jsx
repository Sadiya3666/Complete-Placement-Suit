import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
    CheckCircle2,
    Circle,
    AlertTriangle,
    RotateCcw,
    ExternalLink,
    ShieldCheck,
    Beaker,
    Info
} from 'lucide-react';

const TEST_ITEMS = [
    {
        id: 'validation',
        label: 'JD required validation works',
        hint: 'Go to Practice page, try to analyze without text. Error should appear.'
    },
    {
        id: 'warning',
        label: 'Short JD warning shows for <200 chars',
        hint: 'Paste a short text (e.g., "Software Engineer JD") and check for the calm warning.'
    },
    {
        id: 'skills',
        label: 'Skills extraction groups correctly',
        hint: 'Paste a full JD. Verify skills are categorized into Core CS, Languages, etc.'
    },
    {
        id: 'mapping',
        label: 'Round mapping changes based on company + skills',
        hint: 'Test with "Google" vs "Startup". Interview rounds should differ.'
    },
    {
        id: 'deterministic',
        label: 'Score calculation is deterministic',
        hint: 'Analyze the same JD twice. The starting score should be identical.'
    },
    {
        id: 'toggles',
        label: 'Skill toggles update score live',
        hint: 'In Resources page, click a skill to toggle confidence. The circle score should move.'
    },
    {
        id: 'persistence',
        label: 'Changes persist after refresh',
        hint: 'Toggle a skill, refresh the page. The confidence and score should remain changed.'
    },
    {
        id: 'history',
        label: 'History saves and loads correctly',
        hint: 'Go to Assessments history. Your previous runs should be listed with correct scores.'
    },
    {
        id: 'export',
        label: 'Export buttons copy the correct content',
        hint: 'Click "Copy 7-day plan". Paste it somewhere to verify content is correct.'
    },
    {
        id: 'console',
        label: 'No console errors on core pages',
        hint: 'Open DevTools (F12) and navigate through practice and resources.'
    }
];

const TestChecklist = () => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem('prp-test-checklist');
        if (saved) {
            try {
                setCheckedItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load checklist", e);
            }
        }
    }, []);

    const toggleItem = (id) => {
        const newState = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(newState);
        localStorage.setItem('prp-test-checklist', JSON.stringify(newState));
    };

    const resetChecklist = () => {
        if (window.confirm('Reset all test progress?')) {
            setCheckedItems({});
            localStorage.removeItem('prp-test-checklist');
        }
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const isComplete = passedCount === 10;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold mb-2">
                            <Beaker size={20} />
                            <span className="uppercase tracking-widest text-xs">Quality Assurance</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Verification</h1>
                        <p className="text-slate-500 mt-2">Complete all technical tests before proceeding to deployment.</p>
                    </div>
                    <button
                        onClick={resetChecklist}
                        className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-semibold"
                    >
                        <RotateCcw size={16} />
                        Reset Checklist
                    </button>
                </div>

                {/* Summary Card */}
                <Card className={`border-2 transition-all duration-500 ${isComplete ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'}`}>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-8">
                                <div className="relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={251.3}
                                            strokeDashoffset={251.3 - (passedCount / 10) * 251.3}
                                            strokeLinecap="round"
                                            className={`transition-all duration-1000 ${isComplete ? 'text-emerald-500' : 'text-primary'}`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-slate-900">{passedCount}/10</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-slate-900">Tests Passed: {passedCount} / 10</h2>
                                    <p className="text-slate-500 font-medium">
                                        {isComplete ? 'All systems operational' : `${10 - passedCount} items remaining`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-3">
                                {!isComplete ? (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold border border-amber-200">
                                        <AlertTriangle size={16} />
                                        Fix issues before shipping.
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-200">
                                        <ShieldCheck size={16} />
                                        System Ready for Ship
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate('/prp/08-ship')}
                                    disabled={!isComplete}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${isComplete
                                        ? 'bg-primary text-white shadow-xl shadow-primary/30 hover:scale-105 active:scale-95'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    Proceed to Ship
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Checklist items */}
                <div className="grid gap-4">
                    {TEST_ITEMS.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`cursor-pointer transition-all border shadow-sm hover:shadow-md ${checkedItems[item.id]
                                ? 'bg-white border-emerald-100'
                                : 'bg-white border-slate-200'
                                }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 flex-shrink-0 transition-colors ${checkedItems[item.id] ? 'text-emerald-500' : 'text-slate-300'}`}>
                                        {checkedItems[item.id] ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold transition-all ${checkedItems[item.id] ? 'text-slate-400 line-through' : 'text-slate-900 text-lg'}`}>
                                            {item.label}
                                        </h3>
                                        {item.hint && (
                                            <div className="flex items-start gap-1.5 mt-2 text-slate-500 group">
                                                <Info size={14} className="mt-0.5 opacity-60 flex-shrink-0" />
                                                <p className="text-sm font-medium leading-relaxed italic">{item.hint}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Footer */}
                <div className="pt-8 text-center text-slate-400 text-sm font-medium">
                    &copy; 2026 PRP Engineering | System Verification Module
                </div>
            </div>
        </div>
    );
};

export default TestChecklist;
