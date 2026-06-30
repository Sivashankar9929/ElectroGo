# ---- Build stage (full SDK, discarded after) ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ElectroGO.csproj", "./"]
COPY ["nuget.config", "./"]
RUN dotnet restore "ElectroGO.csproj"
COPY . .
RUN dotnet publish "ElectroGO.csproj" -c Release -o /app/publish --no-restore /p:UseAppHost=false

# ---- Runtime stage (small image, this ships) ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "ElectroGO.dll"]
