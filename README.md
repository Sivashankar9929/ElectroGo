# ElectroGO

ElectroGO is an ASP.NET Core Razor Pages application built with .NET 8.0.
It uses SQLite for local application data storage and cookie-based authentication for user login flows.

## Features

- Razor Pages web application
- SQLite database using Entity Framework Core
- Cookie-based authentication
- User registration, login, logout, and profile pages
- Local persistence with a SQLite database file

## Requirements

- .NET 8.0 SDK or later
- Windows, macOS, or Linux
- Visual Studio, Visual Studio Code, or another C# editor

## Setup

1. Open the `ElectroGO` project folder in your editor.
2. Restore dependencies and build the app:

```bash
dotnet restore
dotnet build
```

3. Run the application:

```bash
dotnet run
```

4. Open the application in your browser using the URL shown in the console, for example:

```text
https://localhost:5001
http://localhost:5000
```

## Configuration

The default application settings are stored in `appsettings.json`.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=ElectroGO.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Local development

- `appsettings.Development.json` can be used for development-specific settings.
- The local SQLite file `ElectroGO.db` is recommended to remain out of source control.
- `.gitignore` already excludes build artifacts, local settings, and temporary files.

## Database

The SQLite database is created automatically at startup by `ApplicationDbContext` using `db.Database.EnsureCreated()`.

To reset the database, stop the app and delete `ElectroGO.db`.

## Authentication

The app configures cookie authentication in `Program.cs` with these settings:

- Login path: `/Account/Login`
- Logout path: `/Account/Logout`
- Cookie name: `ElectroGOAuth`
- Cookie lifetime: 7 days

## Project structure

- `Program.cs` — application startup and service registration
- `ElectroGO.csproj` — project definition and NuGet packages
- `Data/ApplicationDbContext.cs` — EF Core database context
- `Models/User.cs` — user entity model
- `Pages/Account/` — login, register, logout, and profile pages
- `Pages/` — application pages and shared layout
- `wwwroot/` — static files for CSS, JavaScript, and libraries

## Common commands

```bash
# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Run locally
dotnet run

# Publish for release
dotnet publish -c Release
```

## Notes

- The database file is stored in the project root as `ElectroGO.db`.
- `appsettings.Development.json` is intended for local development settings.
- The SQLite package used is `Microsoft.EntityFrameworkCore.Sqlite` version `8.0.0`.

## License

This repository does not include a license by default. Add a `LICENSE` file if you want to declare project licensing.
