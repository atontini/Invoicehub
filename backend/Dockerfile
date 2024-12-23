# Use the official Python image as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt ./

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . ./

# Expose the port the Flask app runs on
EXPOSE 5000

# Define the command to run the application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
