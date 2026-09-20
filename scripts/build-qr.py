#!/usr/bin/env python3
"""Gera img/qr.svg e img/qr-print.svg — o QR que vai em cartão, crachá e proposta.

O endereço do site é a única coisa que muda aqui. Quando a CASA MARTECH tiver
domínio próprio, troque SITE e rode de novo; o material já impresso continua
funcionando enquanto o endereço antigo estiver anexado ao projeto na Vercel.

Uso (dev): pip install segno && python3 scripts/build-qr.py

O SVG sai no mesmo formato de sempre: 33 módulos de dados, 2 de margem de cada
lado (viewBox 37), e cada linha vira um punhado de <rect> por corrida de
módulos pretos — é o que mantém o arquivo pequeno e nítido em qualquer tamanho.
"""
import segno
from pathlib import Path

SITE = 'https://casamartech.vercel.app/?utm_source=qr'
RAIZ = Path(__file__).resolve().parent.parent

TEMAS = {
    'img/qr.svg':       ('#F1EEE6', '#0B0D12'),  # na tela, creme e quase preto
    'img/qr-print.svg': ('#FFFFFF', '#000000'),  # no papel, preto no branco
}

qr = segno.make(SITE, error='Q', boost_error=False)
matriz = [[1 if v else 0 for v in linha] for linha in qr.matrix]
lado = len(matriz)
margem = 2
caixa = lado + margem * 2

for arquivo, (fundo, tinta) in TEMAS.items():
    partes = []
    for y, linha in enumerate(matriz):
        x = 0
        while x < lado:
            if linha[x]:
                largura = 1
                while x + largura < lado and linha[x + largura]:
                    largura += 1
                partes.append(
                    f'<rect x="{x + margem}" y="{y + margem}" width="{largura}" height="1"/>')
                x += largura
            else:
                x += 1
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {caixa} {caixa}" '
           f'shape-rendering="crispEdges" role="img" aria-label="QR code do site da CASA MARTECH">'
           f'<rect width="{caixa}" height="{caixa}" fill="{fundo}"/>'
           f'<g fill="{tinta}">' + ''.join(partes) + '</g></svg>')
    (RAIZ / arquivo).write_text(svg, encoding='utf-8')
    print(arquivo, 'gerado —', lado, 'módulos, versão', qr.version, 'ECC Q')
