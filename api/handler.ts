import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
// import supabase  from "../src/supabase.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { identifier } = request.query;
  const supabaseUrl = 'https://nfzttdrvnjxlwdllziia.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5menR0ZHJ2bmp4bHdkbGx6aWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYwODIxNDcsImV4cCI6MjAwMTY1ODE0N30.XtA0FFtAelqBvREwlXRgH-5ToXW7f_dmSHORckTJ84Y';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    const { data: links, error } = await supabase
      .from('links')
      .select('original_url')
      .eq('identifier', identifier)
      .single();

    if (error || !links) {
      console.log(error, links, 'hello')
      return response.status(404).json({ message: 'URL not found' });
    }

    return response.redirect(301, links.original_url);
  } catch (error) {
    console.error('Error fetching original URL from Supabase:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}
