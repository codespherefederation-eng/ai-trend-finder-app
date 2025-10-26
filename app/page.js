"use client";
// app/page.js

// --- MODIFIED SERVER-SIDE DATA FETCHING (Using Internal API) ---
async function fetchAggregatedTrends() {
    // Environment variable 'NEXT_PUBLIC_BASE_URL' abhi hum Vercel mein set karenge.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; 
    
    // Apne hi naye API route ko call karein
    const response = await fetch(`${baseUrl}/api/trends`, {
        // Data ko har 1 ghante (3600 seconds) mein server par refresh karein
        next: { revalidate: 3600 } 
    });

    if (!response.ok) {
        console.error("Failed to fetch data from internal API. Status:", response.status);
        return null;
    }
    
    const data = await response.json(); // Data JSON format mein aayega
    
    const trendMap = data.reduce((acc, item) => {
        acc[item.metric_name] = item.value;
        return acc;
    }, {});

    return trendMap;
}

// ... (Rest of the code)

// app/page.js

// --- MODIFIED SERVER-SIDE DATA FETCHING (Using Internal API) ---
async function fetchAggregatedTrends() {
    // ... (This function uses 'fetch' and is correct) ...
    const response = await fetch(`${baseUrl}/api/trends`, { /* ... */ });
    // ...
}

// ... (Rest of the code, including the MarketPulseDashboard component)


// --- THE AWESOME FRONTEND COMPONENT ---
export default async function MarketPulseDashboard() {
    const trends = await fetchAggregatedTrends();

    if (!trends) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Server error or data not found. Please run your Python pipeline.</div>;
    }

    // Data ko aasani se nikalna
    const sentiment = trends.Overall_Sentiment_Score?.score || 0;
    const bullishKeywords = trends.Top_Bullish_Keywords || {};
    const bearishKeywords = trends.Top_Bearish_Keywords || {};

    const sentimentColor = sentiment >= 0 ? 'green' : 'red';
    const sentimentText = sentiment >= 0 ? 'BULLISH' : 'BEARISH';

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            
            {/* 1. AWESOME TITLE & BRANDING (Catching Population) */}
            <h1 style={{ color: '#0070f3', textAlign: 'center' }}>
                AI Micro-Trends Finder 🚀
            </h1>
            <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#555' }}>
                Unfiltered Retail Sentiment from India's Top Financial Communities. Updated every 4 hours.
            </p>

            <hr style={{ margin: '30px 0' }} />

            {/* 2. THE MARKET PULSE GAUGE (The Hook) */}
            <div style={{ textAlign: 'center', border: `3px solid ${sentimentColor}`, borderRadius: '15px', padding: '20px', background: '#f9f9f9' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Current Market Sentiment</h2>
                <p style={{ fontSize: '4em', fontWeight: 'bold', color: sentimentColor }}>
                    {sentiment.toFixed(1)}% {sentimentText} 
                </p>
                <p style={{ color: '#777' }}>Based on {trends.Overall_Sentiment_Score?.total_posts || 0} recent AI-analyzed posts.</p>
            </div>

            <hr style={{ margin: '30px 0' }} />

            {/* 3. TRENDING KEYWORDS (The Insights) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                
                {/* BULLISH TRENDS */}
                <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '10px', background: '#e6ffe6' }}>
                    <h3 style={{ color: 'green', borderBottom: '2px solid green', paddingBottom: '10px' }}>🔥 Top Bullish Trends</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {Object.entries(bullishKeywords).map(([word, count]) => (
                            <li key={word} style={{ fontSize: '1.1em', padding: '5px 0' }}>
                                🟢 **{word}** <span style={{ float: 'right', fontWeight: 'normal', color: '#555' }}>({count} Mentions)</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BEARISH TRENDS */}
                <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '10px', background: '#ffe6e6' }}>
                    <h3 style={{ color: 'red', borderBottom: '2px solid red', paddingBottom: '10px' }}>🥶 Top Bearish Trends</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {Object.entries(bearishKeywords).map(([word, count]) => (
                            <li key={word} style={{ fontSize: '1.1em', padding: '5px 0' }}>
                                🔴 **{word}** <span style={{ float: 'right', fontWeight: 'normal', color: '#555' }}>({count} Mentions)</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <hr style={{ margin: '30px 0' }} />

            {/* 4. THE 100X GROWTH HOOK (Monetization Funnel) */}
            <div style={{ textAlign: 'center', padding: '20px', background: '#fff3cd', borderRadius: '15px' }}>
                <h3 style={{ margin: 0, color: '#856404' }}>Don't Just Watch. ACT!</h3>
                <p style={{ fontSize: '1.1em' }}>Get instant **SMS/Email alerts** the moment a trend shifts. **Be the first to know.**</p>
                <button 
                    onClick={() => alert("Redirect to payment page for Premium Alerts!")}
                    style={{ background: '#ffc107', color: 'black', border: 'none', padding: '12px 25px', fontSize: '1.2em', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>
                    Unlock Premium Alerts Now 💰
                </button>
            </div>
        </div>
    );
}