// app/components/PremiumButton.jsx
"use client";

import React from 'react';

export default function PremiumButton() {
    return (
        <div style={{ textAlign: 'center', padding: '20px', background: '#fff3cd', borderRadius: '15px' }}>
            <h3 style={{ margin: 0, color: '#856404' }}>Don't Just Watch. ACT!</h3>
            <p style={{ fontSize: '1.1em' }}>Get instant **SMS/Email alerts** the moment a trend shifts. **Be the first to know.**</p>
            <button 
                onClick={() => alert("Redirect to payment page for Premium Alerts!")}
                style={{ background: '#ffc107', color: 'black', border: 'none', padding: '12px 25px', fontSize: '1.2em', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>
                Unlock Premium Alerts Now 💰
            </button>
        </div>
    );
}