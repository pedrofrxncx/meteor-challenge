# meteor-challenge
Desafio para a vaga de estágio da Tarken

# Execução do código

Para rodar o código, basta salvar os três arquivos em uma pasta e abrir o arquivo index.html. As respostas serão exibidas no console do navegador.

# Análise do desafio
 
A primeira etapa do processo de resolução deste desafio foi analítica. Após a leitura dos enunciados, compreendi que eu precisaria fazer uma verificação pixel por pixel da imagem para conseguir concluir as três primeiras tarefas. O passo seguinte foi decidir qual ferramenta
seria utilizada para tal. Minhas opções eram as linguagens com as quais eu possuo alguma experiência; JavaScript, C e Python. Eliminei C prontamente, pois adicionaria uma complexidade desnecessária à resolução do desafio. Entre JavaScript e Python, eu optei pela primeira, dado o
contexto da vaga (que requer conhecimentos em JavaScrypt) e pensando também em facilitar o lado do avaliador; bastaria baixar os três arquivos, abrir o arquivo index e ler os resultados no console.

# Explicação

A lógica que antecede o código é bem simples: sabendo o valor RGBA dos pixels da imagem, eu simplesmente precisaria fazer uma iteração sobre todos os pixels e comparar os valores RGBA do pixel com os valores da cor do elemento (branco/vermelho). Assim, para cada pixel branco ou vermelho encontrado, o contador de estrelas/meteoros seria incrementado em 1. Para encontrar a quantidade de meteoros que cairiam na água, bastou pegar os valores RGBA da água e, na iteração que busca pixels vermelhos, ao encontrar um, é realizada uma busca por um pixel azul no mesmo eixo Y do vermelho. Como todos os trechos de água da imagem estão acima do solo e não abaixo, essa simples verificação foi suficiente.

# Bônus - frase escondida

Essa foi a parte divertida. Primeiro, considerei a possibilidade da mensagem estar escondida em binário. Assim, sabendo que a mensagem teria 175 caracteres, eu precisaria encontrar o número 1400 em algum lugar (um caractere, em binário, possui 8 dígitos, logo, 175 * 8). Olhando para os valores já encontrados nos itens anteriores (315, 328, 105), não consegui encontrar relação, então cheguei à conclusão de que a mensagem não seria encontrada numa relação direta com a quantidade de pixels brancos/vermelhos. Depois de alguns momentos procurando alguma pista, percebi que a imagem possui 704 pixels de largura. Desconsiderando os pixels azuis do céu, restam dois tipos: vermelho e branco. Multiplicando a largura pela quantidade de pixels, encontrei 1408. Não era o número exato que eu buscava, mas já era um bom ponto de partida. Tendo a largura da imagem como base, passei a observar as colunas da imagem. Aparentemente, uma coluna poderia ter um pixel vermelho e/ou um branco, ou nenhum dos dois. O próximo passo, então, foi confirmar essa suposição; fiz uma nova função que percorre todas as colunas da imagem e conta a quantidade de pixels vermelhos e brancos em cada coluna. A confirmação veio logo: os valores encontrados eram sempre 0 ou 1. Assim, tendo dois vetores com tamanho 704, ambos contendo em cada uma de suas posições apenas um valor 0 ou 1, eu apenas precisei converter cada vetor para uma string e depois transformar a string binária em uma string de caracteres. O resultado foi uma clássica e inspiradora frase do filme Rocky Balboa. Curiosamente, a frase possui 177 caracteres (contando espaços) em vez dos 175. Existe um espaço (provavelmente não intencional) no meio de uma das palavras. Ao removê-lo, temos 176 caracteres. Assim, não foi encontrada uma frase com exatos 175 caracteres, mas acredito que seja um simples erro do desafio, e desconsiderei a chance de existir uma segunda frase.

# Respostas

    Número de estrelas              315
    Number de meteoros              328
    Meteoros caindo na água         105
    (opcional) frase escondida      "It's not about how hard you hit. It's about how hard you can get hit and keep moving fo rward. How much you can take and keep moving forward"  - Rocky Balboa/Sylvester Stallone

