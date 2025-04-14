//const bcrypt = require('bcrypt');

async function handleLogin(username, password) {
	  try {
		      // 1. Find the user in the database by username
		  const result = await dbClient.query(
		             'SELECT user_id, hashed_password FROM users WHERE username = $1', // Assuming you stored 'hashed_password'
              [username]
          );

          if (result.rows.length > 0) {
              const user = result.rows[0];
              const storedHashedPassword = user.hashed_password;

              // 2. Compare the password the user entered (password) with the stored hash
              const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

              if (passwordMatch) {
                  return { success: true, message: 'Login successful!' };
              } else {
                  return { success: false, message: 'Incorrect password.' };
              }
              } else {
              return { success: false, message: 'User not found.' };
          }
          } catch (error) {
          console.error('Error during login:', error);
          return { success: false, message: 'Something went wrong!' };
          }
    }

module.exports = { handleLogin };
