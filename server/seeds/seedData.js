/**
 * Seed Data Script
 * 하드코딩된 데이터를 MongoDB에 초기 데이터로 삽입
 *
 * Usage: node server/seeds/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const Publication = require('../models/Publication');
const News = require('../models/News');
const Project = require('../models/Project');
const Member = require('../models/Member');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/dbi-lab';

// ============================================
// Publications Data
// ============================================
const publicationsData = [
  {
    title: "Layered Feature Engineering for E-commerce Purchase Prediction: A Hierarchical Evaluation on Taobao User Behavior Datasets",
    authors: ["Liqiu Suo", "Lin Xia", "Yoona Chung"],
    year: 2025,
    type: "Journal",
    journal: "CMC-Computers, Materials & Continua",
    volume: "Vol.",
    category: "SCI",
    link: "https://doi.org/10.32604/cmc.2025.076329",
    isSelected: true,
    isActive: true
  },
  {
    title: "Muscle synergy-driven ensemble learning framework for individualized stroke gait rehabilitation",
    authors: ["Jaehyuk Lee"],
    year: 2025,
    type: "Journal",
    journal: "Scientific Reports",
    volume: "Vol.15",
    category: "SCI",
    link: "https://doi.org/10.1038/s41598-025-28818-5",
    isSelected: true,
    isActive: true
  },
  {
    title: "Multi-task Deep Learning Framework for Enhancing Mayo Endoscopic Score Classification in Ulcerative Colitis",
    authors: ["Jaehyuk Lee"],
    year: 2025,
    type: "Journal",
    journal: "Digital Health",
    volume: "Vol.11",
    category: "SCI/SSCI",
    link: "https://doi.org/10.1177/20552076251356396",
    isSelected: true,
    isActive: true
  },
  {
    title: "Primary Determinants and Strategic Implications for Customer Loyalty in Pet-Related Vertical E-Commerce: A Machine Learning Approach",
    authors: ["YongHyun Lee", "Kwangtek Na", "Jungwook Rhim"],
    year: 2025,
    type: "Journal",
    journal: "Systems",
    volume: "Vol.13, No.3",
    category: "SSCI",
    link: "https://doi.org/10.3390/systems13030175",
    isSelected: true,
    isActive: true
  },
  {
    title: "Precision Forecasting in Colorectal Oncology: Predicting Six-Month Survival to Optimize Clinical Decisions",
    authors: ["Jaehyuk Lee", "Youngchae Cho", "Yeunwoong Kyung"],
    year: 2025,
    type: "Journal",
    journal: "Electronics",
    volume: "Vol.14, No.5",
    category: "SCI",
    link: "https://doi.org/10.3390/electronics14050880",
    isSelected: true,
    isActive: true
  },
  {
    title: "Smoothing the Subjective Financial Risk Tolerance: Volatility and Market Implications",
    authors: ["Wookjae Heo"],
    year: 2025,
    type: "Journal",
    journal: "Mathematics",
    volume: "Vol.13, No.4",
    category: "SCI",
    link: "https://doi.org/10.3390/math13040680",
    isSelected: true,
    isActive: true
  },
  {
    title: "Understanding the Adoption Intention of Financial Data Retrieval Services: An Empirical Analysis of My Data",
    authors: ["Yeunwoong Kyung"],
    year: 2025,
    type: "Journal",
    journal: "Heliyon",
    volume: "Vol.11, No.1",
    category: "SCI",
    link: "https://doi.org/10.1016/j.heliyon.2024.e41334",
    isSelected: true,
    isActive: true
  },
  {
    title: "Green Total Factor Productivity and Its Nonlinear Relationship With Coordinated FDI Development: Evidence From Panel Models",
    authors: ["Lihong Fan", "Bisharat H. Chang"],
    year: 2025,
    type: "Journal",
    journal: "Natural Resource Modeling",
    volume: "Vol.38, No.1",
    category: "SCI",
    link: "https://doi.org/10.1111/nrm.12418",
    isSelected: true,
    isActive: true
  },
  {
    title: "Augmented ELBO regularization for enhanced clustering in variational autoencoders",
    authors: ["Kwangtek Na", "Ju-Hong Lee"],
    year: 2025,
    type: "Journal",
    journal: "Neurocomputing",
    volume: "Vol.614",
    category: "SCI",
    link: "https://doi.org/10.1016/j.neucom.2024.128795",
    isSelected: true,
    isActive: true
  },
  {
    title: "SICGNN: Structurally informed convolutional graph neural networks for protein classification",
    authors: ["YongHyun Lee", "Jiwoong Choi", "Changhyun Lee"],
    year: 2024,
    type: "Journal",
    journal: "Machine Learning: Science and Technology",
    volume: "Vol.5, No.4",
    category: "SCI",
    link: "https://doi.org/10.1088/2632-2153/ad979b",
    isSelected: true,
    isActive: true
  },
  {
    title: "Method and System for Authenticating Transfer based on Questioning",
    authors: ["Sole Author"],
    year: 2024,
    type: "Patent",
    journal: "KR Patent",
    volume: "Registered",
    category: "KR Patent",
    link: "https://doi.org/10.8080/1020220000365",
    isSelected: true,
    isActive: true
  },
  {
    title: "Data-Driven Stroke Classification Utilizing Electromyographic Muscle Features and Machine Learning Techniques",
    authors: ["Jaehyuk Lee", "Youngjun Kim"],
    year: 2024,
    type: "Journal",
    journal: "Applied Sciences-Basel",
    volume: "Vol.14, No.18",
    category: "SCI",
    link: "https://doi.org/10.3390/app14188430",
    isSelected: true,
    isActive: true
  },
  {
    title: "Climate policy uncertainty and its impact on energy demand: An empirical evidence using the Fourier augmented ARDL model",
    authors: ["Zhe Tu", "Bisharat H. Chang", "Raheel Gohar"],
    year: 2024,
    type: "Journal",
    journal: "Economic Analysis and Policy",
    volume: "Vol.84",
    category: "SSCI",
    link: "https://doi.org/10.1016/j.eap.2024.08.021",
    isSelected: true,
    isActive: true
  },
  {
    title: "Opportunistic Offloading Scheme for Content Delivery Service using Electro-Mobility Networks",
    authors: ["Yeunwoong Kyung"],
    year: 2024,
    type: "Journal",
    journal: "IET Intelligent Transport Systems",
    volume: "Vol.18, No.4",
    category: "SCI",
    link: "https://doi.org/10.1049/itr2.12255",
    isSelected: true,
    isActive: true
  },
  {
    title: "Deep Learning-based Delinquent Taxpayer Prediction: A Scientific Administrative Approach",
    authors: ["YongHyun Lee"],
    year: 2024,
    type: "Journal",
    journal: "KSII Transactions on Internet and Information Systems",
    volume: "Vol.18, No.1",
    category: "SCI",
    link: "https://doi.org/10.3837/tiis.2024.01.003",
    isSelected: true,
    isActive: true
  },
  {
    title: "LF-Transformer: Latent Factorizer Transformer for Tabular Learning",
    authors: ["Kwangteak Na", "Ju-Hong Lee"],
    year: 2024,
    type: "Journal",
    journal: "IEEE Access",
    volume: "Vol.12",
    category: "SCI",
    link: "https://doi.org/10.1109/ACCESS.2024.3354972",
    isSelected: true,
    isActive: true
  },
  {
    title: "Identifying Hidden Factors Associated with Household Emergency Fund Holdings: A Machine Learning Application",
    authors: ["Wookjae Heo", "Eun Jin Kwak", "John Grable"],
    year: 2024,
    type: "Journal",
    journal: "Mathematics",
    volume: "Vol.12, No.2",
    category: "SCI",
    link: "https://doi.org/10.3390/math12020182",
    isSelected: true,
    isActive: true
  },
  {
    title: "Machine Learning-based Prediction of Relative Regional Air Volume Change",
    authors: ["YongHyun Lee", "Byungjoon Yoo", "Jiwoong Choi", "Kum Ju Chae", "Changhyun Lee"],
    year: 2023,
    type: "Journal",
    journal: "KSII Transactions on Internet and Information Systems",
    volume: "Vol.17, No.2",
    category: "SCI",
    link: "https://doi.org/10.3837/tiis.2023.02.016",
    isSelected: true,
    isActive: true
  },
  {
    title: "Factors Affecting the Adoption Intention of New Electronic Authentication Services: A Convergent Model Approach of VAM, PMT, and TPB",
    authors: ["Yeunwoong Kyung"],
    year: 2023,
    type: "Journal",
    journal: "IEEE Access",
    volume: "Vol.11",
    category: "SCI",
    link: "https://doi.org/10.1109/ACCESS.2023.3243183",
    isSelected: true,
    isActive: true
  },
  {
    title: "TinyML-based Classification in ECG Monitoring Embedded System",
    authors: ["Jaehyuk Kim", "Yeunwoong Kyung", "Juyoung Park"],
    year: 2023,
    type: "Journal",
    journal: "CMC-Computers, Materials & Continua",
    volume: "Vol.75, No.1",
    category: "SCI",
    link: "https://doi.org/10.32604/cmc.2023.031663",
    isSelected: true,
    isActive: true
  },
  {
    title: "ALBERT with Knowledge Graph Encoder Utilizing Semantic Similarity for Commonsense Question Answering",
    authors: ["Byeongmin Choi", "YongHyun Lee", "Yeunwoong Kyung"],
    year: 2023,
    type: "Journal",
    journal: "Intelligent Automation & Soft Computing",
    volume: "Vol.36, No.1",
    category: "SCI",
    link: "https://doi.org/10.32604/iasc.2023.032783",
    isSelected: true,
    isActive: true
  },
  {
    title: "A Case Study of Digital Transformation : Focusing on the Financial Sector in South Korea and Overseas",
    authors: ["Minjae Kim", "Yeunwoong Kyung"],
    year: 2022,
    type: "Journal",
    journal: "Asia Pacific Journal of Information Systems",
    volume: "Vol.32, No.3",
    category: "Scopus",
    link: "https://doi.org/10.14329/apjis.2022.32.3.537",
    isSelected: true,
    isActive: true
  },
  {
    title: "The Association Between SOC and Land Prices Considering Spatial Heterogeneity Based on Finite Mixture Modeling",
    authors: ["Wooseok Kang", "Wookjae Heo"],
    year: 2022,
    type: "Journal",
    journal: "The Korea Spatial Planning Review",
    volume: "Vol.114",
    category: "KCI",
    link: "https://doi.org/10.15793/kspr.2022.114..004",
    isSelected: true,
    isActive: true
  },
  {
    title: "SHOMY: Detection of Small Hazardous Objects using the You Only Look Once Algorithm",
    authors: ["Jinyoung Lee", "Hyunjik Jo", "Kwangtek Na", "Gahgene Gweon", "Byungjoon Yoo", "Yeunwoong Kyung"],
    year: 2022,
    type: "Journal",
    journal: "KSII Transactions on Internet and Information Systems",
    volume: "Vol.16, No.8",
    category: "SCI",
    link: "https://doi.org/10.3837/tiis.2022.08.012",
    isSelected: true,
    isActive: true
  },
  {
    title: "System and Method for Providing Loan Service based on the Value in Use",
    authors: ["Jongmoon Yoon", "Hyochan Lee"],
    year: 2021,
    type: "Patent",
    journal: "KR Patent",
    volume: "Registered",
    category: "KR Patent",
    link: "https://doi.org/10.8080/1020190089899",
    isSelected: true,
    isActive: true
  },
  {
    title: "The Details and Outlook of Three Data Acts Amendment in South Korea: With a Focus on the Changes of Domestic Financial and Data Industry",
    authors: ["Eunyoung Kim", "Hyochan Lee", "Byungjoon Yoo"],
    year: 2021,
    type: "Journal",
    journal: "Informatization Policy",
    volume: "Vol.28, No.3",
    category: "KCI",
    link: "https://doi.org/10.22693/niaip.2021.28.3.049",
    isSelected: true,
    isActive: true
  },
  {
    title: "A Securities Company's Customer Churn Prediction Model and Causal Inference with SHAP Value",
    authors: ["Kwangtek Na", "Jinyoung Lee", "Hyochan Lee"],
    year: 2020,
    type: "Journal",
    journal: "The Journal of Bigdata",
    volume: "Vol.5, No.2",
    category: "KCI",
    link: "https://doi.org/10.36498/kbigdt.2020.5.2.215",
    isSelected: true,
    isActive: true
  },
  // Work-in-Progress Publications
  {
    title: "Strategic default detection leveraging card spending: Static-feature ensemble and cluster-augmented signals for non time-series modeling",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "C-Swin: Integrating CNN and hybrid shifted window in transformer for lung cancer classification",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Interpretable prediction of private brand purchases by pet type in e-commerce for consumer behavior analysis using real-world transaction data",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Neuro-deep fuzzy system for estimation of NO₂ concentration in soil and groundwater on highways from remote sensing images",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Hybrid CNN–Transformer architecture for personal credit risk prediction: Comparative insights into model explainability",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Diagnosis-aware multitask fine-tuning of Whisper for dysarthric speech recognition",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Fostering educational innovation in resource-constrained environments: A design science approach using sLLM-based chatbots in HRD education",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Month-conditioned boosting framework with SHAP-in-the-loop for short-term electricity load forecasting",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "ENSGA-II: An Efficient NSGA-II Framework with Finite-Difference Diversity for Router Placement Optimization",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "An interpretable stacking ensemble with TabNet-enhanced features for breast cancer diagnosis",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Fair credit risk assessment through two-stage false negative recovery: Balancing financial inclusion and stability",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  },
  {
    title: "Resource-Constrained Edge AI Solution for Smart Farming: Real-Time Pest and Disease Detection in Chili Pepper Fields",
    authors: [],
    year: 2025,
    type: "Journal",
    category: "Other",
    isWorkInProgress: true,
    isSelected: false,
    isActive: true
  }
];

// ============================================
// News Data
// ============================================
const newsData = [
  { date: new Date('2025-12-15'), title: 'Signed a memorandum of understanding with Mondrian AI', link: 'https://www.etnews.com/20251219000330', isActive: true },
  { date: new Date('2025-12-10'), title: 'DBI Lab. won the grand prize at the healthy research lab competition', link: 'https://www.newshyu.com/news/articleView.html?idxno=1021910', isActive: true },
  { date: new Date('2025-12-05'), title: 'Received and started a research project (HY-202500000003761)', link: '', isActive: true },
  { date: new Date('2025-11-20'), title: 'Received and started a research project (HY-202500000003952)', link: '', isActive: true },
  { date: new Date('2025-11-15'), title: 'Received and started a research project (HY-202500000003701)', link: '', isActive: true },
  { date: new Date('2025-11-16'), title: 'Lab member, Hosoo Shin was awarded the AI SeoulTech Scholarship', link: 'http://etnews.com/20251116000023', isActive: true },
  { date: new Date('2025-10-20'), title: 'Finished a research project (HY-202500000003726)', link: '', isActive: true },
  { date: new Date('2025-10-15'), title: 'Finished a research project (HY-202500000003279)', link: '', isActive: true },
  { date: new Date('2025-09-20'), title: 'Signed a memorandum of understanding with CRK', link: 'http://www.hynews.ac.kr/news/articleView.html?idxno=13383', isActive: true },
  { date: new Date('2025-09-15'), title: 'Received and started a research project (HY-202500000003108)', link: '', isActive: true },
  { date: new Date('2025-09-10'), title: 'Professor Eunchan Kim was appointed as a Public Officials Training Review Committee Member by the Seoul Facilities Corporation', link: '', isActive: true },
  { date: new Date('2025-08-20'), title: 'Professor Eunchan Kim was appointed as a Task Evaluation Committee Member by Kangwon National University', link: '', isActive: true },
  { date: new Date('2025-08-15'), title: 'Professor Eunchan Kim was appointed as an AI Advisory Committee Member by the Seoul Facilities Corporation', link: '', isActive: true },
  { date: new Date('2025-07-15'), title: 'Received and started a research project (HY-202500000002838)', link: '', isActive: true },
  { date: new Date('2025-06-18'), title: 'Lab member, Yoona Chung was awarded the AI SeoulTech scholarship.', link: 'https://www.etnews.com/20250618000224', isActive: true },
  { date: new Date('2025-05-15'), title: 'Finished a research project (HY-202500000000191)', link: '', isActive: true },
  { date: new Date('2025-04-15'), title: 'Received and started a research project (HY-500000000001616)', link: '', isActive: true },
  { date: new Date('2025-03-20'), title: 'Received and started a research project (HY-202500000001158)', link: '', isActive: true },
  { date: new Date('2025-03-15'), title: 'Visiting Researcher YongHyun Lee has joined DBI Lab', link: '', isActive: true },
  { date: new Date('2025-02-15'), title: 'Agreement on Academic Research Using Pseudonymized Credit and Financial Data (Agreement with KCB)', link: '', isActive: true },
  { date: new Date('2025-01-15'), title: 'Received and started a research project (HY-202500000000191)', link: '', isActive: true },
  { date: new Date('2024-12-15'), title: 'Received and started a research project (HY-202400000003726)', link: '', isActive: true },
  { date: new Date('2024-11-07'), title: 'Signed a memorandum of understanding with Toss Bank', link: 'https://www.etnews.com/20241107000242', isActive: true },
  { date: new Date('2024-10-15'), title: 'Professor Eunchan Kim received the best TPC award from IEEE/KICS', link: '', isActive: true },
  { date: new Date('2024-09-20'), title: 'Research Professor Jaehyuk Lee has joined DBI Lab', link: '', isActive: true },
  { date: new Date('2024-09-15'), title: 'Received and started a research project (HY-202400000003279)', link: '', isActive: true },
  { date: new Date('2024-09-01'), title: 'Data and business intelligence laboratory (DBI Lab.) has opened', link: '', isActive: true }
];

// ============================================
// Projects Data
// ============================================
const projectsData = [
  // Ongoing (Current)
  { title: 'Deep learning-based traffic congestion prediction model for intelligent transportation system optimization', sponsor: 'Hanyang University', period: '2025 - 2026', status: 'Ongoing', isActive: true },
  { title: 'Product data construction', sponsor: 'CRK', period: '2025 - 2026', status: 'Ongoing', isActive: true },
  { title: 'LLM data validation', sponsor: 'TTA - WesleyQuest', period: '2025 - 2026', status: 'Ongoing', isActive: true },
  { title: 'Advancing and integrating AI-driven vision recognition systems', sponsor: 'CRK', period: '2025 - 2026', status: 'Ongoing', isActive: true },
  { title: 'Vision AI-based track recognition and hazardous zone classification', sponsor: 'Hyundai Rotem - D&D', period: '2025 - 2026', status: 'Ongoing', isActive: true },
  { title: 'AI-based speech recognition system to assist communication in neurological disorders', sponsor: 'Hanyang University', period: '2025 - 2026', status: 'Ongoing', isActive: true },
  { title: 'Academic research on pseudonymized credit and financial data', sponsor: 'KCB', period: '2025 - 2028', status: 'Ongoing', isActive: true },

  // Work In Progress
  { title: 'Technology transfer for method and system for secure money transfer authentication based on question answering', sponsor: '-', period: 'Contract in Progress', status: 'Work In Progress', isActive: true },
  { title: 'Development of a novel deep learning algorithm leveraging inspiratory system and validation using heterogeneous data', sponsor: '-', period: 'Submitted', status: 'Work In Progress', isActive: true },

  // Completed (Past)
  { title: 'Research on innovative energy-fusion technology for future mobility transition', sponsor: 'Hanyang University', period: '2025', status: 'Completed', isActive: true },
  { title: 'Preliminary research on driver advisory systems and related technologies', sponsor: 'KORAIL - D&D', period: '2025', status: 'Completed', isActive: true },
  { title: 'AI-based exercise prescription framework to optimize healthcare services', sponsor: 'Hanyang University', period: '2024 - 2025', status: 'Completed', isActive: true },
  { title: 'Intelligent systems and information technology-based convergence research for solving detailed business problems within heterogeneous industries', sponsor: 'Hanyang University', period: '2024 - 2025', status: 'Completed', isActive: true },
  { title: 'Assessment of regional lung function and particle inhalation characteristics during inhaler use in patients with COPD and asthma using quantitative CT and computational fluid dynamics', sponsor: 'MSIT', period: '2021 - 2024', status: 'Completed', isActive: true },
  { title: 'Development of personal information protection technology using anonymization techniques in a big data environment', sponsor: 'MSIT', period: '2017 - 2018', status: 'Completed', isActive: true },
  { title: 'Public big data-based standard analysis model - local tax sector', sponsor: 'MOIS', period: '2017 - 2018', status: 'Completed', isActive: true }
];

// ============================================
// Members Data (Professor, Researchers, Students)
// ============================================
const membersData = [
  // ===== Professor =====
  {
    name: 'Eunchan Kim, Ph.D.',
    nameKo: '김은찬',
    role: 'Professor',
    title: 'Assistant Professor (Tenure Track)',
    email: 'eckim@hanyang.ac.kr',
    affiliation: 'Hanyang University, Department of Information Systems',
    linkedin: 'https://www.linkedin.com/in/daniel0117/',
    orcid: 'https://orcid.org/0000-0002-3743-3550',
    professionalDetails: JSON.stringify({
      professionalExperience: [
        'Assistant Professor, College of Engineering, Hanyang University (2024–present)',
        'Lecturer, Seoul National University (2023–2024)',
        'Visiting Scholar, Seoul National University Hospital (2021–2024)',
        'Visiting Scholar, Jeonbuk National University Hospital (2021–2024)',
        'Senior Researcher & Manager, Hanwha Group (2018–2024)',
        'Researcher, Korea Credit Bureau (2016–2018)'
      ],
      affiliations: [
        'Department of Information Systems (Primary)',
        'Department of Artificial Intelligence (Adjunct)',
        'Department of Data Science (Joint)',
        'Artificial Intelligence institute of Hanyang University',
        'Hanyang Institute of Advanced Artificial Intelligence'
      ],
      evaluationRoles: [
        'Evaluation Committee Member, Korea Technology and Information Promotion Agency for SMEs (TIPA) (Nov. 2025 – present)',
        'Expert Committee Member, Public Officials Training Review Committee, Seoul Facilities Corporation (Sep. 2025 – present)',
        'Expert Committee Member, AI Advisory Committee, Seoul Facilities Corporation (Aug. 2025 – present)',
        'Expert Committee Member, Task Review Committee, Kangwon National University (Aug. 2025 – present)',
        'Evaluation Committee Member, Korea Health Industry Development Institute (Nov. 2024 – present)',
        'Panel Committee Member, Seoul National University, Kangwon National University, and etc. (Sep. 2024 – present)'
      ],
      academicService: [
        'Board Member, Data Intelligence Committee, Korean Academic Society of Business Administration (Mar. 2025 – present)',
        'Editorial Board Member, Korean Innovation Industry Society (Jan. 2025 – present)'
      ],
      editorialService: [
        'SAGE, Springer, Wiley, Elsevier (2025 – present)',
        'Nature Publishing Group, Taylor & Francis (2024 – present)',
        'AIMS Press, Tech Science Press, IEEE (2022 – present)'
      ],
      awards: [
        'Best TPC Award, International Conference on ICT Convergence by IEEE/KICS (Oct. 2024)',
        'Best Paper Award, Asia Pacific International Conference on Information Science and Technology by KSII (Jun. 2022)',
        'Outstanding Paper Award, International Conference on Internet by KSII (Dec. 2021)',
        'Best Paper Award, Korean Big Data Society (Oct. 2021)',
        "Commissioner's Award, Korea Big Data Awards, Statistics Korea (Dec. 2020)"
      ]
    }),
    isActive: true,
    order: 0
  },

  // ===== Researchers (Visiting) =====
  {
    name: 'Jaehyuk Lee, Ph.D.',
    nameKo: '이재혁',
    role: 'Visiting',
    title: 'Visiting Scholar',
    email: 'jhl9405@seoultech.ac.kr',
    affiliation: 'Hanyang University, Department of Information Systems',
    secondaryTitle: 'Research Professor',
    secondaryAffiliation: 'Institute of IT Convergence Technology, Seoul National University of Science and Technology',
    joinYear: 2024,
    isActive: true,
    order: 1
  },
  {
    name: 'YongHyun Lee, Ph.D.',
    nameKo: '이용현',
    role: 'Visiting',
    title: 'Visiting Researcher',
    email: 'joshualeehyun21@gmail.com',
    affiliation: 'Hanyang University, Department of Information Systems',
    secondaryTitle: 'Researcher',
    secondaryAffiliation: 'Department of Radiology, Seoul National University Hospital',
    joinYear: 2025,
    isActive: true,
    order: 2
  },

  // ===== PhD / Integrated PhD Students =====
  {
    name: 'Yoona Chung',
    nameKo: '정윤아',
    role: 'PhD',
    email: 'chungyn@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Digital Divide',
    researchFocus: 'Intelligent Systems, AI Applications',
    github: 'https://github.com/yoona-J',
    orcid: 'https://orcid.org/0009-0003-8487-5743',
    isLabManager: true,
    isActive: true,
    order: 10
  },
  {
    name: 'Jeongmin Hong',
    nameKo: '홍정민',
    role: 'PhD',
    email: 'maxhong99@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Holistic Wellness',
    researchFocus: 'Intelligent Physiology, AI Applications',
    orcid: 'https://orcid.org/0009-0002-0278-8818',
    isActive: true,
    order: 11
  },
  {
    name: 'JinSung Park',
    nameKo: '박진성',
    role: 'PhD',
    email: 'jinpark0923@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Smart City',
    researchFocus: 'Urban Intelligence, AI Applications',
    isActive: true,
    order: 12
  },
  {
    name: 'Hosoo Shin',
    nameKo: '신호수',
    role: 'PhD',
    email: 'enphilo@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Medical Intelligence',
    researchFocus: 'Robust Diagnostics, AI Applications',
    isActive: true,
    order: 13
  },
  {
    name: 'Liqiu Suo',
    nameKo: '소리추',
    role: 'PhD',
    email: 'soda0808@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for User Behavior',
    researchFocus: 'User Analysis, AI Applications',
    isActive: true,
    order: 14
  },
  {
    name: 'Jaemin Yang',
    nameKo: '양재민',
    role: 'PhD',
    email: 'jaemin3404@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Financial Intelligence',
    researchFocus: 'Multi-Modal and Task Learning, AI Applications',
    isActive: true,
    order: 15
  },
  {
    name: 'Bitchan Eom',
    nameKo: '엄빛찬',
    role: 'PhD',
    email: 'ubc445@naver.com',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Network Systems',
    researchFocus: 'Network Optimization, AI Applications',
    isActive: true,
    order: 16
  },

  // ===== Master's Students =====
  {
    name: 'Daehan Kim',
    nameKo: '김대한',
    role: 'MS',
    email: 'kimdae@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Healthcare Innovation',
    researchFocus: 'Medical Intelligence, AI Applications',
    orcid: 'https://orcid.org/0009-0006-7228-0322',
    isActive: true,
    order: 20
  },
  {
    name: 'Lin Xia',
    nameKo: '하림',
    role: 'MS',
    email: 'harim1002@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Medical Intelligence',
    researchFocus: 'Precision Medicine, AI Applications',
    isActive: true,
    order: 21
  },
  {
    name: 'Gibyung Kang',
    nameKo: '강기병',
    role: 'MS',
    email: 'gibyung2000@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for AI-Driven Experience',
    researchFocus: 'Intelligent UX, AI Applications',
    github: 'https://github.com/gibyungkang',
    isActive: true,
    order: 22
  },
  {
    name: 'Seungo Kwon',
    nameKo: '권승오',
    role: 'MS',
    email: 'seungolego1257@gmail.com',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Societal Impact',
    researchFocus: 'Intelligent Vision & Learning, AI Applications',
    github: 'https://github.com/stickman1257',
    isActive: true,
    order: 23
  },
  {
    name: 'Seongyeon Son',
    nameKo: '손성연',
    role: 'MS',
    email: 'annssy@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Sustainable Data Intelligence',
    researchFocus: 'Environmental Forecasting, AI Applications',
    isActive: true,
    order: 24
  },
  {
    name: 'Byeongchan Go',
    nameKo: '고병찬',
    role: 'MS',
    email: 'bcgo99@hanyang.ac.kr',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Platform Design',
    researchFocus: 'Behavior Modeling, AI Applications',
    isActive: true,
    order: 25
  },
  {
    name: 'Minhee Park',
    nameKo: '박민희',
    role: 'MS',
    email: 'bagminhui927@gmail.com',
    affiliation: 'Hanyang University',
    researchKeyword: 'Solutions for Data-Driven Techniques',
    researchFocus: 'Data Intelligence, AI Applications',
    isActive: true,
    order: 26
  }
];

// ============================================
// Seed Functions
// ============================================
async function seedPublications() {
  await Publication.deleteMany({});
  await Publication.insertMany(publicationsData);
  console.log(`✓ Publications: ${publicationsData.length} items seeded`);
}

async function seedNews() {
  await News.deleteMany({});
  await News.insertMany(newsData);
  console.log(`✓ News: ${newsData.length} items seeded`);
}

async function seedProjects() {
  await Project.deleteMany({});
  await Project.insertMany(projectsData);
  console.log(`✓ Projects: ${projectsData.length} items seeded`);
}

async function seedMembers() {
  await Member.deleteMany({});
  await Member.insertMany(membersData);
  console.log(`✓ Members: ${membersData.length} items seeded`);
}

async function runSeeds() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');

    console.log('Seeding data...');
    await seedPublications();
    await seedNews();
    await seedProjects();
    await seedMembers();

    console.log('\n✅ All data seeded successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
}

// Run seeds
runSeeds();
