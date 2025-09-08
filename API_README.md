
# API Endpoints

## Authentication
| Method | Endpoint        | Description        | Auth Required |
|--------|-----------------|--------------------|---------------|
| POST   | /auth/register  | Register new user  | No            |
| POST   | /auth/login     | User login         | No            |
| GET    | /auth/profile   | Get user profile   | Yes           |
| POST   | /auth/logout    | User logout        | Yes           |

## Books
| Method | Endpoint                 | Description                         | Auth Required | Role Required |
|--------|--------------------------|-------------------------------------|---------------|---------------|
| GET    | /books/available         | Get available books                 | No            | -             |
| GET    | /books/search?query=...  | Search books                        | No            | -             |
| GET    | /books/all               | Get all books (with borrower info)  | Yes           | Admin         |
| POST   | /books                   | Add new book                        | Yes           | Admin         |
| PUT    | /books/:id/copies        | Update book copies                  | Yes           | Admin         |
| GET    | /books/my-books          | Get user's borrowed books           | Yes           | -             |

## Borrow/Return
| Method | Endpoint     | Description     | Auth Required |
|--------|--------------|-----------------|---------------|
| POST   | /borrow/:id  | Borrow a book   | Yes           |
| POST   | /return/:id  | Return a book   | Yes           |

## Health Check
| Method | Endpoint | Description          |
|--------|----------|----------------------|
| GET    | /health  | Server status check  |
