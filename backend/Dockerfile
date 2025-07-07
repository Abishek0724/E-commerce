# Use lightweight OpenJDK image
FROM openjdk:17-jdk-slim

# Set port (same as in application.properties)
ENV PORT=2424

# Create app directory
WORKDIR /app

# Copy your JAR file into the container
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app runs on
EXPOSE 2424

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
