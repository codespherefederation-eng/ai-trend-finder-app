import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server'; // <--- Ensure this path is correct

// ENVIRONMENT VARIABLE SETUP
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

// Initialize Supabase Client for Server-Side (API) operations
const supabase = createClient(supabaseUrl, supabaseKey);

// --- The GET Handler for the /api/trends endpoint ---
export async function GET(request) {
    try {
        // Fetch ALL rows from the 'trend_aggregates' table.
        const { data, error } = await supabase
            .from('trend_aggregates')
            .select('*');

        if (error) {
            console.error('Supabase Fetch Error:', error);
            // Return an error response if the database query fails
            return NextResponse.json({ 
                error: 'Database fetch failed', 
                details: error.message 
            }, { status: 500 });
        }

        // Success: Return the fetched data as JSON
        // NextResponse handles serialization automatically
        return NextResponse.json(data);

    } catch (e) {
        console.error('API Server Error:', e.message);
        // Catch any unexpected runtime errors
        return NextResponse.json({ 
            error: 'Internal Server Error', 
            details: e.message 
        }, { status: 500 });
    }
}
