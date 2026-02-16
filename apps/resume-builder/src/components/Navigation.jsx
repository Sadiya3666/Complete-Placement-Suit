import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const MENU_ITEMS = [
        { label: 'Builder', path: '/builder' },
        { label: 'Preview', path: '/preview' },
        { label: 'Proof', path: '/proof' },
        { label: 'Build Track', path: '/rb/01-problem' },
    ];

    /* Desktop Styles */
    const navContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-3)',
        height: '64px',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: isMenuOpen ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
    };

    const desktopListStyle = {
        display: 'none', // Mobile first
        gap: 'var(--spacing-4)',
        alignItems: 'center',
    };

    /* Mobile Styles */
    const mobileListStyle = {
        display: isMenuOpen ? 'flex' : 'none',
        position: 'absolute',
        top: '64px',
        left: 0,
        width: '100%',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-3)',
        gap: 'var(--spacing-3)',
        zIndex: 999,
    };

    return (
        <nav style={navContainerStyle}>
            {/* Brand/Logo */}
            <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--color-text-primary)'
            }}>
                KodNest Premium
            </div>

            {/* Desktop Menu (Visible on large screens) */}
            <div className="desktop-nav">
                {MENU_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            textDecoration: 'none',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '15px',
                            fontWeight: 500,
                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                            paddingBottom: '4px',
                            transition: 'all 0.2s ease'
                        })}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mobile-toggle"
                aria-label="Toggle navigation"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isMenuOpen ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                </svg>
            </button>

            {/* Mobile Menu Content */}
            {isMenuOpen && (
                <div className="mobile-menu" style={{
                    position: 'absolute',
                    top: '64px',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--color-white)',
                    padding: '24px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    {MENU_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            style={({ isActive }) => ({
                                textDecoration: 'none',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '16px',
                                fontWeight: 500,
                                color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--color-border)'
                            })}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navigation;
