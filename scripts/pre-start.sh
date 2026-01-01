#!/bin/bash

echo "🚀 Running pre-start tasks..."

echo "📦 Running database migrations..."
pnpm db:migrate 2>&1 | grep -v "already exists" || {
  echo "⚠️  Migration may have already been applied. Continuing..."
}

echo "🌱 Running database seeds..."
pnpm db:seed

echo "✅ Pre-start tasks completed!"
