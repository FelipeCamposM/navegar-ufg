# Navegar UFG — Índice de Documentação

**Sistema de Navegação Primitivo** — Trabalho Final AED2/INF/UFG 2026-1  
**Professor:** André L. Moura  
**Data de entrega:** 01/06/2026

---

## Documentos

| Arquivo | Descrição |
|---|---|
| [`documentacao.md`](./documentacao.md) | Documento principal no formato exigido pelo professor (introdução, arquitetura, requisitos, guias) |
| [`arquitetura.md`](./arquitetura.md) | Arquitetura técnica detalhada: camadas, estrutura de pastas, fluxos de dados, decisões de design |
| [`requisitos.md`](./requisitos.md) | RF01–RF08 e RNF01–RNF08 com critérios de aceitação e rastreabilidade |
| [`estruturas-de-dados.md`](./estruturas-de-dados.md) | Grafo (Lista de Adjacência), MinHeap, vetores dist/prev, conjunto visited — com código TypeScript |
| [`formatos-dados.md`](./formatos-dados.md) | Especificação dos formatos `.osm`, `.poly` e `.txt` com exemplos reais do Campus UFG |
| [`guia-instalacao.md`](./guia-instalacao.md) | Pré-requisitos, instalação, execução e solução de problemas |
| [`guia-uso.md`](./guia-uso.md) | Interação com o canvas, cálculo de menor caminho, edição de grafos, importação |

### Instruções Originais (PDFs convertidos via Docling)

| Arquivo | PDF original |
|---|---|
| [`instrucoes-originais/trabalho-final.md`](./instrucoes-originais/trabalho-final.md) | `AED2_2026-1_TrabalhoFinalv5.pdf` |
| [`instrucoes-originais/instrucoes-apresentacao.md`](./instrucoes-originais/instrucoes-apresentacao.md) | `InstrucoesSobreAparesentacaoDoTrabalhoFinalv4.pdf` |
| [`instrucoes-originais/minitutorial-conversao-mapa.md`](./instrucoes-originais/minitutorial-conversao-mapa.md) | `MinitutorialConversaoMapaParaGrafo_v2.pdf` |

---

## Tecnologias do Projeto

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Visualização de grafos:** Cytoscape.js + react-cytoscapejs
- **Estilização:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand
- **Algoritmo:** Dijkstra com MinHeap (implementação TypeScript pura)

## Arquivos de Mapa

- `mapas/Campus2UFG&Regiao.osm` — Mapa OSM do Campus Samambaia UFG
- `mapas/Campus2UFG&Regiao.poly` — Grafo cartesiano gerado pelo conversor em C
