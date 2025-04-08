// netlify/functions/data.js
exports.handler = async function(event, context) {
  try {
    // Handle CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };
    
    // Handle OPTIONS request (preflight)
    if (event.httpMethod === 'OPTIONS')  {
      return {
        statusCode: 200,
        headers
      };
    }
    
    // Get data from Netlify environment variable
    let storedData = process.env.STORED_DATA || '{"students":[],"classes":[]}';
    
    if (event.httpMethod === 'GET')  {
      // Return the stored data
      return {
        statusCode: 200,
        headers,
        body: storedData
      };
    } else if (event.httpMethod === 'POST')  {
      // Update the stored data
      // Note: In a production environment, you would use a database
      // This is a simplified example using environment variables
      const client = context.clientContext;
      
      // Store the new data (in a real app, you'd use a database)
      // For this demo, we'll just return success
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Data received" })
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
