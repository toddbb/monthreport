/* ── i18n Strings ──────────────────────────────────────────────────
   All user-visible static text, keyed by language code.
   Supported: "en" (English), "vn" (Vietnamese)
   ────────────────────────────────────────────────────────────────── */
const STRINGS = {
   en: {
      // Header
      periodBadge: "Monthly Progress Report",
      shareBtn: "Share",
      langToggle: "Tiếng Việt",

      // Staff
      sectionInstructors: "Instructors",
      labelTeachers: "Teachers",
      labelTAs: "Teaching Assistants",

      // Feedback
      feedbackTitle: "Monthly Learning Summary",
      feedbackBadge: "Summary",
      feedbackSubtitle: "Based on Teacher and Teaching Assistant feedback and assessments.",

      // Attendance
      attTitle: "Attendance",
      attNote: "Regular attendance supports stronger progress.",
      attFallback: "Attendance needs attention. Please contact us.",

      // Language Skills
      langSkillsTitle: "Language Skills",
      langSkillsNote: "Based on Teacher Assessment in every lesson.",
      skillLabels: { reading: "Reading", writing: "Writing", speaking: "Speaking", listening: "Listening" },

      // Homework
      hwTitle: "Homework",
      hwNote: "Practice completed outside class.",
      hwAvgLabel: "Average score",
      hwCompLabel: "Completion rate",

      // Vocabulary
      vocabTitle: "Vocabulary",
      vocabNote: "Word practice outside of class.",
      vocabAvgLabel: "Average score",
      vocabCompLabel: "Completion rate",

      // Performance notes (fallback when not in config)
      perfStrong: "Strong performance and steady practice.",
      perfGoodScore: "Good accuracy. More regular completion will strengthen progress.",
      perfGoodComp: "Practice is happening. Focus on accuracy during review.",
      perfDefault: "This area needs more regular practice at home.",

      // 21st Century Skills
      pblTitle: "21st Century Skills",
      pblDefaultNote: "Project-based learning skills, rated out of 5.",
      pblDatesPrefix: "Lessons: ",
      pblLabels: {
         creativity: "Creativity",
         collaboration: "Collaboration",
         criticalThinking: "Critical Thinking",
         communication: "Communication",
         selfReflection: "Self-Reflection",
         digitalLiteracy: "Digital Literacy",
      },

      // Cambridge Practice Test
      cambridgeTitle: "Cambridge Practice Test",
      cambridgeNoteType: "Results for {type} practice test.",
      cambridgeNoteDefault: "Results from the Cambridge practice test.",
      cambridgeLabels: { readingWriting: "Reading & Writing", reading: "Reading", writing: "Writing", speaking: "Speaking", listening: "Listening" },
      cambridgeInfo: "Cambridge English qualifications are internationally recognized exams developed by the University of Cambridge. {link}",
      cambridgeInfoLink: "Learn more about {type}",

      // Progress Test
      progressTitle: "Progress Test",
      progressNote: "Checkpoint results from in-class tests.",
      progressLabels: {
         readingWritingGrammarVocabulary: "Reading, Writing & Grammar",
         speaking: "Speaking",
         listening: "Listening",
      },

      // Final Score
      finalTitle: "Final Score",
      finalSubNote: "A combined score based on all available report data.",
      finalCalcLabel: "How this is calculated",
      finalCalcNote: "This score is calculated based on assessments, scores, and other relevant data collected throughout the course.",

      // Recommendations
      sectionRecommendations: "Recommendations",
      recommendationsBadge: "At home support",
      recommendationsSubtitle: "Recommendations from Teacher and Teaching Assistant Feedback and Assessments.",
      recVocab: "Review vocabulary for 5–10 minutes, three times each week.",
      recHomework: "Set a regular homework time at home to improve completion.",
      recSpeaking: "Ask your child to answer simple English questions aloud at home.",
      recDefaults: [
         "Keep a short and regular English routine at home.",
         "Encourage your child to speak in complete English sentences.",
         "Celebrate small wins to keep motivation high.",
      ],

      // FAQ
      sectionFaq: "Notes & FAQ",
      faqBadge: "Help",
      faq: [
         {
            q: "What do these scores mean?",
            a: "This report is designed to be easy to understand. Higher numbers and fuller charts indicate stronger performance or more completed practice. Sections that are missing simply have no data available for this month.",
         },
         {
            id: "faq-lang-skills",
            q: "How are Language Skills assessed?",
            a: "Language Skills are based on the Teacher's assessment in every lesson. They reflect the student's current performance in class and are a key factor in determining their overall course progress. A score of 3 or above indicates the student is meeting expectations for their level, while scores of 1–2 suggest areas where additional focus and practice may be needed.",
         },
         {
            q: "How can I help at home?",
            a: "Encourage short and regular English practice. Even 5–10 minutes a few times each week can help build confidence and improve long-term progress.",
         },
         {
            q: "Who should I contact if I have questions?",
            a: "Please reach out to your child's Teaching Assistant or your Admissions Officer at your center.",
         },
      ],

      // Dates
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      monthsFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

      // Footer / misc
      footerReport: "{month} Report",
      footerMonthlyReport: "Monthly Progress Report",
      shareTitle: "{name}'s Monthly Progress Report — {school}",
      copiedAlert: "Link copied to clipboard.",
      shareDefaultLines: [
         "📊 {name} just received their monthly learning report from {school}!",
         "Program: {program}",
         "Period: {period}",
         "At {school}, we help young learners build real English skills through engaging, structured lessons. Every month, parents receive a detailed report tracking attendance, language skills, homework, vocabulary, and more.",
         "Tap the link to view the full report 👇",
      ],

      // EOC variants
      periodBadgeEoc: "End of Course Progress Report",
      footerReportEoc: "{month} End of Course Progress Report",
      footerFallbackEoc: "End of Course Progress Report",
      shareTitleEoc: "{name}'s End of Course Progress Report — {school}",
   },

   vn: {
      // Header
      periodBadge: "Báo Cáo Tiến Độ Hàng Tháng",
      shareBtn: "Chia sẻ",
      langToggle: "English",

      // Staff
      sectionInstructors: "Giáo Viên",
      labelTeachers: "Giáo Viên",
      labelTAs: "Trợ Giảng",

      // Feedback
      feedbackTitle: "Tóm Tắt Học Tập Tháng Này",
      feedbackBadge: "Tóm Tắt",
      feedbackSubtitle: "Dựa trên phản hồi và đánh giá từ Giáo viên và Trợ giảng.",

      // Attendance
      attTitle: "Điểm Danh",
      attNote: "Đi học đều đặn giúp tiến bộ tốt hơn.",
      attFallback: "Cần chú ý đến việc đi học đều đặn. Vui lòng liên hệ chúng tôi.",

      // Language Skills
      langSkillsTitle: "Kỹ Năng Ngôn Ngữ",
      langSkillsNote: "Dựa trên đánh giá của giáo viên trong mỗi buổi học.",
      skillLabels: { reading: "Đọc", writing: "Viết", speaking: "Nói", listening: "Nghe" },

      // Homework
      hwTitle: "Bài Tập Về Nhà",
      hwNote: "Bài tập hoàn thành ngoài lớp học.",
      hwAvgLabel: "Điểm trung bình",
      hwCompLabel: "Tỉ lệ hoàn thành",

      // Vocabulary
      vocabTitle: "Từ Vựng",
      vocabNote: "Luyện tập từ vựng ngoài lớp học.",
      vocabAvgLabel: "Điểm trung bình",
      vocabCompLabel: "Tỉ lệ hoàn thành",

      // Performance notes (fallback when not in config)
      perfStrong: "Kết quả tốt và luyện tập đều đặn.",
      perfGoodScore: "Độ chính xác tốt. Hoàn thành đều đặn hơn sẽ giúp tiến bộ.",
      perfGoodComp: "Đang luyện tập tốt. Hãy tập trung vào độ chính xác khi ôn bài.",
      perfDefault: "Lĩnh vực này cần luyện tập đều đặn hơn ở nhà.",

      // 21st Century Skills
      pblTitle: "Kỹ Năng Thế Kỷ 21",
      pblDefaultNote: "Kỹ năng học qua dự án, chấm trên 5.",
      pblDatesPrefix: "Các buổi học: ",
      pblLabels: {
         creativity: "Sáng Tạo",
         collaboration: "Hợp Tác",
         criticalThinking: "Tư Duy Phản Biện",
         communication: "Giao Tiếp",
         selfReflection: "Tự Nhận Xét",
         digitalLiteracy: "Kỹ Năng Số",
      },

      // Cambridge Practice Test
      cambridgeTitle: "Bài Kiểm Tra Cambridge",
      cambridgeNoteType: "Kết quả bài kiểm tra {type}.",
      cambridgeNoteDefault: "Kết quả từ bài kiểm tra Cambridge.",
      cambridgeLabels: { readingWriting: "Đọc & Viết", reading: "Đọc", writing: "Viết", speaking: "Nói", listening: "Nghe" },
      cambridgeInfo: "Các chứng chỉ Cambridge English là các kỳ thi tiếng Anh được công nhận quốc tế, được phát triển bởi Đại học Cambridge. {link}",
      cambridgeInfoLink: "Tìm hiểu thêm về {type}",

      // Progress Test
      progressTitle: "Kiểm Tra Tiến Độ",
      progressNote: "Kết quả kiểm tra tại lớp.",
      progressLabels: {
         readingWritingGrammarVocabulary: "Đọc, Viết & Ngữ Pháp",
         speaking: "Nói",
         listening: "Nghe",
      },

      // Final Score
      finalTitle: "Điểm Tổng Kết",
      finalSubNote: "Điểm tổng hợp từ tất cả dữ liệu báo cáo hiện có.",
      finalCalcLabel: "Cách tính điểm này",
      finalCalcNote: "Điểm này là trung bình của các dữ liệu đánh giá trong tháng. Hiện tại là {score} trên 100.",

      // Recommendations
      sectionRecommendations: "Khuyến Nghị",
      recommendationsBadge: "Hỗ trợ tại nhà",
      recommendationsSubtitle: "Khuyến nghị dựa trên phản hồi và đánh giá từ Giáo viên và Trợ giảng.",
      recVocab: "Ôn tập từ vựng 5–10 phút, ba lần mỗi tuần.",
      recHomework: "Đặt thời gian cố định cho bài tập về nhà để cải thiện tỷ lệ hoàn thành.",
      recSpeaking: "Khuyến khích con trả lời các câu hỏi tiếng Anh đơn giản to tiếng ở nhà.",
      recDefaults: [
         "Duy trì thói quen luyện tập tiếng Anh ngắn và đều đặn ở nhà.",
         "Khuyến khích con nói tiếng Anh thành câu hoàn chỉnh.",
         "Khen ngợi những tiến bộ nhỏ để duy trì động lực.",
      ],

      // FAQ
      sectionFaq: "Ghi Chú & Câu Hỏi Thường Gặp",
      faqBadge: "Hỗ Trợ",
      faq: [
         {
            q: "Các điểm số này có nghĩa là gì?",
            a: "Báo cáo này được thiết kế để dễ hiểu. Số cao hơn và biểu đồ đầy hơn cho thấy kết quả tốt hơn hoặc nhiều bài tập đã hoàn thành hơn. Các mục bị thiếu đơn giản là không có dữ liệu trong tháng này.",
         },
         {
            id: "faq-lang-skills",
            q: "Kỹ năng ngôn ngữ được đánh giá như thế nào?",
            a: "Kỹ năng ngôn ngữ dựa trên đánh giá của giáo viên trong mỗi buổi học. Chúng phản ánh hiệu suất hiện tại của học sinh trong lớp và là yếu tố quan trọng trong việc xác định tiến trình học tập. Điểm từ 3 trở lên cho thấy học sinh đang đáp ứng kỳ vọng, trong khi điểm 1–2 gợi ý các lĩnh vực cần tập trung thêm.",
         },
         {
            q: "Tôi có thể giúp con ở nhà như thế nào?",
            a: "Khuyến khích luyện tập tiếng Anh ngắn và đều đặn. Chỉ cần 5–10 phút vài lần mỗi tuần cũng có thể giúp xây dựng sự tự tin và cải thiện tiến bộ lâu dài.",
         },
         {
            q: "Tôi nên liên hệ với ai nếu có câu hỏi?",
            a: "Vui lòng liên hệ với Trợ giảng của con hoặc Nhân viên Tuyển sinh tại trung tâm của bạn.",
         },
      ],

      // Dates
      monthsShort: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
      monthsFull: [
         "Tháng Một",
         "Tháng Hai",
         "Tháng Ba",
         "Tháng Tư",
         "Tháng Năm",
         "Tháng Sáu",
         "Tháng Bảy",
         "Tháng Tám",
         "Tháng Chín",
         "Tháng Mười",
         "Tháng Mười Một",
         "Tháng Mười Hai",
      ],

      // Footer / misc
      footerReport: "Báo Cáo {month}",
      footerMonthlyReport: "Báo Cáo Tiến Độ Hàng Tháng",
      shareTitle: "Báo Cáo Tiến Độ Tháng Này của {name} — {school}",
      copiedAlert: "Đã sao chép liên kết.",
      shareDefaultLines: [
         "📊 {name} vừa nhận được báo cáo học tập tháng này từ {school}!",
         "Chương trình: {program}",
         "Kỳ học: {period}",
         "Tại {school}, chúng tôi giúp các em xây dựng kỹ năng tiếng Anh thực sự qua các bài học hấp dẫn và có cấu trúc. Mỗi tháng, phụ huynh nhận báo cáo chi tiết theo dõi điểm danh, kỹ năng ngôn ngữ, bài tập về nhà, từ vựng và nhiều hơn nữa.",
         "Nhấn vào đường dẫn để xem báo cáo đầy đủ 👇",
      ],

      // EOC variants
      periodBadgeEoc: "Báo Cáo Tiến Độ Cuối Khóa",
      footerReportEoc: "Báo Cáo Tiến Độ Cuối Khóa {month}",
      footerFallbackEoc: "Báo Cáo Tiến Độ Cuối Khóa",
      shareTitleEoc: "Báo Cáo Tiến Độ Cuối Khóa của {name} — {school}",
   },
};
