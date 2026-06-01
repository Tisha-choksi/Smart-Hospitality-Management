# Use a dual Node.js and Python image
FROM nikolaik/python-nodejs:python3.11-nodejs20

WORKDIR /app

# Copy the entire workspace
COPY . .

# --- SETUP BACKEND ---
WORKDIR /app/backend
RUN npm install
# Generate Prisma client
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate

# --- SETUP AI SERVICES ---
WORKDIR /app/ai-services
RUN pip install --no-cache-dir -r requirements.txt

# --- ROOT SETUP ---
WORKDIR /app
# Make start.sh executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Render uses port 10000 by default
EXPOSE 10000

CMD ["/app/start.sh"]
