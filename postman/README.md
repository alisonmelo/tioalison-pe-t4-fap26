# 📮 Guia de Testes de API com Postman - LojaQA

> **Programa FAP 2026 - Turma 4 | Teste de Software**  
> **Orientador:** Prof. Alison Melo  
> **Arquivos Inclusos:** Coleção Postman v2.1 + Ambientes Nuvem (Render) e Local.

---

## 🚀 1. Como Importar no Postman

1. Abra o **Postman**;
2. No canto superior esquerdo, clique no botão **"Import"**;
3. Arraste ou selecione os arquivos desta pasta:
   * 📁 `LojaQA.postman_collection.json` (A coleção completa de requisições organizadas por módulos)
   * 🌍 `LojaQA-Nuvem.postman_environment.json` (Ambiente configurado para `https://api-qa-fap2026.onrender.com/api`)
   * 💻 `LojaQA-Local.postman_environment.json` (Ambiente configurado para `http://localhost:3000/api`)
4. No canto superior direito do Postman, no seletor de ambientes (*Environments*), selecione **"LojaQA - Nuvem (Render)"** ou **"LojaQA - Local"**.

---

## 🔑 2. Fluxo Automático de Autenticação (Token JWT)

Você **não precisa copiar e colar o Token JWT manualmente**!

1. Abra a pasta **`02. Autenticação & Gestão de Acessos`**;
2. Execute uma das requisições de login:
   * `Login como Cliente (user@system.com)`
   * `Login como Lojista (lojista@system.com)`
   * `Login como Admin (admin@system.com)`
3. O script da aba **Tests** captura o token retornado e o armazena automaticamente na variável de ambiente correspondente (`tokenCliente`, `tokenLojista` ou `tokenAdmin`) e na variável global `{{token}}`.
4. Todas as rotas fechadas da coleção já estão configuradas com `Authorization: Bearer {{token}}`.

---

## ⚠️ 3. Aviso Importante sobre os Métodos `DELETE` (Hard Delete Pedagógico)

> [!WARNING]
> ### 🎓 Por que o DELETE está presente na coleção?
> Ele foi disponibilizado para que vocês aprendam o ciclo completo de automação em QA (**CRUD + Teardown**). Em testes automatizados, é boa prática criar a massa no início do teste e limpá-la no final para não poluir o banco.
> 
> ### 🏢 Por que sistemas reais quase NUNCA usam Hard Delete?
> Em produção, apagar registros fisicamente gera **inconsistências graves** (ex: pedidos fiscais antigos ficam com produto ou cliente inexistente, quebrando notas fiscais e relatórios contábeis). Sistemas reais usam **Soft Delete** (`active: false` ou `role: 'blocked'`).
>
> ### 🛡️ Travas de Proteção da Turma:
> Para garantir que nenhum aluno apague acidentalmente a massa de testes dos colegas no Render:
> * A API bloqueia a exclusão dos dados padrão (`admin@system.com`, `user@system.com`, `Teclado Mecânico Aurora`) retornando **`403 Forbidden`**;
> * A API bloqueia a exclusão de itens que já possuem pedidos vinculados retornando **`409 Conflict`**.

---

## 🕵️‍♂️ 4. Roteiro Sugerido para Testes Exploratórios de API

Explore a pasta **`07. Laboratório de Testes Exploratórios & Segurança`**:

1. **Heurística de Autenticação & Bloqueio:**
   * Tente logar com `blocked@system.com`. A API deve responder `403 Forbidden` com `"Usuário bloqueado."`.
2. **Heurística de Latência & Concorrência:**
   * Logue com `slow@system.com`. Observe o tempo de resposta (~1.8s) e analise se a aplicação aguarda a resposta sem disparar requisições duplicadas.
3. **Análise de Valor Limite (BVA):**
   * Cadastre senhas com 7 caracteres (deve falhar com `400 Bad Request`);
   * Cadastre senhas com 26 caracteres (deve falhar com `400 Bad Request`);
   * Cadastre produtos com preço `-10` ou estoque `-1` (a API deve rejeitar).
4. **Heurística de Integridade Referencial:**
   * Crie um produto novo com o lojista (`POST /seller/products`);
   * Faça um pedido de compra desse produto com o cliente (`POST /orders`);
   * Tente deletar esse produto com o lojista (`DELETE /seller/products/:id`). Observe que a API retorna **`409 Conflict`**, impedindo a corrupção do histórico de vendas!
5. **Heurística de Teardown Limpo:**
   * Crie um produto novo;
   * Sem criar nenhum pedido para ele, execute o `DELETE /seller/products/:id`. O produto será excluído com **`200 OK`**.

