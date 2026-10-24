import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env if available
function getMockApiUrl() {
  if (process.argv[2]) {
    return process.argv[2];
  }
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_MOCKAPI_URL\s*=\s*(.*)/);
    if (match && match[1]) {
      return match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return process.env.VITE_MOCKAPI_URL || '';
}

const J = (
  id,
  title,
  company,
  location,
  type,
  mode,
  min,
  max,
  skills,
  cat,
  exp = '1–3 years',
  dept = 'Engineering',
  desc = 'Join our mission-driven team to create world-class solutions.',
  resp = 'Design and build core features, review code, collaborate across teams.',
  qual = "Bachelor's degree in Computer Science, Design or equivalent field.",
  pref = 'Strong communication, teamwork, and analytical problem-solving.',
  benefits = 'Comprehensive health insurance, flexible work hours, annual learning stipend, generous PTO',
  deadline = '2026-12-31',
  posted = '2026-10-15'
) => ({
  id,
  rid: 'r0',
  title,
  company,
  location,
  type,
  mode,
  min,
  max,
  skills,
  cat,
  dept,
  exp,
  desc,
  resp,
  qual,
  pref,
  benefits,
  deadline,
  status: 'Active',
  posted,
});

const sampleJobs = [
  J(
    'j1',
    'Frontend Developer',
    'Zoho',
    'Coimbatore',
    'Full Time',
    'Hybrid',
    6,
    10,
    'React, JavaScript, CSS',
    'Frontend',
    '1–3 years',
    'Engineering',
    "Build sleek, responsive web interfaces for Zoho's cloud suite of enterprise tools.",
    'Ship high-performance React UI components, optimize bundle sizes, and conduct code reviews.',
    'Proficiency in React.js, modern ECMAScript, CSS Grid/Flexbox, and RESTful APIs.',
    'Experience with TypeScript and state management (Redux/Zustand) is a plus.',
    'Health insurance, free meals, commute shuttle, generous paid time off',
    '2026-12-31',
    '2026-10-10'
  ),
  J(
    'j2',
    'Backend Engineer',
    'Freshworks',
    'Chennai',
    'Full Time',
    'Remote',
    8,
    14,
    'Node.js, SQL, Express',
    'Backend',
    '1–3 years',
    'Engineering',
    'Power backend microservices processing hundreds of thousands of customer service tickets.',
    'Architect robust REST and GraphQL APIs, optimize PostgreSQL queries, write automated unit tests.',
    'Deep understanding of Node.js event loop, asynchronous patterns, and relational databases.',
    'Familiarity with Redis caching, Kafka or RabbitMQ event streaming.',
    '100% remote flexibility, home office setup budget, wellness allowance',
    '2026-11-30',
    '2026-10-12'
  ),
  J(
    'j3',
    'UI/UX Designer',
    'Kovai.co',
    'Coimbatore',
    'Contract',
    'On-site',
    5,
    9,
    'Figma, Research, Prototyping',
    'UI/UX',
    '1–3 years',
    'Design',
    'Lead user research and create stunning, intuitive user journeys for enterprise SaaS.',
    'Create wireframes, high-fidelity prototypes in Figma, and maintain comprehensive design systems.',
    'Strong portfolio demonstrating user-centric web/mobile design processes and design systems.',
    'Experience conducting user interviews and usability tests.',
    'Modern office spaces, collaborative environment, flexible leave policy',
    '2026-12-15',
    '2026-10-14'
  ),
  J(
    'j4',
    'QA Automation Tester',
    'Infosys',
    'Bengaluru',
    'Internship',
    'On-site',
    3,
    5,
    'Selenium, Cypress, Testing',
    'Testing',
    'Fresher',
    'Quality Assurance',
    'Ensure defect-free releases for high-impact banking and enterprise applications.',
    'Write automated end-to-end and regression test scripts using Cypress and Selenium WebDriver.',
    'Basic programming in Java or JavaScript, understanding of SDLC and STLC concepts.',
    'Hands-on experience with Git and Postman API testing.',
    'Internship completion certificate, mentorship from senior architects, pre-placement offer',
    '2026-11-20',
    '2026-10-16'
  ),
  J(
    'j5',
    'Data Analyst',
    'TCS',
    'Hyderabad',
    'Full Time',
    'Hybrid',
    5,
    8,
    'Python, SQL, PowerBI',
    'Data',
    '1–3 years',
    'Analytics',
    'Transform complex relational data sets into executive-level dashboards and predictive insights.',
    'Write complex SQL queries, build automated PowerBI reports, clean data using Python (Pandas).',
    'Solid foundation in SQL data aggregation, statistics, and business intelligence reporting.',
    'Familiarity with Snowflake or AWS Redshift.',
    'Comprehensive medical insurance, performance bonuses, skill training programs',
    '2026-12-10',
    '2026-10-18'
  ),
  J(
    'j6',
    'Growth Marketing Executive',
    'Ola',
    'Mumbai',
    'Part Time',
    'Remote',
    4,
    7,
    'SEO, Content, Analytics',
    'Marketing',
    '1–3 years',
    'Marketing',
    'Accelerate user acquisition and retention through data-backed digital campaigns.',
    'Execute organic SEO strategies, manage Google and Meta ad campaigns, write converting copy.',
    'Demonstrated track record with Google Analytics, Search Console, and campaign tracking.',
    'Strong storytelling and copy-crafting abilities.',
    'Flexible part-time schedule, ride discounts, performance incentives',
    '2026-11-25',
    '2026-10-19'
  ),
  J(
    'j7',
    'Full Stack React & Node Developer',
    'Razorpay',
    'Bengaluru',
    'Full Time',
    'Hybrid',
    12,
    20,
    'React, Node.js, TypeScript, PostgreSQL',
    'Frontend',
    '3–5 years',
    'Payments Engineering',
    'Develop mission-critical fintech checkout flows and merchant dashboard portals.',
    'End-to-end feature delivery: from database migrations and Node APIs to polished React interfaces.',
    'Solid command over TypeScript, React hooks, database normalization, and secure coding practices.',
    'Experience with high-volume payment processing or micro-frontend architectures.',
    'Stock options (ESOPs), top-tier medical coverage, annual learning stipend',
    '2026-12-31',
    '2026-10-20'
  ),
  J(
    'j8',
    'Cloud & DevOps Engineer',
    'Swiggy',
    'Bengaluru',
    'Full Time',
    'Remote',
    14,
    22,
    'AWS, Docker, Kubernetes, Terraform',
    'Backend',
    '3–5 years',
    'Infrastructure',
    'Manage highly scalable cloud architecture handling tens of thousands of orders per minute.',
    'Automate CI/CD pipelines, provision infrastructure as code via Terraform, maintain Kubernetes clusters.',
    'Hands-on production experience with AWS (EKS, RDS, S3), Docker containerization, and Prometheus.',
    'Certified Kubernetes Administrator (CKA) or AWS Solutions Architect preferred.',
    'Remote work stipend, food delivery allowance, flexible vacation policy',
    '2026-12-20',
    '2026-10-21'
  ),
  J(
    'j9',
    'Machine Learning / AI Engineer',
    'Cred',
    'Bengaluru',
    'Full Time',
    'On-site',
    18,
    28,
    'PyTorch, Python, LLMs, NLP',
    'Data',
    '3–5 years',
    'AI Research',
    'Build proprietary NLP and recommendation algorithms to hyper-personalize member rewards.',
    'Fine-tune Large Language Models, build vector search retrieval systems, deploy low-latency inference.',
    'Strong mathematics background, deep fluency in Python, PyTorch/TensorFlow, and Hugging Face.',
    'Publications in NeurIPS, ICML, or hands-on LangChain/LlamaIndex production systems.',
    'Catered gourmet meals, gym memberships, competitive stock grants',
    '2026-12-31',
    '2026-10-22'
  ),
  J(
    'j10',
    'Senior Product Designer',
    'Canva',
    'Remote',
    'Full Time',
    'Remote',
    15,
    24,
    'Figma, Design Systems, UX Research',
    'UI/UX',
    '5+ years',
    'Design',
    'Design next-generation creative tools used by over 100 million creators worldwide.',
    'Establish design principles, craft cross-platform design systems, run rapid prototype testing.',
    'Demonstrated experience designing complex interactive web applications and design systems.',
    'Fluency in micro-interactions, accessibility (WCAG), and developer collaboration.',
    'Global remote culture, home office allowance, wellness days',
    '2027-01-15',
    '2026-10-23'
  ),
  J(
    'j11',
    'Mobile App Developer (Flutter)',
    'PhonePe',
    'Bengaluru',
    'Full Time',
    'Hybrid',
    10,
    17,
    'Flutter, Dart, Mobile, REST',
    'Frontend',
    '1–3 years',
    'Mobile Engineering',
    'Develop secure, snappy payment features used by millions of Indian consumers and merchants.',
    'Build native-feeling cross-platform mobile modules, optimize frame rates and memory usage.',
    'Proven production experience with Flutter & Dart, state management (Bloc or Riverpod).',
    'Familiarity with native Android (Kotlin) or iOS (Swift) bridge plugins.',
    'Comprehensive medical insurance, performance bonuses, hybrid work schedule',
    '2026-12-31',
    '2026-10-23'
  ),
  J(
    'j12',
    'Cybersecurity Analyst',
    'Wipro',
    'Pune',
    'Full Time',
    'Hybrid',
    7,
    12,
    'Network Security, SIEM, Penetration Testing',
    'Testing',
    '1–3 years',
    'Information Security',
    'Safeguard critical enterprise infrastructure against modern cyber threats and vulnerabilities.',
    'Monitor security logs via SIEM tools, conduct vulnerability assessments, respond to incidents.',
    'Working knowledge of OWASP Top 10, TCP/IP networking, Linux administration, and Wireshark.',
    'Security certifications such as CEH, CompTIA Security+, or OSCP are valued.',
    'Annual health checkup, transportation facility, certification reimbursements',
    '2026-12-15',
    '2026-10-24'
  ),
  J(
    'j13',
    'Technical Product Manager',
    'Flipkart',
    'Bengaluru',
    'Full Time',
    'On-site',
    16,
    26,
    'Agile, Product Strategy, JIRA, SQL',
    'Engineering',
    '3–5 years',
    'Product Management',
    'Define the product roadmap for supply-chain fulfillment and express grocery delivery.',
    'Author detailed PRDs, work closely with engineering and UX teams, measure feature impact via KPIs.',
    'Prior product management experience in e-commerce, logistics, or consumer tech platforms.',
    'Strong analytical abilities, SQL proficiency, and stakeholder management skills.',
    'Attractive bonus structure, relocation allowance, extensive medical benefits',
    '2027-01-10',
    '2026-10-24'
  ),
  J(
    'j14',
    'Site Reliability Engineer (SRE)',
    'Zomato',
    'Gurugram',
    'Full Time',
    'Hybrid',
    12,
    19,
    'Linux, Prometheus, Grafana, Python, CI/CD',
    'Backend',
    '3–5 years',
    'Platform Reliability',
    'Ensure 99.99% uptime for food ordering and delivery fleets during peak dinner surges.',
    'Build automated alerting, chaos engineering experiments, and disaster recovery automations.',
    'Strong Linux internal knowledge, Python/Bash scripting, monitoring with Prometheus/Grafana.',
    'Experience conducting blameless post-mortems and capacity planning.',
    'Free daily gourmet meals, health & dental coverage, fitness subsidies',
    '2026-12-25',
    '2026-10-24'
  ),
  J(
    'j15',
    'Junior Web Developer',
    'Thoughtworks',
    'Chennai',
    'Full Time',
    'On-site',
    4,
    7,
    'HTML5, CSS3, JavaScript, Git',
    'Frontend',
    'Fresher',
    'Software Consultancy',
    'Kickstart your career delivering client-facing digital solutions with industry-leading agile methodologies.',
    'Pair program with senior craftspeople, write clean, test-driven JavaScript, create accessible web pages.',
    'Strong foundational skills in semantic HTML, modern CSS, JavaScript, and Git version control.',
    'Passion for test-driven development (TDD) and continuous learning.',
    'Thoughtworks university induction training, book allowances, world-class pair programming culture',
    '2026-11-30',
    '2026-10-24'
  ),
  J(
    'j16',
    'Senior Data Scientist',
    'Microsoft',
    'Hyderabad',
    'Full Time',
    'Hybrid',
    22,
    35,
    'Python, Deep Learning, Azure ML, SQL',
    'Data',
    '5+ years',
    'Cloud & AI',
    'Develop innovative AI models powering Microsoft 365 Copilot and Azure cognitive capabilities.',
    'Formulate complex hypotheses, architect training pipelines, deploy production models to Azure ML.',
    'M.S. or Ph.D. in Computer Science, Statistics, or related STEM discipline with 5+ years experience.',
    'Track record in deep learning frameworks, transformer architectures, and distributed training.',
    'Microsoft stock grants (RSUs), 401(k)/PF matching, wellness budget, family health coverage',
    '2027-02-28',
    '2026-10-24'
  ),
];

const sampleApplications = [
  {
    uid: 'c0',
    jid: 'j1',
    rid: 'r0',
    name: 'Shalini Murugan',
    email: 'shalini@careerhub.com',
    phone: '+91 98765 43210',
    loc: 'Bengaluru, India',
    notice: 'Immediate',
    salary: '8',
    exp: '2 years',
    skills: 'React, JavaScript, CSS3, Redux',
    edu: 'B.Tech in Computer Science, Anna University (2022)',
    work: 'Frontend Engineer at TechStart (2022–Present). Developed responsive React interfaces.',
    resume: 'https://drive.google.com/file/d/demo_shalini_resume/view',
    cover: 'I have been building responsive web applications using React for over 2 years and would love to contribute to Zoho.',
    status: 'Interview',
    date: '2026-10-18',
    notes: 'Strong frontend fundamentals demonstrated during preliminary screening.',
    iv: {
      date: '2026-10-28',
      time: '11:00 AM',
      mode: 'Google Meet',
      link: 'https://meet.google.com/abc-defg-hij',
      notes: 'Technical interview with Frontend Lead. Focus on React state and live coding.',
    },
  },
  {
    uid: 'c1',
    jid: 'j2',
    rid: 'r0',
    name: 'Priya Sharma',
    email: 'priya@careerhub.com',
    phone: '+91 98450 11223',
    loc: 'Chennai, India',
    notice: '15 Days',
    salary: '12',
    exp: '3 years',
    skills: 'Node.js, Express, PostgreSQL, Docker, AWS',
    edu: 'B.E. Information Technology, SRM University (2021)',
    work: 'Backend Engineer at CloudScale. Built scalable microservices.',
    resume: 'https://drive.google.com/file/d/demo_priya_resume/view',
    cover: 'Passionate about building scalable backend architectures and API gateways.',
    status: 'Interview',
    date: '2026-10-17',
    notes: 'Scheduled system design interview.',
    iv: {
      date: '2026-10-29',
      time: '02:30 PM',
      mode: 'Zoom',
      link: 'https://zoom.us/j/9876543210',
      notes: 'Architecture and PostgreSQL deep-dive round.',
    },
  },
  {
    uid: 'c2',
    jid: 'j5',
    rid: 'r0',
    name: 'Arun Kumar',
    email: 'arun@careerhub.com',
    phone: '+91 97110 99887',
    loc: 'Hyderabad, India',
    notice: '1 Month',
    salary: '7',
    exp: '3–5 years',
    skills: 'Python, SQL, Tableau, PowerBI',
    edu: 'M.Sc Data Science, University of Hyderabad (2020)',
    work: 'Data Analyst at DataCorp. Automated BI pipelines.',
    resume: 'https://drive.google.com/file/d/demo_arun_resume/view',
    cover: 'Enthusiastic about translating raw business data into actionable dashboard metrics.',
    status: 'Selected',
    date: '2026-10-14',
    notes: 'Offer letter generated and sent.',
  },
  {
    uid: 'c0',
    jid: 'j7',
    rid: 'r0',
    name: 'Shalini Murugan',
    email: 'shalini@careerhub.com',
    phone: '+91 98765 43210',
    loc: 'Bengaluru, India',
    notice: 'Immediate',
    salary: '14',
    exp: '2 years',
    skills: 'React, JavaScript, Node.js, TypeScript',
    edu: 'B.Tech in Computer Science, Anna University (2022)',
    work: 'Frontend Engineer at TechStart (2022–Present)',
    resume: 'https://drive.google.com/file/d/demo_shalini_resume/view',
    cover: 'Excited about Razorpay payments stack.',
    status: 'Under Review',
    date: '2026-10-21',
    notes: 'Profile routed to hiring manager.',
  },
];

async function run() {
  const rawUrl = getMockApiUrl();
  const baseUrl = (rawUrl || '').replace(/\/+$/, '');

  if (!baseUrl || baseUrl.includes('YOUR_PROJECT')) {
    console.error('❌ Error: VITE_MOCKAPI_URL is not set or still contains placeholder.');
    console.error('Please configure VITE_MOCKAPI_URL in .env or provide as argument:');
    console.error('  node scripts/migrate.js https://<your-project>.mockapi.io\n');
    process.exit(1);
  }

  console.log(`\n🚀 Connecting to MockAPI: ${baseUrl}`);

  try {
    // 1. Check existing jobs on MockAPI
    console.log('📡 Fetching existing jobs from GET /jobs...');
    const checkRes = await fetch(`${baseUrl}/jobs`);
    if (!checkRes.ok) {
      throw new Error(`Failed to GET /jobs: HTTP ${checkRes.status} ${checkRes.statusText}`);
    }
    const existingJobs = await checkRes.json();
    console.log(`ℹ️  Found ${existingJobs.length} existing job(s) in MockAPI.`);

    const idMapping = {};
    let createdCount = 0;
    let skippedCount = 0;

    for (const seedJob of sampleJobs) {
      // Check if job already exists (by title and company)
      const existing = existingJobs.find(
        (ej) =>
          ej.title.toLowerCase() === seedJob.title.toLowerCase() &&
          ej.company.toLowerCase() === seedJob.company.toLowerCase()
      );

      if (existing) {
        console.log(`⏩ [Skipped duplicate] "${seedJob.title}" at "${seedJob.company}" (ID: ${existing.id})`);
        idMapping[seedJob.id] = existing.id;
        skippedCount++;
      } else {
        // Create job in MockAPI (remove dummy static id to let MockAPI generate a unique ID)
        const { id: oldId, ...jobData } = seedJob;
        const createRes = await fetch(`${baseUrl}/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobData),
        });

        if (!createRes.ok) {
          throw new Error(`Failed to POST /jobs for "${seedJob.title}": HTTP ${createRes.status}`);
        }

        const created = await createRes.json();
        console.log(`✅ [Created Job] "${created.title}" at "${created.company}" -> MockAPI ID: ${created.id}`);
        idMapping[seedJob.id] = created.id;
        createdCount++;
      }
    }

    // 2. Check and seed sample applications if /applications exists
    try {
      console.log('\n📡 Checking /applications endpoint...');
      const appCheck = await fetch(`${baseUrl}/applications`);
      if (appCheck.ok) {
        const existingApps = await appCheck.json();
        console.log(`ℹ️  Found ${existingApps.length} existing application(s) in MockAPI.`);
        for (const app of sampleApplications) {
          const mappedJid = idMapping[app.jid] || app.jid;
          const exists = existingApps.find(
            (ea) => ea.email === app.email && String(ea.jid) === String(mappedJid)
          );
          if (!exists) {
            const createPayload = { ...app, jid: mappedJid };
            const postRes = await fetch(`${baseUrl}/applications`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(createPayload),
            });
            if (postRes.ok) {
              const createdApp = await postRes.json();
              console.log(`✅ [Created Application] ${createdApp.name} applied for job ${mappedJid} -> ID: ${createdApp.id}`);
            }
          }
        }
      }
    } catch (appErr) {
      console.log('ℹ️  Skipped /applications migration or endpoint not found:', appErr.message);
    }

    console.log('\n=========================================');
    console.log('🎉 Migration Completed Successfully!');
    console.log(`Jobs Created: ${createdCount} | Jobs Skipped: ${skippedCount}`);
    console.log('Old ID -> MockAPI ID Mapping:');
    console.table(idMapping);
    console.log('=========================================\n');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

run();
