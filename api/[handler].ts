
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const { identifier } = request.query;
  console.log('identifier:', identifier)
  
  // Extract identifier from URL path
  const identifierFromPath = request.url?.replace('/', '');
 console.log('identifier from path:',identifierFromPath)
  const supabaseUrl = 'https://nfzttdrvnjxlwdllziia.supabase.co';
  
  // eslint-disable-next-line
  // @ts-ignore
  const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_KEY);
  
  try {
    const { data: links, error } = await supabase
      .from('links')
      .select('original_url')
      .eq('identifier', identifier)
      .single();

    if (error || !links) {
      console.log('error:', error)
      console.log('links:', links)
      return response.status(404).json({ message: 'URL not found' });
    }

    return response.redirect(301, links.original_url);
  } catch (error) {
    console.error('Error fetching original URL from Supabase:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}
