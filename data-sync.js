// Data synchronization for School Dismissal Manager
const dataSync = {
  // Store for our data
  data: {
    students: [],
    classes: [],
    timestamp: 0
  },
  
  // Initialize the data sync system
  init: async function() {
    console.log('Initializing data synchronization...');
    
    // Try to load data from localStorage first (for faster startup)
    const localData = this.loadFromLocalStorage();
    if (localData) {
      this.data = localData;
      console.log('Loaded data from localStorage');
    }
    
    // Then fetch from server to get the latest
    try {
      await this.fetchFromServer();
    } catch (error) {
      console.error('Error fetching data from server:', error);
    }
    
    // Set up periodic sync (every 30 seconds)
    setInterval(() => this.fetchFromServer(), 30000);
    
    return this.data;
  },
  
  // Load data from localStorage
  loadFromLocalStorage: function() {
    try {
      const dataStr = localStorage.getItem('schoolData');
      if (dataStr) {
        return JSON.parse(dataStr);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return null;
  },
  
  // Save data to localStorage
  saveToLocalStorage: function() {
    try {
      localStorage.setItem('schoolData', JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  // Fetch data from the server
  fetchFromServer: async function() {
    try {
      const response = await fetch('/.netlify/functions/studentData');
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const serverData = await response.json();
      
      // Only update if server data is newer
      if (!this.data.timestamp || serverData.timestamp > this.data.timestamp) {
        console.log('Updating local data with server data');
        this.data = serverData;
        this.saveToLocalStorage();
        
        // Dispatch an event so the UI can update
        const event = new CustomEvent('dataUpdated', { detail: this.data });
        document.dispatchEvent(event);
      } else if (this.data.timestamp > serverData.timestamp) {
        // Our data is newer, push to server
        console.log('Local data is newer, pushing to server');
        this.pushToServer();
      }
      
      return this.data;
    } catch (error) {
      console.error('Error fetching from server:', error);
      throw error;
    }
  },
  
  // Push data to the server
  pushToServer: async function() {
    try {
      const response = await fetch('/.netlify/functions/studentData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.data)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Data pushed to server successfully');
      
      // Update our timestamp
      this.data.timestamp = result.timestamp;
      this.saveToLocalStorage();
      
      return result;
    } catch (error) {
      console.error('Error pushing to server:', error);
      throw error;
    }
  },
  
  // Update data and sync with server
  updateData: async function(newData) {
    // Merge the new data with our existing data
    this.data = {
      ...this.data,
      ...newData,
      timestamp: Date.now()
    };
    
    // Save locally first
    this.saveToLocalStorage();
    
    // Then push to server
    try {
      await this.pushToServer();
      
      // Dispatch an event so the UI can update
      const event = new CustomEvent('dataUpdated', { detail: this.data });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Error updating data:', error);
    }
    
    return this.data;
  },
  
  // Add a new student
  addStudent: async function(student) {
    // Add ID if not provided
    if (!student.id) {
      student.id = 'student_' + Date.now();
    }
    
    // Add to our students array
    this.data.students.push(student);
    
    // Update and sync
    return this.updateData({ students: this.data.students });
  },
  
  // Update a student
  updateStudent: async function(studentId, updates) {
    // Find the student
    const index = this.data.students.findIndex(s => s.id === studentId);
    if (index === -1) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    
    // Update the student
    this.data.students[index] = {
      ...this.data.students[index],
      ...updates
    };
    
    // Update and sync
    return this.updateData({ students: this.data.students });
  },
  
  // Add a new class
  addClass: async function(classData) {
    // Add ID if not provided
    if (!classData.id) {
      classData.id = 'class_' + Date.now();
    }
    
    // Add to our classes array
    this.data.classes.push(classData);
    
    // Update and sync
    return this.updateData({ classes: this.data.classes });
  },
  
  // Update a class
  updateClass: async function(classId, updates) {
    // Find the class
    const index = this.data.classes.findIndex(c => c.id === classId);
    if (index === -1) {
      throw new Error(`Class with ID ${classId} not found`);
    }
    
    // Update the class
    this.data.classes[index] = {
      ...this.data.classes[index],
      ...updates
    };
    
    // Update and sync
    return this.updateData({ classes: this.data.classes });
  }
};

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  dataSync.init().then(data => {
    console.log('Data sync initialized with data:', data);
  });
});
