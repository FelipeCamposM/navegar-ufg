## INF/UFG - Algoritmos e Estruturas de Dados 2 - Prof. André L. Moura

## CONVERSÃO DE MAPAS DO GOOGLE MAPS PARA GRAFO

1. Abrir a ferramenta OpenStreetMpa , disponível no link abaixo:

https://www.openstreetmap.org/export?bbox

- 1.1. No campo "Buscar", digitar o nome da cidade ("Goiânia", por exemplo) e clicar no botão à direita sob a forma de lupa.
- 1.2. Expandir o mapa, usando a "rodinha do mouse", até ser mostrada a região desejada.
- 1.3. No menu horizontal, na parte superior, clicar na opção "Exportar".
- 1.3.1. Clicar no item "Selecionar outra área manualmente", situado na caixa à esquerda.
- 1.3.2. Fazer ajustes no tamanho do retângulo que delimita a área selecionada do mapa.
- 1.4. Clicar no botão "Exportar". (A ferramenta gera um arquivo (map.osm) e o copia na pasta 'Downloads'.)
2. Alterar o nome do arquivo map.osm para um nome que facilite identificar seu conteúdo. Por exemplo: Campus2UFG.osm.
3.   Alterar   código   do   programa ConverteMapaParaGrafo,   incluindo   função   que   converta coordenadas geográficas em coordenadas cartesianas (UTM).
4.   Executar   o   programa  ConverteMapaParaGrafo,  que   converte   coordenadas   geográficas   em coordenadas cartesianas. Esse programa cria arquivo contendo todos os vértices e arestas obtidos do arquivo .osm .

## Sintaxe de uso:

ConverteMapaParaGrafo [&lt;arquivo&gt;.osm | &lt;arquivo&gt;.xml]

5. Ler o arquivo .poly criado, que contém os vértices  e as arestas do grafo.
6. Construir a matriz de adjacência.
7.   Executar   programa   que   implemente   o   algoritmo   do   Dijkstra   e   ler   os   vértices   e   as   arestas (segmentos) do arquivo .poly para descrever o menor caminho entre o vértice de origem e o de destino.
8. Implementar solução do algoritmo do Dijkstra baseada em interface gráfica com suporte para mouse conforme requisitos do Trabalho Final de AED2.

Figura 1. Área selecionada do Campus Samambaia UFG e cercanias.

<!-- image -->

Figura 2. Grafo correspondente à área selecionada do Campus Samambaia UFG e cercanias.

<!-- image -->

Figura 3. Grafo correspondente ao da Figura 2 com o menor caminho traçado.

<!-- image -->