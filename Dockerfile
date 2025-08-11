# ---- Build stage ----
FROM gradle:8.10.2-jdk21-alpine AS build
WORKDIR /workspace
# copy only backend to keep context small
COPY backend/ ./backend/
WORKDIR /workspace/backend
RUN gradle clean bootJar -x test

# ---- Run stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/backend/build/libs/app.jar /app/app.jar

# Render provides PORT; pass it to Spring Boot
ENV PORT=8080
EXPOSE 8080
CMD ["sh","-c","java -Dserver.port=${PORT} -jar /app/app.jar"]
