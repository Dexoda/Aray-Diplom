# Amour De Beauté - Интернет-магазин косметики

Amour De Beauté

## 🇷🇺 Русский

### О проекте
Amour De Beauté - современный интернет-магазин косметики, предлагающий широкий ассортимент косметических средств. Проект разработан с использованием современных технологий и представляет собой полнофункциональное веб-приложение с панелью администратора.

### Технологии
- **Backend**: Node.js, Express
- **База данных**: MongoDB
- **Контейнеризация**: Docker, Docker Compose
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Шаблонизатор**: EJS

### Требования
- Docker
- Docker Compose

### Установка и запуск

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/Dexoda/Aray-Diplom.git
   cd Aray-Diplom
   ```

2. Запустить проект с помощью Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Доступ к приложению:
   - Веб-интерфейс: http://localhost:3000
   - MongoDB Express (администрирование базы данных): http://localhost:8081
     - Логин: admin
     - Пароль: pass

4. Данные для входа как администратор:
   - Email: admin
   - Пароль: pass

### Структура проекта
- `backend/` - Исходный код серверной части
  - `controllers/` - Контроллеры для обработки запросов
  - `models/` - Mongoose модели для взаимодействия с базой данных
  - `routes/` - Маршруты API
  - `views/` - EJS шаблоны для рендеринга страниц
  - `middleware/` - Middleware функции
  - `public/` - Статические файлы (CSS, JavaScript, изображения)
- `docker-compose.yml` - Конфигурация Docker Compose

### Основная функциональность
- Каталог косметических товаров с категориями
- Детальная информация о товаре
- Корзина покупок
- Оформление заказа
- Личный кабинет пользователя
- Административная панель для управления товарами и заказами


---

## 🇰🇿 Қазақша

### Жоба туралы
Amour De Beauté - косметикалық өнімдердің кең ауқымын ұсынатын заманауи онлайн косметика дүкені. Жоба заманауи технологиялар арқылы әзірленген және әкімші панелі бар толық функционалды веб-қосымшаны құрайды.

### Технологиялар
- **Backend**: Node.js, Express
- **Деректер базасы**: MongoDB
- **Контейнеризация**: Docker, Docker Compose
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Шаблондаушы**: EJS

### Талаптар
- Docker
- Docker Compose

### Орнату және іске қосу

1. Репозиторийді клондау:
   ```bash
   git clone https://github.com/Dexoda/Aray-Diplom.git
   cd Aray-Diplom
   ```

2. Docker Compose арқылы жобаны іске қосу:
   ```bash
   docker-compose up -d
   ```

3. Қосымшаға қол жеткізу:
   - Веб-интерфейс: http://localhost:3000
   - MongoDB Express (деректер базасын басқару): http://localhost:8081
     - Логин: admin
     - Құпия сөз: pass

4. Әкімші ретінде кіру үшін деректер:
   - Email: admin
   - Құпия сөз: pass

### Жоба құрылымы
- `backend/` - Сервер жағының бастапқы коды
  - `controllers/` - Сұраныстарды өңдеуге арналған контроллерлер
  - `models/` - Деректер базасымен өзара әрекеттесуге арналған Mongoose модельдері
  - `routes/` - API бағыттары
  - `views/` - Беттерді рендерлеуге арналған EJS шаблондары
  - `middleware/` - Middleware функциялары
  - `public/` - Статикалық файлдар (CSS, JavaScript, суреттер)
- `docker-compose.yml` - Docker Compose конфигурациясы

### Негізгі функционалдық
- Санаттары бар косметикалық тауарлар каталогі
- Тауар туралы егжей-тегжейлі ақпарат
- Сатып алу себеті
- Тапсырыс рәсімдеу
- Пайдаланушының жеке кабинеті
- Тауарлар мен тапсырыстарды басқаруға арналған әкімші панелі

---

## 🇬🇧 English

### About the Project
Amour De Beauté is a modern online cosmetics store offering a wide range of beauty products. The project is developed using modern technologies and represents a fully functional web application with an admin panel.

### Technologies
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Template Engine**: EJS

### Requirements
- Docker
- Docker Compose

### Installation and Launch

1. Clone the repository:
   ```bash
   git clone https://github.com/Dexoda/Aray-Diplom.git
   cd Aray-Diplom
   ```

2. Launch the project using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Web interface: http://localhost:3000
   - MongoDB Express (database administration): http://localhost:8081
     - Login: admin
     - Password: pass

4. Admin login credentials:
   - Email: admin
   - Password: pass

### Project Structure
- `backend/` - Server-side source code
  - `controllers/` - Controllers for handling requests
  - `models/` - Mongoose models for database interaction
  - `routes/` - API routes
  - `views/` - EJS templates for page rendering
  - `middleware/` - Middleware functions
  - `public/` - Static files (CSS, JavaScript, images)
- `docker-compose.yml` - Docker Compose configuration

### Main Functionality
- Catalog of cosmetic products with categories
- Detailed product information
- Shopping cart
- Order checkout
- User personal account
- Administrative panel for managing products and orders
