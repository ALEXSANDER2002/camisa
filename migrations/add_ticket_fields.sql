-- Adicionar campos de ticket à tabela shirts
ALTER TABLE shirts ADD COLUMN IF NOT EXISTS ticket_type TEXT;
ALTER TABLE shirts ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10, 2);

-- Atualizar o script setup-database para incluir os novos campos
-- Execute esse SQL no painel do Supabase (SQL Editor -> New Query) 