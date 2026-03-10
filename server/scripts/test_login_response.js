const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'akuuu.0538@gmail.com', // one of the users in DB
      password: 'temp_password' // we don't know the password, but we can see the endpoint behavior or just check getting by ID
    });
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.log('Login failed with status', err.response.status, 'message:', err.response.data.message);
    } else {
      console.error(err);
    }
  }
}

testLogin();
