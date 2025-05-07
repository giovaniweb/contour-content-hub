
#!/bin/bash

echo "🔐 Configurando variáveis de ambiente para integração com o Vimeo..."

# Solicita as credenciais de forma segura
read -p "Informe o VIMEO_CLIENT_ID: " CLIENT_ID
read -s -p "Informe o VIMEO_CLIENT_SECRET: " CLIENT_SECRET
echo ""
read -p "Informe o VIMEO_REDIRECT_URI [default: https://fluida.online/auth/vimeo/callback]: " REDIRECT_URI

# Define valor padrão se não informado
REDIRECT_URI=${REDIRECT_URI:-https://fluida.online/auth/vimeo/callback}

# Define os secrets no Supabase
echo "🔑 Configurando secrets no Supabase..."
supabase functions secrets set VIMEO_CLIENT_ID=$CLIENT_ID
supabase functions secrets set VIMEO_CLIENT_SECRET=$CLIENT_SECRET
supabase functions secrets set VIMEO_REDIRECT_URI=$REDIRECT_URI

# Faz o deploy das funções relevantes
echo "🚀 Deploy das funções..."
supabase functions deploy vimeo-oauth-start
supabase functions deploy vimeo-oauth-callback
supabase functions deploy vimeo-status-check
supabase functions deploy vimeo-direct-test
supabase functions deploy vimeo-test-connection

# Verificar se os secrets foram configurados corretamente
echo "✅ Verificando a configuração..."
supabase functions secrets list | grep -E 'VIMEO_(CLIENT_ID|CLIENT_SECRET|REDIRECT_URI)'

echo "✅ Pronto! Agora volte ao painel e clique em 'Verificar novamente'."
