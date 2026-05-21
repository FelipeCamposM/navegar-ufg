# Guia de Uso da Aplicação — Navegar UFG

Sistema de Navegação Primitivo — AED2/UFG 2026-1

---

## 1. Interface Geral

```
┌─────────────────────────────────────────────────────────────────┐
│  [Importar] [Modo: Selecionar ▼] [Calcular Caminho] [Limpar]    │  ← Toolbar
│  [Rótulos ☐] [Tipo: Não-direcionado ▼]             [Copiar img] │
├────────────────────────────────────────┬────────────────────────┤
│                                        │   Estatísticas         │
│                                        │  ─────────────────     │
│         Canvas do Grafo                │  Tempo:  12 ms         │
│         (Cytoscape.js)                 │  Nós:    47            │
│                                        │  Custo:  3.2 km        │
│                                        │                        │
│                                        │  Origem:  Vértice 3    │
│                                        │  Destino: Vértice 15   │
└────────────────────────────────────────┴────────────────────────┘
```

---

## 2. Modos de Operação

A Toolbar possui um seletor de **Modo** que controla o que acontece ao interagir com o canvas:

| Modo | Ícone | Descrição |
|---|---|---|
| **Selecionar** | Cursor | Clique nos vértices para definir origem/destino |
| **Adicionar Vértice** | Círculo + | Clique no canvas para criar novos vértices |
| **Adicionar Aresta** | Linha + | Arraste de um vértice para outro para criar aresta |
| **Mover** | Mão | Arraste vértices para reposicioná-los |
| **Excluir** | Lixeira | Clique em qualquer elemento para removê-lo |

---

## 3. Interação com o Canvas

### 3.1 Navegação no mapa

| Ação | Gesto |
|---|---|
| Pan (mover a visão) | Clique e arraste no fundo do canvas |
| Zoom in | Scroll do mouse para cima |
| Zoom out | Scroll do mouse para baixo |
| Centralizar grafo | Duplo clique no fundo (sem modo ativo) |
| Centralizar no elemento | Clique simples em qualquer modo |

### 3.2 Manipulação de vértices

| Ação | Gesto | Modo necessário |
|---|---|---|
| Criar vértice | Clique no canvas vazio | **Adicionar Vértice** |
| Mover vértice | Arrastar o vértice | **Mover** |
| Remover vértice | Clique no vértice | **Excluir** |
| Menu de opções | Clique direito no vértice | Qualquer modo |

### 3.3 Manipulação de arestas

| Ação | Gesto | Modo necessário |
|---|---|---|
| Criar aresta | Arrastar do vértice A ao vértice B | **Adicionar Aresta** |
| Remover aresta | Clique na aresta | **Excluir** |
| Editar aresta | Clique direito na aresta | Qualquer modo |

### 3.4 Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Ctrl+Z` | Desfazer última operação |
| `Ctrl+Y` | Refazer operação desfeita |
| `Delete` | Remover elemento selecionado |
| `Escape` | Cancelar operação atual / desselecionar |

---

## 4. Encontrar o Menor Caminho

### Passo a passo

**1. Selecione o vértice de origem:**
- Escolha o modo **Selecionar** na Toolbar
- Clique no vértice de origem
- O vértice ficará **verde**

**2. Selecione o vértice de destino:**
- Clique em outro vértice (diferente da origem)
- O vértice ficará **vermelho**

**3. Calcule o caminho:**
- Clique no botão **"Calcular Menor Caminho"** na Toolbar
- O sistema executa o Algoritmo de Dijkstra

**4. Visualize o resultado:**
- Os vértices e arestas do caminho ficam **laranja**
- O painel **Estatísticas** mostra:
  - Tempo de processamento (ex: 12 ms)
  - Número de nós explorados (ex: 47)
  - Custo total do caminho (ex: 3.2 km)

**5. Para calcular um novo caminho:**
- Clique em um vértice diferente para redefinir a seleção
- Ou clique em **"Limpar Seleção"** para começar do zero

### Casos especiais

| Situação | Resultado |
|---|---|
| Não existe caminho entre os vértices | Mensagem: "Não há caminho entre os vértices selecionados" |
| Origem e destino são o mesmo vértice | Mensagem: "Origem e destino devem ser vértices diferentes" |
| Nenhum vértice selecionado | Botão "Calcular" desabilitado |

---

## 5. Importação de Mapas

### 5.1 Importar arquivo

1. Clique em **"Importar"** na Toolbar
2. Selecione um arquivo no diálogo (`.osm`, `.poly` ou `.txt`)
3. Aguarde o carregamento (pode levar alguns segundos para mapas grandes)
4. O grafo é renderizado automaticamente no canvas

### 5.2 Arquivos incluídos no projeto

Para a demonstração com o campus UFG (conforme exigido pelo professor):

| Arquivo | Localização | Recomendado para |
|---|---|---|
| `Campus2UFG&Regiao.poly` | `mapas/` | Carga rápida (~1s), grafo pronto |
| `Campus2UFG&Regiao.osm` | `mapas/` | Mais informações (nomes de ruas) |

**Recomendação:** use o `.poly` para demonstrações de desempenho (RNF04), pois as coordenadas já estão em formato cartesiano, dispensando conversão.

### 5.3 Após importar

O sistema:
- Renderiza todos os vértices e arestas no canvas
- Centraliza o grafo automaticamente
- Ajusta o zoom para mostrar o grafo completo
- Exibe contagem de vértices e arestas no painel de estatísticas

---

## 6. Edição do Grafo

### 6.1 Adicionar vértice manualmente

1. Selecione o modo **"Adicionar Vértice"**
2. Clique em qualquer ponto vazio do canvas
3. Um novo vértice é criado na posição do clique
4. Opcional: clique direito no vértice → "Editar" para definir um rótulo

### 6.2 Adicionar aresta

1. Selecione o modo **"Adicionar Aresta"**
2. Clique e **segure** no vértice de origem
3. **Arraste** até o vértice de destino
4. Solte para criar a aresta
5. Uma janela perguntará o peso (distância) da aresta — informe o valor ou aceite o padrão (distância euclidiana)

### 6.3 Definir direcionamento

- Na Toolbar, use o seletor **"Tipo de Aresta"**:
  - **Não-direcionado** — cria aresta de mão dupla (linha simples)
  - **Direcionado** — cria aresta de mão única (linha com seta)
- Para alterar uma aresta existente: clique direito → "Alternar direção"

### 6.4 Desfazer e refazer

O sistema mantém um histórico de até **50 operações**:

```
Ctrl+Z  →  Desfaz última operação
Ctrl+Y  →  Refaz operação desfeita
```

Operações registradas no histórico:
- Adicionar/remover vértice
- Adicionar/remover aresta
- Mover vértice (posição)
- Importar arquivo (estado anterior é restaurável)

---

## 7. Configurações Visuais

### 7.1 Exibir rótulos

- Checkbox **"Mostrar Rótulos"** na Toolbar
- Quando ativado: exibe o ID de cada vértice e o peso de cada aresta

### 7.2 Cores dos elementos

| Elemento | Cor padrão |
|---|---|
| Vértice normal | Azul (`#4A90D9`) |
| Vértice de origem | Verde (`#27AE60`) |
| Vértice de destino | Vermelho (`#E74C3C`) |
| Vértice no caminho | Laranja (`#F39C12`) |
| Aresta normal | Cinza escuro (`#555555`) |
| Aresta no caminho | Laranja (`#F39C12`) |
| Aresta direcionada | Linha com seta |

---

## 8. Exportação de Imagem

Para copiar o estado atual do grafo como imagem PNG:

1. Clique em **"Copiar Imagem"** na Toolbar
2. A imagem é copiada para a área de transferência
3. Cole em qualquer aplicativo (Word, PowerPoint, Paint etc.) com `Ctrl+V`

> O snapshot captura exatamente o que está visível no canvas, incluindo highlights de caminho e estados dos vértices.

---

## 9. Fluxo Completo — Demonstração do Campus UFG

Roteiro sugerido para a apresentação do trabalho:

```
1. Abrir a aplicação (http://localhost:3000)
2. Clicar em "Importar" → selecionar mapas/Campus2UFG&Regiao.poly
3. Aguardar carregamento do grafo do campus
4. Ativar "Mostrar Rótulos" para visualizar os IDs
5. Selecionar modo "Selecionar"
6. Clicar em um vértice próximo à entrada do campus (origem - verde)
7. Clicar em um vértice distante (destino - vermelho)
8. Clicar em "Calcular Menor Caminho"
9. Observar o caminho em laranja e as estatísticas no painel
10. Clicar em "Copiar Imagem" para exportar o resultado
```
