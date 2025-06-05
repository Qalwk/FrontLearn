import { Course, Notification, User, UserStats } from "../types";

// Mock User Stats for Admin Dashboard
export const mockUserStats: UserStats = {
  totalUsers: 1256,
  activeUsers: 876,
  completedCourses: 3240,
  completedLessons: 12650,
  averageScore: 84
};

// Mock Courses Data
export const mockCourses: Course[] = [
  {
    id: "html-fundamentals",
    title: {
      en: "HTML Fundamentals",
      ru: "Основы HTML",
    },
    description: {
      en: "Learn the fundamentals of HTML, the backbone of web development.",
      ru: "Изучите основы HTML, основу веб-разработки.",
    },
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    lessons: [
      {
        id: "html-lesson1",
        title: {
          en: "Introduction to HTML",
          ru: "Введение в HTML",
        },
        description: {
          en: "Learn what HTML is and why it's important.",
          ru: "Узнайте, что такое HTML и почему он важен.",
        },
        content: {
          en: "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the meaning and structure of web content.\n\nHTML uses 'markup' to annotate text, images, and other content for display in a web browser. HTML markup includes special elements such as <head>, <title>, <body>, <header>, <footer>, <article>, <section>, <p>, <div>, <span>, <img>, <aside>, <audio>, <canvas>, <datalist>, <details>, <embed>, <nav>, <output>, <progress>, <video>, and many others.\n\nHTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items.",
          ru: "HTML (язык гипертекстовой разметки) - это стандартный язык разметки для документов, предназначенных для отображения в веб-браузере. Он определяет значение и структуру веб-контента.\n\nHTML использует 'разметку' для аннотирования текста, изображений и другого контента для отображения в веб-браузере. Разметка HTML включает специальные элементы, такие как <head>, <title>, <body>, <header>, <footer>, <article>, <section>, <p>, <div>, <span>, <img>, <aside>, <audio>, <canvas>, <datalist>, <details>, <embed>, <nav>, <output>, <progress>, <video> и многие другие.\n\nЭлементы HTML являются строительными блоками HTML-страниц. С помощью конструкций HTML изображения и другие объекты, такие как интерактивные формы, могут быть встроены в отображаемую страницу. Он предоставляет средства для создания структурированных документов, обозначая структурную семантику для текста, такого как заголовки, абзацы, списки, ссылки, цитаты и другие элементы.",
        },
        type: "article",
        duration: 10,
        quiz: {
          id: "quiz-html-intro",
          title: {
            en: "HTML Introduction Quiz",
            ru: "Тест по Введению в HTML",
          },
          questions: [
            {
              id: "q1-html-intro",
              question: {
                en: "What does HTML stand for?",
                ru: "Что означает HTML?",
              },
              options: {
                en: [
                  "Hyper Text Markup Language",
                  "High Technical Modern Language",
                  "Hyper Transfer Markup Language",
                  "Home Tool Markup Language",
                ],
                ru: [
                  "Язык Гипертекстовой Разметки",
                  "Высокотехнологичный Современный Язык",
                  "Язык Разметки Гипер-Переноса",
                  "Домашний Инструмент Языка Разметки",
                ],
              },
              correctOptionIndex: 0,
            },
            {
              id: "q2-html-intro",
              question: {
                en: "Which element is used to define the title of an HTML document?",
                ru: "Какой элемент используется для определения заголовка HTML-документа?",
              },
              options: {
                en: ["<head>", "<title>", "<h1>", "<header>"],
                ru: ["<head>", "<title>", "<h1>", "<header>"],
              },
              correctOptionIndex: 1,
            },
            {
              id: "q3-html-intro",
              question: {
                en: "Which HTML element is used to define a paragraph?",
                ru: "Какой HTML-элемент используется для определения абзаца?",
              },
              options: {
                en: ["<para>", "<p>", "<paragraph>", "<text>"],
                ru: ["<para>", "<p>", "<paragraph>", "<text>"],
              },
              correctOptionIndex: 1,
            },
          ],
          pointsReward: 10,
          timeLimit: 300,
          passingScore: 2,
        },
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "html-lesson2",
        title: {
          en: "HTML Document Structure",
          ru: "Структура HTML-документа",
        },
        description: {
          en: "Learn how to structure an HTML document.",
          ru: "Изучите структуру HTML-документа.",
        },
        content: {
          en: "Every HTML page has a basic structure that includes the <!DOCTYPE> declaration, and the <html>, <head>, and <body> elements.\n\nThe <!DOCTYPE> declaration represents the document type, and helps browsers to display web pages correctly. It must appear only once, at the top of the page, before any HTML tags.\n\nThe <html> element is the root element of an HTML page. All other elements are contained within this element.\n\nThe <head> element contains meta information about the HTML document, such as its title, style information, scripts, and more. This information is not displayed on the page.\n\nThe <title> element specifies a title for the HTML page (which is shown in the browser's title bar or in the page's tab).\n\nThe <body> element contains the visible page content. Everything that you want to show on your web page must be placed between the opening and closing <body> tags.",
          ru: "Каждая HTML-страница имеет базовую структуру, которая включает в себя декларацию <!DOCTYPE>, а также элементы <html>, <head> и <body>.\n\nДекларация <!DOCTYPE> представляет тип документа и помогает браузерам правильно отображать веб-страницы. Она должна появиться только один раз, в начале страницы, перед любыми HTML-тегами.\n\n<html> - это корневой элемент HTML-страницы. Все остальные элементы содержатся внутри этого элемента.\n\n<head> содержит мета-информацию об HTML-документе, такую как его заголовок, стилевую информацию, скрипты и многое другое. Эта информация не отображается на странице.\n\n<title> указывает заголовок для HTML-страницы (который отображается в заголовке браузера или в вкладке страницы).\n\n<body> содержит видимое содержимое страницы. Всё, что вы хотите показать на своей веб-странице, должно быть размещено между открывающим и закрывающим тегами <body>.",
        },
        type: "article",
        duration: 15,
        quiz: {
          id: "quiz-html-structure",
          title: {
            en: "HTML Structure Quiz",
            ru: "Тест по Структуре HTML",
          },
          questions: [
            {
              id: "q1-html-structure",
              question: {
                en: "What is the root element of an HTML page?",
                ru: "Какой элемент является корневым элементом HTML-страницы?",
              },
              options: {
                en: ["<body>", "<head>", "<html>", "<root>"],
                ru: ["<body>", "<head>", "<html>", "<root>"],
              },
              correctOptionIndex: 2,
            },
            {
              id: "q2-html-structure",
              question: {
                en: "Which element contains the visible content of an HTML page?",
                ru: "Какой элемент содержит видимое содержимое HTML-страницы?",
              },
              options: {
                en: ["<body>", "<head>", "<title>", "<content>"],
                ru: ["<body>", "<head>", "<title>", "<content>"],
              },
              correctOptionIndex: 0,
            },
            {
              id: "q3-html-structure",
              question: {
                en: "What should appear at the top of every HTML document?",
                ru: "Что должно появиться в начале каждого HTML-документа?",
              },
              options: {
                en: ["<!DOCTYPE html>", "<html>", "<head>", "<title>"],
                ru: ["<!DOCTYPE html>", "<html>", "<head>", "<title>"],
              },
              correctOptionIndex: 0,
            },
          ],
          pointsReward: 15,
          timeLimit: 300,
          passingScore: 2,
        },
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-17"),
      },
    ],
    difficulty: "beginner",
    tags: ["html", "web development", "frontend"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "css-mastery",
    title: {
      en: "CSS Mastery",
      ru: "Мастерство CSS",
    },
    description: {
      en: "Take your styling skills to the next level with advanced CSS techniques.",
      ru: "Поднимите свои навыки стилизации на новый уровень с помощью продвинутых методов CSS.",
    },
    image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    lessons: [
      {
        id: "css-lesson1",
        title: {
          en: "Advanced Selectors",
          ru: "Продвинутые селекторы",
        },
        description: {
          en: "Master complex CSS selectors for precise styling.",
          ru: "Освойте сложные селекторы CSS для точной стилизации.",
        },
        content: {
          en: "CSS selectors are patterns used to select and style HTML elements. Beyond the basic selectors, CSS offers a range of advanced selectors that can help you target elements with incredible precision.\n\n**Attribute Selectors**\nAttribute selectors target elements based on their attributes and attribute values:\n- `[attribute]` selects elements with a specific attribute\n- `[attribute=value]` selects elements with a specific attribute value\n- `[attribute^=value]` selects elements whose attribute value begins with a specified value\n- `[attribute$=value]` selects elements whose attribute value ends with a specified value\n- `[attribute*=value]` selects elements whose attribute value contains a specified value\n\n**Pseudo-classes**\nPseudo-classes select elements based on their state or position:\n- `:hover` selects elements when the mouse hovers over them\n- `:active` selects elements when they're being activated\n- `:focus` selects elements when they have focus\n- `:first-child` selects elements that are the first child of their parent\n- `:last-child` selects elements that are the last child of their parent\n- `:nth-child(n)` selects elements that are the nth child of their parent\n\n**Pseudo-elements**\nPseudo-elements select and style a part of an element:\n- `::before` creates a pseudo-element that is the first child of the selected element\n- `::after` creates a pseudo-element that is the last child of the selected element\n- `::first-letter` selects the first letter of the selected element\n- `::first-line` selects the first line of the selected element\n\n**Combinators**\nCombinators explain the relationship between selectors:\n- `descendant selector (space)` selects all elements that are descendants of a specified element\n- `child selector (>)` selects all elements that are the direct children of a specified element\n- `adjacent sibling selector (+)` selects an element that is directly after another specific element\n- `general sibling selector (~)` selects all elements that are next siblings of a specified element",
          ru: "Селекторы CSS - это шаблоны, используемые для выбора и стилизации HTML-элементов. Помимо базовых селекторов, CSS предлагает ряд продвинутых селекторов, которые помогут вам нацелить элементы с невероятной точностью.\n\n**Селекторы атрибутов**\nСелекторы атрибутов нацелены на элементы на основе их атрибутов и значений атрибутов:\n- `[attribute]` выбирает элементы с конкретным атрибутом\n- `[attribute=value]` выбирает элементы с конкретным значением атрибута\n- `[attribute^=value]` выбирает элементы, значение атрибута которых начинается с указанного значения\n- `[attribute$=value]` выбирает элементы, значение атрибута которых заканчивается указанным значением\n- `[attribute*=value]` выбирает элементы, значение атрибута которых содержит указанное значение\n\n**Псевдоклассы**\nПсевдоклассы выбирают элементы на основе их состояния или положения:\n- `:hover` выбирает элементы, когда на них наводится курсор мыши\n- `:active` выбирает элементы, когда они активируются\n- `:focus` выбирает элементы, когда они в фокусе\n- `:first-child` выбирает элементы, которые являются первым дочерним элементом своего родителя\n- `:last-child` выбирает элементы, которые являются последним дочерним элементом своего родителя\n- `:nth-child(n)` выбирает элементы, которые являются n-ым дочерним элементом своего родителя\n\n**Псевдоэлементы**\nПсевдоэлементы выбирают и стилизуют часть элемента:\n- `::before` создает псевдоэлемент, который является первым дочерним элементом выбранного элемента\n- `::after` создает псевдоэлемент, который является последним дочерним элементом выбранного элемента\n- `::first-letter` выбирает первую букву выбранного элемента\n- `::first-line` выбирает первую строку выбранного элемента\n\n**Комбинаторы**\nКомбинаторы объясняют отношение между селекторами:\n- `селектор потомка (пробел)` выбирает все элементы, которые являются потомками указанного элемента\n- `дочерний селектор (>)` выбирает все элементы, которые являются прямыми дочерними элементами указанного элемента\n- `селектор смежного брата (+)` выбирает элемент, который находится непосредственно после другого конкретного элемента\n- `общий селектор братьев (~)` выбирает все элементы, которые являются следующими братьями указанного элемента",
        },
        type: "article",
        duration: 20,
        quiz: null,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-20"),
      },
    ],
    difficulty: "intermediate",
    tags: ["css", "styling", "frontend"],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "javascript-fundamentals",
    title: {
      en: "JavaScript Fundamentals",
      ru: "Основы JavaScript",
    },
    description: {
      en: "Learn the core concepts of JavaScript programming.",
      ru: "Изучите основные концепции программирования на JavaScript.",
    },
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    lessons: [
      {
        id: "js-lesson1",
        title: {
          en: "JavaScript Variables and Data Types",
          ru: "Переменные и типы данных в JavaScript",
        },
        description: {
          en: "Learn about different ways to declare variables and data types in JavaScript.",
          ru: "Изучите различные способы объявления переменных и типы данных в JavaScript.",
        },
        content: {
          en: "JavaScript variables are containers for storing data values. In modern JavaScript, there are three ways to declare a variable:\n\n1. `var` - The traditional way to declare variables. Variables declared with var are function-scoped, meaning they are only available within the function they're declared in, or globally if declared outside a function.\n\n2. `let` - Introduced in ES6, let allows you to declare block-scoped variables. This means they are only available within the block they're declared in (a block is denoted by curly braces {}).\n\n3. `const` - Also introduced in ES6, const is used to declare variables whose values should not be reassigned. Like let, const variables are block-scoped.\n\n**JavaScript Data Types**\n\nJavaScript has several built-in data types:\n\n1. **Primitive Data Types**:\n   - String: Represents textual data, e.g., \"Hello, World!\"\n   - Number: Represents numeric values, e.g., 42 or 3.14\n   - Boolean: Represents logical values, true or false\n   - Undefined: Represents a variable that has been declared but not assigned a value\n   - Null: Represents the intentional absence of any object value\n   - Symbol (ES6): Represents a unique identifier\n   - BigInt (ES2020): Represents integers with arbitrary precision\n\n2. **Complex Data Types**:\n   - Object: Represents a collection of related data and/or functionality\n   - Array: A special type of object used for storing ordered collections\n   - Function: A special type of object that can be called\n   - Date: Represents dates and times\n   - RegExp: Represents regular expressions\n\nJavaScript is a dynamically typed language, which means you don't need to specify the data type when declaring a variable. The type is determined automatically when the code is executed.",
          ru: "Переменные JavaScript - это контейнеры для хранения значений данных. В современном JavaScript существует три способа объявления переменной:\n\n1. `var` - Традиционный способ объявления переменных. Переменные, объявленные с помощью var, имеют функциональную область видимости, что означает, что они доступны только внутри функции, в которой они объявлены, или глобально, если объявлены вне функции.\n\n2. `let` - Введенный в ES6, let позволяет объявлять переменные с блочной областью видимости. Это означает, что они доступны только внутри блока, в котором они объявлены (блок обозначается фигурными скобками {}).\n\n3. `const` - Также введенный в ES6, const используется для объявления переменных, значения которых не должны переназначаться. Как и let, переменные const имеют блочную область видимости.\n\n**Типы данных JavaScript**\n\nJavaScript имеет несколько встроенных типов данных:\n\n1. **Примитивные типы данных**:\n   - String: Представляет текстовые данные, например, \"Привет, мир!\"\n   - Number: Представляет числовые значения, например, 42 или 3.14\n   - Boolean: Представляет логические значения, true или false\n   - Undefined: Представляет переменную, которая была объявлена, но не присвоена значение\n   - Null: Представляет преднамеренное отсутствие любого значения объекта\n   - Symbol (ES6): Представляет уникальный идентификатор\n   - BigInt (ES2020): Представляет целые числа с произвольной точностью\n\n2. **Сложные типы данных**:\n   - Object: Представляет коллекцию связанных данных и/или функциональности\n   - Array: Специальный тип объекта, используемый для хранения упорядоченных коллекций\n   - Function: Специальный тип объекта, который можно вызвать\n   - Date: Представляет даты и время\n   - RegExp: Представляет регулярные выражения\n\nJavaScript - это язык с динамической типизацией, что означает, что вам не нужно указывать тип данных при объявлении переменной. Тип определяется автоматически при выполнении кода.",
        },
        type: "article",
        duration: 25,
        quiz: {
          id: "quiz-js-variables",
          title: {
            en: "JavaScript Variables & Data Types Quiz",
            ru: "Тест по Переменным и Типам Данных JavaScript",
          },
          questions: [
            {
              id: "q1-js-variables",
              question: {
                en: "Which keyword creates a constant variable in JavaScript?",
                ru: "Какое ключевое слово создает константную переменную в JavaScript?",
              },
              options: {
                en: ["var", "let", "const", "define"],
                ru: ["var", "let", "const", "define"],
              },
              correctOptionIndex: 2,
            },
            {
              id: "q2-js-variables",
              question: {
                en: "Which of these is NOT a primitive data type in JavaScript?",
                ru: "Какой из этих НЕ является примитивным типом данных в JavaScript?",
              },
              options: {
                en: ["String", "Number", "Boolean", "Array"],
                ru: ["String", "Number", "Boolean", "Array"],
              },
              correctOptionIndex: 3,
            },
            {
              id: "q3-js-variables",
              question: {
                en: "What is the result of typeof null in JavaScript?",
                ru: "Каков результат typeof null в JavaScript?",
              },
              options: {
                en: ["null", "undefined", "object", "string"],
                ru: ["null", "undefined", "object", "string"],
              },
              correctOptionIndex: 2,
            },
          ],
          pointsReward: 15,
          timeLimit: 300,
          passingScore: 2,
        },
        createdAt: new Date("2024-01-22"),
        updatedAt: new Date("2024-01-25"),
      },
    ],
    difficulty: "beginner",
    tags: ["javascript", "programming", "frontend"],
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "react-essentials",
    title: {
      en: "React Essentials",
      ru: "Основы React",
    },
    description: {
      en: "Master the fundamentals of React, the popular JavaScript library for building user interfaces.",
      ru: "Овладейте основами React, популярной JavaScript-библиотеки для создания пользовательских интерфейсов.",
    },
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    lessons: [],
    difficulty: "intermediate",
    tags: ["react", "javascript", "frontend", "ui"],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "typescript-advanced",
    title: {
      en: "Advanced TypeScript",
      ru: "Продвинутый TypeScript",
    },
    description: {
      en: "Take your TypeScript skills to the next level with advanced concepts and patterns.",
      ru: "Поднимите свои навыки TypeScript на следующий уровень с помощью продвинутых концепций и паттернов.",
    },
    image: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    lessons: [],
    difficulty: "advanced",
    tags: ["typescript", "javascript", "programming"],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
];

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: {
      en: "Welcome to FrontendMaster!",
      ru: "Добро пожаловать в ФронтендМастер!",
    },
    message: {
      en: "Thank you for joining our platform. Start your learning journey today!",
      ru: "Спасибо за присоединение к нашей платформе. Начните свой путь обучения сегодня!",
    },
    type: "info",
    userId: "all",
    read: false,
    createdAt: new Date("2025-05-29"),
  },
  {
    id: "n2",
    title: {
      en: "New Course Added: React Essentials",
      ru: "Добавлен новый курс: Основы React",
    },
    message: {
      en: "Check out our new React course to improve your frontend skills.",
      ru: "Ознакомьтесь с нашим новым курсом по React, чтобы улучшить свои навыки фронтенда.",
    },
    type: "info",
    userId: "all",
    read: false,
    createdAt: new Date("2025-05-28"),
  },
  {
    id: "n3",
    title: {
      en: "Your Course Progress",
      ru: "Ваш Прогресс Курса",
    },
    message: {
      en: "You've completed 50% of HTML Fundamentals. Keep going!",
      ru: "Вы выполнили 50% курса Основы HTML. Продолжайте!",
    },
    type: "success",
    userId: "user1",
    read: true,
    createdAt: new Date("2025-05-27"),
  },
  {
    id: "n4",
    title: {
      en: "Reminder: Continue Your Learning",
      ru: "Напоминание: Продолжите Свое Обучение",
    },
    message: {
      en: "You haven't logged in for 3 days. Don't break your learning streak!",
      ru: "Вы не заходили 3 дня. Не прерывайте свою полосу обучения!",
    },
    type: "warning",
    userId: "user1",
    read: false,
    createdAt: new Date("2025-05-26"),
  },
  {
    id: "n5",
    title: {
      en: "System Maintenance",
      ru: "Техническое Обслуживание Системы",
    },
    message: {
      en: "The platform will be under maintenance on May 31 from 02:00 to 04:00 UTC.",
      ru: "Платформа будет на техническом обслуживании 31 мая с 02:00 до 04:00 UTC.",
    },
    type: "warning",
    userId: "all",
    read: false,
    createdAt: new Date("2025-05-25"),
  },
];