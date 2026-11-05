# 📚 Projeto LojaQA - Especificação de Requisitos, Critérios de Aceite & Guia Oficial de QA

> **Ambiente Pedagógico de Qualidade e Testes de Software**  
> **Programa FAP 2026 - Turma 4 | Teste de Software**  
> **Projeto Final - Módulo 01 (Unidade 08) — Versão 3.0 Final**  
> **Orientador:** Prof. Alison Melo  
> **Evolução do Sistema:** Evolução da antiga Versão 2.0 (Sistema de Login/Cadastro) para a **Versão 3.0 Final (Plataforma Completa de E-commerce Multi-Perfil LojaQA)**.

---

## 1. Contextualização do Sistema (Visão de Negócio & Evolução)

* **Nome do Sistema:** LojaQA E-commerce Marketplace (Versão 3.0)
* **Histórico de Evolução:** O sistema que na Versão 2.0 era apenas um módulo de autenticação e gestão de usuários agora evoluiu para uma plataforma completa de comércio eletrônico.
* **Escopo de Regressão Obrigatória:** Todas as regras da Versão 2.0 (Login com bloqueio por tentativas, Cadastro com e-mail único, Esqueci a Senha, Logout Seguro e Route Guards) devem ser retestadas para garantir que a chegada do e-commerce não introduziu efeitos colaterais.
* **Escopo de Novas Funcionalidades (V3.0):**
  * **Vitrine Pública & Catálogo (`loja.html`):** Busca em tempo real, filtros combinados de categoria/preço e controle visual de esgotados;
  * **Carrinho Drawer:** Persistência no `localStorage`, controle dinâmico de estoque e recalculo instantâneo de subtotal;
  * **Checkout Dedicado (`checkout.html`):** Consulta automática ao **ViaCEP**, validação matemática de CPF por **Módulo 11**, cupons de desconto, regras de frete regional e simulações financeiras (Cartão, PIX 5% OFF e Boleto);
  * **Painéis Multi-Perfil RBAC (`painel.html`):** Gestão de pedidos e rastreio para Clientes, gestão de estoque exclusiva para Lojistas (*Multi-Tenancy*) e moderação global para Administradores.

---

## 2. Perfis de Usuário e Matriz de Permissões (RBAC)

| Perfil | Descrição | Permissão de Compra | Gestão de Catálogo | Gestão Administrativa |
|---|---|---|---|---|
| `user` (Cliente) | Consumidor da loja | **Sim** (carrinho, checkout, cálculo de frete e histórico de pedidos) | **Não** | **Não** (apenas o próprio perfil) |
| `seller` (Lojista) | Vendedor parceiro da plataforma | **Não** (apenas visualiza a vitrine como vitrine de catálogo) | **Sim** (cadastra/edita apenas produtos da sua própria loja) | **Não** (apenas pedidos contendo produtos da sua loja) |
| `admin` (Administrador) | Gestor global do sistema | **Não** (apenas visualiza a vitrine em modo de auditoria) | **Sim** (audita e gerencia todos os produtos de todas as lojas) | **Sim** (gestão de usuários, lojas, pedidos e métricas) |
| `blocked` (Bloqueado) | Usuário com credenciais suspensas | **Não** (acesso bloqueado) | **Não** (acesso bloqueado) | **Não** (acesso bloqueado pela API e frontend) |

---

## 3. Análise de Riscos e Impactos de Negócio

| Área de Risco | Possível Defeito Crítico | Impacto para o Usuário | Impacto para o Negócio | Relação Custo do Defeito |
|---|---|---|---|---|
| **Financeiro / Checkout** | Cupom zerando o subtotal ou cálculo divergente | Cobrança indevida ou compra gratuita não autorizada | Prejuízo financeiro direto e perda de margem | **Crítico:** Descoberto em produção gera dano imediato |
| **Documentação / Fraude** | Aceitação de CPF inválido ou repetido | Usuário cadastra dados falsos sem auditoria | Invalidação fiscal e risco de estorno/fraude | **Alto:** Dificulta faturamento e entrega |
| **Logística / Entrega** | Erro de cálculo de CEP/Frete | Prazo não cumprido ou frete cobrado a menor | Prejuízo com transportadora e insatisfação | **Médio/Alto:** Custo de suporte e devolução |
| **Segurança / Multi-Tenancy**| Lojista adulterando produtos de concorrentes | Dados de outra loja expostos | Quebra de contrato e vazamento de dados | **Crítico:** Risco jurídico e reputacional |

---

## 4. Massa de Dados e Credenciais para Testes QA

### 👤 Usuários de Teste

| Perfil | Loja / Identificação | E-mail | Senha | Objetivo do Teste |
|---|---|---|---|---|
| **Admin** | Painel Geral | `admin@system.com` | `AdminPassword123` | Moderação global, alteração de perfis e auditoria de produtos |
| **Cliente** | Consumidor | `user@system.com` | `UserPassword123` | Fluxo de compra, carrinho, checkout e histórico |
| **Lojista 1** | Vitrine Tech | `lojista@system.com` | `SellerPass123` | Gestão de estoque/catálogo: Periféricos, Cadeiras & Acessórios |
| **Lojista 2** | Arena Gamer Store | `lojistagamer@system.com` | `SellerPass123` | Gestão de estoque/catálogo: Monitores, Áudio Gamer & SSD |
| **Lojista 3** | Studio Pro Design | `lojistadesign@system.com` | `SellerPass123` | Gestão de estoque/catálogo: Microfones, Webcams & Ergonomia |
| **Bloqueado** | Usuário Inativo | `blocked@system.com` | `Blocked123` | Validação de bloqueio de acesso e mensagens de segurança |
| **Lento** | Usuário Simulação | `slow@system.com` | `SlowPass123` | Teste de latência artificial (3s), feedback visual e carga |

### 📦 Catálogo Oficial de Produtos (12 Itens em 6 Categorias)

| # | Produto | Categoria | Preço | Estoque | Lojista Parceiro | Cenário Especial QA |
|---|---|---|---|---|---|---|
| 01 | **Teclado Mecânico Aurora RGB** | Periféricos | R$ 289,90 | 18 un | Vitrine Tech | Produto popular, valor intermediário |
| 02 | **Mouse Óptico Atlas Pro 16000 DPI** | Periféricos | R$ 149,90 | 35 un | Vitrine Tech | Alto volume de estoque |
| 03 | **Headset Gamer Nexo 7.1 Surround** | Áudio | R$ 219,90 | 14 un | Arena Gamer Store | Categoria Áudio Gamer |
| 04 | **Monitor Gamer Curvo UltraWide 29" IPS** | Monitores | R$ 1.399,00 | 8 un | Arena Gamer Store | Ticket alto, frete e cupons |
| 05 | **Microfone Condensador USB Podcast Studio** | Áudio | R$ 329,90 | 10 un | Studio Pro Design | Equipamento para streaming/gravação |
| 06 | **Webcam StreamCam 1080p 60FPS Full HD** | Acessórios | R$ 399,90 | 4 un | Studio Pro Design | **Estoque baixo** (badge de alerta) |
| 07 | **Cadeira Ergonômica Mesh ErgoTech** | Cadeiras & Ergonomia | R$ 899,90 | 6 un | Vitrine Tech | Ticket médio/alto, conformidade NR17 |
| 08 | **SSD NVMe M.2 1TB Gen4 UltraSpeed** | Hardware & Armazenamento | R$ 449,90 | 20 un | Arena Gamer Store | Categoria Hardware |
| 09 | **Mousepad Gamer Speed Extra Grande (90x40cm)** | Acessórios | R$ 79,90 | 50 un | Vitrine Tech | Menor valor unitário do catálogo |
| 10 | **Suporte Articulado a Gás para 2 Monitores** | Cadeiras & Ergonomia | R$ 269,90 | **0 un** | Studio Pro Design | **Esgotado proposital** (validação de botão disabled e badge vermelho) |
| 11 | **Caixa de Som Soundbar Desktop RGB Bluetooth** | Áudio | R$ 169,90 | 15 un | Arena Gamer Store | Categoria Áudio / Som |
| 12 | **Hub Adaptador USB-C 8 em 1 4K HDMI PD 100W** | Acessórios | R$ 189,90 | 22 un | Studio Pro Design | Periférico universal |

### 🎟️ Cupons de Teste

| Código do Cupom | Tipo de Benefício | Regra de Aplicação |
|---|---|---|
| `QA10` | 10% OFF | Aplicado sobre o subtotal dos produtos |
| `QA20` | 20% OFF | Aplicado sobre o subtotal dos produtos |
| `FRETEGRATIS` | Frete Grátis | Zera o valor do frete na modalidade PAC |
| `ALUNOQA` | R$ 30,00 OFF | Desconto fixo de R$ 30,00 no total |

### 📍 CEPs de Referência para Testes de Frete e ViaCEP

| CEP | Localidade / UF | Região | Frete PAC Esperado | Prazo Estimado |
|---|---|---|---|---|
| `01310-100` | São Paulo - SP | Sudeste | R$ 16,90 | 3 a 5 dias úteis |
| `80010-000` | Curitiba - PR | Sul | R$ 22,90 | 5 a 8 dias úteis |
| `50010-000` | Recife - PE | Nordeste | R$ 27,90 | 7 a 10 dias úteis |
| `69005-000` | Manaus - AM | Norte | R$ 34,90 | 10 a 15 dias úteis |
| `00000-000` | Inválido | Inexistente | Erro controlado | "CEP não encontrado" |

### 🔢 CPFs para Testes de Algoritmo Módulo 11

| CPF de Teste | Validade | Comportamento Esperado |
|---|---|---|
| `111.444.777-35` | ✅ Válido | Badge verde "CPF Válido" e avanço liberado |
| `529.982.247-25` | ✅ Válido | Badge verde "CPF Válido" e avanço liberado |
| `123.456.789-00` | ❌ Inválido | Badge vermelho "CPF Inválido" (dígito verificador incorreto) |
| `111.111.111-11` | ❌ Inválido | Rejeitado por dígitos repetidos |

---

## 5. Critérios de Aceite por Módulo (Base para os seus CTs)

### 📦 Módulo 1: Catálogo & Vitrine Pública (`loja.html`)
* **CA-CAT-01:** Visitantes não autenticados devem conseguir visualizar todos os produtos com status ativo.
* **CA-CAT-02:** Cada card deve exibir imagem, nome, código identificador (`#PROD-...`), categoria, badge da loja parceira, preço formatado em `R$` e badge de estoque.
* **CA-CAT-03:** A busca em tempo real deve filtrar produtos por correspondência parcial no nome ou na descrição.
* **CA-CAT-04:** Quando uma busca não retornar resultados, exibir mensagem amigável de estado vazio (*empty state*).
* **CA-CAT-05:** Os filtros de categoria e preço máximo devem operar de forma combinada e instantânea (incluindo valores iguais ao limite).
* **CA-CAT-06:** Produtos com estoque zero (`stock: 0`) devem exibir badge vermelho `"Esgotado"` e botão desabilitado.

### 🛒 Módulo 2: Carrinho de Compras Drawer
* **CA-CAR-01:** Visitante deve conseguir adicionar produtos ao carrinho sem login prévio.
* **CA-CAR-02:** O carrinho deve persistir no `localStorage`, sobrevivendo a recarregamentos de página (`F5`).
* **CA-CAR-03:** A quantidade no carrinho não pode ultrapassar o limite disponível em estoque no momento.
* **CA-CAR-04:** Ao decrementar a quantidade para zero, o item deve ser removido do carrinho.
* **CA-CAR-05:** O subtotal do carrinho deve ser recalculado automaticamente a cada alteração.

### 🔐 Módulo 3: Autenticação, Autorização e Sessão (RBAC)
* **CA-AUTH-01:** Senhas devem ter obrigatoriamente entre **8 e 25 caracteres**.
* **CA-AUTH-02:** Bloqueio temporário após 3 falhas consecutivas de login por 1 minuto.
* **CA-AUTH-03:** Usuários com perfil `blocked` não devem conseguir autenticar.
* **CA-AUTH-04:** Tentativa de compra sem login deve redirecionar para `login.html?return=checkout` e retornar após sucesso.
* **CA-AUTH-05:** Usuários logados como `seller` ou `admin` **não podem realizar compras**.
* **CA-AUTH-06:** Logout deve limpar o `localStorage` e o botão "Voltar" não pode reabrir o painel.

### 💳 Módulo 4: Checkout Dedicado (`checkout.html`)
* **CA-CHK-01:** CPF deve formatar máscara e validar dígitos verificadores por **Módulo 11** com rejeição de repetidos.
* **CA-CHK-02:** CEP deve consultar o **ViaCEP** e auto-preencher Logradouro, Bairro, Cidade e UF ao digitar 8 números.
* **CA-CHK-03:** Opções de frete (PAC, SEDEX, Retirada) devem refletir prazos e valores da região do CEP.
* **CA-CHK-04:** Compras $\ge$ R$ 250,00 recebem Frete Grátis automático na modalidade PAC.
* **CA-CHK-05:** Cupom deve validar códigos (`QA10`, `QA20`, `FRETEGRATIS`, `ALUNOQA`) e recalcular valores com exatidão matemática.
* **CA-CHK-06:** Pagamento via PIX aplica **5% de desconto** no subtotal e gera código Copia e Cola.
* **CA-CHK-07:** Pagamento com Cartão identifica bandeira e valida data de validade futura (`MM/AA`) e CVV.
* **CA-CHK-08:** Confirmação cria pedido na API (`POST /api/orders`), baixa estoque, limpa carrinho e redireciona para o modal com rastreio.

### 📊 Módulo 5: Painéis de Gestão (`painel.html`)
* **CA-PNL-01 (Cliente):** Visualização de pedidos, timeline de rastreio e botão de impressão de comprovante.
* **CA-PNL-02 (Lojista):** Cadastrar, editar e excluir **exclusivamente** os produtos pertencentes à sua loja (*Multi-Tenancy*), respeitando as travas de integridade de vendas.
* **CA-PNL-03 (Admin):** Gestão global de usuários, alteração de perfis com senha de admin, moderação geral e exclusão de contas com confirmação de senha administrativa.

---

## 6. Técnicas de Teste de Caixa-Preta (Aplicação Prática)

Os alunos devem aplicar as técnicas clássicas de teste de software para derivar seus Casos de Teste:

### 1️⃣ Particionamento de Equivalência (EP - Equivalence Partitioning)
* **Campo Senha (8 a 25 caracteres):**
  * *Classe Válida:* `8 a 25 caracteres` (ex: `Senha1234`)
  * *Classe Inválida 1:* `< 8 caracteres` (ex: `1234567`)
  * *Classe Inválida 2:* `> 25 caracteres` (ex: `12345678901234567890123456`)
* **Campo CPF:**
  * *Classe Válida:* CPF oficial com dígitos verificadores corretos.
  * *Classe Inválida:* CPF com 11 dígitos repetidos (`111.111.111-11`) ou dígitos incorretos.

### 2️⃣ Análise de Valor Limite (BVA - Boundary Value Analysis)
* **Estoque de Produto ($N$ unidades disponíveis):**
  * *Limite Inferior:* $0$ (Produto esgotado - Botão desabilitado).
  * *Limite Mínimo Válido:* $1$ unidade no carrinho.
  * *Limite Máximo Válido:* $N$ unidades no carrinho.
  * *Limite Inválido Acima:* $N + 1$ unidades no carrinho (Bloqueio com mensagem de estoque insuficiente).
* **Filtro de Preço Máximo:**
  * Testar o valor exatamente igual ao preço do produto (ex: R$ 150,00 no slider para produto de R$ 150,00).

### 3️⃣ Transição de Estados (State Transition Testing)
* **Ciclo de Vida do Pedido:**
  ```text
  [Carrinho] ──> [Checkout] ──> [Aprovado] ──> [Em Preparação] ──> [A Caminho] ──> [Entregue]
  ```
* Testar a progressão visual do Stepper de Rastreamento no modal conforme o status do pedido evolui.

---

## 7. Heurísticas de Testes Exploratórios (Guia Prático)

Para as **Sessões de Testes Exploratórios**, utilize as seguintes heurísticas consagradas de QA:

1. **Heurística CRUD (Create, Read, Update, Delete):**
   * Testar criação de produto pelo lojista, visualização na vitrine, edição de preço/estoque e exclusão/desativação.
2. **Heurística Goldilocks (Muito pequeno, Muito grande, Na medida):**
   * Inserir nomes com 1 caractere, 50 caracteres e 100 caracteres;
   * Compras de R$ 1,00, R$ 250,00 (limiar de frete grátis) e R$ 10.000,00.
3. **Heurística de Interrupção / Navegação Destrutiva:**
   * Clicar no botão "Voltar" do navegador após finalizar compra ou após logout;
   * Recarregar a página (`F5`) no meio do preenchimento do checkout.
4. **Heurística de Concorrência & Latência:**
   * Utilizar o usuário `slow@system.com` e clicar múltiplas vezes seguidas no botão de submit para verificar prevenção de cliques duplos (*Double Submit*).
5. **Heurística de Acessibilidade & Contraste (WCAG):**
   * Inspecionar legibilidade de badges, contrastes de cores de botões e navegação via teclado (`Tab`).

---

## 8. Exemplo de BDD / Gherkin vs Caso de Teste Tradicional

### 📝 Abordagem Tradicional (Caso de Teste Clássico)
```text
ID: CT-CHK-05
Título: Aplicar cupom de desconto percentual QA10 no checkout
Pré-condição: Carrinho com subtotal de R$ 200,00 e usuário autenticado no checkout
Passos:
  1. Digitar "QA10" no campo de cupom.
  2. Clicar no botão "Aplicar".
Resultado Esperado: O sistema exibe mensagem de sucesso, aplica 10% de desconto (- R$ 20,00) e recalcula o total final.
```

### 🥒 Abordagem BDD (Gherkin)
```gherkin
Funcionalidade: Aplicação de Cupons Promocionais no Checkout
  Como um cliente da LojaQA
  Eu quero aplicar um cupom de desconto válido
  Para reduzir o valor final da minha compra

  Cenário: Aplicação bem-sucedida de cupom de 10% de desconto
    Dado que estou na página de checkout com subtotal de "R$ 200,00"
    Quando eu informo o código de cupom "QA10"
    E clico no botão "Aplicar"
    Então o sistema deve exibir a mensagem "Cupom QA10 (-10%) ativado!"
    E o valor do desconto deve ser de "R$ 20,00"
    E o total final deve ser recalculado para "R$ 180,00" mais o frete

  Cenário: Tentativa de aplicação de cupom inexistente
    Dado que estou na página de checkout
    Quando eu informo o código de cupom "CUPOM_INVALIDO_999"
    E clico no botão "Aplicar"
    Então o sistema deve exibir o alerta "Cupom inválido"
    E nenhum desconto deve ser aplicado ao total
```

---

## 9. Ciclos e Níveis de Teste

| Ciclo | Objetivo | Foco na LojaQA |
|---|---|---|
| **Smoke Test (Teste de Fumaça)** | Validar a estabilidade básica dos fluxos críticos | Login com sucesso, carregamento da vitrine, adição de item e acesso ao checkout. |
| **Sanity Test (Teste de Sanidade)** | Validar rapidamente uma funcionalidade específica após ajuste | Validação do cálculo de frete após troca de CEP ou aplicação de cupom. |
| **Regression Test (Teste de Regressão)** | Garantir que correções não geraram efeitos colaterais | Execução completa da suíte cobrindo todos os fluxos de ponta a ponta. |

---

## 10. Manual vs Automatizável (Decisão de Automação / ROI)

| Cenário de Teste | Tipo Recomendado | Justificativa Técnica |
|---|---|---|
| Login com credenciais válidas / inválidas | **Automatizável (E2E / API)** | Alto volume de repetição e caminho crítico de regressão. |
| Cálculo de frete e validação de CPF | **Automatizável (Unitário / API)** | Lógica determinística e regras matemáticas com baixo custo de automação. |
| Usabilidade visual e acessibilidade de cores | **Manual (Exploratório)** | Depende de julgamento humano, percepção visual e testes de experiência. |
| Fluxo completo de compra (End-to-End) | **Automatizável (Cypress / Playwright)** | Teste crítico de fumaça e regressão contínua para pipelines de CI/CD. |

---

## 11. Documentação da API REST para Testes de Integração & Postman

> **🌐 Base URL Oficial (Nuvem / Render):** `https://api-qa-fap2026.onrender.com/api`  
> **💻 Base URL Local (Caso execute o backend na sua máquina):** `http://localhost:3000/api`  
> **Formato das Mensagens:** `Content-Type: application/json`  
> **Contrato OpenAPI 3.0 (YAML Oficial):** Arquivo [`openapi.yaml`](openapi.yaml) (ou [`projetos-base/api-backend/openapi.yaml`](projetos-base/api-backend/openapi.yaml)).  
> **Coleção & Ambientes do Postman:** Disponíveis na pasta [`postman/`](postman/) ([Guia Postman](postman/README.md), [Coleção JSON](postman/LojaQA.postman_collection.json), [Ambiente Nuvem](postman/LojaQA-Nuvem.postman_environment.json) e [Ambiente Local](postman/LojaQA-Local.postman_environment.json)).

> [!WARNING]
> ### ⚠️ AVISO CRÍTICO DE ARQUITETURA & SEGURANÇA SOBRE OS MÉTODOS `DELETE`
> **CARÁTER ESTRITAMENTE PEDAGÓGICO PARA AUTOMAÇÃO COM PLAYWRIGHT (TEARDOWN):**
> 1. **Por que o método `DELETE` existe nesta API?**  
>    Ele está habilitado **exclusivamente para fins didáticos** nas aulas de automação de testes de API com Playwright, Cypress e Postman, permitindo exercitar o ciclo de vida completo do CRUD e o conceito de **Teardown** (o teste cria uma massa com `POST` e a apaga ao final com `DELETE` para manter os testes isolados e limpos).
> 2. **Por que o `DELETE` físico é evitado e quase nunca ativado em sistemas reais de produção?**  
>    Em empresas e plataformas reais de e-commerce, o **Hard Delete (exclusão física) é proibido** por causar:
>    - **Inconsistência de Dados & Registros Órfãos:** Excluir produtos ou clientes que já compraram destrói a integridade dos pedidos passados (`Order`), quebrando relatórios contábeis, notas fiscais e auditorias fiscais;
>    - **Segurança & Fraude:** Evita que usuários mal-intencionados, invasores ou erros operacionais apaguem cadastros, produtos ou históricos legítimos;
>    - **Soft Delete como Padrão de Mercado:** Em produção, utiliza-se **desativação lógica** (`active: false` para produtos e `role: 'blocked'` para usuários suspensos).
> 3. **Travas Anti-Caos da API do Curso:**  
>    Para permitir que toda a turma teste junta sem um aluno quebrar o teste dos outros, o backend rejeita tentativas de excluir os dados do seed com **`403 Forbidden`** e dados que possuem pedidos com **`409 Conflict`**.

---

### 📋 Matriz de Endpoints, Autenticação e Perfis (RBAC)

| Método | Rota | Autenticação Obrigatória? | Perfil Mínimo | Objetivo / Operação |
|---|---|:---:|---|---|
| `GET` | `/api/health` | ❌ Pública | Qualquer | Verificação de status e versão da API |
| `POST` | `/api/login` | ❌ Pública | Qualquer | Autenticação e emissão do Token JWT (Rate Limit: 5/15min) |
| `POST` | `/api/register` | ❌ Pública | Qualquer | Cadastro de novos clientes (`user`) ou lojistas (`seller`) |
| `POST` | `/api/forgot-password`| ❌ Pública | Qualquer | Solicitação de link de recuperação de senha por e-mail |
| `POST` | `/api/reset-password` | ❌ Pública | Qualquer | Aplicação de nova senha com token recebido por e-mail |
| `GET` | `/api/products` | ❌ Pública | Qualquer | Catálogo de produtos ativos com busca e filtros |
| `GET` | `/api/products/categories`| ❌ Pública | Qualquer | Lista de categorias ativas na vitrine |
| `POST` | `/api/orders` | 🔒 **Sim (Token JWT)** | `user`, `seller`, `admin` | Criação de pedido de compra e baixa no estoque |
| `GET` | `/api/orders/me` | 🔒 **Sim (Token JWT)** | `user`, `seller`, `admin` | Histórico dos pedidos realizados pelo usuário logado |
| `GET` | `/api/seller/products` | 🔒 **Sim (Token JWT)** | `seller` ou `admin` | Listagem dos produtos pertencentes à loja do lojista |
| `POST` | `/api/seller/products` | 🔒 **Sim (Token JWT)** | `seller` ou `admin` | Cadastro de novo produto para a loja |
| `PUT` | `/api/seller/products/:id` | 🔒 **Sim (Token JWT)** | `seller` ou `admin` | Edição de produto ou desativação (*Soft Delete* via `active: false`) |
| `DELETE`| `/api/seller/products/:id` | 🔒 **Sim (Token JWT)** | `seller` ou `admin` | Exclusão física (*Hard Delete*) **Pedagógica com Travas** |
| `GET` | `/api/seller/orders` | 🔒 **Sim (Token JWT)** | `seller` ou `admin` | Pedidos contendo produtos vendidos pela loja |
| `PUT` | `/api/seller/orders/:id/status`| 🔒 **Sim (Token JWT)** | `seller` ou `admin` | Atualização do status de rastreio/entrega do pedido |
| `GET` | `/api/users` | 🔒 **Sim (Token JWT)** | `admin` | Listagem completa de todos os usuários da base |
| `PUT` | `/api/users/:id` | 🔒 **Sim (Token JWT)** | `admin` | Atualização de perfil, dados ou bloqueio (`role: blocked`) |
| `DELETE`| `/api/users/:id` | 🔒 **Sim (Token JWT)** | `admin` (+ senha admin) | Exclusão física (*Hard Delete*) **Pedagógica com Travas** |

---

### 🔑 11.1 Módulo de Autenticação & Gestão de Acessos

#### `POST /api/login`
* **Descrição:** Autentica um usuário e retorna o Token JWT e os dados do perfil. Possui proteção de *Rate Limiting* (máximo 3 tentativas por minuto).
* **Corpo da Requisição (JSON):**
  ```json
  {
    "email": "user@system.com",
    "password": "UserPassword123"
  }
  ```
* **Respostas Esperadas:**
  * `200 OK`: `{ "message": "Login realizado com sucesso", "token": "...", "user": { "id": "...", "name": "...", "email": "...", "role": "user" } }`
  * `400 Bad Request`: `{ "error": "Informe e-mail e senha" }`
  * `401 Unauthorized`: `{ "error": "Credenciais inválidas" }`
  * `403 Forbidden`: `{ "error": "Usuário bloqueado pelo administrador" }`
  * `429 Too Many Requests`: `{ "error": "Muitas tentativas. Aguarde 1 minuto." }`

#### `POST /api/register`
* **Descrição:** Realiza o cadastro de um novo usuário na plataforma.
* **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Nome do Aluno QA",
    "email": "novoaluno@system.com",
    "password": "SenhaSegura123",
    "role": "user",
    "storeName": ""
  }
  ```
* **Respostas Esperadas:**
  * `201 Created`: `{ "message": "Usuário registrado com sucesso!", "user": { ... } }`
  * `400 Bad Request`: `{ "error": "E-mail já cadastrado" }` ou validação de campos.

#### `POST /api/forgot-password`
* **Descrição:** Solicita redefinição de senha com resposta genérica segura.
* **Corpo da Requisição (JSON):** `{ "email": "user@system.com" }`
* **Resposta Esperada:** `200 OK` `{ "message": "Se o e-mail estiver cadastrado, um link de recuperação foi enviado." }`

---

### 📦 11.2 Módulo de Catálogo & Vitrine (Público)

#### `GET /api/products`
* **Descrição:** Lista produtos ativos para a vitrine com suporte a filtros via Query Parameters.
* **Query Params Suportados:**
  * `search` (string): Busca parcial por nome/descrição;
  * `category` (string): Filtra por categoria exata;
  * `maxPrice` (número): Filtra produtos com preço até o valor máximo.
* **Exemplo de URL:** `GET /api/products?category=Periféricos&maxPrice=300`
* **Resposta Esperada:** `200 OK` com array de produtos `[{ "_id": "...", "name": "...", "price": 250, "stock": 10, "sellerId": { ... } }]`.

#### `GET /api/products/categories`
* **Descrição:** Retorna a lista de categorias disponíveis no catálogo.
* **Resposta Esperada:** `200 OK` `["Periféricos", "Monitores", "Áudio", "Acessórios"]`.

---

### 🛒 11.3 Módulo de Pedidos (Cliente - Role `user`)

#### `POST /api/orders`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_cliente>`
* **Descrição:** Cria um novo pedido, reduz o estoque dos produtos de forma atômica e registra o endereço.
* **Corpo da Requisição (JSON):**
  ```json
  {
    "items": [
      {
        "productId": "64f1a2b3c4d5e6f7a8b9c0d1",
        "quantity": 2
      }
    ],
    "shippingAddress": "Av. Paulista, 1000 - Bela Vista, São Paulo/SP (CEP: 01310-100)",
    "total": 500.00
  }
  ```
* **Respostas Esperadas:**
  * `201 Created`: `{ "message": "Pedido criado com sucesso!", "order": { "_id": "...", "status": "aprovado", "total": 500.00, ... } }`
  * `400 Bad Request`: `{ "error": "Estoque insuficiente para o produto X" }` ou carrinho vazio.
  * `403 Forbidden`: Se enviado por perfil `seller` ou `admin` (compras são restritas a clientes).

#### `GET /api/orders/me`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_cliente>`
* **Descrição:** Retorna todos os pedidos realizados pelo cliente logado.
* **Resposta Esperada:** `200 OK` com a lista dos pedidos do próprio usuário.

---

### 🏪 11.4 Módulo do Lojista (Role `seller`)

#### `GET /api/seller/products`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_lojista>`
* **Descrição:** Retorna exclusivamente os produtos pertencentes à loja do lojista autenticado (*Multi-Tenancy*).
* **Resposta Esperada:** `200 OK` `[{ "_id": "...", "name": "...", "stock": 15, ... }]`.

#### `POST /api/seller/products`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_lojista>`
* **Descrição:** Cadastra um novo produto vinculado à loja do usuário.
* **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Headset Gamer 7.1",
    "price": 320.00,
    "stock": 25,
    "category": "Áudio",
    "description": "Headset com cancelamento de ruído ativo",
    "image": "https://exemplo.com/headset.jpg"
  }
  ```
* **Resposta Esperada:** `201 Created` `{ "message": "Produto criado com sucesso!", "product": { ... } }`.

#### `PUT /api/seller/products/:id`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_lojista>` ou `<token_admin>`
* **Descrição:** Atualiza os dados de um produto da loja (ou realiza o *Soft Delete* enviando `"active": false`).
* **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Headset Gamer Pro Atualizado",
    "price": 349.90,
    "stock": 10,
    "active": true
  }
  ```
* **Respostas Esperadas:**
  * `200 OK`: `{ "message": "Produto atualizado com sucesso.", "product": { ... } }`
  * `403 Forbidden`: Se tentar atualizar produto de outra loja sem ser admin.
  * `404 Not Found`: `{ "error": "Produto não encontrado ou sem permissão." }`

#### `DELETE /api/seller/products/:id`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_lojista>` ou `<token_admin>`
* **Descrição:** Exclui fisicamente um produto do catálogo. Ideal para o ciclo de testes automatizados e rotinas de **Teardown** (limpeza de massa descartável criada nos testes).
* **Travas de Segurança Aplicadas:**
  * 🔒 **Anti-Caos (Seed):** Bloqueia exclusão de produtos base do sistema (`Teclado Mecânico Aurora`, `Mouse Óptico Atlas`, `Headset Nexo`);
  * 🔒 **Integridade Referencial:** Bloqueia exclusão se o produto já fez parte de algum pedido de compra registrado;
  * 🔒 **Multi-Tenancy:** Lojista só pode deletar produtos cadastrados por sua própria loja.
* **Respostas Esperadas:**
  * `200 OK`: `{ "message": "Produto excluído com sucesso.", "id": "64f1a2b3..." }`
  * `400 Bad Request`: `{ "error": "ID de produto inválido." }`
  * `403 Forbidden`: `{ "error": "Proibido: produtos padrão do catálogo oficial não podem ser excluídos." }` ou falta de permissão na loja.
  * `404 Not Found`: `{ "error": "Produto não encontrado." }`
  * `409 Conflict`: `{ "error": "Conflito de integridade: este produto possui pedidos vinculados ao histórico de vendas. Utilize a desativação lógica (active: false)." }`

#### `PUT /api/seller/orders/:id/status`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_lojista>`
* **Descrição:** Altera o status de entrega do pedido.
* **Corpo da Requisição (JSON):** `{ "status": "enviado" }`
* **Valores aceitos para status:** `"pendente"`, `"aprovado"`, `"enviado"`, `"entregue"`, `"cancelado"`.

---

### 🛡️ 11.5 Módulo de Administração (Role `admin`)

#### `GET /api/users`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_admin>`
* **Descrição:** Retorna a lista completa de usuários cadastrados no banco de dados.
* **Resposta Esperada:** `200 OK` com array de todos os usuários.

#### `PUT /api/users/:id`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_admin>`
* **Descrição:** Atualiza o perfil ou bloqueia/desbloqueia um usuário (exige senha mestra de admin).
* **Corpo da Requisição (JSON):**
  ```json
  {
    "role": "blocked",
    "adminPassword": "AdminPassword123"
  }
  ```
* **Respostas Esperadas:**
  * `200 OK`: `{ "message": "Usuário atualizado com sucesso!", "user": { ... } }`
  * `401 Unauthorized`: `{ "error": "Senha do administrador inválida para alterar este perfil." }`

#### `DELETE /api/users/:id`
* **Autenticação Obrigatória:** `Authorization: Bearer <token_admin>`
* **Descrição:** Exclui fisicamente um usuário do sistema. Criado especialmente para automações de teste de cadastro onde o teste de API precisa limpar a massa criada ao final do cenário.
* **Autorização Adicional:** Requer a senha do administrador via Body (`adminPassword`), Header (`x-admin-password: AdminPassword123`) ou Query Param (`?adminPassword=AdminPassword123`).
* **Travas de Segurança Aplicadas:**
  * 🔒 **Anti-Caos (Seed da Turma):** Bloqueia a exclusão dos usuários essenciais (`admin@system.com`, `user@system.com`, `lojista@system.com`, `blocked@system.com`, `slow@system.com`);
  * 🔒 **Anti-Auto-Exclusão:** O administrador não pode excluir sua própria conta conectada;
  * 🔒 **Integridade Referencial:** Bloqueia a exclusão se o usuário tiver histórico de compras (`Order`) ou produtos cadastrados.
* **Respostas Esperadas:**
  * `200 OK`: `{ "message": "Usuário excluído com sucesso.", "id": "64f1..." }`
  * `400 Bad Request`: `{ "error": "ID de usuário inválido." }` ou tentativa de auto-exclusão do admin logado.
  * `401 Unauthorized`: `{ "error": "Senha administrativa incorreta ou não fornecida para autorizar a exclusão." }`
  * `403 Forbidden`: `{ "error": "Proibido: usuários padrão do sistema não podem ser excluídos." }`
  * `404 Not Found`: `{ "error": "Usuário não encontrado." }`
  * `409 Conflict`: `{ "error": "Conflito de integridade: este usuário possui pedidos ou produtos vinculados ao histórico. Utilize a suspensão de acesso (role: 'blocked')." }`

---

### 🧪 11.6 Guia de Travas de Segurança & Automação com Playwright (DELETE & Teardown)

#### 🎯 Por que a API possui "Travas de Segurança" nos métodos DELETE?

Em ambientes profissionais de desenvolvimento e em **plataformas de teste compartilhadas por turmas de alunos**, o método HTTP `DELETE` físico (*Hard Delete*) é a operação mais sensível e arriscada.

1. **Proteção contra Caos em Massa Compartilhada:** Se a API não possuísse a trava de e-mails/nomes protegidos, um aluno com erro de loop ou script em Playwright poderia deletar o `admin@system.com` ou a vitrine inteira no Render, quebrando os testes de todos os outros 30 colegas na mesma aula.
2. **Integridade de Negócio (E-commerce Real):** Um pedido de compra (`Order`) faz vínculo direto com o ID do cliente e o ID dos produtos comprados. Excluir o registro físico no banco causaria erro de dados órfãos e *null pointers* em relatórios contábeis, notas fiscais e telas de pedidos.
3. **Didática de QA (Status Codes Ricos):** Permite aos alunos testarem não apenas o caminho feliz (`200 OK`), mas também códigos HTTP fundamentais do protocolo REST como `401 Unauthorized`, `403 Forbidden`, `404 Not Found` e `409 Conflict`.

---

#### 💻 Exemplo Prático de Teste de API no Playwright

Abaixo está o padrão recomendado de teste automatizado usando `@playwright/test` aplicando o ciclo completo (CRUD) e **Teardown**:

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/api'; // Ou a URL da nuvem no Render

test.describe('Automação de API - Ciclo de Vida do Produto com DELETE (Teardown)', () => {
    let tokenLojista: string;
    let produtoId: string;

    test.beforeAll(async ({ request }) => {
        // 1. Autenticar como Lojista
        const loginRes = await request.post(`${BASE_URL}/login`, {
            data: { email: 'lojista@system.com', password: 'SellerPass123' }
        });
        expect(loginRes.status()).toBe(200);
        const loginData = await loginRes.json();
        tokenLojista = loginData.token;
    });

    test('Deve cadastrar produto temporário e executar o Teardown com DELETE', async ({ request }) => {
        // PASSO 1: CREATE (POST)
        const postRes = await request.post(`${BASE_URL}/seller/products`, {
            headers: { Authorization: `Bearer ${tokenLojista}` },
            data: {
                name: 'Produto Teste Playwright ' + Date.now(),
                price: 99.90,
                stock: 15,
                category: 'Acessórios',
                description: 'Produto criado exclusivamente para validação de automação'
            }
        });
        expect(postRes.status()).toBe(201);
        const postData = await postRes.json();
        produtoId = postData.product._id;
        expect(produtoId).toBeDefined();

        // PASSO 2: READ (GET)
        const getRes = await request.get(`${BASE_URL}/products?search=${produtoId}`);
        expect(getRes.status()).toBe(200);

        // PASSO 3: TEARDOWN / DELETE (Limpeza de massa de teste)
        const deleteRes = await request.delete(`${BASE_URL}/seller/products/${produtoId}`, {
            headers: { Authorization: `Bearer ${tokenLojista}` }
        });
        expect(deleteRes.status()).toBe(200);
        const deleteData = await deleteRes.json();
        expect(deleteData.message).toContain('Produto excluído com sucesso');

        // PASSO 4: VERIFICAR SE FOI REALMENTE APAGADO
        const verifyRes = await request.delete(`${BASE_URL}/seller/products/${produtoId}`, {
            headers: { Authorization: `Bearer ${tokenLojista}` }
        });
        expect(verifyRes.status()).toBe(404); // Deve retornar Not Found na segunda tentativa
    });

    test('Deve rejeitar a exclusão de produtos protegidos do catálogo padrão (Trava Seed)', async ({ request }) => {
        // Busca produto padrão 'Teclado Mecânico Aurora'
        const listRes = await request.get(`${BASE_URL}/products?search=Aurora`);
        const products = await listRes.json();
        const aurora = products.find((p: any) => p.name === 'Teclado Mecânico Aurora');

        if (aurora) {
            const deleteRes = await request.delete(`${BASE_URL}/seller/products/${aurora._id}`, {
                headers: { Authorization: `Bearer ${tokenLojista}` }
            });
            // Espera bloqueio 403 Forbidden pela trava anti-caos
            expect(deleteRes.status()).toBe(403);
            const body = await deleteRes.json();
            expect(body.error).toContain('produtos padrão do catálogo oficial não podem ser excluídos');
        }
    });
});
```

