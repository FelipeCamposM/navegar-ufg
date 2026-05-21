import type Cytoscape from 'cytoscape';

export async function copyGraphToClipboard(cy: Cytoscape.Core): Promise<void> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    const dataUrl = cy.png({ output: 'base64uri', bg: '#070710', full: true, scale: 2 });
    if (!dataUrl) return reject(new Error('Falha ao gerar imagem'));

    fetch(dataUrl)
      .then(r => r.blob())
      .then(resolve)
      .catch(reject);
  });

  if (typeof ClipboardItem !== 'undefined') {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  } else {
    // Firefox fallback: download the image
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'navegar-ufg-grafo.png';
    a.click();
    URL.revokeObjectURL(url);
  }
}
