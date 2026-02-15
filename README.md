# Legacy Migration - Task Manager

## Project Overview

This is a school project focused on modernizing a legacy task management system. The primary objective was to migrate the application from a monolithic architecture to a modern MVC (Model-View-Controller) architecture, separating concerns and improving maintainability, scalability, and code organization.

The project demonstrates the practical application of architectural patterns and modern web development practices, transforming a tightly-coupled monolithic system into a clean, modular application with a clear separation between the backend API and frontend interface.

## Technologies Used

### Backend
- **C# with .NET 10**: Modern backend framework providing robust API capabilities
- **PostgreSQL**: Relational database for data persistence

### Frontend
- **React.js**: Component-based UI library for building interactive user interfaces
- **Tailwind CSS 4**: Utility-first CSS framework for rapid UI development

### Deployment
- **Railway**: Cloud platform for deployment and hosting

## Architecture

The application follows the MVC architectural pattern:

- **Model**: Data entities and business logic (Services, DTOs, Models)
- **View**: React-based frontend components
- **Controller**: API controllers handling HTTP requests and responses

This separation allows for independent development, testing, and scaling of each layer, representing a significant improvement over the original monolithic structure.
