import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import jobsData from '../data/jobs.json';

const Saved = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobStatuses, setJobStatuses] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const jobs = jobsData.filter(job => savedIds.includes(job.id));
        setSavedJobs(jobs);

        // Load Statuses
        const statuses = JSON.parse(localStorage.getItem('jobTrackerStatus')) || {};
        setJobStatuses(statuses);
    }, []);

    const handleStatusChange = (jobId, newStatus) => {
        const updatedStatuses = { ...jobStatuses, [jobId]: newStatus };
        setJobStatuses(updatedStatuses);
        localStorage.setItem('jobTrackerStatus', JSON.stringify(updatedStatuses));

        // Add to history for Digest
        const history = JSON.parse(localStorage.getItem('jobTrackerStatusHistory')) || [];
        history.unshift({
            jobId,
            status: newStatus,
            date: new Date().toISOString()
        });
        localStorage.setItem('jobTrackerStatusHistory', JSON.stringify(history.slice(0, 50)));

        setToast(`Status updated: ${newStatus}`);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = (id) => {
        // Here, it would only mean unsaving
        const newSaved = savedJobs.filter(job => job.id !== id);
        setSavedJobs(newSaved);

        // Update local storage
        const currentSavedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const newSavedIds = currentSavedIds.filter(savedId => savedId !== id);
        localStorage.setItem('savedJobs', JSON.stringify(newSavedIds));
    };

    const handleView = (job) => {
        setSelectedJob(job);
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-5) var(--spacing-3)' }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: '80px', right: '20px',
                    backgroundColor: '#323232', color: 'white',
                    padding: '12px 24px', borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2000,
                    animation: 'fadeIn 0.3s', fontSize: '14px', fontWeight: 500
                }}>
                    {toast}
                </div>
            )}

            <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-3xl)',
                letterSpacing: '-1px',
                marginBottom: 'var(--spacing-3)',
                textAlign: 'center'
            }}>
                Your Shortlist
            </h1>

            {savedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--color-text-secondary)' }}>
                    <p style={{ fontSize: '18px' }}>You haven't saved any jobs yet.</p>
                    <a href="/dashboard" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
                        Browse Jobs
                    </a>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '24px',
                    marginTop: '32px'
                }}>
                    {savedJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={{
                                ...job,
                                status: jobStatuses[job.id],
                                onStatusChange: handleStatusChange
                            }}
                            isSaved={true}
                            onToggleSave={handleSave}
                            onView={handleView}
                        />
                    ))}
                </div>
            )}
            {selectedJob && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '24px'
                }} onClick={() => setSelectedJob(null)}>
                    <div style={{
                        backgroundColor: 'white', padding: '32px', borderRadius: '8px',
                        maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>{selectedJob.title}</h2>
                        <h4 style={{ color: '#555', marginBottom: '16px' }}>{selectedJob.company} • {selectedJob.location}</h4>

                        <div style={{ marginBottom: '16px' }}>
                            <strong>Skills:</strong> {selectedJob.skills.join(', ')}
                        </div>

                        <p style={{ lineHeight: '1.6', color: '#333', marginBottom: '24px' }}>
                            {selectedJob.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Close</button>
                            <a href={selectedJob.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Apply Now</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Saved;
