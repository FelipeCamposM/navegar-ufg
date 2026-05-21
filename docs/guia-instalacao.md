# Guia de Instalação e Execução — Navegar UFG

Sistema de Navegação Primitivo — AED2/UFG 2026-1

---

## 1. Pré-requisitos

### Software obrigatório

| Software | Versão mínima | Download |
|---|---|---|
| **Node.js** | 20.x LTS | [nodejs.org](https://nodejs.org) |
| **npm** | 10.x | Incluído com Node.js |
| **Navegador moderno** | Chrome 90+ / Firefox 88+ / Edge 90+ | — |

### Verificar instalação

```bash
node --version   # deve mostrar v20.x.x ou superior
npm --version    # deve mostrar 10.x.x ou superior
```

### Software opcional (para conversão de mapas OSM)

| Software | Finalidade |
|---|---|
| **GCC** (Linux) ou **MinGW** (Windows) | Compilar `ConverteMapaParaGrafo.c` |
| **Python 3.10+** | Executar `scripts/convert_pdfs.py` (conversão de PDFs) |

---

## 2. Instalação

### 2.1 Obter o projeto

**Opção A — A partir do arquivo .zip entregue:**

```bash
# Extraia o arquivo PF_<NomeAluno>.zip
unzip PF_NomeAluno.zip
cd navegar-ufg
```

**Opção B — Clonar o repositório:**

```bash
git clone <url-do-repositorio>
cd navegar-ufg
```

### 2.2 Instalar dependências

```bash
npm install
```

Este comando instala todas as dependências listadas no `package.json`, incluindo:
- `next` (framework)
- `react`, `react-dom`
- `cytoscape`, `react-cytoscapejs`
- `zustand`
- `tailwindcss`
- `shadcn/ui` e componentes

**Tempo estimado:** 1–3 minutos dependendo da velocidade de internet.

---

## 3. Execução

### 3.1 Modo desenvolvimento (recomendado para demonstração)

```bash
npm run dev
```

Acesse no navegador: **http://localhost:3000**

O servidor de desenvolvimento inclui:
- Hot reload (atualização automática ao editar código)
- Mensagens de erro detalhadas no browser
- Source maps para depuração

### 3.2 Build de produção

```bash
# Gerar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

Acesse no navegador: **http://localhost:3000**

### 3.3 Exportação estática (opcional)

Para gerar uma versão estática que funciona sem servidor Node.js:

```bash
npm run build
# Os arquivos estáticos serão gerados em: out/
```

Abra `out/index.html` diretamente no navegador.

---

## 4. Comandos disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento em localhost:3000 |
| `npm run build` | Gera build de produção otimizado |
| `npm start` | Inicia servidor de produção (requer build prévio) |
| `npm run lint` | Verifica erros de lint no código |

---

## 5. Configuração por Sistema Operacional

### Windows 10/11

1. Instale o Node.js via [nodejs.org](https://nodejs.org) (instalador `.msi`)
2. Abra o **Prompt de Comando** ou **PowerShell** na pasta do projeto
3. Execute `npm install` e depois `npm run dev`
4. Abra o Chrome/Edge em **http://localhost:3000**

**Possível problema — EACCES / permissão negada:**
```bash
# Execute o PowerShell como Administrador
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Linux (Ubuntu/Debian)

```bash
# Instalar Node.js via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Instalar dependências e executar
npm install
npm run dev
```

---

## 6. Arquivos de mapa incluídos

O projeto já inclui os arquivos do Campus UFG prontos para uso:

```
mapas/
├── Campus2UFG&Regiao.osm    # Mapa OSM do Campus Samambaia UFG e região
└── Campus2UFG&Regiao.poly   # Grafo cartesiano gerado pelo conversor em C
```

Para importar no sistema:
1. Clique em **"Importar"** na barra de ferramentas
2. Selecione `Campus2UFG&Regiao.poly` (carregamento mais rápido) ou `.osm`
3. O grafo do campus será renderizado automaticamente

---

## 7. Solução de Problemas

| Problema | Causa provável | Solução |
|---|---|---|
| `npm install` falha | Node.js desatualizado | Atualize para Node.js 20+ |
| Porta 3000 em uso | Outro processo na porta | `npm run dev -- --port 3001` |
| Grafo não renderiza após import | Arquivo inválido ou corrompido | Verifique o formato conforme `formatos-dados.md` |
| Dijkstra demora >2s | Grafo muito grande | Use o arquivo `.poly` (pré-processado) em vez do `.osm` |
| Erro "Cannot find module" | Instalação incompleta | Delete `node_modules/` e rode `npm install` novamente |
| Cópia de imagem não funciona | Browser sem suporte a Clipboard API | Use Chrome 90+ ou Edge 90+ |
