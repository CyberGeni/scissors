import { Handler } from '@netlify/functions';
import supabase from '../../src/supabase';

export const handler: Handler = async (event) => {
  const { identifier } = event.queryStringParameters || {};

  try {
    // Fetch the original URL from the database using the identifier
    const { data, error } = await supabase
      .from('links')
      .select('original_url')
      .eq('identifier', identifier)
      .single();

    if (error || !data) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'URL not found',
        }),
      };
    }

    // Redirect to the original URL
    return {
      statusCode: 301,
      headers: {
        Location: data.original_url,
      },
      body: '',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};
