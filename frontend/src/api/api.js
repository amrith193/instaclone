import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/v1' // Localhost for development
      : 'https://api.sapthapadhiswayamvara.in/api', // Cloudflare Tunnel for production
  timeout: 5000, // 5 seconds timeout (optional)
  headers: {
    'Content-Type': 'application/json', // Default headers
  },
});

export default api;




// import axios from 'axios';

// // Create an instance of axios with default configuration
// const api = axios.create({
//   baseURL: 'https://api.sapthapadhiswayamvara.in/api', // Updated with Cloudflare Tunnel URL
//   timeout: 5000, // Timeout after 5 seconds (optional)
//   headers: {
//     'Content-Type': 'application/json', // Default headers
//   },
// });

// export default api;
