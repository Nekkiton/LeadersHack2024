CV_PARSE_PROMPT = '''
Extract information from current file. Provide valid JSON output.

Учитывай что поле work_experience надо вычислить на основе истории работы кандидата. Поле work_experience должно содержать одно из значений %(work_experiences)s.

Учитывай что поле education.degree должно быть одним из следующих значений: %(degrees)s.

Учитывай что поле birthday должно быть преобразованно в формат "dd.mm.yyyy".

В качестве ответа пришли только JSON.
'''

VACANCY_PROMPT = '''
Extract information from next JSON string: %(json)s.

Учитывай что исходные поля НЕЛЬЗЯ менять.

Заполни поле scope на основе полей title и description. Поле scope должно содержать одно из значений %(scopes)s.

Заполни поле work_type на основе полей title и description. Поле work_type должно содержать одно из значений %(work_types)s.
Если в вакансии не указан город, то поле work_type должно содержать значение "Удаленно".

Заполни поле work_schedule на основе полей title и description. Поле work_schedule должно содержать одно из значений %(work_schedules)s. Если не удается определить график работы по описанию, то поле work_schedule должно содержать значение "5/2".

Поле work_experience должно содержать одно из значений %(work_experiences)s.

Заполни поле skills на основе всей вакансии. Поле skills должно содержать список из значений %(skills)s.

В качестве ответа пришли только JSON.
'''

CV_EXAMPLE_JSON = {
    "name": "Александр",
    "surname": "Фадеев",
    "patronymic": "Андреевич",
    "email": "email@google.com",
    "phone": "+7 (999) 9999999",
    "birthday": "08.11.1992",
    "city": "Иваново",
    "desired_position": "UX/UI-дизайнер",
    "education": [{ "degree": "Высшее" }],
    "work_experience": "от 3 до 6 лет",
    "work_history": [
      {
        "company": "UXART",
        "position": "UX-дизайнер",
        "start_date": "04.2021",
        "end_date": "настоящее время",
        "responsibilities": "Предпроектная аналитика, Верхнеуровневое прототипирование, Детальное прототипирование, Аудит ПО"
      },
      {
        "company": "Skillbox",
        "position": "студент годового курса веб дизайнера",
        "start_date": "04.2020",
        "end_date": "01.2021",
        "responsibilities": "Активное изучение курса, пройдено около 65%."
      }
    ],
    "salary_expectation": 150000,
    "skills": [
      "Figma",
      "UX",
      "UI",
      "Прототипирование",
      "Дизайн интерфейсов",
      "Проектирование пользовательских интерфейсов",
      "Тестирование пользовательского интерфейса",
      "WEB аналитика",
      "UX-исследования"
    ]
  }


VACANCY_EXAMPLE_JSON = {
  "_id": {
    "$oid": "666c93e8e22511aa197a3351"
  },
  "title": "Java-разработчик",
  "description": "Приглашаем в команду Java-разработчиков уровня Middle, Senior и Team Lead.\r\nМы реализуем проекты в перспективных областях: производство, телекоммуникации, интернет-магазины, финансы, страхование, ритейл, ИТ.",
  "responsibilities": "Java 11 – 17 (иногда Kotlin)\nSpring Boot / Cloud / MVC\nPostgreSQL\nKafka\nRabbitMQ\nDocker\nKubernetes\nМикросервисная архитектура",
  "candidate_expectation": "Знания и опыт работы с Kotlin",
  "additions": None,
  "conditions": "Официальное оформление\nСоциальный пакет\nГибкий график работы\nПрофессиональное развитие\nПоддержка инициатив\nРабочее оборудование",
  "source": {
    "company": "RNTGroup",
    "url": "https://www.rntgroup.com/career/vacancies/java-developer/"
  },
  "status": "active",
  "scope": "",
  "work_type": "",
  "work_schedule": "",
  "work_experience": "",
  "skills": ["", ""]
}