from typing import Literal


Role = Literal[
    "recruiter", 
    "candidate"
]

VacancyStatus = Literal[
    "active",
    "closed"
]

Educations = Literal[
    "Среднее",
    "Среднее специальное",
    "Неоконченное высшее",
    "Высшее",
]

WorkSchedules = Literal[
    "5/2",
    "2/2",
    "3/3",
]

WorkExperiences = Literal[
    "Нет опыта",
    "от 1 до 3 лет",
    "от 3 до 6 лет",
    "от 6 лет"
]

Cities = Literal[
    "Абакан",
    "Архангельск",
    "Астрахань",
    "Барнаул",
    "Белгород",
    "Бийск",
    "Братск",
    "Брянск",
    "Великий Новгород",
    "Владимир",
    "Волгоград",
    "Волжский",
    "Вологда",
    "Воронеж",
    "Грозный",
    "Екатеринбург",
    "Иваново",
    "Ижевск",
    "Иркутск",
    "Казань",
    "Калининград",
    "Калуга",
    "Кемерово",
    "Киров",
    "Кострома",
    "Краснодар",
    "Красноярск",
    "Курган",
    "Курск",
    "Липецк",
    "Магнитогорск",
    "Махачкала",
    "Москва",
    "Мурманск",
    "Набережные Челны",
    "Назрань",
    "Нальчик",
    "Нижний Новгород",
    "Нижний Тагил",
    "Новокузнецк",
    "Новосибирск",
    "Новороссийск",
    "Омск",
    "Оренбург",
    "Орёл",
    "Пенза",
    "Пермь",
    "Петрозаводск",
    "Подольск",
    "Псков",
    "Ростов-на-Дону",
    "Рязань",
    "Самара",
    "Санкт-Петербург",
    "Саратов",
    "Севастополь",
    "Смоленск",
    "Сочи",
    "Ставрополь",
    "Стерлитамак",
    "Сургут",
    "Сыктывкар",
    "Тамбов",
    "Тверь",
    "Тольятти",
    "Томск",
    "Тула",
    "Тюмень",
    "Улан-Удэ",
    "Ульяновск",
    "Уфа",
    "Хабаровск",
    "Чебоксары",
    "Челябинск",
    "Череповец",
    "Чита",
    "Элиста",
    "Ярославль",
]

WorkTypes = Literal[
    "Удаленно", 
    Cities
]

WorkScopes = Literal[
    "Аналитика",
    "Архитектура",
    "Менеджмент и развитие бизнеса",
    "Разработка",
    "Тестирование",
    "Data практика",
    "Другое",
]

Skills = Literal[
    "Java",
    "Python",
    "JavaScript",
    "C#",
    "C++",
    "HTML",
    "CSS",
    "SQL",
    "NoSQL",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "Symfony",
    "ASP.NET",
    "Spring Framework",
    "Hibernate",
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Travis CI",
    "CircleCI",
    "Ansible",
    "Puppet",
    "Chef",
    "Terraform",
    "AWS",
    "Azure",
    "Google Cloud Platform (GCP)",
    "Heroku",
    "DigitalOcean",
    "Linux",
    "Unix",
    "Windows Server",
    "Bash",
    "PowerShell",
    "Networking",
    "TCP/IP",
    "HTTP/HTTPS",
    "RESTful APIs",
    "GraphQL",
    "SOAP",
    "OAuth",
    "JWT",
    "Active Directory",
    "LDAP",
    "Firewalls",
    "VPN",
    "SQL Server",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Cassandra",
    "Redis",
    "Elasticsearch",
    "RabbitMQ",
    "Kafka",
    "Hadoop",
    "Spark",
    "Hive",
    "Pig",
    "HBase",
    "Scala",
    "R",
    "MATLAB",
    "TensorFlow",
    "Keras",
    "PyTorch",
    "Scikit-learn",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing (NLP)",
    "Computer Vision",
    "Data Science",
    "Data Analysis",
    "Data Visualization",
    "Business Intelligence (BI)",
    "Tableau",
    "Power BI",
    "QlikView",
    "MicroStrategy",
    "Looker",
    "SAP",
    "Oracle",
    "Salesforce",
    "CRM",
    "ERP",
    "Agile",
    "Scrum",
    "Kanban",
    "Project Management",
    "JIRA",
    "Confluence",
    "Trello",
    "Slack",
    "Microsoft Teams",
    "Zoom",
    "Collaboration Tools",
    "UX/UI Design",
    "Figma",
    "Sketch",
    "Adobe XD",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Usability Testing",
    "A/B Testing",
    "Heatmaps",
    "HTML5",
    "CSS3",
    "SASS",
    "LESS",
    "Bootstrap",
    "Materialize",
    "Foundation",
    "Responsive Design",
    "Mobile Development",
    "iOS",
    "Android",
    "Swift",
    "Kotlin",
    "Objective-C",
    "React Native",
    "Flutter",
    "Xamarin",
    "Ionic",
    "PhoneGap",
    "Progressive Web Apps (PWA)",
    "WebAssembly",
    "WebSockets",
    "WebRTC",
    "SEO",
    "SEM",
    "Google Analytics",
    "Firebase",
    "App Store Optimization (ASO)",
    "Content Management Systems (CMS)",
    "WordPress",
    "Joomla",
    "Drupal",
    "Magento",
    "Shopify",
    "WooCommerce",
    "E-commerce",
    "Payment Gateways",
    "Stripe",
    "PayPal",
    "Square",
    "Blockchain",
    "Ethereum",
    "Bitcoin",
    "Smart Contracts",
    "Solidity",
    "Truffle",
    "Hyperledger",
    "Cybersecurity",
    "Penetration Testing",
    "Vulnerability Assessment",
    "Security Information and Event Management (SIEM)",
    "Intrusion Detection Systems (IDS)",
    "Intrusion Prevention Systems (IPS)",
    "Endpoint Protection",
    "Antivirus",
    "Malware Analysis",
    "Ethical Hacking",
    "Computer Forensics",
    "Compliance (e.g., GDPR, HIPAA)",
    "Risk Management",
    "Disaster Recovery",
    "Incident Response",
    "Backup and Recovery",
    "Encryption",
    "Authentication",
    "Multi-Factor Authentication (MFA)",
    "Identity and Access Management (IAM)",
    "Single Sign-On (SSO)",
    "Security Audits",
    "Security Policies",
    "ITIL",
    "DevOps",
    "CI/CD",
    "Microservices",
    "Service-Oriented Architecture (SOA)",
    "Event-Driven Architecture (EDA)",
    "Serverless Computing",
    "Edge Computing",
    "Internet of Things (IoT)",
    "Robotics",
    "Коммуникабельность",
    "Умение работать в команде",
    "Тайм-менеджмент",
    "Решение проблем",
    "Критическое мышление",
    "Внимание к деталям",
    "Креативность",
    "Гибкость",
    "Адаптивность",
    "Способность к обучению",
    "Самоорганизация",
    "Управление стрессом",
    "Эмоциональный интеллект",
    "Лидерство",
    "Принятие решений",
    "Навыки презентации",
    "Управление конфликтами",
    "Наставничество",
    "Эмпатия",
    "Этика и честность",
    "Стратегическое мышление",
    "Планирование",
    "Мотивация",
    "Управление проектами",
    "Межличностные навыки",
    "Переговоры",
    "Ведение документации",
    "Умение слушать",
    "Проактивность",
    "Умение вести деловую переписку",
    "Управление временем",
    "Аналитическое мышление",
    "Гибкость ума",
    "Пунктуальность",
    "Организаторские способности",
    "Техническое письмо",
    "Навыки наставника",
    "Управление изменениями",
    "Работа в условиях неопределенности",
    "Умение давать и принимать обратную связь",
    "Умение расставлять приоритеты",
    "Позитивное отношение",
    "Эффективное общение",
    "Творческий подход к решению задач",
    "Самодисциплина",
    "Системное мышление",
    "Социальная ответственность",
    "Ориентация на результат",
    "Навыки адаптации",
    "Умение работать в многозадачном режиме",
]