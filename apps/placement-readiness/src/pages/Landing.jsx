import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart3, ChevronRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Navbar */}
            <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Placement Prep</span>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white pt-24 pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                                Ace Your <span className="text-primary">Placement</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Practice, assess, and prepare for your dream job with our comprehensive placement readiness platform.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                            >
                                Get Started
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]"></div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="bg-slate-50 py-24 border-y border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature Card 1 */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary/20 transition-all group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Code size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Practice Problems</h3>
                                <p className="text-slate-600 leading-relaxed">Master data structures and algorithms with our curated library of questions.</p>
                            </div>

                            {/* Feature Card 2 */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary/20 transition-all group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Video size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Mock Interviews</h3>
                                <p className="text-slate-600 leading-relaxed">Prepare for technical and behavioral rounds with industry experts.</p>
                            </div>

                            {/* Feature Card 3 */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary/20 transition-all group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Track Progress</h3>
                                <p className="text-slate-600 leading-relaxed">Monitor your readiness with detailed analytics and performance charts.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Placement Prep Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
