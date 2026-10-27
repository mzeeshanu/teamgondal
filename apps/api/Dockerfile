FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY src/TeamGondal.Api/TeamGondal.Api.csproj src/TeamGondal.Api/
RUN dotnet restore src/TeamGondal.Api/TeamGondal.Api.csproj
COPY src/ src/
RUN dotnet publish src/TeamGondal.Api/TeamGondal.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["dotnet", "TeamGondal.Api.dll"]
