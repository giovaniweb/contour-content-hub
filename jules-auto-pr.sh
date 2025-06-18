#!/bin/bash

git config --global user.name "Jules Bot"
git config --global user.email "jules@google.com"

BRANCH="jules-auto-$(date +%s)"

git checkout -b "$BRANCH"
git add .
git commit -m "chore(jules): alterações automáticas feitas no ambiente"
git push origin "$BRANCH"

gh pr create --base main --head "$BRANCH" --title 'Alterações automáticas do Jules' --body 'Esse PR contém ajustes aplicados automaticamente após sugestões do Jules.'
