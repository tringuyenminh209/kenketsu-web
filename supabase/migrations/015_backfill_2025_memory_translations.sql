-- ==============================================================================
-- Migration 015: Nap lai (backfill) ban dich co san (11 ngon ngu, tru tieng
-- Nhat) cho ky niem nam 2025 vao cot `translations` (them o migration 014).
-- Noi dung lay nguyen tu cac file src/locales/*.json (khoa lastYear.*) da
-- duoc dich tu cac session truoc — khong bat giao vien phai go lai tu dau.
-- File: supabase/migrations/015_backfill_2025_memory_translations.sql
-- ==============================================================================

UPDATE public.event_memories
SET translations = $json$
{
  "en": {
    "badge": "Last Year's Event",
    "title": "Here's how our 2025 campus blood drive went.",
    "summary": "On September 24, 2025, the event was held in the 1st floor lounge of Building 1 at ECC Computer College. Over 30 students and faculty participated, with student volunteers playing an active role.",
    "source_label": "Source: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "The 1st floor lounge of Building 1, the event venue.",
      "/assets/last-year/lastyear-102.webp": "The blood donation bus parked next to Building 1, in front of Building 4.",
      "/assets/last-year/lastyear-201.webp": "Up to 3 donors at a time inside the bus. Radio played softly — a relaxed atmosphere.",
      "/assets/last-year/lastyear-202.webp": "During donation, reading the precautions pamphlet and receiving tips from nurses.",
      "/assets/last-year/lastyear-203.webp": "Student volunteers handled pre-registration check-in and guided attendees.",
      "/assets/last-year/lastyear-204.webp": "Student volunteers joined Lions Club members to encourage blood donation."
    }
  },
  "vi": {
    "badge": "Hoạt động năm ngoái",
    "title": "Buổi hiến máu trong trường năm 2025 đã diễn ra như thế này.",
    "summary": "Ngày 24/9/2025, sự kiện được tổ chức tại sảnh tầng 1 tòa nhà số 1 của ECC. Hơn 30 sinh viên và giáo viên đã tham gia, cùng với các tình nguyện viên sinh viên tích cực hỗ trợ.",
    "source_label": "Nguồn: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "Không khí sảnh tầng 1 tòa nhà số 1 — nơi tổ chức sự kiện.",
      "/assets/last-year/lastyear-102.webp": "Xe buýt hiến máu đỗ ngay cạnh tòa nhà số 1, phía trước tòa nhà số 4.",
      "/assets/last-year/lastyear-201.webp": "Mỗi lúc có 3 người hiến máu trên xe. Trong xe phát nhạc, không khí rất thoải mái.",
      "/assets/last-year/lastyear-202.webp": "Trong lúc lấy máu, được đọc tài liệu hướng dẫn và nghe lời khuyên từ y tá.",
      "/assets/last-year/lastyear-203.webp": "Sinh viên tình nguyện phụ trách đăng ký trước và hướng dẫn vào hội trường.",
      "/assets/last-year/lastyear-204.webp": "Sinh viên tình nguyện cùng các thành viên Lions Club kêu gọi mọi người hiến máu."
    }
  },
  "zh": {
    "badge": "去年的活动记录",
    "title": "2025年校内献血活动就是这样进行的。",
    "summary": "2025年9月24日，活动在ECC计算机专门学校1号楼1楼休息厅举行。超过30名学生和教职员工参加，学生志愿者们也发挥了积极作用。",
    "source_label": "来源：",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "活动会场——1号楼1楼休息厅的现场情况",
      "/assets/last-year/lastyear-102.webp": "献血车停在1号楼旁边、4号楼前的空间",
      "/assets/last-year/lastyear-201.webp": "献血车内同时可供3人献血，车内播放着广播，氛围轻松",
      "/assets/last-year/lastyear-202.webp": "献血过程中，阅读注意事项，并听取护士关于促进血液循环的建议",
      "/assets/last-year/lastyear-203.webp": "学生志愿者负责预约确认和场内引导工作",
      "/assets/last-year/lastyear-204.webp": "学生志愿者与狮子会成员一起呼吁大家参与献血"
    }
  },
  "my": {
    "badge": "ပြီးခဲ့သည့်နှစ် အစီအစဉ်",
    "title": "၂၀၂၅ ခုနှစ် ကျောင်းတွင်း သွေးလှူဒါန်းမှု အခြေအနေ ဖြစ်ပါသည်",
    "summary": "၂၀၂၅ ခုနှစ် စက်တင်ဘာလ ၂၄ ရက်တွင် ECC ကွန်ပျူတာ専門ကျောင်း အဆောက်အဦး ၁၊ ၁ ထပ် ဧည့်ခန်းမ၌ ကျင်းပခဲ့သည်။ ကျောင်းသားနှင့် ဆရာ ၃၀ ကျော် ပါဝင်လှူဒါန်းခဲ့ကြပြီး ကျောင်းသားစေတနာ့ဝန်ထမ်းများလည်း တက်ကြွစွာ ကူညီခဲ့ကြသည်။",
    "source_label": "ရင်းမြစ်: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "အဆောက်အဦး ၁၊ ၁ ထပ် ဧည့်ခန်းမ၊ အစီအစဉ် ကျင်းပရာနေရာ",
      "/assets/last-year/lastyear-102.webp": "အဆောက်အဦး ၁ ၏ဘေး၊ အဆောက်အဦး ၄ ၏အရှေ့တွင် ရပ်ထားသော သွေးလှူဒါန်းမှုယာဉ်",
      "/assets/last-year/lastyear-201.webp": "ယာဉ်ပေါ်တွင် တစ်ကြိမ်လျှင် ၃ ဦးအထိ လှူဒါန်းနိုင်သည်။ သီချင်းသံ ညင်သာစွာ ဖွင့်ထားပြီး သက်တောင့်သက်သာရှိသော အခြေအနေ ဖြစ်သည်",
      "/assets/last-year/lastyear-202.webp": "သွေးလှူဒါန်းစဉ် သတိပြုဖွယ်ရာများကို ဖတ်ရှုပြီး သူနာပြုများထံမှ အကြံဉာဏ်များ ရယူခြင်း",
      "/assets/last-year/lastyear-203.webp": "ကျောင်းသားစေတနာ့ဝန်ထမ်းများက ကြိုတင်မှတ်ပုံတင်ခြင်းနှင့် လမ်းညွှန်ခြင်းများကို ဆောင်ရွက်ခဲ့ကြသည်",
      "/assets/last-year/lastyear-204.webp": "ကျောင်းသားစေတနာ့ဝန်ထမ်းများနှင့် လိုင်းယွန်းကလပ် အဖွဲ့ဝင်များ သွေးလှူဒါန်းရန် ဝိုင်းဝန်း တိုက်တွန်းခဲ့ကြသည်"
    }
  },
  "ne": {
    "badge": "गत वर्षको कार्यक्रम",
    "title": "हाम्रो २०२५ को क्याम्पस रक्तदान अभियान यसरी सम्पन्न भएको थियो।",
    "summary": "२४ सेप्टेम्बर २०२५ मा, ECC कम्प्युटर कलेजको भवन १ को पहिलो तल्लाको लाउन्जमा कार्यक्रम आयोजना गरिएको थियो। ३० भन्दा बढी विद्यार्थी र शिक्षकहरू सहभागी हुनुभएको थियो, जसमा विद्यार्थी स्वयंसेवकहरूले सक्रिय भूमिका निर्वाह गरे।",
    "source_label": "स्रोत: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "भवन १ को पहिलो तल्लाको लाउन्ज, कार्यक्रम आयोजना स्थल",
      "/assets/last-year/lastyear-102.webp": "भवन १ को छेउमा र भवन ४ को अगाडि पार्क गरिएको रक्तदान बस",
      "/assets/last-year/lastyear-201.webp": "बस भित्र एक पटकमा ३ जनासम्म रक्तदाताहरू। रेडियो बिस्तारै बजिरहेको थियो — शान्त वातावरण",
      "/assets/last-year/lastyear-202.webp": "रक्तदान गर्दा सावधानीका बुँदाहरू पढ्दै र नर्सहरूबाट सल्लाह लिँदै",
      "/assets/last-year/lastyear-203.webp": "विद्यार्थी स्वयंसेवकहरूले अग्रिम दर्ता जाँच र आगन्तुकहरूलाई मार्गदर्शन गरे",
      "/assets/last-year/lastyear-204.webp": "विद्यार्थी स्वयंसेवकहरू र लायन्स क्लबका सदस्यहरू मिलेर रक्तदानका लागि प्रोत्साहित गरे"
    }
  },
  "uz": {
    "badge": "O'tgan yilgi tadbir",
    "title": "2025-yildagi kampus qon topshirish tadbirimiz shunday o'tdi.",
    "summary": "2025-yil 24-sentabrda tadbir ECC Computer College 1-bino 1-qavatidagi dam olish zalida bo'lib o'tdi. 30 dan ortiq talaba va o'qituvchilar ishtirok etdi, ko'ngilli talabalar faol rol o'ynadi.",
    "source_label": "Manba: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "1-bino 1-qavatdagi dam olish zali, tadbir bo'lib o'tgan joy.",
      "/assets/last-year/lastyear-102.webp": "1-bino yonida, 4-bino ro'parasida to'xtab turgan qon topshirish avtobusi.",
      "/assets/last-year/lastyear-201.webp": "Avtobus ichida bir vaqtning o'zida 3 nafargacha donor qabul qilindi. Radio past ovozda yangradi — tinch muhit.",
      "/assets/last-year/lastyear-202.webp": "Qon topshirish jarayonida ehtiyot choralari flayerini o'qish va hamshiralardan maslahatlar olish.",
      "/assets/last-year/lastyear-203.webp": "Ko'ngilli talabalar ro'yxatdan o'tishni boshqardilar va ishtirokchilarni yo'naltirdilar.",
      "/assets/last-year/lastyear-204.webp": "Ko'ngilli talabalar qon topshirishni targ'ib qilish uchun Lions Club a'zolariga qo'shildilar."
    }
  },
  "bn": {
    "badge": "গত বছরের ইভেন্ট",
    "title": "এভাবেই আমাদের ২০২৫ সালের ক্যাম্পাসের রক্তদান কর্মসূচি সম্পন্ন হয়েছিল।",
    "summary": "২০২৫ সালের ২৪ সেপ্টেম্বর, ইভেন্টটি ইসিসি কম্পিউটার কলেজের ভবন ১ এর ১ম তলা লাউঞ্জে অনুষ্ঠিত হয়েছিল। ৩০ জনেরও বেশি শিক্ষার্থী এবং শিক্ষক অংশ নিয়েছিলেন, যেখানে স্বেচ্ছাসেবক শিক্ষার্থীরা অগ্রণী ভূমিকা পালন করেছিল।",
    "source_label": "উৎস: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "ভবন ১ এর ১ম তলার লাউঞ্জ, যেখানে ইভেন্টটি অনুষ্ঠিত হয়েছিল।",
      "/assets/last-year/lastyear-102.webp": "ভবন ১ এর পাশে এবং ভবন ৪ এর সামনে পার্ক করা রক্তদান বাস।",
      "/assets/last-year/lastyear-201.webp": "বাসের ভেতরে একবারে ৩ জন পর্যন্ত রক্তদাতার রক্ত নেওয়া সম্ভব। রেডিও মৃদু শব্দে চলছিল — একটি শান্ত পরিবেশ।",
      "/assets/last-year/lastyear-202.webp": "রক্তদানের সময়, সতর্কতা নির্দেশিকা পড়া এবং নার্সদের কাছ থেকে পরামর্শ গ্রহণ।",
      "/assets/last-year/lastyear-203.webp": "স্বেচ্ছাসেবক শিক্ষার্থীরা প্রাক-নিবন্ধন ডেস্ক পরিচালনা করেছিল এবং অংশগ্রহণকারীদের গাইড করেছিল।",
      "/assets/last-year/lastyear-204.webp": "রক্তদানকে উৎসাহিত করতে স্বেচ্ছাসেবক শিক্ষার্থীরা লায়ন্স ক্লাবের সদস্যদের সাথে যোগ দিয়েছিল।"
    }
  },
  "id": {
    "badge": "Acara Tahun Lalu",
    "title": "Inilah dokumentasi kegiatan donor darah di kampus kami tahun 2025.",
    "summary": "Pada tanggal 24 September 2025, acara ini diadakan di lounge lantai 1 Gedung 1 di ECC Computer College. Lebih dari 30 mahasiswa dan staf berpartisipasi, dengan sukarelawan mahasiswa memainkan peran aktif.",
    "source_label": "Sumber: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "Lounge lantai 1 Gedung 1, tempat berlangsungnya acara.",
      "/assets/last-year/lastyear-102.webp": "Bus donor darah yang diparkir di sebelah Gedung 1, di depan Gedung 4.",
      "/assets/last-year/lastyear-201.webp": "Hingga 3 donor sekaligus di dalam bus. Radio diputar pelan — suasana yang santai.",
      "/assets/last-year/lastyear-202.webp": "Selama donor, membaca brosur pencegahan dan menerima tips dari perawat.",
      "/assets/last-year/lastyear-203.webp": "Sukarelawan mahasiswa menangani pemeriksaan pra-pendaftaran dan memandu peserta.",
      "/assets/last-year/lastyear-204.webp": "Sukarelawan mahasiswa bergabung dengan anggota Lions Club untuk menyemangati donor darah."
    }
  },
  "ko": {
    "badge": "지난해 이벤트",
    "title": "2025년에 진행되었던 캠퍼스 헌혈 활동 기록입니다.",
    "summary": "2025년 9월 24일, ECC 컴퓨터 전문학교 1호관 1층 라운지에서 행사가 열렸습니다. 30명이 넘는 학생들과 교직원들이 힘을 모았으며, 자원봉사 학생들이 앞장서서 이끌어 주었습니다.",
    "source_label": "출처: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "행사가 개최되었던 1호관 1층 라운지 전경.",
      "/assets/last-year/lastyear-102.webp": "1호관 옆, 4호관 앞에 대기 중인 헌혈 버스 차량.",
      "/assets/last-year/lastyear-201.webp": "쾌적한 내부에서 동시에 최대 3명까지 채혈. 라디오 음악이 흐르는 편안한 분위기.",
      "/assets/last-year/lastyear-202.webp": "헌혈하는 동안 간호사 선생님들에게 주의사항을 듣고 팁을 배우는 모습.",
      "/assets/last-year/lastyear-203.webp": "접수 및 대기열을 관리하며 참가자들을 친절히 안내하는 봉사 학생들.",
      "/assets/last-year/lastyear-204.webp": "라이온스 클럽 회원들과 함께 캠퍼스 내 참여를 독려하는 봉사 학생들."
    }
  },
  "th": {
    "badge": "กิจกรรมปีที่ผ่านมา",
    "title": "ภาพบรรยากาศกิจกรรมการบริจาคโลหิตในมหาวิทยาลัยเมื่อปี 2568",
    "summary": "เมื่อวันที่ 24 กันยายน 2568 กิจกรรมได้จัดขึ้น ณ เลานจ์ ชั้น 1 อาคาร 1 ของสถาบัน ECC Computer College โดยมีนักศึกษาและคณาจารย์เข้าร่วมมากกว่า 30 คน และมีกลุ่มนักศึกษาอาสาสมัครเป็นกำลังหลักในการดูแลงาน",
    "source_label": "แหล่งที่มา: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "บริเวณพื้นที่เลานจ์ ชั้น 1 อาคาร 1 ซึ่งใช้จัดกิจกรรมหลัก",
      "/assets/last-year/lastyear-102.webp": "รถรับบริจาคโลหิตเคลื่อนที่จอดอำนวยความสะดวกข้างอาคาร 1 บริเวณหน้าอาคาร 4",
      "/assets/last-year/lastyear-201.webp": "ภายในรถสามารถรองรับการเจาะเลือดได้พร้อมกันถึง 3 คน เปิดเพลงคลอเบาๆ บรรยากาศผ่อนคลายสบายๆ",
      "/assets/last-year/lastyear-202.webp": "ในระหว่างบริจาคโลหิต พยาบาลจะคอยแนะนำขั้นตอนและวิธีการดูแลตนเองอย่างใกล้ชิด",
      "/assets/last-year/lastyear-203.webp": "กลุ่มนักศึกษาอาสาสมัครช่วยดูแลการลงทะเบียนล่วงหน้าและจัดคิวอำนวยความสะดวกให้แก่ผู้เข้าร่วม",
      "/assets/last-year/lastyear-204.webp": "นักศึกษาอาสาสมัครร่วมมือกับสมาชิกสโมสรไลออนส์ในการประชาสัมพันธ์เชิญชวนเพื่อนๆ ในมหาวิทยาลัย"
    }
  },
  "si": {
    "badge": "පසුගිය වසරේ වැඩසටහන",
    "title": "මෙන්න 2025 අපගේ විශ්වවිද්‍යාල ලේ දීමේ වැඩසටහන සිදු වූ ආකාරය.",
    "summary": "2025 සැප්තැම්බර් 24 වන දින, වැඩසටහන ECC පරිගණක විද්‍යාලයේ 1 වන ගොඩනැගිල්ලේ 1 වන මහල විවේකාගාරයේදී පැවැත්විණි. සිසුන් සහ ගුරුවරුන් 30 කට වැඩි පිරිසක් සහභාගී වූ අතර, ස්වේච්ඡා සිසුන් සක්‍රීයව දායක විය.",
    "source_label": "මූලාශ්‍රය: ",
    "photoCaptions": {
      "/assets/last-year/lastyear-101.webp": "වැඩසටහන පැවැත්වුණු 1 වන ගොඩනැගිල්ලේ 1 වන මහල විවේකාගාරය.",
      "/assets/last-year/lastyear-102.webp": "1 වන ගොඩනැගිල්ල අසල, 4 වන ගොඩනැගිල්ල ඉදිරිපිට නවතා තිබූ ලේ දීමේ බස් රථය.",
      "/assets/last-year/lastyear-201.webp": "බස් රථය තුළ එකවර රෝගීන් 3 දෙනෙකු දක්වා ලේ ලබාගත හැක. ගුවන් විදුලිය මෘදු ලෙස වාදනය විය — සැහැල්ලු පරිසරයක්.",
      "/assets/last-year/lastyear-202.webp": "ලේ දෙන අතරතුර, පූර්ව සූදානම් පත්‍රිකාව කියවීම සහ හෙදියන්ගෙන් උපදෙස් ලබා ගැනීම.",
      "/assets/last-year/lastyear-203.webp": "ස්වේච්ඡා සිසුන් ලියාපදිංචිය කළමනාකරණය කළ අතර සහභාගී වන්නන්ට මඟ පෙන්වූහ.",
      "/assets/last-year/lastyear-204.webp": "ලේ දීම දිරිමත් කිරීම සඳහා ස්වේච්ඡා සිසුන් ලයන්ස් සමාජයේ සාමාජිකයන් සමඟ එක් විය."
    }
  }
}
$json$::jsonb
WHERE event_year = 2025;
