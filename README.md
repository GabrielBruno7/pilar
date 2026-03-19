# 🏢 Pilar

Pilar é um sistema de gestão de imóveis focado em locação, desenvolvido como projeto prático com o objetivo de simular um SaaS real para administração imobiliária.

A aplicação permite gerenciar imóveis, inquilinos, contratos e pagamentos de forma simples, organizada e com foco em produtividade.

---
## 📸 Preview

<img width="1620" height="912" alt="image" src="https://github.com/user-attachments/assets/e094abe4-9803-4151-93b4-cda2088bc446" />

## Sobre o projeto

Este projeto foi desenvolvido como uma forma de aplicar conceitos de arquitetura, organização de domínio e construção de interfaces modernas.

A ideia foi simular um sistema que poderia ser utilizado por:

- proprietários de imóveis
- pequenas imobiliárias
- gestores de aluguel

---

## Funcionalidades

- 📊 Dashboard com visão geral da operação
- 🏠 Cadastro e gestão de imóveis
- 👤 Gestão de inquilinos
- 📄 Controle de contratos de locação
- 💰 Gestão de pagamentos
- ✅ Marcação de pagamentos como pagos
- 🔐 Autenticação de usuário
- 📈 Indicadores como ocupação e cobranças

---

## Conceitos aplicados

- Organização por domínio no backend
- Separação de responsabilidades (Use Cases, Controllers, etc)
- Consumo de API com React Query
- Interface baseada em componentes reutilizáveis
- Feedback de ações com toast e estados de loading

---

## Tecnologias

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query
- React Router
- Framer Motion

### Backend
- Laravel (PHP)
- Arquitetura orientada a domínio (Domain + UseCase)
- API REST
- Autenticação com middleware

### Infraestrutura
- Docker / Docker Compose
- Nginx

---

## Organização do projeto

O projeto está dividido em duas partes principais:

### Frontend
Aplicação web construída com React, responsável pela interface e experiência do usuário.

Organizado em:
- páginas (views principais do sistema)
- componentes reutilizáveis
- serviços de comunicação com a API

### Backend
API desenvolvida em Laravel, responsável pelas regras de negócio e persistência dos dados.

Organizada por domínios como:
- imóveis
- contratos
- inquilinos
- pagamentos

Essa separação ajuda a manter o código mais claro, escalável e próximo de um sistema real.
