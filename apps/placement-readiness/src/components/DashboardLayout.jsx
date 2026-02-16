import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Code2,
    FileText,
    Library,
    User,
    Menu,
    X,
    Bell,
    Search,
    Shield,
    Target,
    FileCheck
} from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Practice', icon: Code2, path: '/dashboard/practice' },
        { name: 'Assessments', icon: FileText, path: '/dashboard/assessments' },
        { name: 'Resources', icon: Library, path: '/dashboard/resources' },
        { name: 'Verification', icon: Shield, path: '/prp/07-test' },
        { name: 'Shipment', icon: Target, path: '/prp/08-ship' },
        { name: 'Proof of Work', icon: FileCheck, path: '/prp/proof' },
        { name: 'Profile', icon: User, path: '/dashboard/profile' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
                            <span className="font-bold text-slate-900 truncate">Placement Prep</span>
                        </div>
                    )}
                    {!isSidebarOpen && (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto">P</div>
                    )}
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
              `}
                        >
                            {item.icon ? <item.icon size={22} /> : <div className="w-[22px]" />}
                            {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-400 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Search size={18} />
                            <input type="text" placeholder="Search topics..." className="bg-transparent border-none outline-none text-sm text-slate-900 w-48" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-slate-300">
                            <User size={20} className="text-slate-400" />
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
