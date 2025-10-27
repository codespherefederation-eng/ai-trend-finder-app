/ app/api/trends/route.js
// Final clean version for Next.js App Router (Render Compatible)

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Next.js automatically finds these environment variables from Render
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase Client (This will be called only on the server side)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export async function GET(request) {
    // Basic check, though Render should handle this
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error("CRITICAL ERROR: Supabase environment keys are missing!");
        return NextResponse.json({ error: 'Configuration Error: Missing API Keys' }, { status: 500 });
    }

    try {
        // Fetch only the necessary columns
        let { data, error } = await supabase
            .from('trend_aggregates')
            .select('metric_name, value');

        if (error) {
            console.error("Supabase API Error:", error);
            return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
        }
        
        // Return the data as a JSON response
        return NextResponse.json(data);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
