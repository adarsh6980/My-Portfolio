# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY backend/Portfolio.slnx backend/
COPY backend/src/Portfolio.Api/Portfolio.Api.csproj backend/src/Portfolio.Api/
COPY backend/src/Portfolio.Application/Portfolio.Application.csproj backend/src/Portfolio.Application/
COPY backend/src/Portfolio.Domain/Portfolio.Domain.csproj backend/src/Portfolio.Domain/
COPY backend/src/Portfolio.Infrastructure/Portfolio.Infrastructure.csproj backend/src/Portfolio.Infrastructure/
COPY backend/tests/Portfolio.Tests/Portfolio.Tests.csproj backend/tests/Portfolio.Tests/
RUN dotnet restore backend/Portfolio.slnx

COPY backend/ backend/
RUN dotnet publish backend/src/Portfolio.Api/Portfolio.Api.csproj --configuration Release --no-restore --output /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime

RUN addgroup -S portfolio && adduser -S -G portfolio -h /app portfolio \
    && mkdir -p /app/data \
    && chown -R portfolio:portfolio /app

WORKDIR /app
COPY --from=build --chown=portfolio:portfolio /app/publish ./

ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:5050 \
    DOTNET_RUNNING_IN_CONTAINER=true

USER portfolio
EXPOSE 5050

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5050/health/ready || exit 1

ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
