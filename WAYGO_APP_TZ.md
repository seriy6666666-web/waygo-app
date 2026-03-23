# Waygo — Техническое задание на мобильное приложение

> **Версия:** 1.0  
> **Дата:** 2026-03-23  
> **Стек:** React Native + Expo (TypeScript)  
> **Платформы:** iOS, Android  

---

## 1. Концепция продукта

**Waygo** — lifestyle-приложение для тех, кто ценит прогулки, замечает настроение и хочет видеть, как складывается неделя.

**Слоган:** «Гуляй, чувствуй, запоминай» / «Walk, feel, remember»

**Антипозиционирование:** Waygo — НЕ фитнес-трекер. Без таймеров пульса, норм калорий, токсичной продуктивности. Скорее «дневник движения и настроения — только красивый».

### 4 столпа продукта

| Столп | Ключ | Описание |
|-------|------|----------|
| **Move** | Движение | Прогулки, маршруты, время в движении |
| **Mood** | Настроение | Настроение, заметки, маленькие моменты дня |
| **Rhythm** | Ритм | Серии, недельная цель, ощущение устойчивости |
| **Memory** | Память | Карточки дней, архив красивой повседневности |

---

## 2. Целевая аудитория

- Люди 18–35, ценящие осознанность и эстетику
- Городские жители, которые гуляют регулярно
- Те, кому не подходят фитнес-приложения с их давлением
- Ведущие дневники / трекеры привычек, ищущие визуально приятный инструмент

---

## 3. Технический стек

```
Framework:      React Native + Expo SDK 52+
Language:       TypeScript
Navigation:     Expo Router (file-based routing)
State:          Zustand
Storage:        expo-sqlite (локальная БД) + AsyncStorage (настройки)
Backend:        Supabase (auth, PostgreSQL, Storage, Edge Functions)
Maps:           react-native-maps + Mapbox (стиль карты)
Location:       expo-location (foreground + background tracking)
Weather API:    Open-Meteo (бесплатный, без ключа)
Notifications:  expo-notifications
Camera/Photos:  expo-image-picker
Animations:     react-native-reanimated 3 + Moti
i18n:           i18next + react-i18next
```

---

## 4. Экраны приложения (MVP)

### 4.1 Onboarding (3 экрана)

**A1 — Welcome**
- Заголовок: «Привет, это Waygo»
- Подзаголовок: «Собирай прогулки, настроение и маленькие моменты в красивый ритм.»
- CTA: «Начать»

**A2 — Location Permission**
- Заголовок: «Разреши геолокацию»
- Подзаголовок: «Нужна для записи маршрутов и адаптации атмосферы по погоде.»
- CTA: «Разрешить» / «Позже»
- При «Позже» → показать: «Без геолокации маршрут не сохранится, но настроение и карточки дня доступны.»

**A3 — Notifications**
- Заголовок: «Мягкие напоминания»
- Подзаголовок: «Чтобы не терять ритм, без давления.»
- CTA: «Включить» / «Не сейчас»

**Технические детали:**
- Onboarding показывается один раз (флаг `hasOnboarded` в AsyncStorage)
- Запрос разрешений через нативные диалоги (expo-location, expo-notifications)

---

### 4.2 Home / Today (Главный экран)

**Назначение:** Living lifestyle feed текущего дня — центральный хаб.

**Структура сверху вниз:**

```
┌─────────────────────────────────┐
│ Header: дата + приветствие       │
│ «Сегодня всё в мягком ритме»    │
├─────────────────────────────────┤
│ Hero Card: «Твой день»          │
│ Мета-чипы: ☁ Облачно · 🌆 Вечер │
├─────────────────────────────────┤
│ Move Card                        │
│ До прогулки: «Выйти на          │
│   короткий маршрут?»             │
│ После: «42 мин · 3.8 км ·       │
│   маршрут сохранён»              │
├─────────────────────────────────┤
│ Mood Card                        │
│ «Как ты сейчас?» + чипы         │
│ 😊 🙂 😐 😔                      │
├─────────────────────────────────┤
│ Rhythm Row                       │
│ Серия: 6 дней · Цель: 3/5       │
├─────────────────────────────────┤
│ Memory Teaser                    │
│ Превью карточки вчерашнего дня   │
├─────────────────────────────────┤
│ Week Bar: ● ● ● ◐ ○ ○ ○        │
│ Progress: ████░░░░ 60%          │
├─────────────────────────────────┤
│ Tip: «Попробуй новый маршрут    │
│   через парк»                    │
└─────────────────────────────────┘
```

**Метрики на экране:** 🚶 42 мин · 📍 3.8 км · 🎯 3/5 прогулок

**Данные:**
- Текущая погода (Open-Meteo API)
- Время суток (device clock)
- Прогулки за сегодня (SQLite)
- Настроение за сегодня (SQLite)
- Серия дней (count consecutive days with activity)
- Недельная цель (настройка пользователя, дефолт: 5)

---

### 4.3 Walk Tracking (Прогулка)

**Назначение:** Ритуал движения, НЕ спортивная панель.

**Состояния:**
1. **Idle** → кнопка «Начать прогулку»
2. **Active** → карта с live-маршрутом + таймер + хинт «Дыши ровно, просто иди в своём темпе»
3. **Paused** → «Продолжить» / «Завершить»
4. **Saving** → Bottom sheet: «Сохранить маршрут как момент дня?»

**UI элементы (Active):**
```
┌──────────────────────────────┐
│        FULL MAP CANVAS       │
│    (route gradient path)     │
│                              │
│  ┌──────────────────────┐    │
│  │ Прогулка идёт · 28:14│    │
│  │ Дыши ровно...        │    │
│  └──────────────────────┘    │
│                              │
│         [ ⏸ Пауза ]         │
│       [ ■ Завершить ]        │
└──────────────────────────────┘
```

**Bottom sheet при сохранении:**
```
┌──────────────────────────────┐
│ Сохранить маршрут?           │
│                              │
│ ⏱ 42 мин  📍 3.8 км         │
│ ⚡ 5.2 км/ч  🔥 156 ккал     │
│ 👣 3 842 шагов  ⛰ +12 м      │
│                              │
│ [Мини-превью маршрута SVG]   │
│                              │
│ [████ Сохранить момент ████] │
│         Пропустить           │
└──────────────────────────────┘
```

**Технические детали:**
- `expo-location` foreground tracking (accuracy: high, distanceInterval: 10м)
- Background location tracking (для записи при свёрнутом приложении)
- Координаты сохраняются как массив `[{lat, lng, timestamp}]`
- Шаги: expo-sensors Pedometer (если доступен)
- Калории: приблизительный расчёт `вес × расстояние_км × 0.75`
- Превью маршрута: SVG polyline из координат

---

### 4.4 Mood / Note (Настроение)

**Назначение:** Быстрая эмоциональная фиксация момента.

**Структура:**
```
┌──────────────────────────────┐
│ Как ты сейчас?               │
│                              │
│ [Спокойно] [Легко]           │
│ [Сфокусировано] [Уставше]    │
│ [Вдохновлённо] [Рефлексивно] │
│                              │
│ ┌──────────────────────┐     │
│ │ Пара слов о дне...   │     │
│ │                      │     │
│ └──────────────────────┘     │
│                              │
│ [📷 Добавить фото]           │
│                              │
│ [████ Сохранить момент ████] │
│          Пропустить          │
└──────────────────────────────┘
```

**Mood options (массив):**
```ts
type MoodKey = 'calm' | 'light' | 'focused' | 'tired' | 'inspired' | 'reflective';
```

**Данные:**
- `mood: MoodKey` (обязательно)
- `note: string` (опционально, max 500 символов)
- `photoUri: string | null` (опционально, через expo-image-picker)
- `timestamp: ISO string`

**Edge state:** «Можно без фото. Твой момент уже ценен.»

---

### 4.5 Day Card / Memory (Карточка дня)

**Назначение:** Коллекционный личный объект — визуальная «страница» дня.

**Структура:**
```
┌──────────────────────────────┐
│ 23 марта, воскресенье        │
│ [😌 Спокойно]                │
│                              │
│ «Длинная прогулка без спешки.│
│  Город вечером стал тише.»   │
│                              │
│ 📍 3.8 км · ⏱ 42 мин        │
│ [Мини-превью маршрута]       │
│                              │
│ #Вечер #Город #Тишина        │
│                              │
│ [Поделиться]  [В архив]      │
└──────────────────────────────┘
```

**Данные:**
- Сведение всех данных дня: прогулки + настроение + заметки + фото
- Автоматические теги: время суток, погода, город (из геолокации)
- Пользовательские теги (опционально)
- «Поделиться» → генерация изображения карточки (ViewShot → Share API)

---

### 4.6 Weekly Recap (Итоги недели)

**Назначение:** Эмоциональный + визуальный недельный итог. Ключевая фича «Твоя неделя как история».

**Структура:**
```
┌──────────────────────────────┐
│ Твоя неделя                  │
│ 17–23 марта                  │
├──────────────────────────────┤
│ 4 прогулки · 16.2 км ·      │
│ Серия 6 дней                 │
├──────────────────────────────┤
│ Лучшие маршруты недели       │
│ [превью] [превью]            │
├──────────────────────────────┤
│ Ритм настроения              │
│ Пн🙂 Вт😊 Ср😐 Чт🙂 Пт😊    │
├──────────────────────────────┤
│ 📷 Фото момента недели       │
├──────────────────────────────┤
│ Что запомнилось              │
│ • Вечерняя прогулка у реки   │
│ • Первый тёплый день         │
├──────────────────────────────┤
│ ┌────────────────────────┐   │
│ │ 🏆 Хороший мягкий темп │   │
│ │ Ты держишь ритм        │   │
│ │ без гонки.             │   │
│ │                        │   │
│ │ [Сохранить recap]      │   │
│ └────────────────────────┘   │
└──────────────────────────────┘
```

**Генерация:** Автоматически по понедельникам (или по запросу из архива).

**Данные:**
- Агрегация прогулок за Mon–Sun
- Массив настроений по дням
- Лучшие маршруты (по длительности/расстоянию)
- Все заметки и фото за неделю
- Reward card — мотивационный текст (выбирается по условиям)

---

### 4.7 Settings (Настройки)

```
┌──────────────────────────────┐
│ Настройки                    │
├──────────────────────────────┤
│ Профиль                      │
│ Имя: ___________             │
│ Недельная цель: [3] [5] [7]  │
├──────────────────────────────┤
│ Атмосфера                    │
│ 🔘 Adaptive Ambiance         │
│ «Менять атмосферу по погоде  │
│  и времени суток»            │
├──────────────────────────────┤
│ Разрешения                   │
│ 🔘 Геолокация                │
│ 🔘 Мягкие напоминания        │
├──────────────────────────────┤
│ Данные                       │
│ Экспорт данных               │
│ Удалить аккаунт              │
├──────────────────────────────┤
│ О приложении                 │
│ Версия · Privacy · Terms     │
└──────────────────────────────┘
```

---

## 5. Навигация

```
Tab Bar (3 вкладки):
├── 🏠 Home (Today)
├── 🚶 Walk (Tracking)
└── 📋 Archive (Day Cards + Weekly Recaps)

Модальные экраны:
├── Mood / Note → открывается из Home
├── Day Card → из Home (teaser) или Archive
├── Weekly Recap → из Archive или push-уведомления
└── Settings → из Header (иконка ⚙)

Onboarding → показывается при первом запуске
```

---

## 6. Модель данных

### SQLite таблицы

```sql
-- Прогулки
CREATE TABLE walks (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,        -- ISO timestamp
  ended_at TEXT,
  duration_sec INTEGER,
  distance_m REAL,
  steps INTEGER,
  calories REAL,
  route TEXT,                       -- JSON: [{lat, lng, ts}]
  synced INTEGER DEFAULT 0
);

-- Настроения
CREATE TABLE moods (
  id TEXT PRIMARY KEY,
  mood TEXT NOT NULL,               -- calm|light|focused|tired|inspired|reflective
  note TEXT,
  photo_uri TEXT,
  created_at TEXT NOT NULL,
  synced INTEGER DEFAULT 0
);

-- Карточки дней
CREATE TABLE day_cards (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,        -- YYYY-MM-DD
  walk_ids TEXT,                    -- JSON array of walk IDs
  mood_ids TEXT,                    -- JSON array of mood IDs
  tags TEXT,                        -- JSON array of strings
  weather_code INTEGER,
  city TEXT,
  synced INTEGER DEFAULT 0
);

-- Недельные итоги
CREATE TABLE weekly_recaps (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,         -- YYYY-MM-DD (Monday)
  week_end TEXT NOT NULL,
  total_walks INTEGER,
  total_distance_m REAL,
  total_duration_sec INTEGER,
  streak_days INTEGER,
  mood_summary TEXT,                -- JSON: {calm: 2, light: 3, ...}
  highlight_note TEXT,
  synced INTEGER DEFAULT 0
);

-- Настройки
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

---

## 7. Архитектура проекта

```
waygo-app/
├── app/                          # Expo Router (file-based)
│   ├── _layout.tsx               # Root layout (providers, theme)
│   ├── (tabs)/                   # Tab navigator
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Home / Today
│   │   ├── walk.tsx              # Walk tracking
│   │   └── archive.tsx           # Archive (cards + recaps)
│   ├── onboarding/
│   │   ├── welcome.tsx
│   │   ├── location.tsx
│   │   └── notifications.tsx
│   ├── mood.tsx                  # Modal: Mood entry
│   ├── day-card/[date].tsx       # Day card detail
│   ├── recap/[weekStart].tsx     # Weekly recap
│   └── settings.tsx              # Settings
│
├── src/
│   ├── components/               # Reusable UI
│   │   ├── cards/
│   │   │   ├── MoveCard.tsx
│   │   │   ├── MoodCard.tsx
│   │   │   ├── RhythmRow.tsx
│   │   │   ├── MemoryTeaser.tsx
│   │   │   ├── DayCard.tsx
│   │   │   └── RewardCard.tsx
│   │   ├── walk/
│   │   │   ├── MapView.tsx
│   │   │   ├── WalkTimer.tsx
│   │   │   ├── RoutePreview.tsx
│   │   │   └── SaveSheet.tsx
│   │   ├── mood/
│   │   │   ├── MoodChips.tsx
│   │   │   └── NoteInput.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── WeekBar.tsx
│   │   │   └── BottomSheet.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── SafeArea.tsx
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── useWalkStore.ts
│   │   ├── useMoodStore.ts
│   │   ├── useDayStore.ts
│   │   ├── useRecapStore.ts
│   │   ├── useSettingsStore.ts
│   │   └── useThemeStore.ts
│   │
│   ├── services/
│   │   ├── database.ts           # SQLite init + queries
│   │   ├── weather.ts            # Open-Meteo API
│   │   ├── location.ts           # Geo helpers
│   │   ├── notifications.ts      # Push scheduling
│   │   └── sync.ts               # Supabase sync
│   │
│   ├── theme/
│   │   ├── tokens.ts             # Design tokens
│   │   ├── adaptive.ts           # Adaptive Ambiance logic
│   │   └── themes.ts             # Theme matrix (16 combos)
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── ru.json
│   │   └── en.json
│   │
│   ├── utils/
│   │   ├── date.ts
│   │   ├── stats.ts              # Расчёт калорий, расстояния
│   │   └── formatters.ts
│   │
│   └── types/
│       └── index.ts              # TypeScript типы
│
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── app.json                      # Expo config
├── tsconfig.json
├── package.json
└── .env                          # SUPABASE_URL, SUPABASE_ANON_KEY
```

---

## 8. Adaptive Ambiance (Система адаптивной атмосферы)

Главная визуальная фича — интерфейс «живёт в контексте пользователя».

### Входные параметры
| Параметр | Источник | Buckets |
|----------|----------|---------|
| Время суток | Device clock | morning (5-11), day (11-17), evening (17-22), night (22-5) |
| Погода | Open-Meteo API | clear (0,1), cloudy (2,3,45,48), rain (51-65,80-82,95), snowFog (66-77,85-86,96,99) |
| Настроение | Последний mood entry | calm, light, focused, tired, inspired, reflective |

### Приоритет
`Weather × Time` → основа → `Mood` → вторичное наложение

### Матрица тем (16 комбо)

| | Clear | Cloudy | Rain | Snow/Fog |
|---|---|---|---|---|
| **Morning** | bg: #E7F7F4→#DDE4EA, accent: #6FAEA5 | bg: #EAF3F6→#DCE4EA, accent: #78AAA4 | bg: #E4EEF2→#CFDAE2, accent: #6C9DA0 | bg: #EEF5F7→#DDE6EC, accent: #81AAB0 |
| **Day** | bg: #E6F7F2→#DBE9EE, accent: #6FAEA5 | bg: #E4F0F3→#D8E2E9, accent: #74A6A2 | bg: #DEEAF0→#CBD9E2, accent: #69979B | bg: #ECF4F8→#D8E3EA, accent: #7DA7AE |
| **Evening** | bg: #DAEFE8→#CADDE5, accent: #649E97 | bg: #D8E7EC→#C7D7E0, accent: #67969A | bg: #D3E1E8→#BECDD9, accent: #5F8D95 | bg: #DEE8EF→#CBD8E2, accent: #739AA4 |
| **Night** | bg: #CFE2DE→#BFD1DA, accent: #5E938D | bg: #CCDCE2→#BACAD5, accent: #5F8C92 | bg: #C6D6DE→#B2C3CF, accent: #567F88 | bg: #D3DFE7→#C0CFDA, accent: #6A8F9B |

### Mood overlay (вторичный)
- `calm`: +4% fog-blue overlay на mood-модулях
- `light/inspired`: +6% soft-butter tint на highlights
- `tired`: -6% saturation на не-критических акцентах
- `reflective`: +5% silver-mist gradient depth

### Переключатель
Одна toggle: «Adaptive Ambiance ON/OFF» в Settings.

---

## 9. Дизайн-токены

### Палитра

| Токен | Hex | Роль |
|-------|-----|------|
| Seafoam | #CDEFE8 | Фоновый акцент |
| Mineral Teal | #6FAEA5 | Основной акцент (Move) |
| Soft Butter | #F5E8B8 | Акцент (Rhythm) |
| Silver Mist | #DDE4EA | Фон вторичный |
| Deep Graphite | #2A3138 | Текст основной |
| Fog Blue | #BFD7E6 | Акцент (Mood) |
| Pale Aqua | #E7F7F4 | Фон основной |
| Olive Gray | #8A948B | Текст вторичный |

### Семантические роли
```ts
const tokens = {
  bg: { primary: '#E7F7F4', secondary: '#DDE4EA' },
  surface: { card: '#F3FAF8', cardAlt: '#EEF4F8' },
  text: { primary: '#2A3138', secondary: '#8A948B' },
  accent: {
    move: '#6FAEA5',    // Mineral Teal
    mood: '#BFD7E6',    // Fog Blue
    rhythm: '#F5E8B8',  // Soft Butter
    memory: '#DDE4EA',  // Silver Mist
  },
  stroke: { soft: '#D9E4E2' },
};
```

### Скругления
`sm: 12, md: 16, lg: 20, xl: 28, sheet: 32, pill: 999`

### Отступы
`xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32`

### Тени
```ts
card:     '0 8px 28px rgba(42,49,56, 0.08)',
cardSoft: '0 4px 18px rgba(42,49,56, 0.05)',
hero:     '0 14px 40px rgba(42,49,56, 0.10)',
```

### Анимации
```ts
duration: { fast: 180, base: 260, slow: 420 },
easing: {
  calmOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  ambient: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
},
```

### Типографика
- **Шрифт:** Inter (300–900) — основной
- **Акцентный:** Newsreader (500, 700, italic) — заголовки, цитаты
- **Размеры:** hero: 34, h1: 28, h2: 22, h3: 18, body: 16, caption: 13, chip: 12

---

## 10. Дизайн-принципы

### Tone of Voice
- Короткий, спокойный, не осуждающий
- Никаких слоганов продуктивности
- Никаких «Нужно», «Должен»
- Глаголы: сохранить, добавить, заметить, прожить, вернуться

### Визуальные правила
- Layered storytelling cards, НЕ dashboard
- Большие карточки, большие радиусы, мягкие тени
- Тонированные поверхности вместо чистого белого
- Щедрый вертикальный ритм
- Минимум резких линий, никакого неона

### Анимации
- Меньше движения, больше атмосферы
- ✅ slow fade, soft scale, subtle blur, smooth card reveal
- ❌ bouncy motion, flashy highlights, aggressive gamification

---

## 11. API интеграции

### Open-Meteo (погода)
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lng}
  &current=weather_code,temperature_2m
```

Без ключа, бесплатный, без лимитов (для личного использования).

**Weather code → bucket:**
```ts
function weatherBucket(code: number): 'clear' | 'cloudy' | 'rain' | 'snowFog' {
  if (code <= 1) return 'clear';
  if ([2, 3, 45, 48].includes(code)) return 'cloudy';
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82) || code === 95) return 'rain';
  return 'snowFog';
}
```

### Supabase (бэкенд)
- **Auth:** email/password + anonymous (для MVP)
- **Database:** PostgreSQL — зеркало таблиц SQLite для синхронизации
- **Storage:** фото из mood entries (bucket `mood-photos`)
- **Edge Functions:** weekly recap generation, push triggers

### Sync стратегия
1. Все данные пишутся сначала в SQLite (offline-first)
2. При наличии сети — фоновый sync в Supabase
3. Поле `synced` (0/1) для отслеживания
4. Конфликты: last-write-wins (для MVP)

---

## 12. Push-уведомления

| Тип | Когда | Текст |
|-----|-------|-------|
| Напоминание о прогулке | Ежедневно 17:00 (если нет прогулки сегодня) | «Хороший вечер для короткой прогулки 🌤» |
| Weekly Recap | Понедельник 10:00 | «Твоя неделя собрана — загляни 📋» |
| Streak risk | Если вчера нет активности, 12:00 | «Один шаг — и серия продолжается» |

Все уведомления отключаемые. Тон мягкий, без давления.

---

## 13. i18n

Поддержка двух языков: **RU** (дефолт) и **EN**.

Определяется по `device locale`, переключается в Settings.

Файлы: `src/i18n/ru.json`, `src/i18n/en.json`

---

## 14. Edge States

| Ситуация | Поведение |
|----------|-----------|
| Нет геолокации | Прогулка без маршрута, mood + day cards доступны |
| Нет интернета | Погода: базовая тема. Все данные локальные. Sync при восстановлении |
| Нет прогулок за неделю | «Неделя только начинается. Одна прогулка уже создаст ритм.» |
| Нет фото | «Можно без фото. Твой момент уже ценен.» |
| Первый день | Пустой Home с welcome-подсказками |

---

## 15. MVP Scope vs Future

### MVP (v1.0)
- ✅ Onboarding (3 экрана)
- ✅ Home / Today
- ✅ Walk Tracking (foreground)
- ✅ Mood + Note + Photo
- ✅ Day Card (автогенерация)
- ✅ Weekly Recap
- ✅ Settings + Adaptive Ambiance
- ✅ Локальное хранение (SQLite)
- ✅ i18n (RU/EN)
- ✅ Push-уведомления (3 типа)

### v1.1 (Post-MVP)
- Background walk tracking
- Supabase sync + auth
- Шеринг Day Card как изображения
- Виджет для iOS (Today summary)

### v2.0 (Future)
- Социальные маршруты (поделиться маршрутом)
- Коллекции маршрутов по городам
- Архив по месяцам с визуализацией
- Apple Health / Google Fit интеграция
- Тёмная тема приложения

---

## 16. Команды для старта

```bash
# Создать проект
npx create-expo-app@latest waygo-app --template tabs
cd waygo-app

# Установить зависимости
npx expo install expo-location expo-notifications expo-image-picker
npx expo install expo-sqlite expo-sensors expo-haptics
npx expo install react-native-maps react-native-reanimated
npx expo install @react-native-async-storage/async-storage
npm install zustand i18next react-i18next moti
npm install @supabase/supabase-js

# Запуск
npx expo start
```

---

## 17. Контекст и связи

- **Лендинг:** `C:\Users\Belmy\Desktop\Waygo` (отдельный проект)
- **GitHub лендинга:** `https://github.com/seriy6666666-web/Waygo.git`
- **Дизайн-токены:** `docs/figma/waygo-design-tokens.json`
- **Тематическая матрица:** `docs/figma/waygo-theme-matrix.md`
- **Figma-спека:** `docs/figma/WAYGO_Figma_Ready_Spec.md`
- **Контент экранов (RU):** `docs/figma/waygo-wire-content-ru.md`
- **Карта экранов:** `docs/figma/waygo-screen-map.md`

---

> **Для нового чата:** скопируй содержимое этого файла в начало разговора. Это даст ИИ полный контекст проекта и позволит сразу начать реализацию.
