import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from 'recharts';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '../components/ui/Card';
import { getLatestAnalysis, getHistory } from '../lib/storage';
import { ChevronRight, Calendar, Clock, Trophy, Sparkles, Plus, Shield, Target } from 'lucide-react';

const DashboardHome = () => {
    const navigate = useNavigate();
    const [latest, setLatest] = useState(null);
    const [historyCount, setHistoryCount] = useState(0);

    useEffect(() => {
        setLatest(getLatestAnalysis());
        setHistoryCount(getHistory().length);
    }, []);

    // Build radar data from latest analysis
    const radarData = (latest && latest.extractedSkills)
        ? Object.entries(latest.extractedSkills).map(([category, skills]) => ({
            subject: category,
            A: Math.min((skills?.length || 0) * 20, 100),
            fullMark: 100,
        }))
        : [
            { subject: 'DSA', A: 75, fullMark: 100 },
            { subject: 'System Design', A: 60, fullMark: 100 },
            { subject: 'Comm.', A: 80, fullMark: 100 },
            { subject: 'Resume', A: 85, fullMark: 100 },
            { subject: 'Aptitude', A: 70, fullMark: 100 },
        ];

    const readinessValue = latest ? latest.readinessScore : 72;
    const radius = 70;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (readinessValue / 100) * circumference;

    const weeklyActivity = [true, true, true, true, false, false, false];
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Readiness Overview</h1>
                    <p className="text-slate-500">
                        {latest ? `Latest: ${latest.company} — ${latest.role}` : 'Track your progress and upcoming goals.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {historyCount > 0 && (
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold flex items-center gap-2">
                            <Trophy size={16} />
                            {historyCount} {historyCount === 1 ? 'Analysis' : 'Analyses'} Completed
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Action Banner */}
            {!latest && (
                <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
                    <CardContent className="p-8 text-center">
                        <Sparkles size={32} className="text-primary mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Start Your Preparation</h2>
                        <p className="text-slate-500 mb-6 max-w-lg mx-auto">Paste a job description into the analyzer to get your personalized skill extraction, preparation plan, and readiness score.</p>
                        <button
                            onClick={() => navigate('/dashboard/practice')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                        >
                            <Plus size={18} />
                            Analyze Your First JD
                        </button>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Readiness Score */}
                <Card className="flex flex-col items-center justify-center py-8">
                    <CardHeader className="text-center pb-2">
                        <CardTitle>Overall Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 relative">
                        <div className="relative flex items-center justify-center">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
                                <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
                                    strokeDasharray={circumference}
                                    style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                                    strokeLinecap="round"
                                    className="text-primary"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-extrabold text-slate-900">{readinessValue}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Readiness Score</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skill Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Radar name="Skills" dataKey="A" stroke="#5a57e6" fill="#5a57e6" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Continue Practice / Quick Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>{latest ? 'Latest Analysis' : 'Continue Practice'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {latest ? (
                            <>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 border-l-4 border-primary pl-3">{latest.company} — {latest.role}</h4>
                                        <p className="text-sm text-slate-500 mt-1 pl-4">
                                            {Object.values(latest.extractedSkills).flat().length} skills detected across {Object.keys(latest.extractedSkills).length} categories
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold text-primary">{latest.readinessScore}/100</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {Object.values(latest.extractedSkills).flat().slice(0, 8).map(s => (
                                        <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{s}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard/resources', { state: { analysisId: latest.id } })}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                                >
                                    View Full Results
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 border-l-4 border-primary pl-3">Dynamic Programming</h4>
                                        <p className="text-sm text-slate-500 mt-1 pl-4">Optimization, Memoization, Tabulation</p>
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">Step 3 of 10</span>
                                </div>
                                <div className="space-y-2 px-1">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-400">
                                        <span>Progress</span>
                                        <span className="text-primary">30% Completed</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                                        <div className="bg-primary h-full rounded-full w-[30%] transition-all duration-1000"></div>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors mt-4">
                                    Continue Learning
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Weekly Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <h4 className="text-lg font-bold text-slate-900">Problems Solved</h4>
                                <span className="text-2xl font-black text-primary">12 <span className="text-sm text-slate-400">/ 20</span></span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[60%]"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {days.map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{day}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${weeklyActivity[i]
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110'
                                        : 'bg-white border border-slate-200 text-slate-300'
                                        }`}>
                                        {weeklyActivity[i] && '✓'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Verification & Shipping */}
                <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Shield className="text-primary" size={24} />
                            System Verification & Shipping
                        </CardTitle>
                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">Engineering Mode</span>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <h4 className="text-lg font-bold text-slate-900 leading-tight">Final Roadmap Clearance</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Before deploying the Placement Readiness Platform, you must pass all 10 internal quality assurance tests.
                                    This ensures JD parsing, skill grouping, and score stability meet production standards.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate('/prp/07-test')}
                                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Run Test Suite
                                        <ChevronRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => navigate('/prp/08-ship')}
                                        className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                                    >
                                        Shipping Status
                                        <Target size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-primary/10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Sparkles size={64} className="text-primary" />
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Test Progress</span>
                                        <span className="text-primary">10 Standardized Tests</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                                        <div className="bg-primary h-full w-full opacity-20"></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 italic">Verify JD Required, Short JD Warnings, Round Mapping, Score Persistence, and more.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Assessments */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', tag: 'Technical' },
                                { title: 'System Design Review', time: 'Wed, 2:00 PM', tag: 'Architecture' },
                                { title: 'HR Interview Prep', time: 'Fri, 11:00 AM', tag: 'Behavioral' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer group">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">{item.title}</h5>
                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                                            <Clock size={12} />
                                            {item.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
