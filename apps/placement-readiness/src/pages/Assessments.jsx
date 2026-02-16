import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { getHistoryInfo, deleteAnalysis } from '../lib/storage';
import {
    Building2, Briefcase, Calendar, Trash2,
    ChevronRight, ClipboardList, Plus, AlertTriangle
} from 'lucide-react';

const Assessments = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [corruptedCount, setCorruptedCount] = useState(0);

    useEffect(() => {
        const info = getHistoryInfo();
        setHistory(info.history);
        setCorruptedCount(info.corruptedCount);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Delete this analysis entry?')) {
            deleteAnalysis(id);
            const info = getHistoryInfo();
            setHistory(info.history);
            setCorruptedCount(info.corruptedCount);
        }
    };

    const handleView = (id) => {
        navigate('/dashboard/resources', { state: { analysisId: id } });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 60) return 'text-primary bg-primary/10 border-primary/20';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    if (history.length === 0 && corruptedCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                    <ClipboardList size={32} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Analysis History</h2>
                <p className="text-slate-500 mb-8 max-w-md">
                    Your analyzed job descriptions will appear here. Start by analyzing a JD to build your history.
                </p>
                <button
                    onClick={() => navigate('/dashboard/practice')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Plus size={18} />
                    Analyze Your First JD
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis History</h1>
                    <p className="text-slate-500 mt-1">{history.length} {history.length === 1 ? 'entry' : 'entries'} saved</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/practice')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Plus size={16} />
                    New Analysis
                </button>
            </div>

            {corruptedCount > 0 && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm">
                    <AlertTriangle size={18} />
                    {corruptedCount === 1
                        ? "One saved entry couldn't be loaded. Create a new analysis."
                        : `${corruptedCount} saved entries couldn't be loaded. Create new analyses.`}
                </div>
            )}

            <div className="space-y-4">
                {history.map((entry) => {
                    const score = entry.finalScore ?? entry.readinessScore ?? 0;
                    const allSkills = Object.values(entry.extractedSkills).flat();

                    return (
                        <Card key={entry.id} className="hover:shadow-md transition-all cursor-pointer group">
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-5 flex-1 min-w-0" onClick={() => handleView(entry.id)}>
                                        {/* Score Badge */}
                                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border ${getScoreColor(score)}`}>
                                            <span className="text-lg font-black leading-none">{score}</span>
                                            <span className="text-[8px] font-bold uppercase opacity-70">Score</span>
                                        </div>

                                        {/* Details */}
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                                {entry.company || 'Unknown Company'} — {entry.role || 'Unknown Role'}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            {/* Skill Preview */}
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {allSkills.slice(0, 6).map(skill => (
                                                    <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {allSkills.length > 6 && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] font-medium">
                                                        +{allSkills.length - 6} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pl-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleView(entry.id)}
                                            className="p-2 text-slate-300 group-hover:text-primary transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Assessments;
