import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import jobsData from '../data/jobs.json'; // Importing local dataset

const Dashboard = () => {
    // State for jobs and filter (basic for now)
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        location: 'All',
        mode: 'All',
        experience: 'All',
        source: 'All',
        sort: 'Latest',
        status: 'All'
    });
    const [savedJobs, setSavedJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null); // For modal
    const [matchThreshold, setMatchThreshold] = useState(40);
    const [showOnlyMatches, setShowOnlyMatches] = useState(false);
    const [preferences, setPreferences] = useState(null);
    const [jobStatuses, setJobStatuses] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Load saved jobs from localStorage
        const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
        setSavedJobs(saved);

        // Load Statuses
        const statuses = JSON.parse(localStorage.getItem('jobTrackerStatus')) || {};
        setJobStatuses(statuses);

        // Load Preferences
        const prefs = JSON.parse(localStorage.getItem('jobTrackerPreferences'));
        setPreferences(prefs);

        if (prefs) {
            setMatchThreshold(prefs.minMatchScore);
        }

        // Process jobs with matching logic
        const processJobs = () => {
            const scoredJobs = jobsData.map(job => {
                let score = 0;
                if (!prefs) return { ...job, matchScore: 0 };

                // 1. Role Keyword Match (+25 Title, +15 Description)
                const keywords = prefs.roleKeywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
                let titleMatch = false;
                let descMatch = false;

                keywords.forEach(keyword => {
                    if (job.title.toLowerCase().includes(keyword)) titleMatch = true;
                    if (job.description.toLowerCase().includes(keyword)) descMatch = true;
                });

                if (titleMatch) score += 25;
                if (descMatch) score += 15;

                // 2. Location Match (+15)
                const prefLocs = prefs.preferredLocations.toLowerCase().split(',').map(l => l.trim()).filter(l => l);
                let locMatch = false;
                prefLocs.forEach(loc => {
                    if (job.location.toLowerCase().includes(loc)) locMatch = true;
                });
                if (locMatch) score += 15;

                // 3. Mode Match (+10)
                if (prefs.preferredMode && prefs.preferredMode[job.mode]) {
                    score += 10;
                }

                // 4. Experience Match (+10)
                // Flexible matching for similar levels could be added, but strict for now per spec
                // job.experience example: "Fresher", "0-1", "1-3", "3-5"
                // prefs.experienceLevel example: "Fresher", "0-1 Years", etc.
                if (prefs.experienceLevel.includes(job.experience)) {
                    score += 10;
                }

                // 5. Skills Overlap (+15)
                const userSkills = prefs.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
                const jobSkills = job.skills.map(s => s.toLowerCase());
                const skillOverlap = userSkills.some(us => jobSkills.includes(us));
                if (skillOverlap) score += 15;

                // 6. Recency (+5)
                if (job.postedDaysAgo <= 2) score += 5;

                // 7. Source (+5)
                if (job.source === 'LinkedIn') score += 5;

                return { ...job, matchScore: Math.min(score, 100) };
            });
            setJobs(scoredJobs);
        };

        processJobs();
    }, []); // Empty dependency array means this runs once on mount. If prefs change in another tab, this won't update automatically without a context or event listener, but sufficient for now.

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
        let newSaved;
        if (savedJobs.includes(id)) {
            newSaved = savedJobs.filter(jobId => jobId !== id);
        } else {
            newSaved = [...savedJobs, id];
        }

        setSavedJobs(newSaved);
        localStorage.setItem('savedJobs', JSON.stringify(newSaved));
    };

    const handleView = (job) => {
        setSelectedJob(job);
    };

    const filteredJobs = jobs.filter(job => {
        // 1. Text Search
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Dropdown Filters
        const matchesLocation = filters.location === 'All' || job.location.includes(filters.location);
        const matchesMode = filters.mode === 'All' || job.mode === filters.mode;
        const matchesExp = filters.experience === 'All' || job.experience === filters.experience;
        const matchesSource = filters.source === 'All' || job.source === filters.source;

        // 3. Status Filter
        const jobStatus = jobStatuses[job.id] || 'Not Applied';
        const matchesStatus = filters.status === 'All' || jobStatus === filters.status;

        // 4. Threshold Filter
        const matchesThreshold = !showOnlyMatches || (job.matchScore >= matchThreshold);

        return matchesSearch && matchesLocation && matchesMode && matchesExp && matchesSource && matchesStatus && matchesThreshold;
    }).sort((a, b) => {
        if (filters.sort === 'Latest') {
            return a.postedDaysAgo - b.postedDaysAgo;
        } else if (filters.sort === 'Oldest') {
            return b.postedDaysAgo - a.postedDaysAgo;
        } else if (filters.sort === 'Match Score') {
            return b.matchScore - a.matchScore;
        } else if (filters.sort === 'Salary') {
            // Rough heuristic sort for strings like "10-18 LPA"
            const extractSalary = (str) => {
                const match = str.match(/(\d+)/);
                return match ? parseInt(match[0]) : 0;
            };
            return extractSalary(b.salaryRange) - extractSalary(a.salaryRange);
        }
        return 0;
    });

    return (
        <div className="container" style={{ padding: 'var(--spacing-4) var(--spacing-3)', maxWidth: '1400px' }}>
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

            {/* Preferences Banner */}
            {!preferences && (
                <div style={{
                    backgroundColor: '#FFF4E5',
                    border: '1px solid #FFCC80',
                    color: '#663C00',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span><strong>Action Required:</strong> Set your preferences to activate intelligent matching.</span>
                    <a href="/settings" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Go to Settings →</a>
                </div>
            )}

            {/* Filter Bar */}
            <div style={{
                marginBottom: 'var(--spacing-4)',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)'
            }}>
                <input
                    type="text"
                    placeholder="Search by role or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: '1 1 200px', minWidth: '150px' }}
                />

                <select onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                    <option value="All">All Locations</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Remote">Remote</option>
                </select>

                <select onChange={(e) => setFilters({ ...filters, mode: e.target.value })}>
                    <option value="All">All Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                </select>

                <select onChange={(e) => setFilters({ ...filters, experience: e.target.value })}>
                    <option value="All">All Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1">0-1 Years</option>
                    <option value="1-3">1-3 Years</option>
                    <option value="3-5">3-5 Years</option>
                </select>

                <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                    <option value="All">All Statuses</option>
                    <option value="Not Applied">Not Applied</option>
                    <option value="Applied">Applied</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                </select>

                <select onChange={(e) => setFilters({ ...filters, source: e.target.value })}>
                    <option value="All">All Sources</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Instahyre">Instahyre</option>
                </select>

                <select onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                    <option value="Latest">Latest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Match Score">Match Score</option>
                    <option value="Salary">Salary (High to Low)</option>
                </select>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: 'auto',
                    borderLeft: '1px solid #eee',
                    paddingLeft: '12px'
                }}>
                    <label style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
                        <input
                            type="checkbox"
                            checked={showOnlyMatches}
                            onChange={(e) => setShowOnlyMatches(e.target.checked)}
                            style={{ marginRight: '6px', accentColor: 'var(--color-accent)' }}
                        />
                        Show Matches Only ({matchThreshold}+)
                    </label>
                </div>
            </div>

            {/* Jobs Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '24px'
            }}>
                {filteredJobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={{
                            ...job,
                            status: jobStatuses[job.id],
                            onStatusChange: handleStatusChange
                        }}
                        isSaved={savedJobs.includes(job.id)}
                        onToggleSave={handleSave}
                        onView={handleView}
                    />
                ))}
            </div>

            {/* Empty State if filter returns 0 */}
            {filteredJobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '8px' }}>
                        No roles match your criteria.
                    </h3>
                    <p>Adjust your filters or lower your match threshold.</p>
                </div>
            )}

            {/* Job Detail Modal (Simple Implementation) */}
            {selectedJob && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    padding: '24px'
                }} onClick={() => setSelectedJob(null)}>
                    <div style={{
                        backgroundColor: 'white', padding: '32px', borderRadius: '8px',
                        maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                        position: 'relative' // relative for close button
                    }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedJob(null)} style={{
                            position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer'
                        }}>&times;</button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)' }}>{selectedJob.title}</h2>
                            {selectedJob.matchScore > 0 && (
                                <span style={{
                                    backgroundColor: selectedJob.matchScore >= 80 ? '#E6F4EA' :
                                        selectedJob.matchScore >= 60 ? '#FFF8E1' : '#F5F5F5',
                                    color: selectedJob.matchScore >= 80 ? '#1E8E3E' :
                                        selectedJob.matchScore >= 60 ? '#F9A825' : '#757575',
                                    padding: '4px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '14px'
                                }}>
                                    {selectedJob.matchScore}% Match
                                </span>
                            )}
                        </div>

                        <h4 style={{ color: '#555', marginBottom: '16px' }}>{selectedJob.company} • {selectedJob.location}</h4>

                        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {selectedJob.skills.map((skill, index) => (
                                <span key={index} style={{
                                    backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '13px'
                                }}>{skill}</span>
                            ))}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <p><strong>Experience:</strong> {selectedJob.experience} Years</p>
                            <p><strong>Salary:</strong> {selectedJob.salaryRange}</p>
                            <p><strong>Posted:</strong> {selectedJob.postedDaysAgo === 0 ? 'Today' : `${selectedJob.postedDaysAgo} days ago`}</p>
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

export default Dashboard;
