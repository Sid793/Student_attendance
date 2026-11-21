package com.attendance.system.config;

import com.attendance.system.entity.*;
import com.attendance.system.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ClassRoomRepository classRoomRepository,
                           SubjectRepository subjectRepository,
                           FacultyRepository facultyRepository,
                           StudentRepository studentRepository,
                           AttendanceRepository attendanceRepository,
                           MarksRepository marksRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.classRoomRepository = classRoomRepository;
        this.subjectRepository = subjectRepository;
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.marksRepository = marksRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println(">>> Initializing Default Academic Database Seed Data...");

        // 1. Create Administrator
        User adminUser = new User(
                "admin",
                "admin@abes.ac.in",
                passwordEncoder.encode("admin123"),
                "Dr. Administrator",
                "9876543210",
                Role.ROLE_ADMIN
        );
        userRepository.save(adminUser);

        // 2. Create Classes
        ClassRoom mcaYear2 = new ClassRoom(
                "MCA II Year - Sec A",
                "Computer Applications",
                3,
                "2026-2027",
                "A"
        );
        ClassRoom mcaYear1 = new ClassRoom(
                "MCA I Year - Sec A",
                "Computer Applications",
                1,
                "2026-2027",
                "A"
        );
        classRoomRepository.saveAll(Arrays.asList(mcaYear2, mcaYear1));

        // 3. Create Subjects
        Subject dbms = new Subject("MCA301", "Advanced Database Management Systems", "Computer Applications", 3, 4);
        Subject fullstack = new Subject("MCA302", "Full-Stack Web Tech (Java & React)", "Computer Applications", 3, 4);
        Subject cloud = new Subject("MCA303", "Cloud Computing & Distributed Systems", "Computer Applications", 3, 3);
        Subject ai = new Subject("MCA304", "Machine Learning & Analytics", "Computer Applications", 3, 4);
        subjectRepository.saveAll(Arrays.asList(dbms, fullstack, cloud, ai));

        // 4. Create Faculty Members
        User facultyUser1 = new User(
                "neha.faculty",
                "neha.sharma@abes.ac.in",
                passwordEncoder.encode("faculty123"),
                "Dr. Neha Sharma",
                "9811223344",
                Role.ROLE_FACULTY
        );
        userRepository.save(facultyUser1);

        Faculty faculty1 = new Faculty(
                "FAC-MCA-01",
                facultyUser1,
                "Computer Applications",
                "Associate Professor",
                "Ph.D. in Computer Science",
                LocalDate.of(2018, 7, 15)
        );
        faculty1.setSubjects(new HashSet<>(Arrays.asList(dbms, ai)));
        facultyRepository.save(faculty1);

        User facultyUser2 = new User(
                "amit.faculty",
                "amit.verma@abes.ac.in",
                passwordEncoder.encode("faculty123"),
                "Prof. Amit Verma",
                "9822334455",
                Role.ROLE_FACULTY
        );
        userRepository.save(facultyUser2);

        Faculty faculty2 = new Faculty(
                "FAC-MCA-02",
                facultyUser2,
                "Computer Applications",
                "Assistant Professor",
                "M.Tech CSE",
                LocalDate.of(2020, 8, 1)
        );
        faculty2.setSubjects(new HashSet<>(Arrays.asList(fullstack, cloud)));
        facultyRepository.save(faculty2);

        // 5. Create Students
        Student student1 = createSampleStudent("aarav.student", "aarav@abes.ac.in", "Aarav Sharma", "9876500001", "MCA-2026-001", "REG-001", mcaYear2, "Male");
        Student student2 = createSampleStudent("ananya.student", "ananya@abes.ac.in", "Ananya Verma", "9876500002", "MCA-2026-002", "REG-002", mcaYear2, "Female");
        Student student3 = createSampleStudent("rohan.student", "rohan@abes.ac.in", "Rohan Gupta", "9876500003", "MCA-2026-003", "REG-003", mcaYear2, "Male");
        Student student4 = createSampleStudent("priya.student", "priya@abes.ac.in", "Priya Singh", "9876500004", "MCA-2026-004", "REG-004", mcaYear2, "Female");
        Student student5 = createSampleStudent("kabir.student", "kabir@abes.ac.in", "Kabir Mehta", "9876500005", "MCA-2026-005", "REG-005", mcaYear2, "Male");

        List<Student> students = Arrays.asList(student1, student2, student3, student4, student5);

        // 6. Create Realistic Attendance Records for Past Days
        LocalDate today = LocalDate.now();
        List<Subject> allSubjects = Arrays.asList(dbms, fullstack, cloud, ai);

        for (int dayOffset = 14; dayOffset >= 1; dayOffset--) {
            LocalDate date = today.minusDays(dayOffset);
            if (date.getDayOfWeek().getValue() >= 6) {
                continue; // Skip Saturday and Sunday
            }

            for (Subject sub : allSubjects) {
                Faculty fac = sub.getSubjectCode().equals("MCA301") || sub.getSubjectCode().equals("MCA304") ? faculty1 : faculty2;

                for (Student st : students) {
                    AttendanceStatus status = AttendanceStatus.PRESENT;
                    // Introduce realistic variations (Rohan has lower attendance ~65% so he appears in defaulter reports)
                    if (st.getRollNumber().equals("MCA-2026-003") && (dayOffset % 3 == 0 || dayOffset % 5 == 0)) {
                        status = AttendanceStatus.ABSENT;
                    } else if (st.getRollNumber().equals("MCA-2026-005") && dayOffset % 4 == 0) {
                        status = AttendanceStatus.ABSENT;
                    } else if (dayOffset % 7 == 0 && st.getRollNumber().equals("MCA-2026-002")) {
                        status = AttendanceStatus.ABSENT;
                    }

                    Attendance att = new Attendance(
                            st,
                            sub,
                            mcaYear2,
                            fac,
                            date,
                            status,
                            status == AttendanceStatus.ABSENT ? "Absent" : "Regular attendance"
                    );
                    attendanceRepository.save(att);
                }
            }
        }

        // 7. Create Sample Marks Records
        // Assessment 1: Quiz 1 (Max 20)
        createSampleMarks(students, dbms, mcaYear2, faculty1, AssessmentType.QUIZ, 20.0, today.minusDays(10),
                new double[]{18.5, 19.0, 12.0, 17.5, 14.0});
        createSampleMarks(students, fullstack, mcaYear2, faculty2, AssessmentType.QUIZ, 20.0, today.minusDays(9),
                new double[]{17.0, 18.5, 11.0, 19.0, 15.0});

        // Assessment 2: Assignment 1 (Max 30)
        createSampleMarks(students, dbms, mcaYear2, faculty1, AssessmentType.ASSIGNMENT, 30.0, today.minusDays(6),
                new double[]{27.0, 28.5, 19.0, 29.0, 22.0});
        createSampleMarks(students, fullstack, mcaYear2, faculty2, AssessmentType.ASSIGNMENT, 30.0, today.minusDays(5),
                new double[]{26.5, 29.0, 18.0, 28.0, 23.5});

        // Assessment 3: Mid-Term Exam (Max 50)
        createSampleMarks(students, dbms, mcaYear2, faculty1, AssessmentType.MID_TERM, 50.0, today.minusDays(2),
                new double[]{44.0, 46.5, 31.0, 47.0, 36.0});
        createSampleMarks(students, fullstack, mcaYear2, faculty2, AssessmentType.MID_TERM, 50.0, today.minusDays(1),
                new double[]{42.0, 48.0, 29.5, 45.5, 37.0});

        System.out.println(">>> Database Seed Complete!");
        System.out.println("    Admin: admin / admin123");
        System.out.println("    Faculty: neha.faculty / faculty123, amit.faculty / faculty123");
        System.out.println("    Student: aarav.student / student123, rohan.student / student123 (Defaulter Demo)");
    }

    private Student createSampleStudent(String username, String email, String fullName, String phone,
                                        String rollNumber, String regNo, ClassRoom classRoom, String gender) {
        User user = new User(
                username,
                email,
                passwordEncoder.encode("student123"),
                fullName,
                phone,
                Role.ROLE_STUDENT
        );
        userRepository.save(user);

        Student student = new Student(
                rollNumber,
                regNo,
                user,
                classRoom,
                LocalDate.of(2001, 5, 20),
                gender,
                "Ghaziabad, Uttar Pradesh, India",
                "Guardian of " + fullName,
                "9876599999"
        );
        return studentRepository.save(student);
    }

    private void createSampleMarks(List<Student> students, Subject subject, ClassRoom classRoom, Faculty faculty,
                                   AssessmentType type, Double maxMarks, LocalDate date, double[] scores) {
        for (int i = 0; i < students.size() && i < scores.length; i++) {
            Marks marks = new Marks(
                    students.get(i),
                    subject,
                    classRoom,
                    faculty,
                    type,
                    maxMarks,
                    scores[i],
                    date,
                    "Evaluated"
            );
            marksRepository.save(marks);
        }
    }
}
