CV_PARSE_PROMPT = '''
Extract information from current file. Provide valid JSON output.

Учитывай что поле work_experience надо вычислить на основе истории работы кандидата. Поле work_experience должно содержать одно из значений ["Нет опыта","от 1 до 3 лет","от 3 до 6 лет","от 6 лет"].

Учитывай что поле education.degree должно быть одним из следующих значений: ["Среднее","Среднее специальное","Неоконченное высшее","Высшее"].

Учитывай что поле birthday должно быть преобразованно в формат "dd.mm.yyyy".

В качестве ответа пришли только JSON.
'''

VACANCY_PROMPT = '''
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
