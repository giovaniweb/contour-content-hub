#!/bin/bash

# Configura o usuário do Git (caso ainda não esteja setado)
git config --global user.name "Jules Bot"
git config --global user.email "jules@google.com"

# Gera nome único pra branch

# Cria e muda pra nova branch
git checkout -b $BRANCH

# Adiciona e comita mudanças
git add .
git commit -m "chore(jules): alterações automáticas feitas no ambiente"
git push origin $BRANCH

# Cria um pull request automaticamente
gh pr create --base main --head $BRANCH --title="Alterações automáticas do Jules" --body="Esse PR contém ajustes aplicados automaticamente após sugestões do Jules."
