import { 
  collection, 
  addDoc, 
  getDocs, 
  query,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Check if data already exists
const checkIfSeeded = async (): Promise<boolean> => {
  const projectsSnapshot = await getDocs(collection(db, 'projects'));
  return projectsSnapshot.size > 0;
};

// Sample user data with African context
const sampleUsers = [
  {
    email: 'kwame.tech@diceytech.com',
    displayName: 'Kwame Mensah',
    bio: 'Full-stack developer passionate about building solutions for African markets. Specializing in fintech and e-commerce platforms.',
    location: 'Accra, Ghana',
    phone: '+233 24 123 4567',
    github: 'github.com/kwametech',
    linkedin: 'linkedin.com/in/kwamemensah',
    twitter: '@kwame_codes',
    role: 'user' as const,
    profileCompleteness: 95,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Mobile Money APIs']
  },
  {
    email: 'amara.dev@diceytech.com',
    displayName: 'Amara Okafor',
    bio: 'Mobile app developer and UI/UX enthusiast. Building apps that solve real problems for African communities.',
    location: 'Lagos, Nigeria',
    phone: '+234 80 987 6543',
    github: 'github.com/amaradev',
    linkedin: 'linkedin.com/in/amaraokafor',
    twitter: '@amara_builds',
    role: 'user' as const,
    profileCompleteness: 90,
    skills: ['Flutter', 'React Native', 'Firebase', 'Figma', 'REST APIs', 'Payment Integration']
  },
  {
    email: 'zuri.code@diceytech.com',
    displayName: 'Zuri Mwangi',
    bio: 'Data scientist and ML engineer focused on agricultural tech solutions. Won 3 hackathons in 2024.',
    location: 'Nairobi, Kenya',
    phone: '+254 71 234 5678',
    github: 'github.com/zuriml',
    linkedin: 'linkedin.com/in/zurimwangi',
    twitter: '@zuri_ml',
    role: 'user' as const,
    profileCompleteness: 88,
    skills: ['Python', 'TensorFlow', 'Django', 'PostgreSQL', 'Docker', 'Data Analysis']
  },
  {
    email: 'tunde.ai@diceytech.com',
    displayName: 'Tunde Adebayo',
    bio: 'Backend engineer specializing in scalable systems. Building infrastructure for African startups.',
    location: 'Ibadan, Nigeria',
    phone: '+234 90 555 1234',
    github: 'github.com/tundebackend',
    linkedin: 'linkedin.com/in/tundeadebayo',
    role: 'user' as const,
    profileCompleteness: 85,
    skills: ['Go', 'Kubernetes', 'Redis', 'GraphQL', 'Microservices', 'CI/CD']
  },
  {
    email: 'fatima.cloud@diceytech.com',
    displayName: 'Fatima Sesay',
    bio: 'Cloud architect and DevOps engineer. Passionate about making tech accessible across Africa.',
    location: 'Freetown, Sierra Leone',
    github: 'github.com/fatimacloud',
    linkedin: 'linkedin.com/in/fatimasesay',
    twitter: '@fatima_devops',
    role: 'user' as const,
    profileCompleteness: 92,
    skills: ['AWS', 'Azure', 'Terraform', 'Docker', 'Jenkins', 'Linux']
  }
];

// Sample projects with African context
const sampleProjects = [
  {
    title: 'AfriPay - Mobile Money Integration Platform',
    description: 'A unified API platform that integrates multiple mobile money providers across Africa (MTN Mobile Money, Airtel Money, M-Pesa, Orange Money). Makes it easy for businesses to accept mobile money payments.',
    category: 'Fintech',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    demoUrl: 'https://afripay-demo.com',
    githubUrl: 'https://github.com/kwametech/afripay',
    techStack: ['Node.js', 'React', 'PostgreSQL', 'Redis', 'Docker'],
    skills: ['Payment APIs', 'Security', 'REST APIs', 'Testing'],
    collaborators: [],
    challenges: 'Handling different API formats from various mobile money providers and ensuring transaction security.',
    learnings: 'Learned about webhook implementations, idempotency in financial transactions, and building retry mechanisms.',
    futureImprovements: 'Add support for more providers, implement real-time analytics dashboard, and add fraud detection.',
    status: 'Live',
    views: 1234,
    likes: 89
  },
  {
    title: 'FarmConnect - Agricultural Marketplace',
    description: 'Mobile app connecting smallholder farmers directly to buyers, eliminating middlemen. Features include price tracking, weather forecasts, and agricultural tips.',
    category: 'Agriculture',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    demoUrl: 'https://farmconnect-demo.com',
    githubUrl: 'https://github.com/amaradev/farmconnect',
    techStack: ['React Native', 'Firebase', 'Node.js', 'MongoDB'],
    skills: ['Mobile Development', 'Real-time Updates', 'Geolocation', 'Push Notifications'],
    collaborators: [],
    challenges: 'Optimizing the app for low-end devices and poor network connectivity common in rural areas.',
    learnings: 'Implemented offline-first architecture and learned about progressive data loading.',
    futureImprovements: 'Add AI-powered crop disease detection and integrate microfinance options.',
    status: 'Beta',
    views: 856,
    likes: 67
  },
  {
    title: 'HealthTrack Nigeria - Telemedicine Platform',
    description: 'Comprehensive telemedicine solution for remote patient monitoring and virtual consultations. Supports multiple local languages and works on USSD for feature phone users.',
    category: 'Healthcare',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    demoUrl: 'https://healthtrack-ng.com',
    githubUrl: 'https://github.com/zuriml/healthtrack',
    techStack: ['Python', 'Django', 'PostgreSQL', 'WebRTC', 'TensorFlow'],
    skills: ['Video Conferencing', 'Data Privacy', 'ML Models', 'USSD Integration'],
    collaborators: ['kwame.tech@diceytech.com'],
    challenges: 'Ensuring HIPAA-level compliance with Nigerian data protection regulations and building reliable video calls on poor connections.',
    learnings: 'Implemented adaptive bitrate streaming and learned about healthcare data encryption standards.',
    futureImprovements: 'Add AI diagnosis assistance, prescription management, and integration with hospital systems.',
    status: 'Live',
    views: 2103,
    likes: 145
  },
  {
    title: 'EduLink - E-Learning Platform for African Schools',
    description: 'Interactive learning platform designed for African curriculum with offline content download, progress tracking, and gamification.',
    category: 'Education',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    githubUrl: 'https://github.com/tundebackend/edulink',
    techStack: ['React', 'Node.js', 'MongoDB', 'AWS S3'],
    skills: ['Progressive Web Apps', 'Offline Storage', 'Video Streaming', 'Gamification'],
    collaborators: [],
    challenges: 'Creating engaging content that works across different education systems and optimizing video content for bandwidth constraints.',
    learnings: 'Learned about adaptive learning algorithms and implementing service workers for offline functionality.',
    futureImprovements: 'Add live classes, peer-to-peer study groups, and integration with national exam boards.',
    status: 'In Development',
    views: 634,
    likes: 52
  },
  {
    title: 'TrafficSmart - Urban Mobility Solution',
    description: 'Real-time traffic management system using AI to optimize traffic light timing and provide route suggestions. Reduces commute time by 30% in pilot areas.',
    category: 'Smart Cities',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    demoUrl: 'https://trafficsmart-demo.com',
    githubUrl: 'https://github.com/fatimacloud/trafficsmart',
    techStack: ['Python', 'TensorFlow', 'React', 'AWS', 'IoT'],
    skills: ['Machine Learning', 'IoT', 'Cloud Infrastructure', 'Data Visualization'],
    collaborators: ['zuri.code@diceytech.com'],
    challenges: 'Processing real-time data from multiple sources and ensuring system reliability for critical infrastructure.',
    learnings: 'Learned about edge computing, real-time data processing with Kafka, and building failsafe systems.',
    futureImprovements: 'Expand to more cities, add public transport integration, and predictive maintenance for traffic infrastructure.',
    status: 'Pilot',
    views: 1567,
    likes: 98
  },
  {
    title: 'VoiceTranslate - African Languages AI Translator',
    description: 'Real-time voice translation app supporting 20+ African languages including Yoruba, Swahili, Zulu, Hausa, and Amharic. Uses custom-trained models for better accuracy.',
    category: 'AI/ML',
    difficulty: 'Expert',
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800',
    demoUrl: 'https://voicetranslate-demo.com',
    githubUrl: 'https://github.com/kwametech/voicetranslate',
    techStack: ['Python', 'PyTorch', 'React Native', 'FastAPI', 'Docker'],
    skills: ['NLP', 'Speech Recognition', 'Deep Learning', 'Mobile Development'],
    collaborators: ['amara.dev@diceytech.com', 'zuri.code@diceytech.com'],
    challenges: 'Building training datasets for under-resourced languages and optimizing models to run on mobile devices.',
    learnings: 'Learned about transfer learning, model quantization, and working with low-resource languages.',
    futureImprovements: 'Add dialect support, improve accuracy for mixed-language conversations, and add text translation.',
    status: 'Beta',
    views: 3421,
    likes: 267
  },
  {
    title: 'GreenEnergy Monitor - Solar Power Tracking',
    description: 'IoT solution for monitoring and optimizing solar panel performance across Africa. Helps users maximize energy production and detect faults early.',
    category: 'IoT',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    githubUrl: 'https://github.com/fatimacloud/greenenergy',
    techStack: ['Arduino', 'Node.js', 'React', 'MQTT', 'InfluxDB'],
    skills: ['IoT', 'Data Visualization', 'Time Series Analysis', 'Hardware Integration'],
    collaborators: [],
    challenges: 'Building reliable hardware that can withstand harsh weather conditions and ensuring data transmission in areas with poor connectivity.',
    learnings: 'Learned about MQTT protocol, building resilient IoT systems, and battery optimization.',
    futureImprovements: 'Add predictive maintenance, expand to wind energy, and create a marketplace for excess energy.',
    status: 'In Development',
    views: 789,
    likes: 61
  },
  {
    title: 'SafeCommute - Women Safety App',
    description: 'Safety app for women with real-time location sharing, emergency contacts, safe route suggestions, and community-verified safe zones.',
    category: 'Social Impact',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800',
    demoUrl: 'https://safecommute-demo.com',
    githubUrl: 'https://github.com/amaradev/safecommute',
    techStack: ['Flutter', 'Firebase', 'Google Maps API', 'Node.js'],
    skills: ['Geolocation', 'Real-time Communication', 'Push Notifications', 'Privacy'],
    collaborators: ['kwame.tech@diceytech.com'],
    challenges: 'Balancing user privacy with safety features and ensuring the emergency system works even with poor network.',
    learnings: 'Implemented SMS fallback for emergencies, learned about privacy-preserving location sharing.',
    futureImprovements: 'Add verification system for safe zones, integrate with local authorities, and add ride-sharing safety features.',
    status: 'Beta',
    views: 1876,
    likes: 134
  },
  {
    title: 'RecycleHub - Waste Management Platform',
    description: 'Connects households and businesses with recycling centers and waste collectors. Tracks recycling impact and rewards users for sustainable practices.',
    category: 'Environment',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    demoUrl: 'https://recyclehub-demo.com',
    githubUrl: 'https://github.com/tundebackend/recyclehub',
    techStack: ['React', 'Go', 'PostgreSQL', 'Redis', 'Stripe'],
    skills: ['Payment Integration', 'Gamification', 'Geolocation', 'REST APIs'],
    collaborators: [],
    challenges: 'Creating an efficient matching algorithm for waste collectors and building trust in the payment system.',
    learnings: 'Learned about route optimization algorithms and building two-sided marketplaces.',
    futureImprovements: 'Add corporate partnerships, expand to industrial waste, and integrate with city waste management systems.',
    status: 'Live',
    views: 945,
    likes: 73
  },
  {
    title: 'CodeMentor Africa - Peer Learning Platform',
    description: 'Platform connecting junior developers with mentors across Africa. Features include code review, pair programming sessions, and career guidance.',
    category: 'Education',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    demoUrl: 'https://codementor-africa.com',
    githubUrl: 'https://github.com/kwametech/codementor',
    techStack: ['React', 'Node.js', 'WebRTC', 'MongoDB', 'Socket.io'],
    skills: ['Real-time Collaboration', 'Video Conferencing', 'Matching Algorithms', 'Community Building'],
    collaborators: ['amara.dev@diceytech.com'],
    challenges: 'Building reliable real-time code collaboration and creating effective mentorship matching.',
    learnings: 'Learned about WebRTC implementation, collaborative code editing, and building community features.',
    futureImprovements: 'Add AI-powered code review, expand to design mentorship, and create certification paths.',
    status: 'Beta',
    views: 1234,
    likes: 102
  },
  {
    title: 'LocalBiz - Small Business Management Suite',
    description: 'All-in-one business management tool for African SMEs. Includes inventory, invoicing, employee management, and mobile money integration.',
    category: 'Business',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800',
    demoUrl: 'https://localbiz-demo.com',
    githubUrl: 'https://github.com/fatimacloud/localbiz',
    techStack: ['Vue.js', 'Laravel', 'MySQL', 'Redis', 'PWA'],
    skills: ['Full-stack Development', 'Payment APIs', 'Offline-first', 'Multi-tenancy'],
    collaborators: ['tunde.ai@diceytech.com'],
    challenges: 'Building a system that works offline and syncs when online, handling multiple currencies and tax systems.',
    learnings: 'Learned about building offline-first apps, implementing conflict resolution for sync, and multi-currency systems.',
    futureImprovements: 'Add AI-powered business insights, accounting integration, and supply chain management.',
    status: 'Live',
    views: 2876,
    likes: 189
  },
  {
    title: 'TalentMatch - Tech Recruitment Platform',
    description: 'AI-powered platform matching African tech talent with global opportunities. Features skill assessments, portfolio hosting, and direct employer connections.',
    category: 'Career',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    demoUrl: 'https://talentmatch-demo.com',
    githubUrl: 'https://github.com/zuriml/talentmatch',
    techStack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Elasticsearch'],
    skills: ['Machine Learning', 'Search Algorithms', 'Data Analysis', 'API Integration'],
    collaborators: [],
    challenges: 'Building accurate skill matching algorithms and verifying candidate qualifications across different education systems.',
    learnings: 'Learned about recommendation systems, building robust search functionality, and handling international payment processing.',
    futureImprovements: 'Add video interview tools, expand to non-tech roles, and integrate with LinkedIn/GitHub.',
    status: 'Beta',
    views: 1987,
    likes: 156
  },
  {
    title: 'EventHub Nigeria - Event Management Platform',
    description: 'Comprehensive event management solution for conferences, weddings, and concerts. Features ticketing, check-in systems, and post-event analytics.',
    category: 'Events',
    difficulty: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    demoUrl: 'https://eventhub-ng.com',
    githubUrl: 'https://github.com/amaradev/eventhub',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'QR Codes'],
    skills: ['Payment Processing', 'QR Code Generation', 'Email Marketing', 'Analytics'],
    collaborators: [],
    challenges: 'Handling high-traffic during ticket sales and preventing ticket fraud.',
    learnings: 'Learned about rate limiting, implementing queuing systems, and building secure QR code systems.',
    futureImprovements: 'Add live streaming integration, expand payment options, and add event networking features.',
    status: 'Live',
    views: 1543,
    likes: 118
  },
  {
    title: 'PropertyPro - Real Estate Marketplace',
    description: 'Modern property listing platform with virtual tours, mortgage calculators, and verified listings. Focuses on making property search transparent and accessible.',
    category: 'Real Estate',
    difficulty: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    demoUrl: 'https://propertypro-demo.com',
    githubUrl: 'https://github.com/tundebackend/propertypro',
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS S3', 'Mapbox'],
    skills: ['Image Processing', 'Geospatial Queries', 'SEO', '3D Tours'],
    collaborators: ['fatima.cloud@diceytech.com'],
    challenges: 'Building 3D virtual tours that work on low bandwidth and implementing effective anti-fraud measures.',
    learnings: 'Learned about 3D image processing, building map-based interfaces, and implementing verification systems.',
    futureImprovements: 'Add AR property viewing, integrate with banks for pre-approvals, and add neighborhood insights.',
    status: 'Beta',
    views: 2234,
    likes: 167
  },
  {
    title: 'AfriDelivery - Last-Mile Logistics Platform',
    description: 'Logistics platform optimizing last-mile delivery across African cities. Uses AI for route optimization and connects businesses with local couriers.',
    category: 'Logistics',
    difficulty: 'Expert',
    imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800',
    demoUrl: 'https://afridelivery-demo.com',
    githubUrl: 'https://github.com/kwametech/afridelivery',
    techStack: ['React', 'Go', 'PostgreSQL', 'Redis', 'Google Maps API'],
    skills: ['Route Optimization', 'Real-time Tracking', 'Payment Integration', 'Push Notifications'],
    collaborators: ['zuri.code@diceytech.com', 'tunde.ai@diceytech.com'],
    challenges: 'Optimizing routes in cities with informal addressing systems and managing multiple delivery fleets.',
    learnings: 'Learned about vehicle routing problems, implementing real-time tracking, and building multi-sided platforms.',
    futureImprovements: 'Add drone delivery for remote areas, expand to cross-border logistics, and add warehouse management.',
    status: 'Pilot',
    views: 1678,
    likes: 124
  }
];

// Sample hackathons with African context
const sampleHackathons = [
  {
    title: 'AfriFintech Innovation Challenge 2025',
    description: 'Build innovative fintech solutions addressing payment challenges across Africa. Focus on mobile money integration, cross-border payments, and financial inclusion.',
    category: 'Fintech',
    difficulty: 'Advanced',
    startDate: Timestamp.fromDate(new Date('2025-04-15')),
    endDate: Timestamp.fromDate(new Date('2025-04-17')),
    prize: '$50,000 total prizes - $25,000 first place, $15,000 second, $10,000 third',
    imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800',
    location: 'Lagos, Nigeria (Hybrid)',
    maxParticipants: 200,
    tags: ['Fintech', 'Mobile Money', 'APIs', 'Blockchain'],
    requirements: ['Team of 2-5 members', 'Working prototype required', 'Integration with at least one mobile money API'],
    isActive: true
  },
  {
    title: 'AgriTech Hackathon Kenya',
    description: 'Develop technology solutions to improve agricultural productivity and connect farmers with markets. Focus on climate-smart agriculture and supply chain optimization.',
    category: 'Agriculture',
    difficulty: 'Intermediate',
    startDate: Timestamp.fromDate(new Date('2025-05-20')),
    endDate: Timestamp.fromDate(new Date('2025-05-22')),
    prize: '$30,000 + Incubation opportunity',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    location: 'Nairobi, Kenya',
    maxParticipants: 150,
    tags: ['Agriculture', 'IoT', 'Mobile Apps', 'Data Analytics'],
    requirements: ['Valid ID', 'Basic coding skills', 'Passion for agriculture'],
    isActive: true
  },
  {
    title: 'HealthTech for Africa Hackathon',
    description: 'Create digital health solutions addressing healthcare challenges in Africa. Categories include telemedicine, health records management, and diagnostic tools.',
    category: 'Healthcare',
    difficulty: 'Advanced',
    startDate: Timestamp.fromDate(new Date('2025-06-10')),
    endDate: Timestamp.fromDate(new Date('2025-06-12')),
    prize: '$40,000 + Partnership with leading hospitals',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    location: 'Accra, Ghana',
    maxParticipants: 180,
    tags: ['Healthcare', 'AI', 'Telemedicine', 'Mobile Health'],
    requirements: ['Healthcare or tech background preferred', 'Team of 3-6 members', 'HIPAA compliance knowledge is a plus'],
    isActive: true
  },
  {
    title: 'EdTech Innovation Summit',
    description: 'Build educational technology solutions for African learners. Focus on offline-first apps, adaptive learning, and making education accessible to all.',
    category: 'Education',
    difficulty: 'Intermediate',
    startDate: Timestamp.fromDate(new Date('2025-03-08')),
    endDate: Timestamp.fromDate(new Date('2025-03-10')),
    prize: '$35,000 + Pilot program with 50 schools',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    location: 'Cape Town, South Africa (Hybrid)',
    maxParticipants: 200,
    tags: ['Education', 'PWA', 'Gamification', 'Content Management'],
    requirements: ['Educators welcome to join tech teams', 'Working prototype required', 'Must work offline'],
    isActive: true
  },
  {
    title: 'Smart Cities Africa Challenge',
    description: 'Develop IoT and AI solutions for African smart cities. Categories include traffic management, waste management, energy optimization, and public safety.',
    category: 'Smart Cities',
    difficulty: 'Expert',
    startDate: Timestamp.fromDate(new Date('2025-07-15')),
    endDate: Timestamp.fromDate(new Date('2025-07-17')),
    prize: '$60,000 + Government pilot programs',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    location: 'Kigali, Rwanda',
    maxParticipants: 120,
    tags: ['IoT', 'AI', 'Smart Cities', 'Urban Planning'],
    requirements: ['Hardware experience preferred', 'Team of 4-6 members', 'Scalability plan required'],
    isActive: true
  },
  {
    title: 'Climate Tech Hackathon',
    description: 'Build technology solutions to combat climate change in Africa. Focus on renewable energy, carbon tracking, and environmental monitoring.',
    category: 'Environment',
    difficulty: 'Advanced',
    startDate: Timestamp.fromDate(new Date('2025-08-20')),
    endDate: Timestamp.fromDate(new Date('2025-08-22')),
    prize: '$45,000 + Climate fund investment opportunity',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    location: 'Addis Ababa, Ethiopia (Hybrid)',
    maxParticipants: 150,
    tags: ['Climate Tech', 'Renewable Energy', 'IoT', 'Data Science'],
    requirements: ['Environmental science background is a plus', 'Data-driven solution required'],
    isActive: false
  },
  {
    title: 'Women in Tech Hackathon',
    description: 'Female-focused hackathon addressing challenges faced by women in Africa. Categories include safety, health, education, and economic empowerment.',
    category: 'Social Impact',
    difficulty: 'Intermediate',
    startDate: Timestamp.fromDate(new Date('2025-02-28')),
    endDate: Timestamp.fromDate(new Date('2025-03-02')),
    prize: '$25,000 + Mentorship program',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    location: 'Dar es Salaam, Tanzania',
    maxParticipants: 100,
    tags: ['Social Impact', 'Women Empowerment', 'Mobile Apps', 'Community'],
    requirements: ['All-female teams or majority-female teams', 'Focus on women-centric solutions'],
    isActive: false
  },
  {
    title: 'Blockchain for Africa Hackathon',
    description: 'Explore blockchain applications for African challenges. Categories include digital identity, supply chain transparency, and decentralized finance.',
    category: 'Blockchain',
    difficulty: 'Expert',
    startDate: Timestamp.fromDate(new Date('2025-09-10')),
    endDate: Timestamp.fromDate(new Date('2025-09-12')),
    prize: '$55,000 in crypto + Token grants',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    location: 'Virtual',
    tags: ['Blockchain', 'Web3', 'DeFi', 'Smart Contracts'],
    requirements: ['Blockchain development experience', 'Working smart contracts', 'Testnet deployment'],
    isActive: false
  },
  {
    title: 'Youth Innovation Challenge',
    description: 'Hackathon for students and young developers under 25. Build solutions addressing youth unemployment, skills development, and entrepreneurship.',
    category: 'Youth',
    difficulty: 'Beginner',
    startDate: Timestamp.fromDate(new Date('2025-03-25')),
    endDate: Timestamp.fromDate(new Date('2025-03-27')),
    prize: '$20,000 + University scholarships',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
    location: 'Kampala, Uganda',
    maxParticipants: 250,
    tags: ['Youth', 'Education', 'Entrepreneurship', 'Skills'],
    requirements: ['Must be under 25 years old', 'Valid student ID or age proof'],
    isActive: true
  },
  {
    title: 'AI for Good Hackathon',
    description: 'Build AI/ML solutions addressing African challenges. Categories include NLP for African languages, computer vision for agriculture, and predictive healthcare.',
    category: 'AI/ML',
    difficulty: 'Expert',
    startDate: Timestamp.fromDate(new Date('2025-10-15')),
    endDate: Timestamp.fromDate(new Date('2025-10-17')),
    prize: '$70,000 + Research collaboration',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    location: 'Virtual',
    tags: ['AI', 'Machine Learning', 'NLP', 'Computer Vision'],
    requirements: ['ML experience required', 'Research paper or prototype', 'Ethical AI considerations'],
    isActive: false
  }
];

// Sample achievements
const sampleAchievements = [
  {
    title: 'First Steps',
    description: 'Complete your profile and join the DiceyTech community',
    icon: '🎯',
    points: 100,
    rarity: 'common' as const,
    requirements: { profileCompleteness: 60 }
  },
  {
    title: 'Project Pioneer',
    description: 'Submit your first project to the platform',
    icon: '🚀',
    points: 250,
    rarity: 'common' as const,
    requirements: { projectsSubmitted: 1 }
  },
  {
    title: 'Hackathon Hero',
    description: 'Participate in your first hackathon',
    icon: '💻',
    points: 500,
    rarity: 'rare' as const,
    requirements: { hackathonsParticipated: 1 }
  },
  {
    title: 'Portfolio Master',
    description: 'Showcase 5 or more projects',
    icon: '📚',
    points: 750,
    rarity: 'rare' as const,
    requirements: { projectsSubmitted: 5 }
  },
  {
    title: 'Competition Champion',
    description: 'Win your first hackathon',
    icon: '🏆',
    points: 1500,
    rarity: 'epic' as const,
    requirements: { hackathonsWon: 1 }
  },
  {
    title: 'Community Leader',
    description: 'Get 100 likes across all your projects',
    icon: '⭐',
    points: 1000,
    rarity: 'epic' as const,
    requirements: { totalLikes: 100 }
  },
  {
    title: 'Legend',
    description: 'Achieve 95%+ profile completion and win 3 hackathons',
    icon: '👑',
    points: 3000,
    rarity: 'legendary' as const,
    requirements: { profileCompleteness: 95, hackathonsWon: 3 }
  },
  {
    title: 'Job Ready',
    description: 'Submit 5 job applications',
    icon: '💼',
    points: 300,
    rarity: 'common' as const,
    requirements: { applicationsSubmitted: 5 }
  }
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if already seeded
    const alreadySeeded = await checkIfSeeded();
    if (alreadySeeded) {
      console.log('⚠️ Database already contains data. Skipping seed.');
      console.log('To re-seed, delete all documents from Firestore first.');
      return {
        success: false,
        message: 'Database already seeded'
      };
    }

    const now = Timestamp.now();
    const userIds: string[] = [];

    // 1. Create users
    console.log('👤 Creating sample users...');
    for (const userData of sampleUsers) {
      const userRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: now,
        updatedAt: now
      });
      userIds.push(userRef.id);
      console.log(`✓ Created user: ${userData.displayName}`);
    }

    // 2. Create projects
    console.log('\n📁 Creating sample projects...');
    for (let i = 0; i < sampleProjects.length; i++) {
      const project = sampleProjects[i];
      const userId = userIds[i % userIds.length]; // Distribute projects across users
      
      await addDoc(collection(db, 'projects'), {
        ...project,
        userId,
        createdAt: now,
        updatedAt: now
      });
      console.log(`✓ Created project: ${project.title}`);
    }

    // 3. Create hackathons
    console.log('\n🎯 Creating sample hackathons...');
    const hackathonIds: string[] = [];
    for (const hackathon of sampleHackathons) {
      const organizerId = userIds[Math.floor(Math.random() * userIds.length)];
      
      const hackathonRef = await addDoc(collection(db, 'hackathons'), {
        ...hackathon,
        organizerId,
        participantCount: Math.floor(Math.random() * 50) + 10,
        createdAt: now,
        updatedAt: now
      });
      hackathonIds.push(hackathonRef.id);
      console.log(`✓ Created hackathon: ${hackathon.title}`);
    }

    // 4. Create achievements
    console.log('\n🏆 Creating achievements...');
    const achievementIds: string[] = [];
    for (const achievement of sampleAchievements) {
      const achievementRef = await addDoc(collection(db, 'achievements'), {
        ...achievement,
        createdAt: now
      });
      achievementIds.push(achievementRef.id);
      console.log(`✓ Created achievement: ${achievement.title}`);
    }

    // 5. Create some sample applications
    console.log('\n📝 Creating sample applications...');
    const applicationStatuses = ['pending', 'under_review', 'accepted', 'rejected'] as const;
    for (let i = 0; i < 8; i++) {
      const userId = userIds[i % userIds.length];
      const hackathonId = hackathonIds[i % hackathonIds.length];
      
      await addDoc(collection(db, 'applications'), {
        userId,
        hackathonId,
        type: 'hackathon',
        status: applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)],
        applicationData: {
          teamName: `Team ${i + 1}`,
          teamSize: Math.floor(Math.random() * 4) + 2,
          experience: 'intermediate',
          motivation: 'We are passionate about building solutions for Africa!'
        },
        createdAt: now,
        updatedAt: now
      });
    }
    console.log('✓ Created sample applications');

    // 6. Create sample notifications for first user
    console.log('\n🔔 Creating sample notifications...');
    if (userIds.length > 0) {
      const firstUserId = userIds[0];
      const notifications = [
        {
          userId: firstUserId,
          type: 'hackathon' as const,
          title: 'New Hackathon Alert!',
          message: 'AfriFintech Innovation Challenge 2025 is now open for registration',
          isRead: false,
          category: 'hackathon',
          relatedId: hackathonIds[0],
          createdAt: now
        },
        {
          userId: firstUserId,
          type: 'achievement' as const,
          title: 'Achievement Unlocked!',
          message: 'You earned the "First Steps" achievement',
          isRead: false,
          category: 'achievement',
          createdAt: now
        },
        {
          userId: firstUserId,
          type: 'project' as const,
          title: 'Project Milestone',
          message: 'Your project "AfriPay" reached 1000 views!',
          isRead: true,
          category: 'project',
          createdAt: now
        },
        {
          userId: firstUserId,
          type: 'application' as const,
          title: 'Application Update',
          message: 'Your application to AgriTech Hackathon is under review',
          isRead: false,
          category: 'application',
          createdAt: now
        },
        {
          userId: firstUserId,
          type: 'system' as const,
          title: 'Welcome to DiceyTech!',
          message: 'Complete your profile to unlock more features',
          isRead: true,
          category: 'system',
          createdAt: now
        }
      ];

      for (const notification of notifications) {
        await addDoc(collection(db, 'notifications'), notification);
      }
      console.log('✓ Created sample notifications');
    }

    // 7. Award some achievements to users
    console.log('\n⭐ Awarding achievements to users...');
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      // Award first 2-3 achievements to each user
      const numAchievements = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < numAchievements && j < achievementIds.length; j++) {
        await addDoc(collection(db, 'userAchievements'), {
          userId,
          achievementId: achievementIds[j],
          earnedAt: now,
          progress: 100
        });
      }
    }
    console.log('✓ Awarded achievements to users');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${userIds.length} users created`);
    console.log(`   - ${sampleProjects.length} projects created`);
    console.log(`   - ${sampleHackathons.length} hackathons created`);
    console.log(`   - ${sampleAchievements.length} achievements created`);
    console.log(`   - 8 applications created`);
    console.log(`   - 5 notifications created`);
    console.log(`   - Multiple user achievements awarded`);
    console.log('\n🎉 Your DiceyTech platform is now populated with realistic African tech data!');

    return {
      success: true,
      message: 'Database seeded successfully',
      stats: {
        users: userIds.length,
        projects: sampleProjects.length,
        hackathons: sampleHackathons.length,
        achievements: sampleAchievements.length
      }
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Helper function to clear all data (use with caution!)
export const clearDatabase = async () => {
  console.log('🗑️ Clearing database...');
  const collections = ['users', 'projects', 'hackathons', 'achievements', 'applications', 'notifications', 'userAchievements'];
  
  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db, collectionName));
    console.log(`Deleting ${snapshot.size} documents from ${collectionName}...`);
    
    // Note: In production, you'd want to batch these deletes
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }
  
  console.log('✅ Database cleared');
};
