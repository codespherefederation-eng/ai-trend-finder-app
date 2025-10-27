// app/page.js
import React from 'react'; // React import karna zaroori hai

// IMPORTANT: No "use client"; directive is present here, 
// ensuring this file runs as a Server Component for SEO and speed.

// --- SERVER-SIDE DATA FETCHING (Using Secure Internal API) ---
async function fetchAggregatedTrends() {
    try {
        // Fetch call to your internal API route
        const response = await fetch(`/api/trends`, { 
            cache: 'no-store' // This prevents caching issues during the build process
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Fetch Failed: ${response.statusText}. Details: ${errorText.substring(0, 100)}`);
            throw new Error('Failed to fetch data from internal API. Status: ' + response.status);
        }

        return response.json();

    } catch (error) {
        // CRITICAL FIX: If the fetch fails during build, we return an empty array instead of crashing.
        console.error('BUILD-TIME CRASH PREVENTED:', error.message);
        return [];
    }
}

// --- THE AWESOME FRONTEND COMPONENT ---
export default async function MarketPulseDashboard() {
    const trends = await fetchAggregatedTrends();

    // 🔴 CRITICAL BUILD/DATA FIX STARTS HERE 🔴
    // Agar trends empty array hai (build ke waqt fetch fail hone par), toh error card dikhayein
    if (!trends || trends.length === 0 || trends.error) {
        return (
            <main style={{ minHeight: '100vh', padding: '32px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px', border: '2px solid #f8d7da' }}>
                    <h1 style={{ fontSize: '2em', fontWeight: 'bold', color: '#dc3545', marginBottom: '16px' }}>🔴 Data Pipeline Offline</h1>
                    <p style={{ color: '#495057', fontSize: '1.1em' }}>The AI Trend data is not available. This is usually because the **Cron Job** (Python pipeline on Render) has not run yet or failed to access the database.</p>
                    <p style={{ color: '#495057', marginTop: '8px' }}>Once the job runs successfully (check Render logs), the dashboard will automatically load.</p>
                </div>
            </main>
        );
    }
    // 🔴 CRITICAL BUILD/DATA FIX ENDS HERE 🔴
    
    // Data ko aasani se nikalna (Data format assumptions ke saath)
    // Aapka fetch sirf ek array of objects return kar raha hai, jismein se humein values dhoondhni hain.
    // Hum trends array ko ek Map mein convert kar rahe hain taaki aasani se access kar sakein.
    const trendMap = trends.reduce((map, item) => {
        map[item.metric_name] = item.value;
        return map;
    }, {});

    const sentimentData = trendMap['Overall_Sentiment_Score'] || { score: 0, total_posts: 0 };
    const sentiment = sentimentData.score || 0;
    const bullishKeywords = trendMap['Top_Bullish_Keywords'] || {};
    const bearishKeywords = trendMap['Top_Bearish_Keywords'] || {};

    const sentimentColor = sentiment >= 0 ? '#28a745' : '#dc3545';
    const sentimentText = sentiment >= 0 ? 'BULLISH' : 'BEARISH';
    const postCount = sentimentData.total_posts || 0;


    return (
        <div style={{ fontFamily: 'Inter, Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f9fafb' }}>
            
            {/* 1. AWESOME TITLE & BRANDING (Catching Population) */}
            <h1 style={{ color: '#0070f3', textAlign: 'center', fontSize: '2.5em', fontWeight: 'bold' }}>
                AI Micro-Trends Finder 🚀
            </h1>
            <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#555', marginBottom: '40px' }}>
                Unfiltered Retail Sentiment from India's Top Financial Communities. Updated every 4 hours.
            </p>

            {/* 2. THE MARKET PULSE GAUGE (The Hook) */}
            <div style={{ textAlign: 'center', border: `3px solid ${sentimentColor}`, borderRadius: '15px', padding: '30px', background: '#ffffff', boxShadow: '0 6px 15px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.5em' }}>Current Market Sentiment</h2>
                <p style={{ fontSize: '4.5em', fontWeight: 'bolder', color: sentimentColor, margin: '10px 0' }}>
                    {sentiment.toFixed(1)}% {sentimentText} 
                </p>
                <p style={{ color: '#777', fontSize: '1em' }}>Based on {postCount} recent AI-analyzed posts.</p>
            </div>

            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px dashed #ccc' }} />

            {/* 3. TRENDING KEYWORDS (The Insights) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                
                {/* BULLISH TRENDS */}
                <div style={{ flex: 1, padding: '20px', border: '1px solid #d4edda', borderRadius: '10px', background: '#f0fff4', boxShadow: '0 2px 5px rgba(40,167,69,0.1)' }}>
                    <h3 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '10px', marginBottom: '15px' }}>🔥 Top Bullish Trends</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {Object.entries(bullishKeywords).slice(0, 5).map(([word, count]) => (
                            <li key={word} style={{ fontSize: '1.1em', padding: '8px 0', borderBottom: '1px dotted #e2f0e7' }}>
                                🟢 **{word}** <span style={{ float: 'right', fontWeight: 'normal', color: '#555', backgroundColor: '#e2f0e7', padding: '2px 8px', borderRadius: '4px' }}>{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BEARISH TRENDS */}
                <div style={{ flex: 1, padding: '20px', border: '1px solid #f5c6cb', borderRadius: '10px', background: '#fff0f3', boxShadow: '0 2px 5px rgba(220,53,69,0.1)' }}>
                    <h3 style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '10px', marginBottom: '15px' }}>🥶 Top Bearish Trends</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {Object.entries(bearishKeywords).slice(0, 5).map(([word, count]) => (
                            <li key={word} style={{ fontSize: '1.1em', padding: '8px 0', borderBottom: '1px dotted #f5e2e4' }}>
                                🔴 **{word}** <span style={{ float: 'right', fontWeight: 'normal', color: '#555', backgroundColor: '#f5e2e4', padding: '2px 8px', borderRadius: '4px' }}>{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px dashed #ccc' }} />

            {/* 4. THE 100X GROWTH HOOK (Monetization Funnel) */}
            <div style={{ textAlign: 'center', padding: '30px', background: '#ffe6aa', borderRadius: '15px', border: '1px solid #ffc107' }}>
                <h3 style={{ margin: 0, color: '#856404', fontSize: '1.4em' }}>Don't Just Watch. ACT!</h3>
                <p style={{ fontSize: '1.1em', margin: '10px 0 20px 0' }}>Get instant **SMS/Email alerts** the moment a trend shifts. **Be the first to know.**</p>
                <button 
                    onClick={() => alert("Redirect to payment page for Premium Alerts!")}
                    style={{ 
                        background: '#ffc107', 
                        color: '#333', 
                        border: 'none', 
                        padding: '15px 30px', 
                        fontSize: '1.2em', 
                        fontWeight: 'bolder', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        boxShadow: '0 4px #e0a800'
                    }}>
                    Unlock Premium Alerts Now 💰
                </button>
            </div>
        </div>
    );
