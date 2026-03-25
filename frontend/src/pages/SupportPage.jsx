import React, { useState } from 'react';
import FeedbackForm from '../components/FeedbackForm.jsx';
import ComplaintForm from '../components/ComplaintForm.jsx';

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('feedback');

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Support</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'feedback' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'feedback' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Give Feedback
          </button>
          <button
            onClick={() => setActiveTab('complaint')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'complaint' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'complaint' ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Make Complaint
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          {activeTab === 'feedback' && (
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h3>Feedback</h3>
              <p>Share your ideas, suggestions, or experience to improve the canteen service.</p>
            </div>
          )}
          {activeTab === 'complaint' && (
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h3>Complaint</h3>
              <p>Report a problem or bad experience that needs attention.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        {activeTab === 'feedback' && <FeedbackForm />}
        {activeTab === 'complaint' && <ComplaintForm />}
      </div>
    </div>
  );
};

export default SupportPage;
