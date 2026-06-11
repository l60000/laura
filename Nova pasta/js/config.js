/**
 * CONFIGURAÇÃO — edite este arquivo para personalizar o site
 *
 * FOTOS: coloque suas imagens em assets/images/ e atualize os caminhos abaixo.
 * MÚSICA: coloque seu arquivo em assets/audio/ e atualize musicSrc.
 *         Formatos suportados: .mp3, .ogg, .wav
 */

const SITE_CONFIG = {
  // Caminho da música romântica (galeria de memórias)
  musicSrc: 'assets/audio/musica-romantica.mp3',

  // Galeria de fotos — substitua src pelas suas fotos reais
  photos: [
    {
      src: 'assets/images/foto1.jpg', // fallback demo: foto1.svg
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
  ],

  // Placeholders SVG usados quando as fotos .jpg ainda não existirem
  photoFallbacks: [
    'assets/images/foto1.svg',
    'assets/images/foto2.svg',
    'assets/images/foto3.svg',
    'assets/images/foto4.svg',
  ],

  // Duração de cada foto na galeria (ms)
  photoDuration: 5000,
};
