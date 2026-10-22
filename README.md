# VanillaJS

VanillaJS is a web application for a technology products store. The project
uses a Java Spring Boot backend and a frontend made with HTML, CSS, and
Vanilla JavaScript.

## Project pages

### Page 1: Local products

URL:

```text
http://localhost:8080/products
```

This page shows products stored in a MySQL database.

It includes:

- Product name.
- Product price.
- Product stock.
- Product description.
- Search by name or description.
- Visible product counter.
- Reset button.
- Message when there are no results.

The backend uses Spring Data JPA to read the products. Spring MVC sends the
data to the Thymeleaf template.

### Page 2: Rick and Morty products

URL:

```text
http://localhost:8080/products-1
```

This page uses characters from the public Rick and Morty API. The characters
are shown as product cards.

It includes:

- Search by character name.
- Filter by character status.
- Alive, Dead, and Unknown status options.
- Four-second search delay.
- Product counter.
- Reset button.
- Character image and information.
- Expandable card details.
- Small browser cache for repeated searches.

## Rick and Morty API

The page uses three API endpoints.

### 1. Character endpoint

```text
GET https://rickandmortyapi.com/api/character
```

This is the first request. It returns the characters and links to related
locations and episodes.

### 2. Location endpoint

```text
GET https://rickandmortyapi.com/api/location/{id}
```

This request runs when the user opens a character card. The URL comes from the
character `origin.url` value.

### 3. Episode endpoint

```text
GET https://rickandmortyapi.com/api/episode/{id}
```

This request also runs when the user opens a character card. The URL comes
from the first value in the character `episode` list.

The request flow is:

```text
character
   ├── origin.url  → location
   └── episode[0]  → episode
```

The location and episode requests depend on information returned by the
character request. For this reason, they are nested requests.

## Frontend technologies

### HTML5

HTML defines the page structure, navigation, forms, product cards, messages,
and page sections.

### Vanilla JavaScript

The project uses JavaScript without a frontend framework.

JavaScript handles:

- Local product search.
- Rick and Morty API requests.
- Status filtering.
- Search delay.
- Browser cache.
- Product card details.
- Result counters.
- Reset buttons.

### CSS3

The custom stylesheet defines:

- Product cards.
- Colors.
- Borders.
- Spacing.
- Images.
- Status labels.
- Hover effects.
- Loading and empty-result messages.

### Flexbox

Flexbox is used for:

- Navigation content.
- Search controls.
- Product price and stock rows.
- Character card headers.
- Vertical card layout.

### CSS Grid

CSS Grid organizes the product cards in responsive columns. The page uses
different column counts depending on the screen width.

### Media queries and responsive design

The interface changes its layout for small, medium, and large screens. This
makes the pages usable on computers, tablets, and mobile devices.

### Tailwind CSS

Tailwind CSS is loaded from a CDN. Its utility classes are used for:

- Layout.
- Responsive columns.
- Flexbox rows.
- Spacing.
- Colors.
- Text styles.
- Borders.
- Buttons.

## Backend technologies

- Java 21.
- Spring Boot 4.1.1.
- Spring MVC.
- Spring Data JPA.
- Hibernate.
- Thymeleaf.
- Bean Validation.
- MySQL 8.x.
- Maven Wrapper.

## Project structure

The repository uses a simple monorepo structure. The backend and frontend are
kept in the same repository, but each application has its own responsibility.

```text
BaseProyect/
├── apps/
│   ├── backend/
│   │   ├── pom.xml
│   │   └── src/
│   │       ├── main/java/com/inventory/
│   │       │   ├── controller/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   └── service/
│   │       ├── main/resources/
│   │       │   └── application.properties
│   │       └── test/
│   └── frontend/
│       ├── package.json
│       └── src/main/resources/
│           ├── static/
│           │   ├── css/
│           │   └── js/
│           └── templates/
├── packages/
│   └── api-contract/
├── infra/
├── .github/
│   └── workflows/
├── pom.xml
├── mvnw
└── mvnw.cmd
```

### Backend folder

The backend folder contains:

- Spring Boot application.
- Controllers.
- Services.
- Repositories.
- Product model.
- Database configuration.
- Java tests.

### Frontend folder

The frontend folder contains:

- HTML templates.
- CSS files.
- JavaScript files.
- Frontend package information.

### Packages folder

The packages folder is reserved for shared contracts and reusable code. The
Rick and Morty API is external, so it is not copied into this folder.

## Database configuration

The application uses a local MySQL database with these default values:

```text
Host: localhost
Port: 3306
Database: inventory_db
```

The database username and password are read from environment variables. This
keeps private database information outside the source code.
