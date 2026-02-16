import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { analyzeJD } from '../lib/analyzer';
import { saveAnalysis } from '../lib/storage';
import { Sparkles, Building2, Briefcase, FileText, AlertCircle } from 'lucide-react';

const Practice = () => {
    const navigate = useNavigate();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');

    const handleAnalyze = () => {
        setError('');
        setWarning('');

        if (!jdText.trim()) {
            setError('Job Description is required to generate your readiness plan.');
            return;
        }

        if (jdText.length > 0 && jdText.length < 200) {
            setWarning('This JD is too short to analyze deeply. Paste full JD for better output.');
        }

        setIsAnalyzing(true);

        // Simulate a brief processing delay for UX
        setTimeout(() => {
            try {
                const result = analyzeJD({ company, role, jdText });
                saveAnalysis(result);
                // Navigate to results with the analysis ID
                navigate('/dashboard/resources', { state: { analysisId: result.id } });
            } catch (err) {
                setError('Analysis failed. Please try again.');
            } finally {
                setIsAnalyzing(false);
            }
        }, 800);
    };

    const sampleJD = `We are looking for a Full Stack Developer proficient in React, Node.js, and TypeScript. 
The ideal candidate should have strong knowledge of DSA, OOP concepts, and SQL databases.
Experience with REST APIs, PostgreSQL, Docker, and CI/CD pipelines is preferred.
Familiarity with AWS services, Linux, and testing frameworks like Jest is a plus.
Strong communication skills and ability to work in Agile teams required.
Minimum 0-2 years of experience. B.Tech/BE in Computer Science preferred.`;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">JD Analyzer</h1>
                <p className="text-slate-500 mt-1">Paste a job description to extract skills, generate a prep plan, and calculate your readiness score.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Building2 size={16} className="text-primary" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g., Google, TCS, Infosys"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                <Briefcase size={16} className="text-primary" />
                                Role / Position
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g., Software Engineer, SDE-1"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                            <FileText size={16} className="text-primary" />
                            Job Description
                        </label>
                        <textarea
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste the full job description here..."
                            rows={12}
                            className={`w-full px-4 py-3 bg-white border rounded-xl text-sm outline-none focus:ring-2 transition-all resize-none leading-relaxed
                                ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-primary/20 focus:border-primary'}
                            `}
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-400">{jdText.length} characters</span>
                            <span className="text-xs text-slate-400">{jdText.length > 800 ? '✓ Detailed JD' : 'Tip: longer JDs improve accuracy'}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {warning && !error && (
                        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm">
                            <AlertCircle size={18} />
                            {warning}
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Analyze & Generate Plan
                            </>
                        )}
                    </button>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">How It Works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-slate-600">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                                <p>Paste a job description from any job portal</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                                <p>Our engine extracts key skills across 6 categories</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                                <p>Get a 4-round checklist, 7-day plan, and 10 interview questions</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
                                <p>Your readiness score is calculated (0–100)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Try a Sample</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-3">Click below to load a sample full-stack JD for testing.</p>
                            <button
                                onClick={() => {
                                    setCompany('Acme Corp');
                                    setRole('Full Stack Developer');
                                    setJdText(sampleJD);
                                }}
                                className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                            >
                                Load Sample JD
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Practice;
