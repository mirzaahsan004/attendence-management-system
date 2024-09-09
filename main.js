document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const markAttendanceButton = document.getElementById('mark-attendance');
    const viewAttendanceButton = document.getElementById('view-attendence');
    const profileButton = document.getElementById('profile');
    const logoutButton = document.getElementById('logout');
    const editProfileForm = document.getElementById('edit-profile-form');
    const backToDashboardButtons = document.querySelectorAll('#back-to-dashboard');
    const profileInfo = document.getElementById('profile-info');
    const attendanceHistory = document.getElementById('attendance-history');
    const continueButton = document.getElementById('continue-button');
    const adminEmail = "admin@example.com"; // Hardcoded admin email
    const adminPassword = "admin123"; // Hardcoded admin password

    if (continueButton) {
        continueButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', registerUser);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    if (markAttendanceButton) {
        markAttendanceButton.addEventListener('click', markAttendance);
    }

    if (viewAttendanceButton) {
        viewAttendanceButton.addEventListener('click', viewAttendence);
    }

    if (profileButton) {
        profileButton.addEventListener('click', viewProfile);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', editProfile);
    }

    backToDashboardButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    });

    if (document.getElementById('user-name')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        document.getElementById('user-name').innerText = currentUser ? currentUser.name : '';
    }

    if (profileInfo) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.getElementById('profile-picture').src = currentUser.profilePicture;
            document.getElementById('profile-name').innerText = currentUser.name;
            document.getElementById('profile-email').innerText = currentUser.email;
        }
    }

    if (attendanceHistory) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            attendanceHistory.innerHTML = ''; // Clear existing content
            currentUser.attendance.forEach(record => {
                if (record) { // Check if the record exists
                    const recordElement = document.createElement('div');
                    recordElement.innerHTML = `<strong>${record.name}</strong> - ${record.date} (${record.day})`;
                    attendanceHistory.appendChild(recordElement);
                }
            });
        }
    }

    // Admin login form handling
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminAttendanceRecords = document.getElementById('admin-attendance-records');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;

            if (email === adminEmail && password === adminPassword) {
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Invalid admin credentials.');
            }
        });
    }

    if (adminAttendanceRecords) {
        displayAdminAttendanceRecords();
    }
});

function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profilePicture = document.getElementById('profilePicture').files[0];

    if (!name || !email || !password || !profilePicture) {
        alert('Please fill in all fields.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const user = {
            name,
            email,
            password,
            profilePicture: reader.result,
            attendance: []
        };
        localStorage.setItem(email, JSON.stringify(user));
        alert('Registration successful');
        window.location.href = 'login.html';
    };
    reader.readAsDataURL(profilePicture);
}

function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const user = JSON.parse(localStorage.getItem(email));
    if (user) {
        if (user.password === password) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Login successful');
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid password.');
        }
    } else {
        alert('User not found.');
    }
}

function markAttendance() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('No user is currently logged in.');
        return;
    }

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });

    const attendanceRecord = {
        name: currentUser.name,
        date: date,
        day: day
    };

    if (!currentUser.attendance.some(record => record.date === date)) {
        currentUser.attendance.push(attendanceRecord);
        localStorage.setItem(currentUser.email, JSON.stringify(currentUser));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Attendance marked successfully.');
    } else {
        alert('Attendance for today is already marked.');
    }
}

function viewAttendence() {
    window.location.href = 'view-attendence.html';
}

function viewProfile() {
    window.location.href = 'profile.html';
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    alert('Logged out successfully.');
    window.location.href = 'login.html';
}

function editProfile(event) {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('No user is currently logged in.');
        return;
    }

    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;
    const profilePicture = document.getElementById('edit-profilePicture').files[0];

    if (!name || !email || !password || !profilePicture) {
        alert('Please fill in all fields.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        currentUser.name = name;
        currentUser.email = email;
        currentUser.password = password;
        currentUser.profilePicture = reader.result;
        localStorage.setItem(currentUser.email, JSON.stringify(currentUser));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Profile updated successfully.');
        window.location.href = 'dashboard.html';
    };
    reader.readAsDataURL(profilePicture);
}

function displayAdminAttendanceRecords() {
    const allKeys = Object.keys(localStorage);
    const attendanceRecords = [];

    allKeys.forEach(key => {
        if (key !== 'currentUser' && key !== 'admin@example.com') {
            const user = JSON.parse(localStorage.getItem(key));
            if (user && user.attendance) {
                user.attendance.forEach(record => {
                    attendanceRecords.push(record);
                });
            }
        }
    });

    const adminAttendanceRecordsContainer = document.getElementById('admin-attendance-records');
    if (adminAttendanceRecordsContainer) {
        adminAttendanceRecordsContainer.innerHTML = ''; // Clear existing content
        attendanceRecords.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.innerHTML = `<strong>${record.name}</strong> - ${record.date} (${record.day})`;
            adminAttendanceRecordsContainer.appendChild(recordElement);
        });
    }
}
