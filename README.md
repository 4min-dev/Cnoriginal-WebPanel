# 🚀 Cnoriginal WebPanel

Современная веб-панель с удобным интерфейсом для управления заказами, доставкой и аналитикой.

---

## 🧰 Стек технологий

- ⚛️ React
- 🟦 TypeScript
- 🗂️ Redux Toolkit
- 🎨 Tailwind CSS
- ⚡ Vite

---

## 📦 Установка

```bash
git clone https://github.com/4min-dev/Cnoriginal-WebPanel.git
cd Cnoriginal-WebPanel
npm install
```

---

## 🧑‍💻 Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу:  
👉 http://localhost:5173

---

## 🏗️ Сборка

```bash
npm run build
```

Превью сборки:

```bash
npm run preview
```

---

## 📁 Структура проекта

```
src/
├── assets/                # Утилиты и вспомогательные функции
├── context/               # React Context
├── hooks/                 # Кастомные хуки
│
├── pages/                 # Страницы приложения
│   ├── dashboard/
│   │   └── ui/            # UI компоненты страницы
│   ├── delivery/
│   │   └── ui/
│   └── orders/
│       └── ui/
│
├── redux/                 # Redux логика
│   ├── services/          # API (RTK Query / async)
│   └── slices/            # Состояние
│
├── store/                 # Конфигурация store
├── types/                 # Глобальные типы
│
├── ui/                    # Переиспользуемые компоненты
│   ├── aside/
│   ├── icons/
│   └── popup/
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🧠 Архитектура

Проект построен по feature-based подходу:

- **pages/** — страницы, разбитые по фичам (dashboard, orders, delivery)
- **ui/** — универсальные переиспользуемые компоненты
- **redux/services/** — слой работы с API
- **redux/slices/** — управление состоянием
- **types/** — централизованная типизация
- **hooks/** — кастомная логика
- **context/** — глобальные состояния через Context API

---

## ✨ Основные возможности

- 📊 Дашборд с аналитикой
- 📦 Управление заказами
- 🚚 Работа с доставками
- 🔔 Уведомления
- 👤 Интеграция с Telegram

---

## ⚙️ Требования

- Node.js 16+
- npm / yarn / pnpm

---