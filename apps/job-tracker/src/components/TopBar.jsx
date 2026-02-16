import React from 'react';

const TopBar = () => {
  return (
    <div style={{
      height: '64px',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      backgroundColor: '#FFFFFF',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100
    }}>
      <div style={{ fontWeight: 600, fontFamily: 'var(--font-serif)', fontSize: '20px', letterSpacing: '-0.5px' }}>
        KodNest
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)' }}>Step 1 / 4</span>
        <div style={{ width: '120px', height: '4px', backgroundColor: '#eee', borderRadius: '2px' }}>
          <div style={{ width: '25%', height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '2px' }}></div>
        </div>
      </div>
      <div style={{
        padding: '6px 12px',
        backgroundColor: '#F5F5F5',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
      }}>
        In Progress
      </div>
    </div>
  );
};

export default TopBar;
