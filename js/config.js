/**
 * ═══════════════════════════════════════════════════════════════
 *  CONFIGURAÇÃO — edite este arquivo para personalizar o site
 * ═══════════════════════════════════════════════════════════════
 *
 *  📁 MÚSICA:
 *     1. Coloque seus arquivos em:  assets/audio/
 *     2. musicSrc       → música da galeria de fotos
 *     3. finaleMusicSrc → música do final ("Eu te amo…" em diante)
 *
 *  📷 FOTOS (10 no total):
 *     1. Coloque suas imagens em:  assets/images/
 *     2. Nomeie como foto1.jpg … foto10.jpg (ou altere os caminhos abaixo)
 *     3. Edite as legendas (caption) de cada foto
 *
 *  ⏱️ TIMING:
 *     - musicDuration: duração total da música (1min 40s = 100000ms)
 *     - photoDuration: tempo de cada foto (10s = 10000ms)
 *     - Com esses valores, cabem ~10 fotos na galeria
 */

const SITE_CONFIG = {
  // ── MÚSICA ──────────────────────────────────────────────────
  musicSrc: 'assets/audio/musica-romantica.mp3',        // galeria de fotos
  finaleMusicSrc: 'assets/audio/musica-final.mp3',     // declaração + créditos finais
  musicDuration: 100000, // 1 minuto e 40 segundos

  // ── FOTOS (10 fotos — uma a cada 10s durante 1min40 de música) ──
  photos: [
    {
      src: 'assets/images/foto1.jpg',
      caption: 'Você é tão linda meu amor ❤️',
    },
    {
      src: 'assets/images/foto2.jpg',
      caption: 'Você é tão perfeita quanto os seus olhos meu amor ❤️',
    },
    {
      src: 'assets/images/foto3.jpg',
      caption: 'Você é a mulher da minha vida amor ❤️',
    },
    {
      src: 'assets/images/foto4.jpg',
      caption: 'Feliz Dia dos Namorados, futura mãe dos meus filhos ❤️',
    },
    {
      src: 'assets/images/foto5.jpg',
      caption: 'Cada momento ao seu lado é um presente ❤️',
    },
    {
      src: 'assets/images/foto6.jpg',
      caption: 'Você ilumina meus dias ❤️',
    },
    {
      src: 'assets/images/foto7.jpg',
      caption: 'Minha pessoa favorita no mundo ❤️',
    },
    {
      src: 'assets/images/foto8.jpg',
      caption: 'Te escolheria mil vezes ❤️',
    },
    {
      src: 'assets/images/foto9.jpg',
      caption: 'Nosso amor é eterno ❤️',
    },
    {
      src: 'assets/images/foto10.jpg',
      caption: '',
    },
  ],

  // Placeholders SVG (demo local) — um por foto, caso o .jpg não exista ainda
  photoFallbacks: [
    'assets/images/foto1.svg',
    'assets/images/foto2.svg',
    'assets/images/foto3.svg',
    'assets/images/foto4.svg',
    'assets/images/foto5.svg',
    'assets/images/foto6.svg',
    'assets/images/foto7.svg',
    'assets/images/foto8.svg',
    'assets/images/foto9.svg',
    'assets/images/foto10.svg',
  ],

  // Frases "eu te amo" em vários idiomas (pós-créditos)
  loveTranslations: [
    'Eu te amo.',
    'I love you.',
    "Je t'aime.",
    'Te amo.',
    'Ti amo.',
    'Ich liebe dich.',
    '愛してる。',
    '사랑해.',
    '我爱你.',
    'Я тебя люблю.',
    'Ik hou van je.',
    'Seni seviyorum.',
    'Jeg elsker deg.',
    'Jag älskar dig.',
    'Kocham cię.',
  ],

  finaleLines: [
    'Feliz Dia dos Namorados ❤️',
    'Obrigado por existir na minha vida.',
  ],

  // Encerramento final (após os créditos)
  herName: 'Laura',
  finalLoveLine: 'eu te amo.',
  finaleButtonText: 'eu também te amo, meu amor',

  // Tempo de exibição de cada foto (10 segundos)
  photoDuration: 10000,
};
