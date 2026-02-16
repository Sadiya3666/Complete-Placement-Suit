import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import RBLayout from '../../components/RBLayout';
import { RB_STEPS } from '../../data/rb_steps';

const RBStep = () => {
    const { stepId } = useParams();
    const stepData = RB_STEPS.find(s => s.id === stepId);

    // Gating Logic: Check if previous step is completed
    const currentIndex = RB_STEPS.findIndex(s => s.id === stepId);
    if (currentIndex > 0) {
        const previousStep = RB_STEPS[currentIndex - 1];
        const isPreviousCompleted = localStorage.getItem(previousStep.artifactKey);
        if (!isPreviousCompleted) {
            return <Navigate to={`/rb/${previousStep.id}`} replace />;
        }
    }

    if (!stepData) {
        return <Navigate to="/rb/01-problem" replace />;
    }

    return (
        <RBLayout
            step={stepData.id}
            title={stepData.title}
            subtitle={stepData.subtitle}
            prompt={stepData.prompt}
            artifactKey={stepData.artifactKey}
        >
            <div style={{ lineHeight: '1.8', color: 'var(--color-text-primary)' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Instructions</h2>
                <p>
                    For this step, you need to use the prompt provided in the right panel to initialize the {stepData.title.toLowerCase()} phase.
                </p>
                <div style={{ backgroundColor: '#FDFCFB', padding: '24px', borderRadius: '8px', border: '1px solid #f0efeb', marginTop: '24px' }}>
                    <h4 style={{ marginBottom: '12px', color: 'var(--color-accent)' }}>What to expect:</h4>
                    <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>Detailed analysis from the AI regarding {stepData.title.toLowerCase()}.</li>
                        <li>Structural suggestions for the resume builder system.</li>
                        <li>Refinement of goals based on current market trends.</li>
                    </ul>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <p>Once you get the response from Lovable, copy the key findings and paste them into the artifact area below to unlock the next step.</p>
                </div>
            </div>
        </RBLayout>
    );
};

export default RBStep;
