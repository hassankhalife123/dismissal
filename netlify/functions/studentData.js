// Netlify Function for Student Data Synchronization
exports.handler = async function(event, context) {
  // Set up CORS headers for cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS')  {
    return {
      statusCode: 200,
      headers
    };
  }

  // Simple in-memory storage (will reset on function cold starts)
  // We'll replace this with a database in production
  let data = {
    students: [],
    classes: [],
    timestamp: Date.now()
  };

  try {
    // GET request - retrieve data
    if (event.httpMethod === 'GET')  {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }
    
    // POST request - update data
    if (event.httpMethod === 'POST')  {
      const payload = JSON.parse(event.body);
      
      // Update our data with the new payload
      data = {
        ...payload,
        timestamp: Date.now()
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          timestamp: data.timestamp
        })
      };
    }
    
    // Method not allowed
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
