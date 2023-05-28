const image = document.getElementById('myImage');
let canvas = document.createElement('canvas');

canvas.width = image.width;
canvas.height = image.height;

const ctx = canvas.getContext('2d');
ctx.drawImage(image, 0, 0);

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Obtém os dados da imagem no formato de imagem (ImageData)
const data = imageData.data; // Obtém os valores dos pixels da imagem

let pixels = []; // Array para armazenar os pixels da imagem

// Percorre os dados dos pixels e cria um array de pixels
for (let i = 0; i < data.length; i += 4) {
  let pixel = [
    data[i], // Valor do componente vermelho (red)
    data[i + 1], // Valor do componente verde (green)
    data[i + 2], // Valor do componente azul (blue)
    data[i + 3], // Valor do componente alfa (alpha)
  ];

  pixels.push(pixel); // Adiciona o pixel ao array de pixels
}

// Função para contar os pixels da imagem
function countPixels() {
  let countWhite = 0; // Contador para pixels brancos
  let countRed = 0; // Contador para pixels vermelhos
  let countRedWithBlue = 0; // Contador para pixels vermelhos que cairão na água (pixels azuis)

  // Percorre os dados dos pixels
  for (let i = 0; i < data.length; i += 4) {
    const [red, green, blue, alpha] = data.slice(i, i + 4); // Extrai os valores do pixel atual

    // Verifica se o pixel é branco
    if (red === 255 && green === 255 && blue === 255 && alpha === 255) {
      countWhite++;
    }

    // Verifica se o pixel é vermelho
    if (red === 255 && green === 0 && blue === 0 && alpha === 255) {
      countRed++;

      let y = Math.floor(i / 4 / canvas.width); // Calcula a posição y do pixel na imagem
      let x = (i / 4) % canvas.width; // Calcula a posição x do pixel na imagem

      let bluePixelFound = false; // Flag para verificar se um pixel azul foi encontrado

      // Percorre a linha vertical do pixel atual em busca de pixels azuis
      for (
        let j = y * canvas.width * 4 + x * 4;
        j < data.length;
        j += canvas.width * 4
      ) {
        let r = data[j];
        let g = data[j + 1];
        let b = data[j + 2];
        let a = data[j + 3];

        // Verifica se o pixel atual é azul
        if (r === 0 && g === 0 && b === 255 && a === 255) {
          bluePixelFound = true;
          break;
        }
      }

      if (bluePixelFound) {
        countRedWithBlue++; // Incrementa o contador de pixels vermelhos com azul
      }
    }
  }

  console.log('Quantidade de pixels brancos:', countWhite);
  console.log('Quantidade de pixels vermelhos:', countRed);
  console.log(
    'Quantidade de pixels vermelhos com pixel azul:',
    countRedWithBlue,
  );
}

// Função para decodificar uma string binária em uma string de caracteres
function decodeBinaryString(binaryString) {
  const binaryChunks = [];
  for (let i = 0; i < binaryString.length; i += 8) {
    binaryChunks.push(binaryString.slice(i, i + 8));
  }

  const decodedChars = binaryChunks.map((chunk) =>
    String.fromCharCode(parseInt(chunk, 2)),
  );
  const decodedString = decodedChars.join('');

  return decodedString;
}

// Função para encontrar a mensagem oculta na imagem
function findMessage() {
  const RED = [255, 0, 0, 255]; // Cor vermelha (red)
  const WHITE = [255, 255, 255, 255]; // Cor branca (white)

  const redPixelsCount = new Int16Array(image.width); // Array para contar pixels vermelhos
  const whitePixelsCount = new Int16Array(image.width); // Array para contar pixels brancos

  // Percorre os pixels da imagem
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const pixel = pixels[x + y * image.width]; // Obtém o pixel atual

      // Verifica se o pixel é vermelho
      if (pixel.every((value, index) => value === RED[index])) {
        redPixelsCount[x]++; // Incrementa o contador de pixels vermelhos
      }
      // Verifica se o pixel é branco
      else if (pixel.every((value, index) => value === WHITE[index])) {
        whitePixelsCount[x]++; // Incrementa o contador de pixels brancos
      }
    }
  }

  console.log(whitePixelsCount);
  let string1 = whitePixelsCount.join(''); // Converte o contador de pixels brancos em uma string
  string1 = decodeBinaryString(string1); // Decodifica a string binária
  let string2 = redPixelsCount.join(''); // Converte o contador de pixels vermelhos em uma string
  string2 = decodeBinaryString(string2); // Decodifica a string binária

  console.log(string1, string2);

  return [string1, string2]; // Retorna as strings decodificadas
}

// Manipulador de evento para quando a imagem é carregada
image.onload = () => {
  countPixels(); // Chama a função para contar os pixels
  findMessage(); // Chama a função para encontrar a mensagem oculta
};
