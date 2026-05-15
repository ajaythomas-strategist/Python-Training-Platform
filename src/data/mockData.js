export const summaryStats = {
  totalStudents: 1248,
  totalTrainers: 45,
  activeClasses: 28,
  totalAdmins: 3,
  totalLabs: 12
};

export const users = [
  // Admins
  { id: 101, name: "Admin Alpha", email: "admin.a@college.edu", phone: "+1 555-0101", department: "Central IT", role: "Admin", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=101" },
  { id: 102, name: "Admin Beta", email: "admin.b@college.edu", phone: "+1 555-0102", department: "Administration", role: "Admin", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=102" },
  
  // Students
  { 
    id: 1, name: "Alice Johnson", email: "alice.j@college.edu", phone: "+1 555-1101", batch: "1 BCA A", role: "Student", gender: "Female", highSchool: "Springfield High", photo: "https://i.pravatar.cc/150?u=1", attendance: 92, score: "88%", comments: "Excellent participation.",
    detailedReport: {
      sessions: [
        { date: "2026-05-10", sessionName: "Intro to Python", attendance: "Present" },
        { date: "2026-05-12", sessionName: "Data Structures", attendance: "Absent" },
        { date: "2026-05-14", sessionName: "Algorithms 101", attendance: "Present" }
      ],
      performance: [
        { activity: "Python Basics Quiz", score: "95/100", timeTaken: "15 mins" },
        { activity: "Data Structures Lab", score: "80/100", timeTaken: "45 mins" },
        { activity: "Algorithm Project", score: "90/100", timeTaken: "2 hours" }
      ]
    }
  },
  { 
    id: 2, name: "Bob Smith", email: "bob.s@college.edu", phone: "+1 555-1102", batch: "1 BSC CS", role: "Student", gender: "Male", highSchool: "Westview High", photo: "https://i.pravatar.cc/150?u=2", attendance: 75, score: "72%", comments: "Needs to focus more on assignments.",
    detailedReport: {
      sessions: [
        { date: "2026-05-10", sessionName: "Intro to Python", attendance: "Present" },
        { date: "2026-05-12", sessionName: "Data Structures", attendance: "Absent" },
        { date: "2026-05-14", sessionName: "Algorithms 101", attendance: "Absent" }
      ],
      performance: [
        { activity: "Python Basics Quiz", score: "70/100", timeTaken: "25 mins" },
        { activity: "Data Structures Lab", score: "65/100", timeTaken: "1 hour" }
      ]
    }
  },
  { 
    id: 5, name: "Emily Davis", email: "emily.d@college.edu", phone: "+1 555-1105", batch: "1 BBA", role: "Student", gender: "Female", highSchool: "Northwood Academy", photo: "https://i.pravatar.cc/150?u=5", attendance: 98, score: "95%", comments: "Top of the class.",
    detailedReport: {
      sessions: [
        { date: "2026-05-10", sessionName: "Intro to Python", attendance: "Present" },
        { date: "2026-05-12", sessionName: "Data Structures", attendance: "Present" },
        { date: "2026-05-14", sessionName: "Algorithms 101", attendance: "Present" }
      ],
      performance: [
        { activity: "Python Basics Quiz", score: "100/100", timeTaken: "10 mins" },
        { activity: "Data Structures Lab", score: "95/100", timeTaken: "30 mins" },
        { activity: "Algorithm Project", score: "98/100", timeTaken: "1.5 hours" }
      ]
    }
  },
  // Extra Students for edge cases
  { id: 31, name: "Zara Ali", email: "zara.a@college.edu", phone: "31", batch: "1 PERFECT", role: "Student", attendance: 100, score: "100%", photo: "https://i.pravatar.cc/150?u=31", detailedReport: { sessions: [{ date: "2026-05-15", sessionName: "Perfect Session", attendance: "Present" }], performance: [] } },
  { id: 32, name: "Liam Bond", email: "liam.b@college.edu", phone: "32", batch: "1 STRUGGLE", role: "Student", attendance: 40, score: "45%", photo: "https://i.pravatar.cc/150?u=32", detailedReport: { sessions: [{ date: "2026-05-15", sessionName: "Hard Session", attendance: "Absent" }], performance: [] } },
  { id: 33, name: "Noah King", email: "noah.k@college.edu", phone: "33", batch: "1 STRUGGLE", role: "Student", attendance: 35, score: "40%", photo: "https://i.pravatar.cc/150?u=33", detailedReport: { sessions: [{ date: "2026-05-15", sessionName: "Hard Session", attendance: "Absent" }], performance: [] } },
  
  // Trainers & Co-Trainers
  { 
    id: 3, name: "Dr. Sarah Lee", email: "sarah.lee@college.edu", phone: "+1 555-2201", department: "Computer Science", role: "Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=3",
    sessions: 45, classes: 12, hours: 120, missedSessions: 2, rating: 4.8, availability: "Available", assignedSessionsCount: 12,
    sessionReports: [
      { date: "2026-05-11", session: "Python Fundamentals", batch: "1 BCA A", lab: "Advanced Computing Lab", hours: 2, rating: 4.9 },
      { date: "2026-05-13", session: "Data Structures Deep Dive", batch: "1 BCA A", lab: "Advanced Computing Lab", hours: 3, rating: 4.7 },
      { date: "2026-05-15", session: "Algorithms 101", batch: "1 BCA A", lab: "Advanced Computing Lab", hours: 2, rating: 4.8 }
    ]
  },
  { 
    id: 4, name: "James Carter", email: "james.c@college.edu", phone: "+1 555-3301", department: "Information Tech", role: "Co-Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=4",
    sessions: 30, classes: 8, hours: 80, missedSessions: 0, rating: 4.5, availability: "On Leave", assignedSessionsCount: 8,
    sessionReports: [
      { date: "2026-05-11", session: "Lab Assistance", batch: "1 BCA A", lab: "Advanced Computing Lab", hours: 2, rating: 4.5, trainer: "Dr. Sarah Lee" }
    ]
  },
  { 
    id: 6, name: "Michael Chang", email: "michael.c@college.edu", phone: "+1 555-2202", department: "Electronics", role: "Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=6",
    sessions: 50, classes: 15, hours: 140, missedSessions: 1, rating: 4.2, availability: "Busy", assignedSessionsCount: 15,
    sessionReports: [
      { date: "2026-05-10", session: "Intro to Python", batch: "1 BSC CS", lab: "Room 101", hours: 2, rating: 4.1 },
      { date: "2026-05-15", session: "Advanced Python", batch: "1 BSC CS", lab: "Room 101", hours: 2, rating: 4.4 }
    ]
  },

  // 8 Additional Trainers
  { id: 10, name: "Prof. Alan Turing", email: "alan@college.edu", phone: "+1 555-4001", department: "Computer Science", role: "Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=10", sessions: 20, classes: 5, hours: 40, missedSessions: 0, rating: 4.9, availability: "Available", assignedSessionsCount: 5, feedback: ["Visionary approach.", "Brilliant logic examples."], 
    sessionReports: [
      { date: "2026-05-15", session: "Commerce Tech", batch: "1 BCOM", lab: "Advanced Computing Lab", hours: 2, rating: 4.9 }
    ], transferredSessions: [] },
  { id: 11, name: "Grace Hopper", email: "grace@college.edu", phone: "+1 555-4002", department: "Information Tech", role: "Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=11", sessions: 22, classes: 6, hours: 45, missedSessions: 1, rating: 4.8, availability: "Busy", assignedSessionsCount: 6, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 12, name: "Ada Lovelace", email: "ada@college.edu", phone: "+1 555-4003", department: "Data Science", role: "Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=12", sessions: 18, classes: 4, hours: 35, missedSessions: 0, rating: 4.7, availability: "Available", assignedSessionsCount: 4, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 13, name: "Dennis Ritchie", email: "dennis@college.edu", phone: "+1 555-4004", department: "Computer Science", role: "Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=13", sessions: 30, classes: 8, hours: 60, missedSessions: 0, rating: 4.6, availability: "On Leave", assignedSessionsCount: 8, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 14, name: "Linus Torvalds", email: "linus@college.edu", phone: "+1 555-4005", department: "Information Tech", role: "Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=14", sessions: 25, classes: 7, hours: 50, missedSessions: 2, rating: 4.5, availability: "Available", assignedSessionsCount: 7, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 15, name: "Margaret Hamilton", email: "margaret@college.edu", phone: "+1 555-4006", department: "Electronics", role: "Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=15", sessions: 40, classes: 10, hours: 80, missedSessions: 0, rating: 5.0, availability: "Available", assignedSessionsCount: 10, feedback: ["Exceptional clarity.", "Best session ever!"], 
    sessionReports: [
      { date: "2026-05-15", session: "Management Basics", batch: "1 BBA", lab: "Room 101", hours: 2, rating: 5.0 }
    ], transferredSessions: [] },
  { id: 16, name: "Tim Berners-Lee", email: "tim@college.edu", phone: "+1 555-4007", department: "Web Development", role: "Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=16", sessions: 15, classes: 3, hours: 30, missedSessions: 0, rating: 4.8, availability: "Busy", assignedSessionsCount: 3, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 17, name: "Hedy Lamarr", email: "hedy@college.edu", phone: "+1 555-4008", department: "Electronics", role: "Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=17", sessions: 28, classes: 6, hours: 56, missedSessions: 1, rating: 4.9, availability: "Available", assignedSessionsCount: 6, sessionReports: [], transferredSessions: [], feedback: [] },

  // 8 Additional Co-Trainers
  { id: 20, name: "John Doe", email: "john@college.edu", phone: "+1 555-5001", department: "Computer Science", role: "Co-Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=20", sessions: 10, classes: 2, hours: 20, missedSessions: 0, rating: 4.2, availability: "Available", assignedSessionsCount: 2, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 21, name: "Jane Smith", email: "jane@college.edu", phone: "+1 555-5002", department: "Information Tech", role: "Co-Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=21", sessions: 12, classes: 3, hours: 24, missedSessions: 0, rating: 4.3, availability: "Available", assignedSessionsCount: 3, feedback: ["Very patient with doubts."], 
    sessionReports: [
      { date: "2026-05-15", session: "Management Support", batch: "1 BBA", lab: "Room 101", hours: 2, rating: 4.4 }
    ], transferredSessions: [] },
  { id: 22, name: "Mike Johnson", email: "mike@college.edu", phone: "+1 555-5003", department: "Data Science", role: "Co-Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=22", sessions: 8, classes: 2, hours: 16, missedSessions: 0, rating: 4.0, availability: "Busy", assignedSessionsCount: 2, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 23, name: "Emily White", email: "emily.w@college.edu", phone: "+1 555-5004", department: "Computer Science", role: "Co-Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=23", sessions: 15, classes: 4, hours: 30, missedSessions: 0, rating: 4.5, availability: "Available", assignedSessionsCount: 4, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 24, name: "Chris Green", email: "chris@college.edu", phone: "+1 555-5005", department: "Information Tech", role: "Co-Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=24", sessions: 20, classes: 5, hours: 40, missedSessions: 1, rating: 4.1, availability: "Available", assignedSessionsCount: 5, feedback: ["Solid technical support."], 
    sessionReports: [
      { date: "2026-05-15", session: "Commerce Support", batch: "1 BCOM", lab: "Advanced Computing Lab", hours: 2, rating: 4.2 }
    ], transferredSessions: [] },
  { id: 25, name: "Sophia Brown", email: "sophia@college.edu", phone: "+1 555-5006", department: "Electronics", role: "Co-Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=25", sessions: 5, classes: 1, hours: 10, missedSessions: 0, rating: 4.8, availability: "On Leave", assignedSessionsCount: 1, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 26, name: "David Black", email: "david@college.edu", phone: "+1 555-5007", department: "Web Development", role: "Co-Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=26", sessions: 18, classes: 4, hours: 36, missedSessions: 0, rating: 4.4, availability: "Available", assignedSessionsCount: 4, sessionReports: [], transferredSessions: [], feedback: [] },
  { id: 27, name: "Olivia Gray", email: "olivia@college.edu", phone: "+1 555-5008", department: "Data Science", role: "Co-Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=27", sessions: 22, classes: 6, hours: 44, missedSessions: 0, rating: 4.6, availability: "Busy", assignedSessionsCount: 6, sessionReports: [], transferredSessions: [], feedback: [] }
];

export const classes = [
  { 
    id: "1 BCA A", 
    trainer: "Dr. Sarah Lee", 
    coTrainers: ["James Carter"],
    lab: "Advanced Computing Lab",
    sessions: [
      { date: "2026-05-15", startTime: "13:00", endTime: "15:00", transferredFrom: "Prof. Alan Turing" },
      { date: "2026-05-16", startTime: "10:00", endTime: "12:00" }
    ],
    status: "Active"
  },
  { 
    id: "1 PERFECT", 
    trainer: "Margaret Hamilton", 
    coTrainers: ["Jane Smith"],
    lab: "AI Research Lab",
    sessions: [{ date: "2026-05-15", startTime: "08:00", endTime: "10:00" }],
    status: "Active"
  },
  { 
    id: "1 STRUGGLE", 
    trainer: "Dennis Ritchie", 
    coTrainers: ["Mike Johnson", "John Doe", "James Carter"],
    lab: "Cybersecurity Lab",
    sessions: [{ date: "2026-05-15", startTime: "16:00", endTime: "18:00" }],
    status: "Active"
  },
  { 
    id: "1 BSC CS", 
    trainer: "Michael Chang", 
    coTrainers: ["Emily White"],
    lab: "Room 101",
    sessions: [
      { date: "2026-05-14", startTime: "14:00", endTime: "16:00" },
      { date: "2026-05-16", startTime: "13:00", endTime: "15:00" }
    ],
    status: "Active"
  },
  { 
    id: "1 BBA", 
    trainer: "Dr. Sarah Lee", 
    coTrainers: ["Jane Smith"],
    lab: "Advanced Computing Lab",
    sessions: [{ date: "2026-05-16", startTime: "08:00", endTime: "10:00" }],
    status: "Upcoming"
  },
  { 
    id: "1 BCOM", 
    trainer: "Michael Chang", 
    coTrainers: [],
    lab: "Room 101",
    sessions: [{ date: "2026-05-16", startTime: "15:30", endTime: "17:30" }],
    status: "Upcoming"
  }
];

export const labs = [
  { id: "LAB-1", name: "Advanced Computing Lab", department: "Computer Science", assignedAdmin: "Admin Alpha", assignedTrainer: "Dr. Sarah Lee", capacity: 40, status: "Available" },
  { id: "LAB-2", name: "Electronics Prototyping", department: "Electronics", assignedAdmin: "Admin Beta", assignedTrainer: "Michael Chang", capacity: 25, status: "Not Available" },
  { id: "LAB-3", name: "Data Mining Center", department: "Data Science", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 30, status: "Available" },
  // 8 Additional Labs
  { id: "LAB-4", name: "AI Research Lab", department: "Computer Science", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 20, status: "Available" },
  { id: "LAB-5", name: "Networking Lab", department: "Information Tech", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 35, status: "Available" },
  { id: "LAB-6", name: "Cybersecurity Lab", department: "Information Tech", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 30, status: "Available" },
  { id: "LAB-7", name: "Robotics Center", department: "Electronics", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 25, status: "Not Available" },
  { id: "LAB-8", name: "Software Engineering Lab", department: "Computer Science", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 50, status: "Available" },
  { id: "LAB-9", name: "IoT Innovation Lab", department: "Electronics", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 15, status: "Available" },
  { id: "LAB-10", name: "Cloud Computing Lab", department: "Computer Science", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 40, status: "Available" },
  { id: "LAB-11", name: "Big Data Lab", department: "Data Science", assignedAdmin: "Unassigned", assignedTrainer: "Unassigned", capacity: 30, status: "Available" }
];

export const reviews = [
  {
    trainerId: 3,
    trainerName: "Dr. Sarah Lee",
    overallScore: 4.8,
    studentScore: 4.9, // 60%
    adminScore: 4.6, // 40%
    recentFeedback: [
      { student: "Alice Johnson", rating: 5, comment: "Excellent teaching style! Very clear." },
      { student: "Emily Davis", rating: 4, comment: "Great content, but pacing was a bit fast." }
    ]
  }
];
