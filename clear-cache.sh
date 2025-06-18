#!/bin/bash

echo "🧹 Limpando cache do projeto..."

rm -rf node_modules/.vite
rm -rf .turbo
rm -rf dist
rm -rf .next
rm -rf .cache

echo "✅ Cache limpo com sucesso."
