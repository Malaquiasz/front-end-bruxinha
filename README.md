# Bruxinha — Tarot, Magia & Terapias Holísticas

Landing page sofisticada, imersiva e contemplativa para a marca **Bruxinha**.

O objetivo não é parecer um site genérico de tarot, espiritualidade ou esoterismo — e tampouco uma estética "Halloween", "gótica" ou "witchcore". A experiência deve lembrar um **templo antigo, um observatório celestial ou uma biblioteca de alquimia**, onde tudo respira calma, mistério e elegância.

## Direção de arte

### Paleta
- Preto profundo `#09050A`
- Vinho `#180913`
- Bordô `#2A0D18`
- Roxo muito escuro `#24111F`
- Vermelho queimado `#A53F48`
- Terracota `#C6655A`
- Marfim `#F5ECE4`
- Dourado envelhecido `#C7A96B` — usado apenas em pequenos detalhes, como joias

### Tipografia
- **Títulos:** Cormorant Garamond (peso forte, espaçamento amplo)
- **Textos:** Manrope (muito leve, altura confortável)

### Atmosfera
- Fundo com profundidade: granulado suave, vinheta escura, névoa discreta, partículas quase invisíveis, constelações apagadas e gradientes vivos — como um céu noturno profundo.
- Movimento quase imperceptível: a lua oscila menos de 1° em ~12s; a fumaça se move lentamente; elementos decorativos respiram entre `0.99` e `1.01` em ciclos longos.
- Sem brilhos exagerados, sem glitter, sem partículas excessivas.
- Textura de papel artesanal no corpo da página — imperceptível, remove a aparência digital.

### Living Ritual — nada se repete
- **Chama orgânica:** balança por composição de senoides irregulares — nunca balança igual duas vezes.
- **Brilho da lua da carta:** pulsa lentamente com ritmo assimétrico (ciclo de 12–18s).
- **Constelações:** oscilam menos de 2px em ciclos de ~40s, cada estrela com fase própria; linhas com opacidade entre 8% e 15%, apenas alguns agrupamentos conectados.
- **Poeira iluminada:** partículas quase invisíveis que sobem, descem ou permanecem suspensas, com velocidades independentes.
- **Luz global:** a temperatura da iluminação ambiente transita entre vinho profundo e âmbar muito discreto ao longo de ~2 minutos.
- **Parallax multicamadas:** carta, cristal, lua e constelação respondem ao mouse com velocidades próprias (movimento < 20px).

### Interações
- **Hero ritualístico:** composição de lua crescente, carta de tarot (A Sacerdotisa), cristal, vela e constelação — sem imagens externas, tudo em SVG/CSS puro.
- **Carta 3D:** inclinação seguindo o mouse, máx. 5°, com respiração sutil (100% → 100.4% → 100% em ~18s), textura de papel fino e sombras profundas.
- **Luz da vela:** luz quente difusa irradiando da chama, atingindo carta, cristal e fundo; o cristal reage com reflexos internos.
- **Cursor customizado:** círculo fino dourado que se transforma lentamente em uma estrela de quatro pontas sobre elementos interativos (apenas dispositivos com hover).
- **Estrela cadente** cruza lentamente o fundo ao entrar no site; a constelação aparece discretamente após alguns segundos.
- **Scroll como narrativa:** opacidade + translateY + blur + escala mínima, cada seção aparece em etapas como capítulos de um filme.
- **Botões como objetos preciosos:** textura metálica fosca, luz que percorre a superfície em ~1,5s no hover (ouro escovado).
- **Hover orgânico:** todos os elementos interativos respondem suavemente (movimento < 3px, escala máx. 101%, easing elegante).
- **Modal de vídeo:** ao abrir, o fundo escurece como se uma vela tivesse sido apagada.

## Estrutura

```
.
├── index.html              → Landing (hero ritual, comunidade, serviços, agendamento, cadastro, pagamento)
├── sobre.html              → Sobre a Bruxinha
├── contato.html            → Contato
├── tarot.html              → Serviço: Tarot
├── divorcio-energetico.html→ Serviço: Divórcio Energético
├── magia.html              → Serviço: Magia
├── terapias-holisticas.html→ Serviço: Terapias Holísticas
├── roda-de-cura-mulheres.html → Serviço: Roda de Cura — Mulheres
├── cursos.html             → Serviço: Cursos
├── palestras-eventos.html  → Serviço: Palestras & Eventos
├── privacidade.html        → Política de Privacidade
├── termos.html             → Termos de Uso
├── style.css               → Design system + atmosfera (CSS/SVG)
├── script.js               → Interações e camada de atmosfera (Canvas)
└── README.md
```

## Funcionalidades
- Navegação suave + scrollspy na navbar
- Menu mobile (hambúrguer)
- Scroll reveal com blur
- Contadores animados das redes sociais
- Accordion de serviços (um aberto por vez)
- Agendamento com data mínima e horários
- Cadastro rápido com validação + máscara de telefone
- Modal de vídeo (YouTube / Instagram)
- Cursor customizado
- Carta de tarot com tilt 3D
- Estrelas/constelação via Canvas
- Botão voltar ao topo

## Performance
- Animações priorizam CSS e SVG; o canvas de estrelas é econômico (~70 partículas).
- `prefers-reduced-motion` é respeitado: todas as animações e transições são desativadas.
- Sem dependências externas além das fontes do Google Fonts.

## Como executar
Basta abrir `index.html` em um navegador. Nenhuma build ou instalação necessária.

