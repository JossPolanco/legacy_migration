# Template API - Guía de Ejecución

## Requisitos

- **.NET 10 SDK** instalado
- **SQL Server** (Local o remoto)
- **Visual Studio 2022** (versión Community, Professional o Enterprise)

## Configuración Inicial

### 1. Base de Datos
Asegúrate de que SQL Server está corriendo. La cadena de conexión en `appsettings.json` utiliza:
```
Server=.;Database=project_template_scharp;Trusted_Connection=True;TrustServerCertificate=True;
```

Si necesitas cambiar el servidor o autenticación, edita el archivo `appsettings.json`.

### 2. Restaurar Dependencias
```powershell
dotnet restore
```

### 3. Aplicar Migraciones (si es necesario)
```powershell
dotnet ef database update
```

## Ejecutar en Visual Studio

1. Abre `Template_API.slnx` en Visual Studio
2. Presiona `F5` o ve a **Debug > Iniciar depuración**
3. La aplicación se ejecutará en `https://localhost:7067`

## Ejecutar desde Terminal

```powershell
dotnet run
```

O con watch mode (recompila automáticamente):
```powershell
dotnet watch run
```

## Acceder a la API

- **Swagger UI**: https://localhost:7067/swagger/index.html
- **OpenAPI JSON**: https://localhost:7067/openapi/v1.json

## Estructura del Proyecto

```
backend/
├── Controllers/          # Endpoints de la API
├── Models/              # Entidades y DbContext
├── Services/            # Lógica de negocio
├── Interfaces/          # Contratos de servicios
├── DTOs/                # Data Transfer Objects
├── Properties/          # Configuración de lanzamiento
├── appsettings.json     # Configuración
└── Program.cs           # Configuración de la aplicación
```

## Troubleshooting

### Error: "Cannot connect to database"
- Verifica que SQL Server está corriendo
- Confirma la cadena de conexión en `appsettings.json`

### Error: "The project file cannot be opened"
- Asegúrate de estar en el directorio `backend/`
- Verifica que `Template_API.slnx` apunta correctamente al `Template_API.csproj`

### CORS Issues
Si el frontend no puede conectarse a la API, verifica que CORS está habilitado en `Program.cs`. La configuración actual permite todos los orígenes en desarrollo.
