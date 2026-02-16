import React, { useState } from 'react';

const JobCard = ({ job, isSaved, onToggleSave, onView }) => {
    return (
        <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-2)',
            position: 'relative',
            padding: '24px',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            cursor: 'pointer',
            height: '100%'
        }}
            onClick={() => onView(job)}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        marginBottom: '4px',
                        fontFamily: 'var(--font-sans)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        {job.title}
                        {job.matchScore > 0 && (
                            <span style={{
                                fontSize: '12px', padding: '2px 6px', borderRadius: '4px',
                                backgroundColor: job.matchScore >= 80 ? '#E6F4EA' : (job.matchScore >= 60 ? '#FFF8E1' : (job.matchScore >= 40 ? '#F5F5F5' : '#FAFAFA')),
                                color: job.matchScore >= 80 ? '#1E8E3E' : (job.matchScore >= 60 ? '#F9A825' : (job.matchScore >= 40 ? '#616161' : '#9E9E9E')),
                                border: '1px solid',
                                borderColor: job.matchScore >= 80 ? '#A5D6A7' : (job.matchScore >= 60 ? '#FFE082' : (job.matchScore >= 40 ? '#E0E0E0' : '#EEEEEE'))
                            }}>
                                {job.matchScore}%
                            </span>
                        )}
                    </h3>
                    <div style={{
                        fontSize: '14px',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 500
                    }}>
                        {job.company}
                    </div>
                </div>
                <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#F5F5F5',
                    color: '#666',
                    fontWeight: 500
                }}>
                    {job.source}
                </span>
            </div>

            <div style={{
                display: 'flex',
                gap: '12px',
                fontSize: '13px',
                color: '#555',
                marginTop: '8px',
                flexWrap: 'wrap'
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    📍 {job.location} ({job.mode})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    💼 {job.experience} Yrs
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    💰 {job.salaryRange}
                </span>
            </div>

            <div style={{
                marginTop: 'auto',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #f0f0f0'
            }}>
                <span style={{ fontSize: '12px', color: '#999' }}>
                    {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}
                </span>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <select
                        value={job.status || 'Not Applied'}
                        onChange={(e) => job.onStatusChange(job.id, e.target.value)}
                        style={{
                            padding: '6px',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                            fontSize: '12px',
                            color: job.status === 'Applied' ? '#1976D2' :
                                job.status === 'Rejected' ? '#D32F2F' :
                                    job.status === 'Selected' ? '#388E3C' : '#666',
                            fontWeight: 500,
                            backgroundColor: job.status === 'Applied' ? '#E3F2FD' :
                                job.status === 'Rejected' ? '#FFEBEE' :
                                    job.status === 'Selected' ? '#E8F5E9' : '#FFF',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="Not Applied">Not Applied</option>
                        <option value="Applied">Applied</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                    </select>

                    <button
                        onClick={() => onToggleSave(job.id)}
                        style={{
                            background: 'none',
                            border: `1px solid ${isSaved ? 'var(--color-accent)' : '#e0e0e0'}`,
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            color: isSaved ? 'var(--color-accent)' : '#666',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                            padding: '6px 16px',
                            fontSize: '13px',
                            textDecoration: 'none'
                        }}
                    >
                        Apply
                    </a>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
