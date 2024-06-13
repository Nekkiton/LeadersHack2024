export const Site = {
  name: 'Reksoft.Работа',
  transition: {
    duration: 400,
  },
  links: {
    creatingVacancies: '#',
    changingVacancyStatuses: '#',
  },
  cardsPerPage: 10,
  recruitingDefaultRejectTemplate:
    'Здравствуйте!\nБольшое спасибо за интерес, проявленный к вакансии. К сожалению, в настоящий момент мы не готовы сделать вам предложение. Мы, возможно, вернемся к вашей кандидатуре, когда у нас возникнет такая потребность.',
  recruitingDefaultStages: [
    {
      title: 'Неразобранные отклики',
      auto_interview: true,
      approve_template:
        'Добрый день! Меня зовут RECRUITER_NAME, я HR-менеджер RNT Group.\nМы ознакомились с вашей вакансий и готовы пригласить вас на интервью-знакомство. Выберите удобную дату и время ниже.\nБуду ждать обратной связи!',
      reject_template:
        'Здравствуйте!\nБольшое спасибо за интерес, проявленный к вакансии. К сожалению, в настоящий момент мы не готовы сделать вам предложение. Мы, возможно, вернемся к вашей кандидатуре, когда у нас возникнет такая потребность.',
      position: 0,
      _isRequired: true,
    },
    {
      title: 'Первичное интервью',
      auto_interview: true,
      approve_template:
        'Добрый день.\nМы готовы пригласить вас на следующий этап. На встрече вы пообщаетесь с нашим лидом по поводу вашего опыта. Будьте готовы к лайфкоддингу. Он будет проходить в онлайн-редакторе, на компьютер устанавливать ничего не придется. Назначьте, пожалуйста, время, в которое вам будет удобно созвониться.\nУдачи на интервью!',
      reject_template:
        'Здравствуйте!\nБольшое спасибо за интерес, проявленный к вакансии. К сожалению, в настоящий момент мы не готовы сделать вам предложение. Мы, возможно, вернемся к вашей кандидатуре, когда у нас возникнет такая потребность.',
      position: 1,
      _isRequired: false,
    },
    {
      title: 'Техническое интервью',
      auto_interview: true,
      approve_template:
        'Добрый день.\nМы готовы пригласить вас на следующий этап — интервью с членами команды, с которыми вы, возможно, будете работать. Вы сможете познакомиться и задать друг другу интересующие вопросы. Назначьте, пожалуйста, время, в которое вам будет удобно созвониться.\nУдачи на интервью!',
      reject_template:
        'Здравствуйте!\nБольшое спасибо за интерес, проявленный к вакансии. К сожалению, в настоящий момент мы не готовы сделать вам предложение. Мы, возможно, вернемся к вашей кандидатуре, когда у нас возникнет такая потребность.',
      position: 2,
      _isRequired: false,
    },
    {
      title: 'Интервью с командой',
      auto_interview: true,
      approve_template:
        'Добрый день.\nМы готовы предложить вам оффер :) Назначьте, пожалуйста, время, в которое вам будет удобно созвониться.\nУдачи на интервью!',
      reject_template:
        'Здравствуйте!\nБольшое спасибо за интерес, проявленный к вакансии. К сожалению, в настоящий момент мы не готовы сделать вам предложение. Мы, возможно, вернемся к вашей кандидатуре, когда у нас возникнет такая потребность.',
      position: 3,
      _isRequired: false,
    },
    {
      title: 'Интервью для оффера',
      auto_interview: true,
      approve_template:
        'Добро пожаловать в команду!\nМы рады, что вы выбрали нашу компанию :)',
      reject_template:
        'Здравствуйте!\nБольшое спасибо за интерес, проявленный к вакансии. К сожалению, в настоящий момент мы не готовы сделать вам предложение. Мы, возможно, вернемся к вашей кандидатуре, когда у нас возникнет такая потребность.',
      position: 4,
      _isRequired: false,
    },
  ],
  defaultVacancyConditions:
    '- Оформление по ТК РФ в аккредитованную ИТ-компанию\n- ДМС со стоматологией с первых дней работы, оплачиваемые отпуска и больничные с доплатой до 100% текущего оклада\n- Возможен гибридный и полностью удаленный формат работы\n- Интересные задачи, индивидуальные программы роста, обучение\n- Возможность принимать участие в обучении, комьюнити и других активностях внутри компании\n- Предоставляем все необходимое для работы оборудование: ноутбук, гарнитура и др.',
}
