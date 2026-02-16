import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
    FileCheck,
    Link as LinkIcon,
    Github,
    Globe,
    Copy,
    Check,
    AlertCircle,
    Trophy,
    CheckCircle2,
    Clock,
    ShieldCheck,
    ArrowRight,
    ExternalLink
} from 'lucide-react';

const STEPS = [
    { id: 1, name: 'Project Initialization & Architecture', status: 'Completed' },
    { id: 2, name: 'AI-Driven JD Parsing Engine', status: 'Completed' },
    { id: 3, name: 'Standardized Data Modeling', status: 'Completed' },
    { id: 4, name: 'Premium Dashboard Layout', status: 'Completed' },
    { id: 5, name: 'Skill Categorization Logic', status: 'Completed' },
    { id: 6, name: 'Persistence & History Storage', status: 'Completed' },
    { id: 7, name: 'Technical Test Suite (10 Checks)', status: 'Pending' }, // Dynamic
    { id: 8, name: 'Final Proof & Submission', status: 'Pending' }  // Dynamic
];

const Proof = () => {
    const navigate = useNavigate();
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deployed: ''
    });
    const [errors, setErrors] = useState({});
    const [isCopied, setIsCopied] = useState(false);
    const [passedCount, setPassedCount] = useState(0);

    useEffect(() => {
        try {
            // Load links
            const savedLinks = localStorage.getItem('prp_final_submission');
            if (savedLinks) {
                const parsed = JSON.parse(savedLinks);
                if (parsed && typeof parsed === 'object') {
                    setLinks(prev => ({ ...prev, ...parsed }));
                }
            }

            // Load checklist status
            const savedChecklist = localStorage.getItem('prp-test-checklist');
            if (savedChecklist) {
                const checked = JSON.parse(savedChecklist);
                if (checked && typeof checked === 'object') {
                    setPassedCount(Object.values(checked).filter(Boolean).length);
                }
            }
        } catch (e) {
            console.error("Failed to load submission data", e);
        }
    }, []);

    const validateURL = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleInputChange = (field, value) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);

        // Save to localStorage
        localStorage.setItem('prp_final_submission', JSON.stringify(newLinks));

        // Validation
        if (value && !validateURL(value)) {
            setErrors(prev => ({ ...prev, [field]: 'Please enter a valid URL (https://...)' }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const areLinksValid =
        links.lovable && validateURL(links.lovable) &&
        links.github && validateURL(links.github) &&
        links.deployed && validateURL(links.deployed);

    const isChecklistComplete = passedCount === 10;
    const isStep7Complete = isChecklistComplete;
    const isStep8Complete = areLinksValid;

    const isShipped = isChecklistComplete && areLinksValid;

    const copyFinalSubmission = () => {
        const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;

        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold mb-2">
                            <ShieldCheck size={20} />
                            <span className="uppercase tracking-widest text-xs">Proof of Work</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Final Submission</h1>
                        <p className="text-slate-500 mt-2">Document your build and verify artifact links for submission.</p>
                    </div>
                    {isShipped ? (
                        <div className="px-6 py-2 bg-emerald-500 text-white rounded-full font-black text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 animate-bounce">
                            <Trophy size={18} />
                            STATUS: SHIPPED
                        </div>
                    ) : (
                        <div className="px-6 py-2 bg-slate-200 text-slate-500 rounded-full font-black text-sm flex items-center gap-2">
                            <Clock size={18} />
                            STATUS: IN PROGRESS
                        </div>
                    )}
                </div>

                {/* Shipped Message */}
                {isShipped && (
                    <Card className="bg-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                            <Trophy size={200} />
                        </div>
                        <CardContent className="p-10 relative z-10">
                            <h2 className="text-3xl font-black mb-4">You built a real product.</h2>
                            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-6">
                                Not a tutorial. Not a clone. A structured tool that solves a real problem.
                                <br /><br />
                                <span className="text-white font-bold italic">"This is your proof of work."</span>
                            </p>
                            <button
                                onClick={copyFinalSubmission}
                                className="flex items-center gap-2 px-8 py-3 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
                            >
                                {isCopied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                                {isCopied ? 'Selection Copied!' : 'Copy Final Submission'}
                            </button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Step Completion Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Clock className="text-primary" size={24} />
                                Step Completion Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {STEPS.map((step) => {
                                    let currentStatus = step.status;
                                    if (step.id === 7) currentStatus = isStep7Complete ? 'Completed' : 'Pending';
                                    if (step.id === 8) currentStatus = isStep8Complete ? 'Completed' : 'Pending';

                                    return (
                                        <div key={step.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStatus === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                                                    }`}>
                                                    {currentStatus === 'Completed' ? '✓' : step.id}
                                                </div>
                                                <span className={`text-sm font-semibold ${currentStatus === 'Completed' ? 'text-slate-700' : 'text-slate-400'}`}>
                                                    {step.name}
                                                </span>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${currentStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {currentStatus}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Artifact Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <FileCheck className="text-primary" size={24} />
                                Artifact Submission
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <LinkIcon size={14} /> Lovable Project Link
                                </label>
                                <input
                                    type="text"
                                    value={links.lovable}
                                    onChange={(e) => handleInputChange('lovable', e.target.value)}
                                    placeholder="https://lovable.dev/projects/..."
                                    className={`w-full p-3 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.lovable ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                />
                                {errors.lovable && <p className="text-[10px] text-red-500 font-bold">{errors.lovable}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Github size={14} /> GitHub Repository Link
                                </label>
                                <input
                                    type="text"
                                    value={links.github}
                                    onChange={(e) => handleInputChange('github', e.target.value)}
                                    placeholder="https://github.com/username/repo"
                                    className={`w-full p-3 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.github ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                />
                                {errors.github && <p className="text-[10px] text-red-500 font-bold">{errors.github}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Globe size={14} /> Live Deployed URL
                                </label>
                                <input
                                    type="text"
                                    value={links.deployed}
                                    onChange={(e) => handleInputChange('deployed', e.target.value)}
                                    placeholder="https://your-app.lovable.app"
                                    className={`w-full p-3 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.deployed ? 'border-red-300' : 'border-slate-200'
                                        }`}
                                />
                                {errors.deployed && <p className="text-[10px] text-red-500 font-bold">{errors.deployed}</p>}
                            </div>

                            {!isShipped && (
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                    <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        All 8 steps and 10 verification tests must be complete to submit.
                                        {passedCount < 10 && <span className="block mt-1 font-bold underline cursor-pointer" onClick={() => navigate('/prp/07-test')}>Finish Verification Checks &rarr;</span>}
                                    </p>
                                </div>
                            )}

                            {isShipped && !isCopied && (
                                <button
                                    onClick={copyFinalSubmission}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                                >
                                    <Copy size={20} />
                                    Copy Final Submission
                                </button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Requirements Checklist */}
                <Card className="bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Tests</p>
                                <div className="flex items-center justify-center gap-2">
                                    {isChecklistComplete ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Clock size={24} className="text-slate-300" />}
                                    <span className={`text-xl font-black ${isChecklistComplete ? 'text-slate-900' : 'text-slate-400'}`}>10 / 10 passed</span>
                                </div>
                            </div>
                            <div className="space-y-2 border-x border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Artifact Links</p>
                                <div className="flex items-center justify-center gap-2">
                                    {areLinksValid ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Clock size={24} className="text-slate-300" />}
                                    <span className={`text-xl font-black ${areLinksValid ? 'text-slate-900' : 'text-slate-400'}`}>3 / 3 validated</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step Verification</p>
                                <div className="flex items-center justify-center gap-2">
                                    {isShipped ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Clock size={24} className="text-slate-300" />}
                                    <span className={`text-xl font-black ${isShipped ? 'text-slate-900' : 'text-slate-400'}`}>Ready to Ship</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Proof;
