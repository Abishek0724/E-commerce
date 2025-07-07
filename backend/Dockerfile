# === Stage 1: Build the JAR ===
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy everything (source, pom.xml, etc.)
COPY . .

# Build JAR
RUN mvn clean package -DskipTests

# === Stage 2: Run the app ===
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy JAR from the previous stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 2424

# Start app
ENTRYPOINT ["java", "-jar", "app.jar"]
