# ToDo API

## Обзор

**ToDo API** — это веб-приложение, созданное на фреймворке ASP.NET, позволяющее управлять задачами и категориями. Приложение поддерживает создание, редактирование и удаление задач, а также регистрацию и авторизацию пользователей.

## Функциональность

- **Задачи**: Создание, редактирование, удаление и просмотр задач.
- **Пользователи**: Регистрация, авторизация и управление пользователями.
- **Категории**: Создание и управление категориями задач.
- **Фронтенд**: Адаптивный интерфейс на HTML, CSS и JavaScript.

## Технологический стек

- **Backend**: ASP.NET, C#
- **Database**: Microsoft SQL Server
- **Frontend**: HTML, CSS, JavaScript
- **API Documentation**: Swagger

## Как запустить

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/1SERGIO11/_ToDoApi.git
2.  Откройте проект в Visual Studio.
3.  Настройте строку подключения в `appsettings.json`.
4.  Постройте решение и запустите приложение.

## API Endpoints

-   **AuthController**:
    -   `POST /api/Auth/login`: Авторизация пользователя.
    -   `POST /api/Auth/register`: Регистрация пользователя.
-   **TodoItemsController**:
    -   `GET /api/TodoItems`: Получение списка задач.
    -   `GET /api/TodoItems/{id}`: Получение задачи по ID.
    -   `POST /api/TodoItems`: Создание новой задачи.
    -   `PUT /api/TodoItems/{id}`: Обновление задачи.
    -   `DELETE /api/TodoItems/{id}`: Удаление задачи.
-   **UsersController**:
    -   `GET /api/Users`: Получение списка пользователей.
    -   `GET /api/Users/{id}`: Получение пользователя по ID.
    -   `POST /api/Users`: Создание нового пользователя.
-   **CategoriesController**:
    -   `GET /api/Categories`: Получение списка категорий.
    -   `GET /api/Categories/{id}`: Получение категории по ID.
    -   `POST /api/Categories`: Создание новой категории.

## Скриншоты

![image](https://github.com/1SERGIO11/_ToDoApi/assets/114675359/67f5cd40-f671-45e7-81d3-5ae8b2715320)
![image](https://github.com/1SERGIO11/_ToDoApi/assets/114675359/1d49aceb-621e-46fd-8b45-1fac2133a34d)
![image](https://github.com/1SERGIO11/_ToDoApi/assets/114675359/20830f45-78e8-4c6f-9805-637f504da2e1)
