#!/bin/bash

# Configura o usuário do Git
git config --global user.name "Jules Bot"
git config --global user.email "jules@google.com"

# Gera nome único pra branch
BRANCH="jules-auto-$(date +%s)"

# Cria e muda pra nova branch
git checkout -b "$BRANCH"

# Adiciona e commita mudanças
git add .
git commit -m "chore(jules): alterações automáticas feitas no ambiente"

# Faz push da nova branch
git push --set-upstream origin "$BRANCH"

echo "✅ Push feito com sucesso na branch: $BRANCH"
echo "👉 Agora você pode abrir o Pull Request manualmente no GitHub."
