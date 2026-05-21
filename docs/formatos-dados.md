# Formatos de Dados de Entrada — Navegar UFG

O sistema suporta três formatos de arquivo para importação de grafos. Esta documentação detalha a estrutura de cada formato com base nos arquivos reais do projeto.

---

## 1. Formato `.osm` — OpenStreetMap

### 1.1 Descrição

Arquivo XML gerado pela ferramenta de exportação do [OpenStreetMap](https://www.openstreetmap.org/export). Contém todos os elementos geográficos de uma área selecionada: nós (interseções), vias (ruas/avenidas) e metadados.

**Arquivo de referência:** `mapas/Campus2UFG&Regiao.osm`  
**Estatísticas do arquivo do campus UFG:**
- ~11.456 nós (`<node>`)
- ~2.166 vias (`<way>`)
- Área: Campus Samambaia UFG e cercanias (Goiânia, GO)

### 1.2 Estrutura

```xml
<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="openstreetmap-cgimap ...">

  <!-- Bounding box da área exportada -->
  <bounds minlat="-16.6239000" minlon="-49.2838500"
          maxlat="-16.5937100" maxlon="-49.2470700"/>

  <!-- ===== VÉRTICES DO GRAFO ===== -->
  <!-- Cada <node> representa uma interseção ou ponto de interesse -->
  <node id="260408351"
        visible="true"
        version="3"
        lat="-16.6272363"    <!-- latitude geográfica -->
        lon="-49.2705353"/>  <!-- longitude geográfica -->

  <node id="260408352" visible="true" lat="-16.6269236" lon="-49.2704151"/>
  <!-- ... mais nós ... -->

  <!-- ===== ARESTAS DO GRAFO ===== -->
  <!-- Cada <way> representa um segmento de via (rua, avenida etc.) -->
  <way id="129096308" visible="true">
    <!-- Sequência de nós que formam a via -->
    <nd ref="1740819768"/>  <!-- vértice inicial -->
    <nd ref="3291787572"/>  <!-- vértices intermediários -->
    <nd ref="1740819769"/>
    <nd ref="1740819771"/>
    <nd ref="1740819778"/>  <!-- vértice final -->

    <!-- Metadados da via -->
    <tag k="highway"  v="residential"/>   <!-- tipo da via -->
    <tag k="name"     v="Rua das Flores"/>
    <tag k="oneway"   v="yes"/>           <!-- mão única → aresta DIRECIONADA -->
    <tag k="surface"  v="asphalt"/>
    <tag k="maxspeed" v="30"/>
  </way>

  <!-- Via de mão dupla (não-direcionada) -->
  <way id="129096309" visible="true">
    <nd ref="1740819778"/>
    <nd ref="1740819739"/>
    <nd ref="1740819623"/>
    <tag k="highway" v="residential"/>
    <tag k="name"    v="Rua da Maçonaria"/>
    <tag k="oneway"  v="no"/>             <!-- mão dupla → aresta NÃO-DIRECIONADA -->
  </way>

</osm>
```

### 1.3 Regras de Parsing

O `osmParser.ts` segue estas regras ao converter OSM para o grafo interno:

| Elemento OSM | Conversão |
|---|---|
| `<node id lat lon>` | `GraphNode { id, x, y }` — coordenadas convertidas via `coordinates.ts` (geo → UTM) |
| Par consecutivo de `<nd ref>` em um `<way>` | `GraphEdge { source, target, weight, directed }` |
| `<tag k="oneway" v="yes">` | `directed: true` |
| `<tag k="oneway" v="no">` ou ausência da tag | `directed: false` |
| Peso da aresta | Calculado pela **fórmula de Haversine** entre as coordenadas dos dois nós |
| Nós sem `<way>` associado | Ignorados (não são vértices do grafo de navegação) |

### 1.4 Fórmula de Haversine (peso das arestas)

Para calcular a distância em metros entre dois pontos geográficos:

```typescript
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

---

## 2. Formato `.poly` — Grafo Cartesiano

### 2.1 Descrição

Formato gerado pelo programa `ConverteMapaParaGrafo.c` (fornecido pelo professor, disponível em `funcoes em C/`). Contém vértices com coordenadas cartesianas (já convertidas de geográficas para UTM) e arestas com pesos pré-calculados.

**Arquivo de referência:** `mapas/Campus2UFG&Regiao.poly`  
**Estatísticas do arquivo do campus UFG:**
- **10.000 vértices**
- **11.526 arestas**

### 2.2 Estrutura

O arquivo é dividido em duas seções: cabeçalho + vértices, e cabeçalho + arestas.

```
<num_vertices>  <dimensoes>  <num_atributos>  <marcadores_de_fronteira>
<id>  <x>  <y>
...
<num_arestas>  <marcadores_de_fronteira>
<id>  <vertice_origem>  <vertice_destino>  <marcador>
...
```

**Legenda dos marcadores de fronteira (boundary marker):**
- `0` = aresta **não-direcionada** (mão dupla)
- `1` = aresta **direcionada** (mão única)

### 2.3 Exemplo real (início do arquivo `Campus2UFG&Regiao.poly`)

```
10000	2	0	1
0	1229.06822	2651.30068
1	1235.12256	2633.82730
2	1269.20044	2598.69963
3	1309.32435	2564.71869
4	1316.20592	2539.14645
5	1313.20804	2500.68433
...
9998	1420.50766	1897.01355
9999	1423.63365	1892.13251
11526	1
0	3701	34	0
1	34	35	0
2	35	36	0
3	36	37	0
4	37	38	0
...
```

**Interpretação:**
- Linha 1: `10000 2 0 1` → 10.000 vértices, dimensão 2 (x,y), 0 atributos, 1 marcador de fronteira
- Linhas 2–10001: vértices no formato `id  x  y`
- Linha 10002: `11526 1` → 11.526 arestas, 1 marcador de fronteira
- Linhas 10003+: arestas no formato `id  origem  destino  marcador`

### 2.4 Implementação do Parser

```typescript
// src/lib/parsers/polyParser.ts

export function parsePoly(content: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const lines = content.trim().split('\n');
  let cursor = 0;

  // Cabeçalho de vértices
  const [numVertices] = lines[cursor++].trim().split(/\s+/).map(Number);
  const nodes: GraphNode[] = [];

  for (let i = 0; i < numVertices; i++) {
    const [id, x, y] = lines[cursor++].trim().split(/\s+/).map(Number);
    nodes.push({ id: String(id), x, y });
  }

  // Cabeçalho de arestas
  const [numEdges] = lines[cursor++].trim().split(/\s+/).map(Number);
  const edges: GraphEdge[] = [];

  for (let i = 0; i < numEdges; i++) {
    const [id, source, target, marker] = lines[cursor++].trim().split(/\s+/).map(Number);
    // Peso calculado pela distância euclidiana entre os vértices
    const srcNode = nodes[source];
    const tgtNode = nodes[target];
    const weight = Math.sqrt((srcNode.x - tgtNode.x) ** 2 + (srcNode.y - tgtNode.y) ** 2);

    edges.push({
      id: String(id),
      source: String(source),
      target: String(target),
      weight,
      directed: marker === 1,
    });
  }

  return { nodes, edges };
}
```

---

## 3. Formato `.txt` — Lista de Adjacência

### 3.1 Descrição

Formato texto simples, sem dependências externas. Ideal para criar grafos pequenos manualmente ou para fins de teste.

### 3.2 Variantes suportadas

#### Variante A — Apenas arestas (formato mínimo)

Cada linha define uma aresta. Linhas iniciadas com `#` são comentários.

```
# Sistema de Navegação Primitivo — Grafo de exemplo
# Formato: <origem> <destino> <peso>
0 1 5.2
0 2 3.1
1 3 7.8
2 3 2.4
3 4 1.0
```

IDs de vértices são criados automaticamente a partir das referências nas arestas.

#### Variante B — Vértices + arestas (formato completo)

Permite definir as coordenadas (x, y) dos vértices para posicionamento visual.

```
# Arquivo de grafo com coordenadas
NODES 5
# id  x      y
0     100.0  200.0
1     150.0  250.0
2     200.0  200.0
3     250.0  250.0
4     300.0  200.0

EDGES 6
# origem  destino  peso   [direcionado: 0|1]
0         1        5.2    0
0         2        3.1    0
1         3        7.8    1
2         3        2.4    0
3         4        1.0    0
1         4        9.0    1
```

#### Variante C — Lista de adjacência tradicional

```
# Nó: lista de (vizinho, peso) separados por vírgula
0: 1,5.2 2,3.1
1: 3,7.8
2: 3,2.4
3: 4,1.0
```

### 3.3 Regras de parsing

| Situação | Comportamento |
|---|---|
| Linha em branco | Ignorada |
| Linha iniciando com `#` | Ignorada (comentário) |
| Peso não informado | Assume `weight = 1.0` |
| Direção não informada | Assume `directed = false` |
| Coordenadas não informadas | Vértices posicionados em layout automático (círculo) |
| ID duplicado | Ignora a segunda ocorrência; mantém a primeira |

---

## 4. Comparação dos Formatos

| Aspecto | `.osm` | `.poly` | `.txt` |
|---|---|---|---|
| Origem | OpenStreetMap | Conversor em C (prof.) | Manual / programático |
| Coordenadas | Geográficas (lat/lon) | Cartesianas (UTM) | Livres (x,y) ou automáticas |
| Pesos das arestas | Calculados (Haversine) | Calculados (Euclidiana) | Explícitos ou 1.0 |
| Direcionamento | Tag `oneway` | Marcador 0/1 | Campo explícito ou 0 |
| Complexidade do parser | Alta (XML) | Média | Baixa |
| Arquivo do campus UFG | `Campus2UFG&Regiao.osm` | `Campus2UFG&Regiao.poly` | — |
| Tamanho do arquivo | ~5 MB | ~350 KB | Variável |

---

## 5. Como obter novos mapas OSM

Seguindo o tutorial do professor (`docs/instrucoes-originais/minitutorial-conversao-mapa.md`):

1. Acesse [openstreetmap.org/export](https://www.openstreetmap.org/export)
2. Pesquise a cidade desejada (ex: "Goiânia")
3. Clique em **"Exportar"** no menu superior
4. Clique em **"Selecionar outra área manualmente"** e ajuste o retângulo
5. Clique no botão **"Exportar"** — o arquivo `map.osm` é baixado
6. Renomeie para um nome descritivo (ex: `CampusUFG.osm`)
7. Importe no sistema via botão "Importar" na Toolbar

**Para gerar o `.poly` a partir do `.osm`:**

```bash
# Usando o conversor fornecido pelo professor
cd "funcoes em C"
gcc ConverteMapaParaGrafo.c -o ConverteMapaParaGrafo -lm
./ConverteMapaParaGrafo CampusUFG.osm
# Gera: CampusUFG.poly
```
