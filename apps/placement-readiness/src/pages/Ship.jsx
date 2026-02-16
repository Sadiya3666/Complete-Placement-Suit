import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import {
    Ship as ShipIcon,
    Lock,
    ChevronLeft,
    CheckCircle2,
    Rocket,
    ShieldAlert,
    ArrowRight,
    Clock,
    FileCheck
} from 'lucide-react';

const Ship = () => {
    const navigate = useNavigate();
    const [isLocked, setIsLocked] = useState(true);
    const [passedCount, setPassedCount] = useState(0);
    const [isProofSubmitted, setIsProofSubmitted] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('prp-test-checklist');
            let count = 0;
            if (saved) {
                const checked = JSON.parse(saved);
                count = Object.values(checked || {}).filter(Boolean).length;
                setPassedCount(count);
            }

            const savedLinks = localStorage.getItem('prp_final_submission');
            let proofDone = false;
            if (savedLinks) {
                const links = JSON.parse(savedLinks) || {};
                proofDone = !!(links.lovable && links.github && links.deployed);
                setIsProofSubmitted(proofDone);
            }

            setPassedCount(count);
            setIsLocked(count < 10 || !proofDone);
        } catch (e) {
            console.error("Local storage error:", e);
            setIsLocked(true);
        }
    }, []);

    if (isLocked) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-md w-full text-center space-y-8 relative z-10">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-red-500/20 rounded-3xl flex items-center justify-center border border-red-500/30 animate-pulse">
                            <Lock size={48} className="text-red-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black tracking-tight">Deployment Locked</h1>
                        <p className="text-slate-400 font-medium">
                            System safety protocol active. You must pass all 10 verification tests and provide proof artifacts before shipping.
                        </p>
                    </div>

                    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Verification</span>
                                    <span className={`text-sm font-black ${passedCount === 10 ? 'text-emerald-500' : 'text-red-500'}`}>{passedCount}/10</span>
                                </div>
                                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${passedCount === 10 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${(passedCount / 10) * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-700">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Artifact Submission</span>
                                {isProofSubmitted ? (
                                    <span className="text-xs font-black text-emerald-500 flex items-center gap-1"><CheckCircle2 size={14} /> SUBMITTED</span>
                                ) : (
                                    <span className="text-xs font-black text-amber-500 flex items-center gap-1"><Clock size={14} /> PENDING</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => navigate('/prp/07-test')}
                                    className="flex items-center justify-center gap-2 py-3 bg-slate-700 text-white rounded-xl font-bold text-xs hover:bg-slate-600 transition-all shadow-lg"
                                >
                                    <ShieldAlert size={14} />
                                    Test Checks
                                </button>
                                <button
                                    onClick={() => navigate('/prp/proof')}
                                    className="flex items-center justify-center gap-2 py-3 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all shadow-lg"
                                >
                                    <FileCheck size={14} />
                                    Proof of Work
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Security Protocol v2.4.0</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 overflow-hidden relative font-sans">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
                <div className="flex justify-center relative">
                    <div className="w-32 h-32 bg-emerald-500 text-white rounded-[40px] flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10 animate-bounce">
                        <Rocket size={64} />
                    </div>
                    {/* Particles */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-20 animate-ping"></div>
                    <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-primary rounded-full opacity-10 animate-pulse"></div>
                </div>

                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-2 border border-emerald-200">
                        <CheckCircle2 size={14} />
                        All Checks Passed
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">Ready for Launch</h1>
                    <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
                        The Placement Readiness Platform has passed all technical requirements and is cleared for global deployment.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-10 py-5 bg-primary text-white rounded-3xl font-black text-xl hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        Deploy to Production
                        <ArrowRight size={24} />
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-5 bg-white text-slate-700 border-2 border-slate-200 rounded-3xl font-black text-xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Go to Dashboard
                    </button>
                </div>

                <div className="pt-12 flex items-center justify-center gap-12 border-t border-slate-200">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-sm font-bold text-emerald-600">Stable Build</p>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Version</p>
                        <p className="text-sm font-bold text-slate-900">1.0.0-PRO</p>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</p>
                        <p className="text-sm font-bold text-slate-900">US-EAST-1</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ship;
