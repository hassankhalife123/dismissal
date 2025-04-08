// Data Synchronization Integration for School Dismissal Manager
// This script adds data synchronization capabilities while preserving original functionality

// Initialize data synchronization when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data sync if available
    if (typeof dataSync !== 'undefined') {
        // Add sync status indicator to the header
        const systemStatusBar = document.querySelector('.mt-4.p-2.bg-blue-50');
        if (systemStatusBar) {
            const syncStatusBar = document.createElement('div');
            syncStatusBar.className = 'mt-2 p-2 bg-green-50 dark:bg-green-900 rounded-lg text-center';
            syncStatusBar.innerHTML = `
                <span id="syncStatus" class="text-green-700 dark:text-green-200">
                    <i class="fas fa-sync mr-1"></i> Initializing data synchronization...
                </span>
            `;
            systemStatusBar.after(syncStatusBar);
        }
        
        // Initialize data sync
        initializeDataSync();
    }
});

// Initialize data synchronization
async function initializeDataSync() {
    try {
        // Initialize with current data
        const currentData = {
            students: window.students || [],
            classes: window.classesData || [],
            systemMode: window.systemMode || 'morning'
        };
        
        await dataSync.init(currentData);
        
        // Update sync status
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Data synchronized successfully';
        }
        
        // Listen for data updates from other devices
        document.addEventListener('dataUpdated', function(event) {
            console.log("Data was updated from another device");
            
            // Update local variables with synchronized data
            updateLocalDataFromSync();
            
            // Refresh current view
            refreshCurrentView();
        });
        
        console.log("Data synchronization initialized successfully");
    } catch (error) {
        console.error("Error initializing data sync:", error);
        
        // Update sync status to show error
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Sync error: ' + error.message;
            syncStatus.className = 'text-red-700 dark:text-red-200';
        }
    }
}

// Update local data variables from synchronized data
function updateLocalDataFromSync() {
    if (typeof dataSync !== 'undefined' && dataSync.data) {
        // Update students
        if (dataSync.data.students) {
            window.students = dataSync.data.students;
        }
        
        // Update classes
        if (dataSync.data.classes) {
            window.classesData = dataSync.data.classes;
        }
        
        // Update system mode
        if (dataSync.data.systemMode) {
            window.systemMode = dataSync.data.systemMode;
            updateSystemStatus();
        }
        
        console.log("Local data updated from synchronized data");
    }
}

// Refresh the current view based on what's active
function refreshCurrentView() {
    // Determine which view is currently active
    if (document.getElementById('adminView') && !document.getElementById('adminView').classList.contains('hidden')) {
        refreshAdminView();
    } else if (document.getElementById('receptionView') && !document.getElementById('receptionView').classList.contains('hidden')) {
        refreshReceptionView();
    } else if (document.getElementById('securityView') && !document.getElementById('securityView').classList.contains('hidden')) {
        refreshSecurityView();
    } else if (document.getElementById('teacherView') && !document.getElementById('teacherView').classList.contains('hidden')) {
        refreshTeacherView();
    }
}

// Wrapper for saving student data
async function saveStudentData(students) {
    // Save to local variable
    window.students = students;
    
    // Save to localStorage (original behavior)
    localStorage.setItem('students', JSON.stringify(students));
    
    // Sync if available
    if (typeof dataSync !== 'undefined') {
        try {
            await dataSync.updateData({ students: students });
            console.log("Student data synchronized");
        } catch (error) {
            console.error("Error synchronizing student data:", error);
        }
    }
    
    // Show auto-save notification (original behavior)
    showAutoSaveNotification();
}

// Wrapper for saving class data
async function saveClassData(classes) {
    // Save to local variable
    window.classesData = classes;
    
    // Save to localStorage (original behavior)
    localStorage.setItem('classesData', JSON.stringify(classes));
    
    // Sync if available
    if (typeof dataSync !== 'undefined') {
        try {
            await dataSync.updateData({ classes: classes });
            console.log("Class data synchronized");
        } catch (error) {
            console.error("Error synchronizing class data:", error);
        }
    }
    
    // Show auto-save notification (original behavior)
    showAutoSaveNotification();
}

// Wrapper for saving system mode
async function saveSystemMode(mode) {
    // Save to local variable
    window.systemMode = mode;
    
    // Save to localStorage (original behavior)
    localStorage.setItem('systemMode', mode);
    
    // Sync if available
    if (typeof dataSync !== 'undefined') {
        try {
            await dataSync.updateData({ systemMode: mode });
            console.log("System mode synchronized");
        } catch (error) {
            console.error("Error synchronizing system mode:", error);
        }
    }
}

// Wrapper for adding a student
async function addStudentWrapper(studentData) {
    // Get current students
    let students = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.students) {
        students = [...dataSync.data.students];
    } else {
        students = JSON.parse(localStorage.getItem('students') || '[]');
    }
    
    // Add the new student
    students.push(studentData);
    
    // Save the updated students
    await saveStudentData(students);
    
    // Refresh the view
    refreshCurrentView();
}

// Wrapper for updating a student
async function updateStudentWrapper(studentId, updatedData) {
    // Get current students
    let students = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.students) {
        students = [...dataSync.data.students];
    } else {
        students = JSON.parse(localStorage.getItem('students') || '[]');
    }
    
    // Find and update the student
    const studentIndex = students.findIndex(s => s.id == studentId);
    if (studentIndex !== -1) {
        students[studentIndex] = { ...students[studentIndex], ...updatedData };
        
        // Save the updated students
        await saveStudentData(students);
        
        // Refresh the view
        refreshCurrentView();
    }
}

// Wrapper for deleting a student
async function deleteStudentWrapper(studentId) {
    // Get current students
    let students = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.students) {
        students = [...dataSync.data.students];
    } else {
        students = JSON.parse(localStorage.getItem('students') || '[]');
    }
    
    // Filter out the student to delete
    students = students.filter(s => s.id != studentId);
    
    // Save the updated students
    await saveStudentData(students);
    
    // Refresh the view
    refreshCurrentView();
}

// Wrapper for adding a class
async function addClassWrapper(classData) {
    // Get current classes
    let classes = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.classes) {
        classes = [...dataSync.data.classes];
    } else {
        classes = JSON.parse(localStorage.getItem('classesData') || '[]');
    }
    
    // Add the new class
    classes.push(classData);
    
    // Save the updated classes
    await saveClassData(classes);
    
    // Refresh the view
    refreshCurrentView();
}

// Wrapper for updating a class
async function updateClassWrapper(classId, updatedData) {
    // Get current classes
    let classes = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.classes) {
        classes = [...dataSync.data.classes];
    } else {
        classes = JSON.parse(localStorage.getItem('classesData') || '[]');
    }
    
    // Find and update the class
    const classIndex = classes.findIndex(c => c.id == classId);
    if (classIndex !== -1) {
        classes[classIndex] = { ...classes[classIndex], ...updatedData };
        
        // Save the updated classes
        await saveClassData(classes);
        
        // Refresh the view
        refreshCurrentView();
    }
}

// Wrapper for deleting a class
async function deleteClassWrapper(classId) {
    // Get current classes
    let classes = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.classes) {
        classes = [...dataSync.data.classes];
    } else {
        classes = JSON.parse(localStorage.getItem('classesData') || '[]');
    }
    
    // Filter out the class to delete
    classes = classes.filter(c => c.id != classId);
    
    // Save the updated classes
    await saveClassData(classes);
    
    // Refresh the view
    refreshCurrentView();
}

// Wrapper for bulk importing students
async function bulkImportStudentsWrapper(studentsToImport) {
    // Get current students
    let students = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.students) {
        students = [...dataSync.data.students];
    } else {
        students = JSON.parse(localStorage.getItem('students') || '[]');
    }
    
    // Add the new students
    students = [...students, ...studentsToImport];
    
    // Save the updated students
    await saveStudentData(students);
    
    // Refresh the view
    refreshCurrentView();
}

// Wrapper for resetting all student statuses
async function resetAllStudentStatusesWrapper() {
    // Get current students
    let students = [];
    if (typeof dataSync !== 'undefined' && dataSync.data && dataSync.data.students) {
        students = [...dataSync.data.students];
    } else {
        students = JSON.parse(localStorage.getItem('students') || '[]');
    }
    
    // Reset all statuses to "waiting"
    students = students.map(student => ({
        ...student,
        status: "waiting",
        exitGate: null,
        statusReason: ""
    }));
    
    // Save the updated students
    await saveStudentData(students);
    
    // Refresh the view
    refreshCurrentView();
}

// Wrapper for creating a data backup
function createDataBackupWrapper() {
    // Get current data
    let data = {
        students: [],
        classes: [],
        systemMode: 'morning',
        timestamp: Date.now()
    };
    
    // Get data from sync if available, otherwise from localStorage
    if (typeof dataSync !== 'undefined' && dataSync.data) {
        data.students = dataSync.data.students || [];
        data.classes = dataSync.data.classes || [];
        data.systemMode = dataSync.data.systemMode || 'morning';
    } else {
        data.students = JSON.parse(localStorage.getItem('students') || '[]');
        data.classes = JSON.parse(localStorage.getItem('classesData') || '[]');
        data.systemMode = localStorage.getItem('systemMode') || 'morning';
    }
    
    return data;
}

// Wrapper for restoring data from backup
async function restoreDataFromBackupWrapper(backupData) {
    // Update local variables
    window.students = backupData.students || [];
    window.classesData = backupData.classes || [];
    window.systemMode = backupData.systemMode || 'morning';
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(window.students));
    localStorage.setItem('classesData', JSON.stringify(window.classesData));
    localStorage.setItem('systemMode', window.systemMode);
    
    // Sync if available
    if (typeof dataSync !== 'undefined') {
        try {
            await dataSync.updateData({
                students: window.students,
                classes: window.classesData,
                systemMode: window.systemMode
            });
            console.log("Backup data synchronized");
        } catch (error) {
            console.error("Error synchronizing backup data:", error);
        }
    }
    
    // Update system status
    updateSystemStatus();
    
    // Refresh the view
    refreshCurrentView();
}

// Function to override original functions with wrapper versions
function overrideOriginalFunctions() {
    // Store original functions if they exist
    const originalFunctions = {
        saveStudentData: window.saveStudentData,
        saveClassData: window.saveClassData,
        saveSystemMode: window.saveSystemMode,
        addStudent: window.addStudent,
        updateStudent: window.updateStudent,
        deleteStudent: window.deleteStudent,
        addClass: window.addClass,
        updateClass: window.updateClass,
        deleteClass: window.deleteClass,
        bulkImportStudents: window.bulkImportStudents,
        resetAllStudentStatuses: window.resetAllStudentStatuses,
        createDataBackup: window.createDataBackup,
        restoreDataFromBackup: window.restoreDataFromBackup
    };
    
    // Override with wrapper functions
    window.saveStudentData = saveStudentData;
    window.saveClassData = saveClassData;
    window.saveSystemMode = saveSystemMode;
    window.addStudent = addStudentWrapper;
    window.updateStudent = updateStudentWrapper;
    window.deleteStudent = deleteStudentWrapper;
    window.addClass = addClassWrapper;
    window.updateClass = updateClassWrapper;
    window.deleteClass = deleteClassWrapper;
    window.bulkImportStudents = bulkImportStudentsWrapper;
    window.resetAllStudentStatuses = resetAllStudentStatusesWrapper;
    window.createDataBackup = createDataBackupWrapper;
    window.restoreDataFromBackup = restoreDataFromBackupWrapper;
    
    // Store original functions for potential fallback
    window._originalFunctions = originalFunctions;
}

// Call the override function when the script loads
overrideOriginalFunctions();
