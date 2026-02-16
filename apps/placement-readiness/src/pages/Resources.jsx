import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getAnalysisById, getLatestAnalysis, updateAnalysis } from '../lib/storage';
import {
    CheckCircle2, Circle, ChevronDown, ChevronRight,
    Calendar, HelpCircle, ClipboardList,
    Tag, ArrowLeft, Building2, Briefcase,
    Copy, Download, Check, AlertTriangle, Zap,
    Info, Users, Target, Shield
} from 'lucide-react';

const CATEGORY_COLORS = {
    'Core CS': 'bg-blue-50 text-blue-700 border-blue-200',
    'Languages': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Web': 'bg-violet-50 text-violet-700 border-violet-200',
    'Data': 'bg-amber-50 text-amber-700 border-amber-200',
    'Cloud/DevOps': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Testing': 'bg-rose-50 text-rose-700 border-rose-200',
    'General': 'bg-slate-50 text-slate-700 border-slate-200',
    'Other': 'bg-slate-50 text-slate-700 border-slate-200',
};

const UI_CATEGORIES = {
    coreCS: 'Core CS',
    languages: 'Languages',
    web: 'Web',
    data: 'Data',
    cloud: 'Cloud/DevOps',
    testing: 'Testing',
    other: 'Other'
};

const Resources = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [expandedRounds, setExpandedRounds] = useState({});
    const [checkedItems, setCheckedItems] = useState({});
    const [activeTab, setActiveTab] = useState('intel');
    const [copiedKey, setCopiedKey] = useState(null);

    // Load analysis from state or latest
    useEffect(() => {
        const stateId = location.state?.analysisId;
        if (stateId) {
            const entry = getAnalysisById(stateId);
            if (entry) { setAnalysis(entry); return; }
        }
        const latest = getLatestAnalysis();
        if (latest) setAnalysis(latest);
    }, [location.state]);

    // ─── Skill Confidence Logic ──────────────────────────────────────────
    const getConfidence = (skill) => analysis?.skillConfidenceMap?.[skill] || 'practice';

    const toggleSkillConfidence = useCallback((skill) => {
        if (!analysis) return;
        const currentMap = analysis.skillConfidenceMap || {};
        const newVal = (currentMap[skill] || 'practice') === 'practice' ? 'know' : 'practice';
        const newMap = { ...currentMap, [skill]: newVal };

        // Score stability: finalScore starts at baseScore
        const allSkills = Object.values(analysis.extractedSkills).flat();
        let adjustment = 0;
        for (const s of allSkills) {
            const conf = s === skill ? newVal : (newMap[s] || 'practice');
            if (conf === 'know') adjustment += 2;
            else adjustment -= 2;
        }

        const baseScore = analysis.baseScore ?? analysis.readinessScore ?? 35;
        const finalScore = Math.max(0, Math.min(100, baseScore + adjustment));

        const updated = {
            ...analysis,
            skillConfidenceMap: newMap,
            finalScore: finalScore,
            updatedAt: new Date().toISOString()
        };
        setAnalysis(updated);
        updateAnalysis(analysis.id, {
            skillConfidenceMap: newMap,
            finalScore: finalScore,
            updatedAt: updated.updatedAt
        });
    }, [analysis]);

    // ─── Live Score ──────────────────────────────────────────────────────
    const displayScore = useMemo(() => {
        if (!analysis) return 0;
        return analysis.finalScore ?? analysis.readinessScore ?? 0;
    }, [analysis]);

    // ─── Weak Skills ─────────────────────────────────────────────────────
    const weakSkills = useMemo(() => {
        if (!analysis) return [];
        const allSkills = Object.values(analysis.extractedSkills).flat();
        const map = analysis.skillConfidenceMap || {};
        return allSkills.filter(s => (map[s] || 'practice') === 'practice').slice(0, 3);
    }, [analysis]);

    // ─── Export Helpers ──────────────────────────────────────────────────
    const copyToClipboard = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        }
    };

    const formatPlanText = () => {
        if (!analysis) return '';
        const plan = analysis.plan7Days || analysis.plan || [];
        return plan.map(d =>
            `${d.day}: ${d.focus || d.title}\n${d.tasks.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}`
        ).join('\n\n');
    };

    const formatChecklistText = () => {
        if (!analysis) return '';
        const checklist = analysis.checklist || [];
        return checklist.map(r =>
            `${r.roundTitle || r.round}\n${r.items.map((item, i) => `  [ ] ${i + 1}. ${item}`).join('\n')}`
        ).join('\n\n');
    };

    const formatQuestionsText = () => {
        if (!analysis) return '';
        return analysis.questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    };

    const downloadFullTXT = () => {
        if (!analysis) return;
        const lines = [
            `═══════════════════════════════════════════`,
            `  PLACEMENT READINESS ANALYSIS REPORT`,
            `═══════════════════════════════════════════`,
            ``,
            `Company: ${analysis.company}`,
            `Role: ${analysis.role}`,
            `Date: ${new Date(analysis.createdAt).toLocaleString()}`,
            `Readiness Score: ${displayScore}/100`,
            ``,
            `───────────────────────────────────────────`,
            `  EXTRACTED SKILLS`,
            `───────────────────────────────────────────`,
            ``,
            ...Object.entries(analysis.extractedSkills).map(([cat, skills]) => {
                const display = UI_CATEGORIES[cat] || cat;
                return skills.length > 0 ? `${display}: ${skills.join(', ')}` : null;
            }).filter(Boolean),
            ``,
            `───────────────────────────────────────────`,
            `  SKILL CONFIDENCE`,
            `───────────────────────────────────────────`,
            ``,
            ...Object.values(analysis.extractedSkills).flat().map(s =>
                `  ${getConfidence(s) === 'know' ? '✓' : '✗'} ${s} — ${getConfidence(s) === 'know' ? 'I know this' : 'Need practice'}`
            ),
            ``,
            `───────────────────────────────────────────`,
            `  4-ROUND PREPARATION CHECKLIST`,
            `───────────────────────────────────────────`,
            ``,
            formatChecklistText(),
            ``,
            `───────────────────────────────────────────`,
            `  7-DAY PREPARATION PLAN`,
            `───────────────────────────────────────────`,
            ``,
            formatPlanText(),
            ``,
            `───────────────────────────────────────────`,
            `  10 LIKELY INTERVIEW QUESTIONS`,
            `───────────────────────────────────────────`,
            ``,
            formatQuestionsText(),
            ``,
            `═══════════════════════════════════════════`,
            `  Generated by Placement Readiness Platform`,
            `═══════════════════════════════════════════`,
        ];

        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${analysis.company.replace(/\s+/g, '_')}_${analysis.role.replace(/\s+/g, '_')}_analysis.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // ─── UI Helpers ──────────────────────────────────────────────────────
    const toggleRound = (idx) => setExpandedRounds(prev => ({ ...prev, [idx]: !prev[idx] }));
    const toggleCheck = (roundIdx, itemIdx) => {
        const key = `${roundIdx}-${itemIdx}`;
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const CopyButton = ({ label, textFn, copyKey }) => (
        <button
            onClick={() => copyToClipboard(textFn(), copyKey)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
            {copiedKey === copyKey
                ? <><Check size={15} className="text-emerald-500" /> Copied!</>
                : <><Copy size={15} className="text-slate-400" /> {label}</>
            }
        </button>
    );

    // ─── Empty State ─────────────────────────────────────────────────────
    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                    <ClipboardList size={32} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Analysis Found</h2>
                <p className="text-slate-500 mb-8 max-w-md">Paste a job description in the analyzer to generate your personalized preparation plan.</p>
                <button
                    onClick={() => navigate('/dashboard/practice')}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    Go to JD Analyzer
                </button>
            </div>
        );
    }

    const { extractedSkills, questions, company, role, createdAt } = analysis;
    const checklist = analysis.checklist || [];
    const plan = analysis.plan7Days || analysis.plan || [];

    // Circular score
    const radius = 60;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    const tabs = [
        { id: 'intel', label: 'Company Intel', icon: Building2 },
        { id: 'skills', label: 'Skills', icon: Tag },
        { id: 'checklist', label: 'Checklist', icon: ClipboardList },
        { id: 'plan', label: '7-Day Plan', icon: Calendar },
        { id: 'questions', label: 'Questions', icon: HelpCircle },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button
                        onClick={() => navigate('/dashboard/assessments')}
                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors mb-2"
                    >
                        <ArrowLeft size={14} /> Back to History
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis Results</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Building2 size={14} /> {company || 'Unknown Company'}</span>
                        <span className="flex items-center gap-1"><Briefcase size={14} /> {role || 'Unknown Role'}</span>
                        <span>{new Date(createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Live Readiness Score */}
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="relative">
                        <svg className="w-28 h-28 transform -rotate-90">
                            <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
                            <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
                                strokeDasharray={circumference}
                                style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.6s ease-in-out' }}
                                strokeLinecap="round"
                                className="text-primary"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-900">{displayScore}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Readiness</p>
                        <p className="text-xs text-slate-500">
                            {displayScore >= 80 ? 'Strong — well prepared' : displayScore >= 60 ? 'Good — focus on weak areas' : 'Needs work — follow the plan'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center mr-2">Export</span>
                <CopyButton label="Copy 7-day plan" textFn={formatPlanText} copyKey="plan" />
                <CopyButton label="Copy round checklist" textFn={formatChecklistText} copyKey="checklist" />
                <CopyButton label="Copy 10 questions" textFn={formatQuestionsText} copyKey="questions" />
                <button
                    onClick={downloadFullTXT}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Download size={15} /> Download as TXT
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 justify-center
              ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── SKILLS TAB (with interactive toggles) ─── */}
            {activeTab === 'skills' && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><Tag size={20} className="text-primary" /> Extracted Skills</CardTitle>
                                <p className="text-xs text-slate-400">Click a skill to toggle confidence</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {Object.entries(extractedSkills).map(([catKey, skills]) => {
                                const displayName = UI_CATEGORIES[catKey] || catKey;
                                if (!skills || skills.length === 0) return null;
                                return (
                                    <div key={catKey}>
                                        <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">{displayName}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(skill => {
                                                const conf = getConfidence(skill);
                                                const isKnown = conf === 'know';
                                                return (
                                                    <button
                                                        key={skill}
                                                        onClick={() => toggleSkillConfidence(skill)}
                                                        className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all
                                ${isKnown
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                : `${CATEGORY_COLORS[displayName] || CATEGORY_COLORS['General']} hover:border-slate-300`
                                                            }`}
                                                    >
                                                        {isKnown
                                                            ? <CheckCircle2 size={14} className="text-emerald-500" />
                                                            : <AlertTriangle size={14} className="opacity-40" />
                                                        }
                                                        {skill}
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${isKnown ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                            {isKnown ? 'Know' : 'Practice'}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── CHECKLIST TAB ─── */}
            {activeTab === 'checklist' && (
                <div className="space-y-4">
                    {checklist.map((round, rIdx) => (
                        <Card key={rIdx}>
                            <button onClick={() => toggleRound(rIdx)} className="w-full flex items-center justify-between p-6 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">{rIdx + 1}</div>
                                    <h3 className="font-bold text-slate-900">{round.roundTitle || round.round}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400">{round.items.length} items</span>
                                    {expandedRounds[rIdx] ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                                </div>
                            </button>
                            {expandedRounds[rIdx] && (
                                <CardContent className="pt-0 space-y-2 border-t border-slate-100">
                                    {round.items.map((item, iIdx) => {
                                        const key = `${rIdx}-${iIdx}`;
                                        const checked = checkedItems[key];
                                        return (
                                            <button
                                                key={iIdx}
                                                onClick={() => toggleCheck(rIdx, iIdx)}
                                                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${checked ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                                            >
                                                {checked
                                                    ? <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    : <Circle size={18} className="text-slate-300 mt-0.5 flex-shrink-0" />
                                                }
                                                <span className={`text-sm ${checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item}</span>
                                            </button>
                                        );
                                    })}
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* ─── PLAN TAB ─── */}
            {activeTab === 'plan' && (
                <div className="space-y-6">
                    {plan.map((day, idx) => (
                        <Card key={idx}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {(day.day || '').replace('Day ', '').replace('–', '-')}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{day.focus || day.title}</CardTitle>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">{day.day}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {day.tasks.map((task, tIdx) => (
                                        <li key={tIdx} className="flex items-start gap-3 text-sm text-slate-700">
                                            <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{tIdx + 1}</div>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ─── QUESTIONS TAB ─── */}
            {activeTab === 'questions' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HelpCircle size={20} className="text-primary" /> 10 Likely Interview Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {questions.map((q, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">{idx + 1}</div>
                                <p className="text-sm text-slate-800 leading-relaxed pt-1">{q}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* ─── COMPANY INTEL TAB ─── */}
            {activeTab === 'intel' && analysis.companyIntel && (
                <div className="space-y-8">
                    {/* Company Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building2 size={20} className="text-primary" /> Company Intel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 size={16} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">{analysis.companyIntel.companyInfo.name || 'Unknown'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target size={16} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry</span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">{analysis.companyIntel.companyInfo.industry}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users size={16} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Size Category</span>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">{analysis.companyIntel.companyInfo.sizeLabel}</p>
                                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-md text-xs font-bold ${analysis.companyIntel.companyInfo.size === 'Enterprise' ? 'bg-blue-100 text-blue-700' :
                                        analysis.companyIntel.companyInfo.size === 'Mid-size' ? 'bg-violet-100 text-violet-700' :
                                            'bg-emerald-100 text-emerald-700'
                                        }`}>{analysis.companyIntel.companyInfo.size}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hiring Focus */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Shield size={20} className="text-primary" /> Typical Hiring Focus</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <h4 className="font-bold text-primary text-sm mb-1">{analysis.companyIntel.hiringFocus.title}</h4>
                            </div>
                            <ul className="space-y-3">
                                {analysis.companyIntel.hiringFocus.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                        <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{i + 1}</div>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Round Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ClipboardList size={20} className="text-primary" /> Expected Interview Rounds</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                                <div className="space-y-8">
                                    {(analysis.roundMapping || analysis.companyIntel.roundMapping).map((round, idx) => (
                                        <div key={idx} className="relative pl-14">
                                            {/* Circle on timeline */}
                                            <div className={`absolute left-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${round.type === 'online' ? 'border-blue-400 bg-blue-50 text-blue-600' :
                                                round.type === 'technical' ? 'border-violet-400 bg-violet-50 text-violet-600' :
                                                    round.type === 'project' ? 'border-emerald-400 bg-emerald-50 text-emerald-600' :
                                                        'border-amber-400 bg-amber-50 text-amber-600'
                                                }`}>
                                                {idx + 1}
                                            </div>

                                            {/* Round Card */}
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                                <h4 className="font-bold text-slate-900 mb-2">{round.roundTitle || round.name}</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed mb-3">{round.description}</p>

                                                {/* Focus tags */}
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {(round.focusAreas || round.focus || []).map((f, fi) => (
                                                        <span key={fi} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[11px] font-medium">{f}</span>
                                                    ))}
                                                </div>

                                                {/* Why this round matters */}
                                                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                                                    <p className="text-xs text-amber-800 leading-relaxed">
                                                        <span className="font-bold">Why this round matters: </span>
                                                        {round.whyItMatters || round.why}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Demo Mode Note */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <Info size={14} className="text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-400">Demo Mode: Company intel generated heuristically. Data is template-based and not sourced from live company records.</p>
                    </div>
                </div>
            )}

            {/* ─── ACTION NEXT BOX ─── */}
            <Card className="border-primary/10 bg-primary/[0.02]">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Zap size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 mb-2">Action Next</h3>
                            {weakSkills.length > 0 ? (
                                <>
                                    <p className="text-sm text-slate-600 mb-3">Your top weak areas that need attention:</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {weakSkills.map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium flex items-center gap-1.5">
                                                <AlertTriangle size={12} />
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-700 font-semibold flex items-center gap-2">
                                        <ChevronRight size={16} className="text-primary" />
                                        Start Day 1 plan now.
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-emerald-600 font-semibold">All skills marked as confident. Review your checklist next.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Resources;
