// app/api/trends/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// NOTE: Yahan NEXT_PUBLIC_ nahi hai. Yeh keys sirf server par milengi!
const SUPABASE_URL = process.env.SUPABASE_URL; 
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; // Ya Service Role Key agar zaroori ho

// Supabase connection
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET() {
    try {
        let { data, error } = await supabase
            .from('trend_aggregates')
            .select('metric_name, value');

        if (error) {
            console.error("Supabase API Error:", error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        
        // Data ko browser (page.js) ko wapas bhej dena
        return NextResponse.json(data);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}