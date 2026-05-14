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
  
  // Trainers & Co-Trainers
  { 
    id: 3, name: "Dr. Sarah Lee", email: "sarah.lee@college.edu", phone: "+1 555-2201", department: "Computer Science", role: "Trainer", gender: "Female", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=3",
    sessions: 45, classes: 12, hours: 120, missedSessions: 2, rating: 4.8, availability: "Available", assignedSessionsCount: 12,
    sessionReports: [
      { date: "2026-05-11", session: "Python Fundamentals", batch: "Batch A - Morning", lab: "Advanced Computing Lab", hours: 2, rating: 4.9 },
      { date: "2026-05-13", session: "Data Structures Deep Dive", batch: "Batch A - Morning", lab: "Advanced Computing Lab", hours: 3, rating: 4.7 }
    ],
    transferredSessions: [
      { date: "2026-05-10", session: "Intro to Python", batch: "Batch B - Afternoon", lab: "Room 101", hours: 2, direction: "To", partner: "Michael Chang", reason: "Sick Leave" },
      { date: "2026-05-12", session: "Algorithms 101", batch: "Batch A - Morning", lab: "Advanced Computing Lab", hours: 2, direction: "From", partner: "James Carter", reason: "Covering shift", rating: 4.8 }
    ],
    feedback: ["Great methodology.", "Very clear explanations.", "Could use more real-world examples."]
  },
  { 
    id: 4, name: "James Carter", email: "james.c@college.edu", phone: "+1 555-3301", department: "Information Tech", role: "Co-Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=4",
    sessions: 30, classes: 8, hours: 80, missedSessions: 0, rating: 4.5, availability: "On Leave", assignedSessionsCount: 8,
    sessionReports: [
      { date: "2026-05-11", session: "Lab Assistance", batch: "Batch A - Morning", lab: "Advanced Computing Lab", hours: 2, rating: 4.5, trainer: "Dr. Sarah Lee" }
    ],
    transferredSessions: [
      { date: "2026-05-12", session: "Algorithms 101", batch: "Batch A - Morning", lab: "Advanced Computing Lab", hours: 2, direction: "To", partner: "Dr. Sarah Lee", reason: "Conference" }
    ],
    feedback: ["Very helpful during lab hours.", "Answers questions patiently."]
  },
  { 
    id: 6, name: "Michael Chang", email: "michael.c@college.edu", phone: "+1 555-2202", department: "Electronics", role: "Trainer", gender: "Male", highSchool: "N/A", photo: "https://i.pravatar.cc/150?u=6",
    sessions: 50, classes: 15, hours: 140, missedSessions: 1, rating: 4.2, availability: "Busy", assignedSessionsCount: 15,
    sessionReports: [
      { date: "2026-05-10", session: "Intro to Python", batch: "Batch B - Afternoon", lab: "Room 101", hours: 2, rating: 4.1 }
    ],
    transferredSessions: [
      { date: "2026-04-20", session: "Hardware Basics", batch: "Batch C - Evening", lab: "Electronics Prototyping", hours: 3, direction: "To", partner: "Dr. Sarah Lee", reason: "Personal Emergency" },
      { date: "2026-05-10", session: "Intro to Python", batch: "Batch B - Afternoon", lab: "Room 101", hours: 2, direction: "From", partner: "Dr. Sarah Lee", reason: "Covering shift", rating: 4.5 }
    ],
    feedback: ["Good pacing.", "Sometimes hard to follow the slides.", "Responsive to emails.", "Awesome technical depth."]
  },
];

export const classes = [
  { 
    id: "1 BCA A", 
    trainer: "Dr. Sarah Lee", 
    coTrainers: ["James Carter"],
    lab: "Advanced Computing Lab",
    sessions: ["2026-05-15T10:00"],
    status: "Active"
  },
  { 
    id: "1 BSC CS", 
    trainer: "Michael Chang", 
    coTrainers: [],
    lab: "Room 101",
    sessions: ["2026-05-16T14:00"],
    status: "Active"
  },
  { 
    id: "1 BBA", 
    trainer: "Unassigned", 
    coTrainers: [],
    lab: "Unassigned",
    sessions: [],
    status: "Upcoming"
  },
  { 
    id: "1 BCOM", 
    trainer: "Unassigned", 
    coTrainers: [],
    lab: "Unassigned",
    sessions: [],
    status: "Upcoming"
  }
];

export const labs = [
  {
    id: "LAB-1",
    name: "Advanced Computing Lab",
    department: "Computer Science",
    assignedAdmin: "Admin Alpha",
    assignedTrainer: "Dr. Sarah Lee",
    capacity: 40,
    status: "Active"
  },
  {
    id: "LAB-2",
    name: "Electronics Prototyping",
    department: "Electronics",
    assignedAdmin: "Admin Beta",
    assignedTrainer: "Michael Chang",
    capacity: 25,
    status: "Maintenance"
  },
  {
    id: "LAB-3",
    name: "Data Mining Center",
    department: "Data Science",
    assignedAdmin: "Unassigned",
    assignedTrainer: "Unassigned",
    capacity: 30,
    status: "Available"
  }
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
