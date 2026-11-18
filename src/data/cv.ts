// Transcribed from the owner-supplied CV dated 18 November 2026.
// Keep the web CV, download link, and skills marquee in sync here.
export const cv = {
  updated: "2026-11-18",
  updatedLabel: "18/11/2026",
  resumeUrl: "/assets/resume.pdf?v=20261118",
  location: "Hanoi, Vietnam",
  role: "Senior Deep Learning Algorithms Engineer",
  work: [
    {
      company: "NVIDIA",
      role: "Senior Deep Learning Algorithms Engineer",
      location: "Hanoi",
      start: "Aug 2026",
      end: "Present",
      projects: [
        {
          name: "AutoResearch",
          team: "PIC · team of 2",
          confidential: true,
          description:
            "Autonomous LLM agent for inference optimization of Cosmos models.",
          bullets: [
            "Automatically delivers verified speed-ups through stable, unattended multi-day campaigns.",
            "Cosmos3-Nano on vLLM-Omni (4× H200): Sim-Auto +415%. On SGLang (1× H200): Sim-Auto +103%, Sim-Bimanual +71%, Sim-Transfer +49%, and Transfer-Auto +17%.",
            "Built a stable, reliable agent loop with verification separated from the LLM into a deterministic Controller, theory-backed statistical verdict rules, and a leak-free data flow.",
            "Enforced guardrails through restricted code-edit scope, harness-owned flags, locked network/URL/path options, disabled caches, and output-size limits.",
            "The agent runs in ClawRT; experiments run on the Athena GPU workload platform.",
          ],
          stack:
            "LLM Agents · vLLM-Omni · SGLang · Diffusion & World Models · Benchmarking & Statistical Verification",
        },
        {
          name: "Athena",
          team: "Team of 8",
          description: "GPU workload submission and benchmarking platform.",
          bullets: [
            "Added support for the Cosmos model family on the Athena platform and its agent.",
          ],
          stack: "MCP · Kubernetes · Docker",
        },
      ],
    },
    {
      company: "Moreh Vietnam",
      role: "AI System Engineer",
      location: "Hanoi",
      start: "Jul 2024",
      end: "Aug 2026",
      projects: [
        {
          name: "Moreh vLLM",
          team: "Team of 5",
          href: "https://moreh.io/moreh-vllm/",
          description: "High-performance, AMD-optimized inference engine.",
          bullets: [
            "Directly contributed to securing $15.6M in contracts with leading enterprises in China and South Korea.",
            "Optimized inference performance to be 20–70% faster than leading inference engines on the same AMD devices.",
            "Achieved 90% of NVIDIA performance while delivering better price per token, up to 2×.",
            "Flagship models: DeepSeek V3/R1, GPT-OSS, and EXAONE 3.5; supporting Llama 3.2/3.3 and Qwen 3.",
          ],
          stack:
            "LLM Serving Optimization · Distributed & Parallel Inference · LLM Benchmarking & Profiling",
        },
        {
          name: "Moreh LLM Eval",
          team: "Solo project",
          description: "Moreh vLLM benchmarking and evaluation framework.",
          bullets: [
            "Reduced manual effort by 80% for benchmarking and evaluation per Moreh vLLM release, moving toward full automation.",
            "Standardized correctness evaluation and performance benchmarking with automated PDF reports.",
            "Built S3-synced logging for simultaneous multi-instance runs and collaborative analysis.",
            "Integrated into a complex CI pipeline to track performance across versions and detect regressions early.",
          ],
          stack: "LLM Evaluation & Benchmarking · CI/CD · Docker · AWS S3",
        },
        {
          name: "MoDiffusion",
          team: "Team of 5",
          description: "Performance optimization suite for diffusion models.",
          bullets: [
            "Delivered inference speedups of 5× on Motif, 2.2× on Stable Diffusion, and 2.4× on Open-Sora, enabling AMD MI300X to match NVIDIA H100/TensorRT through graph optimization, low-bit quantization, and kernel fusion.",
          ],
        },
        {
          name: "Moreh IR & Testbench",
          team: "Team of 5",
          href: "https://moreh.io/platform/",
          description: "Core components of the MoAI Platform.",
          bullets: [
            "Maintained torch-2.1.0+moreh, the PyTorch-compatible compiler layer, and built the automated daily benchmarking system serving as the primary quality gate for releases.",
          ],
        },
      ],
    },
    {
      company: "MB Bank",
      role: "AI Software Engineer",
      location: "Hanoi",
      start: "Mar 2024",
      end: "Jun 2024",
      projects: [
        {
          name: "MB Chatbot",
          team: "Team of 2",
          confidential: true,
          description: "Enterprise RAG-based customer service system.",
          bullets: [
            "Served 1,000+ users in the MB247 department with 81% accuracy and sub-7-second response time. Indexed 60,000+ documents with Milvus and Neo4j, integrating a Python AI server with a Java Spring Boot gateway using Redis and Keycloak.",
          ],
        },
      ],
    },
    {
      company: "Asilla Vietnam",
      role: "AI Engineer",
      location: "Hanoi",
      start: "Oct 2023",
      end: "Feb 2024",
      projects: [
        {
          name: "Ajikame — Hananoki Hospital Version",
          href: "https://en.asilla.com/services/ai-security-asilla",
          team: "Team of 2",
          description: "Medical behavior detection.",
          bullets: [
            "Built respiratory failure detection using Optical Flow and pose estimation with 70% accuracy, and epileptic seizure detection using frequency-domain pose analysis with 65% recall and sub-30-second alerts.",
          ],
        },
      ],
    },
    {
      company: "VinBigdata",
      role: "Teaching Assistant",
      location: "Hanoi",
      start: "Jul 2023",
      end: "Sep 2023",
      projects: [
        {
          name: "Computer Vision",
          description:
            "Prepared exercises, supported lectures, and graded assignments for VinBigdata employees.",
          bullets: [],
        },
      ],
    },
    {
      company: "PIXTA Vietnam",
      role: "AI Research Intern",
      location: "Hanoi",
      start: "May 2022",
      end: "Nov 2022",
      projects: [
        {
          name: "Pixta Face Recognition",
          team: "Solo project",
          description: "Automated facial attendance system.",
          bullets: [
            "Deployed a passive check-in system for 50+ employees with 100% precision and sub-1-second recognition, supporting 3 people simultaneously and integrated with the 1Office platform.",
          ],
        },
        {
          name: "Pixta Image Embedding",
          team: "Team of 3",
          description: "Foundation model research.",
          bullets: [
            "Built a generalized backbone using self-supervised learning with DINO and BEiT, and vision-language pre-training with CLIP and FLAVA.",
          ],
        },
      ],
    },
  ],
  education: [
    {
      institution: "Hanoi University of Science and Technology",
      qualification: "Bachelor of Engineering in Computer Engineering",
      location: "Hanoi, Vietnam",
      period: "Aug 2018 – Aug 2023",
      details: [
        "GPA: 3.88/4.0 · Ranked 1st of 176 in the graduating class.",
        "Talent Scholarship for 7 of 8 semesters; Best Graduate Thesis (AIoT).",
      ],
    },
    {
      institution: "Tran Phu High School for the Gifted",
      qualification: "Specialized in Mathematics",
      location: "Hai Phong, Vietnam",
      period: "Aug 2015 – Aug 2018",
      details: ["Grade: 9.0/10."],
    },
  ],
  skillGroups: [
    {
      name: "Inference frameworks",
      values: ["vLLM", "SGLang", "vLLM-Omni", "TRT-LLM", "PyTorch"],
    },
    {
      name: "Optimizations",
      values: ["torch.compile", "ONNX", "TensorRT", "Triton"],
    },
    {
      name: "Benchmarking & profiling",
      values: [
        "InferenceMax",
        "MLPerf",
        "LM Eval",
        "torch.profiler",
        "Nsight",
        "rocprofv2",
        "Perfetto",
      ],
    },
    {
      name: "MLOps & workflow",
      values: [
        "Docker",
        "Kubernetes",
        "AWS S3",
        "Airflow",
        "Git",
        "Jira",
        "CI/CD",
      ],
    },
    {
      name: "Backend & data",
      values: [
        "Python (FastAPI, Flask)",
        "Java (Spring Boot)",
        "MCP",
        "Milvus",
        "Redis",
        "Neo4j",
        "MySQL",
        "MongoDB",
      ],
    },
  ],
  publications: [
    {
      title:
        "PGA-KD: Principal Geometry Alignment and Semantic Consistency for VLM2Vec Distillation",
      authors:
        "The-Anh Tran, Thanh Xuan Nguyen, Duc Anh Nguyen, Dinh Viet Sang, Linh Ngo Van, Thien Huu Nguyen",
      venue: "EMNLP 2026 · Main Conference",
      href: "https://aclanthology.org/2026.emnlp-main.257/",
      code: "https://github.com/theanh-ktmt/PGA-KD",
    },
  ],
  honors: [
    {
      title: "Honorable Mention — Hack<CX>Together",
      organization: "HUST & Techcombank",
      period: "2025",
      detail: "Automatic Loan Approval (AI).",
    },
    {
      title: "Best Presentation Award",
      organization: "HUST",
      period: "2023",
      detail: "Best Graduate Thesis (AIoT).",
    },
    {
      title: "Talent Scholarship",
      organization: "HUST",
      period: "2020–2023",
      detail: "Earned for 7 of 8 semesters.",
    },
    {
      title: "Third Place — Chat’Innov Hackathon",
      organization: "AUF",
      period: "2023",
      detail: "Laptop Advisor Chatbot (AI).",
    },
    {
      title: "Third Place — Oraichain Hackathon",
      organization: "Oraichain Labs & CYTAST",
      period: "2023",
      detail:
        "Decentralized Image Ownership Verification System (AI, Blockchain, Web3).",
    },
    {
      title: "Honorable Mention — Vietnamese Traffic Safety Contest",
      organization: "Vietnam Traffic Police & Dan Tri News",
      period: "2022",
      detail: "Traffic Density Monitoring System (AIoT).",
    },
    {
      title: "Second Place — Hanoi Open Mathematics Competitions",
      organization: "Hanoi Mathematical Society",
      period: "2017",
    },
  ],
  activities: [
    {
      title: "Head of Communication",
      organization: "BKFintech Club, HUST",
      period: "2023–2024",
    },
    {
      title: "Research Assistant",
      organization: "BKC Lab",
      period: "2023–2025",
    },
    {
      title: "Teaching Assistant — Computer Vision",
      organization: "VinBigdata",
      period: "2023",
    },
    { title: "Research Assistant", organization: "NCT Lab", period: "2022" },
  ],
  languages: [
    {
      name: "English",
      detail:
        "Professional working proficiency. TOEIC 805 (Nov 2022); IELTS 7.5 (Jul 2017).",
    },
    { name: "Vietnamese", detail: "Native language." },
  ],
  reference: {
    name: "Do Ba Lam",
    qualification: "PhD, University of Vienna",
    position:
      "Lecturer, School of Information and Communication Technology, Hanoi University of Science and Technology.",
    email: "lam.doba@hust.edu.vn",
  },
};

export const marqueeSkills = [
  "Agent Loop",
  "World Models",
  "Diffusion Models",
  "LLM Inference Optimization",
  "GPU Performance Engineering",
  "Distributed Inference",
  "vLLM-Omni",
  "SGLang",
  "TRT-LLM",
  "torch.compile",
  "Triton",
  "MCP",
  "Kubernetes",
  "InferenceMax",
  "MLPerf",
  "Nsight / rocprofv2 / Perfetto",
  "Edge AI",
  "RAG",
  "Prompt Engineering",
  "Model Optimization",
  "MLOps & CI/CD",
  "LLM Benchmarking",
  "Quantization",
  "Kernel Fusion",
  "Computer Vision",
];
