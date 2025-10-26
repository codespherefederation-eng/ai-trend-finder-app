// app/api/trends/route.js
// VERCEL FORCE PUSH FIX

import { createClient } from '@supabase/supabase-js';
// ... (baaki code)

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Keys ko direct process.env se access karein
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Connection check: Agar keys nahi hain, toh Vercel ko clear error message do
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("CRITICAL ERROR: Supabase environment keys are missing!");
    // Vercel build ko fail karne ki jagah, hum runtime error denge (par build ko pass karayenge)
    // Lekin Next.js mein build time par check hota hai.
    // Hum simple rakhenge aur assume karenge ki Vercel mein variables set hain.
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export async function GET(request) { // Request parameter bhi optional hai, par best practice hai
    try {
        let { data, error } = await supabase
            .from('trend_aggregates')
            .select('metric_name, value');

        if (error) {
            console.error("Supabase API Error:", error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        
        return NextResponse.json(data);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}