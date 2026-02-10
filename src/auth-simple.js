// Simple authentication system without Firebase
export const simpleAuth = {
  // Predefined users
  users: [
    {
      id: 'admin-123',
      email: 'admin@church.com',
      password: 'admin123',
      name: 'Church Administrator',
      role: 'admin'
    },
    {
      id: 'member-123',
      email: 'member@church.com',
      password: 'member123',
      name: 'Church Member',
      role: 'member'
    }
  ],

  // Simple login function
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Attempting login with:', email, password); // Debug log
        const user = simpleAuth.users.find(u => u.email === email && u.password === password);
        console.log('Found user:', user); // Debug log
        if (user) {
          // Store current user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log('User stored in localStorage:', user); // Debug log
          resolve({ success: true, user });
        } else {
          console.log('Login failed - user not found'); // Debug log
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },

  // Logout function
  logout: async () => {
    localStorage.removeItem('currentUser');
    return { success: true };
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check auth state
  onAuthChange: (callback) => {
    // Simulate auth state change
    const user = simpleAuth.getCurrentUser();
    console.log('Current user from localStorage:', user); // Debug log
    callback(user);
    return () => {}; // Return unsubscribe function
  }
};

export default simpleAuth;
