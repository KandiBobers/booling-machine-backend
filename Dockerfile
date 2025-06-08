# Используем официальный образ Node.js
FROM node:20-alpine AS builder

# Создаем рабочую директорию
WORKDIR /app

# 1. Копируем файлы конфигурации
COPY package*.json ./
COPY tsconfig.json ./

# 2. Устанавливаем зависимости
RUN npm install

# 3. Копируем ВСЕ исходные файлы (включая миграции)
COPY src ./src

# 4. Компилируем TypeScript
RUN npm run build

# Финальный образ
FROM node:20-alpine

WORKDIR /app

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Копируем только необходимые файлы из builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env ./

# Открываем порт
EXPOSE 3000

# Команда запуска с проверкой миграций
CMD ["node", "dist/server.js"]