# ✅ Cat Calendar – Checklist Técnico (atualizado 17/04/2025)

## 🔧 Backend – Lógica e Funcionalidades

- [x] Criar e vincular usuários (`/users`)
- [x] Criar e listar gatos com `user_id`
- [x] Implementar configuração de ração por gato
- [x] Implementar configuração de medicação por gato
- [x] Implementar configuração de areia por usuário
- [x] Conectar tudo ao PostgreSQL com `pool.ts` e `init.ts`
- [x] Lógica de cálculo de ração (por idade, tipo)
- [x] Lógica de medicação (data + duração + frequência)
- [x] Lógica de areia (tipo + caixas + número de gatos)
- [x] Implementar `/calendar/:user_id` para unir eventos

## 🔁 Lógicas de Recorrência

- [x] Criar `generateRecurringDates` para gerar eventos múltiplos
- [x] Aplicar recorrência para **medicação**
- [x] Aplicar recorrência para **ração**
- [x] Aplicar recorrência para **areia**

## 💾 Banco de Dados

- [x] `schema.sql` atualizado com todas as entidades atuais
- [x] Integração entre `cats`, `users`, `foods`, `medications`, `litter_config`
- [x] Adicionar suporte a **vacinas** no banco (tabela `vaccinations`)
- [x] Verificar consistência de `start_date` e `end_date` nos inserts

## 🧰 Utilitários

- [x] `formatDate()`
- [x] `formatCurrency()`
- [x] `formatBoolean()`
- [x] Utilização dos utilitários nos controllers

## 🛡️ Acesso e segurança

- [x] Implementar autenticação (JWT)
- [x] Adicionar middleware de proteção para rotas

## 🧪 Testes e qualidade

- [ ] Criar testes unitários simples com Jest
- [ ] Criar testes de integração por rota

## 🎨 Frontend (futuramente)

- [ ] Exibir calendário com dados retornados da API
- [ ] Permitir cadastro e edição dos dados via UI
- [ ] Adicionar painel de administração (como planejado)
- [ ] Autenticação no front (login/cadastro real)

## ✨ Extras possíveis

- [ ] Exportar calendário como PDF ou ICS
- [ ] Notificações por e-mail ou push
- [ ] Multigato: filtros e relatórios por animal

## 🔁 Voltar para implementar testes com Jest

- [ ] calculateFoodNeeds()
- [ ] calculateMedicationNeeds()
- [ ] middleware de autenticação
- [ ] rotas de integração com Supertest
