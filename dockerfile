# Stage 1: Build frontend
FROM node:22 AS frontend-build
WORKDIR /app
COPY package*.json ./
COPY webpack.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src ./src
RUN npm install
RUN npm run build

# Stage 2: Build backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /app
COPY backend ./
RUN dotnet publish -c Release -o out

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=backend-build /app/out .
COPY --from=frontend-build /app/backend/wwwroot ./wwwroot
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Template_API.dll"]