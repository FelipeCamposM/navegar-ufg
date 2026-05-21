"""
Converte os PDFs de instru??o do projeto para Markdown usando a biblioteca docling.
Uso: python scripts/convert_pdfs.py
"""

from pathlib import Path
from docling.document_converter import DocumentConverter

BASE_DIR = Path(__file__).parent.parent

PDFS = [
    {
        "input": BASE_DIR / "pdfs_instrucoes" / "AED2_2026-1_TrabalhoFinalv5.pdf",
        "output": BASE_DIR / "docs" / "instrucoes-originais" / "trabalho-final.md",
    },
    {
        "input": BASE_DIR / "pdfs_instrucoes" / "InstrucoesSobreAparesentacaoDoTrabalhoFinalv4.pdf",
        "output": BASE_DIR / "docs" / "instrucoes-originais" / "instrucoes-apresentacao.md",
    },
    {
        "input": BASE_DIR / "pdfs_instrucoes" / "MinitutorialConversaoMapaParaGrafo_v2.pdf",
        "output": BASE_DIR / "docs" / "instrucoes-originais" / "minitutorial-conversao-mapa.md",
    },
]


def convert_pdfs():
    converter = DocumentConverter()

    for entry in PDFS:
        input_path: Path = entry["input"]
        output_path: Path = entry["output"]

        if not input_path.exists():
            print(f"[AVISO] Arquivo n?o encontrado: {input_path}")
            continue

        print(f"Convertendo: {input_path.name} ...")
        result = converter.convert(str(input_path))
        markdown = result.document.export_to_markdown()

        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(markdown, encoding="utf-8")
        print(f"  -> Salvo em: {output_path.relative_to(BASE_DIR)}")

    print("\nConvers?o conclu?da.")


if __name__ == "__main__":
    convert_pdfs()
