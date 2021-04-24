let canvas = document.getElementById('snake');
let context = canvas.getContext('2d');
let box = 16;

let snake = [];
snake[0] =
{
    x: 16 * box,
    y: 16 * box
};
let direction = 'right';

let food =
{
    x: Math.floor(Math.random() * 31 + 1) * box,
    y: Math.floor(Math.random() * 31 + 1) * box
};

let pontos = 0;
let start = false;
let recordista = [];
let recordes = [];
let baterRec = false
let mudou = false;
let rec;

// Criando background do canvas
function criarBG()
{
    context.fillStyle = '#383838';
    context.fillRect(0, 0, 32 * box, 32 * box); // Parâmetros (pos x, pos y, altura, largura)
}

// Desenhando a cobra no canvas
function criarCobra()
{
    for (let i = 0; i < snake.length; i++)
    {
        context.fillStyle = '#ad6531';
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// Desenhando a comida no canvas
function drawFood()
{
    context.fillStyle = '#f0ff1c';
    context.fillRect(food.x, food.y, box, box);
}

// Configurando as direções e teclas
document.addEventListener('keydown', update);
function update(event)
{
    if (event.keyCode == 37 && direction != 'right'){direction = 'left';}
    if (event.keyCode == 38 && direction != 'down'){direction = 'up';}
    if (event.keyCode == 39 && direction != 'left'){direction = 'right';}
    if (event.keyCode == 40 && direction != 'up'){direction = 'down';}
}

// Lendo dados dos recordistas
function pegarDados()
{
    if (localStorage.recordista0 == null && localStorage.recordes0 == null)
    {
        recordista = ['AAA', 'AAA', 'AAA', 'AAA', 'AAA'];
        recordes = ['000', '000', '000', '000', '000'];
    }
    else
    {
        for (let i = 0; i < 5; i++)
        {
            recordista[i] = localStorage.getItem(`recordista${i}`);
            recordes[i] = localStorage.getItem(`recordes${i}`);
        }
    }
}

let jogo = setInterval(iniciarJogo, 150);
function iniciarJogo()
{
    start = true;

    if (snake[0].x > (((32 * box) - box) - 1) && direction == 'right'){terminarJogo();}
    if (snake[0].x < box && direction == 'left'){terminarJogo();}
    if (snake[0].y > (((32 * box) - box) - 1) && direction == 'down'){terminarJogo();}
    if (snake[0].y < box && direction == 'up'){terminarJogo();}

    

    // Loop for para caso bater no corpo
    for (let i = 1; i < snake.length; i++) // Nosso i começa com 1 para não coincidir com o 0 da cabeça
    {
        if (snake.length >= 2)
        {
            // Meta dificil de alcançar, morder o próprio rabo
            if (snake[0].x == snake[snake.length - 1].x && snake[0].y == snake[snake.length - 1].y)
            {
                baterMeta('rabo');
                snake.pop();
            }
            // Batendo no próprio corpo
            else if (snake[0].x == snake[i].x && snake[0].y == snake[i].y)
            {
                terminarJogo();
            }
        }
    }

    criarBG();
    criarCobra();
    drawFood();
    pontuar(pontos);

    // Ponto de partida
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == 'right'){snakeX += box;}
    if (direction == 'left'){snakeX -= box;}
    if (direction == 'up'){snakeY -= box;}
    if (direction == 'down'){snakeY += box;}

    if (snakeX != food.x || snakeY != food.y)
    {
        // Função pop para tirar o último elemento do array
        snake.pop();
    }
    else
    {
        pontos += 10;
        food.x = Math.floor(Math.random() * 31 + 1) * box;
        food.y = Math.floor(Math.random() * 31 + 1) * box;
        switch(pontos)
        {
            case 30:
                baterMeta(30);
                break;
            case 60:
                baterMeta(60);
                break;
            case 100:
                baterMeta(100);
                break;
        }
        pontuar(pontos);
    }

    // Acrescentando a nova cabeça da cobra
    let newHead =
    {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

// Funções Pause
function pausar()
{
    if (start)
    {
        start = false;
        clicou('bt');
        clearInterval(jogo);
    }
    else
    {
        start = true;
        clicou('bt');
        jogo = setInterval(iniciarJogo, 150);
    }
}

// Pause acionado com a tecla barra de espaço
document.addEventListener('keydown', acionar)
function acionar(event)
{
    if(event.keyCode == 32)
    {
        pausar();
    }
}

function terminarJogo()
{
    clearInterval(jogo);
    document.getElementById('fim').style.visibility = 'visible';
    document.getElementById('end').style.animation = 'final 0.5s';
    document.getElementById('end').style.animationIterationCount = 'infinite';
    document.getElementById('end').style.animationDirection = 'alternate';
    document.getElementById('imgend').style.animation = 'final 0.5s';
    document.getElementById('imgend').style.animationIterationCount = 'infinite';
    document.getElementById('imgend').style.animationDirection = 'alternate';

    // Batendo recordes
    if (pontos > 100)
    {
        for (let i = 0; i <= 4; i++)
        {
            if (pontos > recordes[i])
            {
                baterRec = true
                entrarNome(i);
                break;
            }
        }
    }
}

function reiniciar(){
    snake = [];
    snake[0] =
    {
        x: 16 * box,
        y: 16 * box
    }
    direction = 'right';
    pontos = 0;
    document.getElementById('meusPontos').innerHTML = 0;
    start = false;
     
    if (mudou)
    {
        while (rec.firstChild)
        {
            rec.removeChild(rec.firstChild);
        }
            
        let tit = document.createElement('h3');
        tit.id = 'hRec';
        tit.innerText = 'RECORDES:';
        rec.appendChild(tit);
        rec.id = 'rec'
        rec.style.animation = '';
        mudou = false;
    }

    document.getElementById('fim').style.visibility = 'hidden';
    clicou('recomeco');
    jogo = setInterval(iniciarJogo, 150);
}

// Reiniciar acionado com a tecla Enter
document.addEventListener('keydown', apertarStart)
function apertarStart(event){
    if (event.keyCode == 13 && baterRec)
    {
        baterRec = false;
        okNome();
    }
    else if(event.keyCode == 13 && !baterRec)
    {
        reiniciar();
    }
}

// Transição após clicar em recordes
function mostrarRec(pts, nomes)
{
    if (typeof rec == 'undefined'){
        rec = document.getElementById('rec');
    }

    rec.style.animation = 'sair 1s';
    setTimeout(() => {rec.id = 'recOther';}, 1000);
    while (rec.firstChild)
    {
        rec.removeChild(rec.firstChild);
    }

    setTimeout(() =>
    {
        for (let i = 0; i < 4; i++)
        {
            let lista = document.createElement('h'+ (i + 1));
            lista.id = 'n' + (i + 1);

            rec.appendChild(lista);

            lista.appendChild(document.createTextNode(nomes[i] + ": " + pts[i]));

            // CSS para a lista de recordistas
            document.getElementById(`n${i + 1}`).style.fontSize = 20 - ((i * 4) - 3) + 'pt';
            document.getElementById(`n${i + 1}`).style.color = 'red';
            document.getElementById(`n${i + 1}`).style.textShadow = '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black';
            document.getElementById(`n${i + 1}`).style.marginTop = '-15px';
            if (lista.id == 'n1'){document.getElementById(`n${i + 1}`).style.textDecoration = 'underline'}
        }
    }, 1000);
    mudou = true;
}

// Função onclick para mostrar os recordistas
function enviarRec()
{
    if(!mudou)
    {
        let nomes = recordista;
        let pt = recordes;
        mostrarRec(pt, nomes);
    }
}

// Quando a cobra come a comida, mostra a nova pontuação no painel
function pontuar(pt)
{
    let display = document.getElementById('displayPts');

    while (display.firstChild)
    {
        display.removeChild(display.firstChild);
    }
    let meusPontos = document.createElement('span');
    meusPontos.id = 'meusPontos';

    display.appendChild(meusPontos);
    meusPontos.innerHTML = pt;
}

// Animações ao alcançar a meta de 100, ou 500, ou 1000 pontos
function baterMeta(alvo)
{
    let display = document.getElementById('metas');

    while (display.firstChild)
    {
        display.removeChild(display.firstChild);
    }
    let meta = document.createElement('img');
    meta.id = 'metaimg';

    display.appendChild(meta);

    switch(alvo)
    {
        case 30:
            meta.src = 'img/genial.png';
            meta.style.animation = 'fade 2s';
            break;
        case 60:
            meta.src = 'img/fanta.png';
            meta.style.animation = 'fade 2s';
            break;
        case 100:
            meta.src = 'img/espet.png';
            meta.style.animation = 'fade 2s';
            break;
        case 'rabo':
            let txt = document.createElement('p');
            txt.id = 'rabo';
            display.appendChild(txt);
            document.getElementById('rabo').innerHTML = 'UAU<br />COMEU O PRÓPRIO RABO ! ! !';
            document.getElementById('rabo').style.textAlign = 'center';
            document.getElementById('rabo').style.width = '300px';
            document.getElementById('rabo').style.marginTop = '100px';
            document.getElementById('rabo').style.marginLeft = '-120px';
            document.getElementById('rabo').style.animation = 'fade 7s';
            setTimeout(() => {document.getElementById('rabo').style.visibility = 'hidden';}, 7000);
            meta.src = 'img/dog.gif';
            meta.style.animation = 'fade 7s';
            break;
    }
}

// Pop-Up para mostrar que é possível acionar os botões clicando uma tecla
function popUp(id)
{
    document.getElementById(id).style.animation = '';
    setTimeout(() =>
    {
        document.getElementById(id).style.visibility = 'visible';
        document.getElementById(id).style.animation = 'popup 4s';
    }, 2000);
    setTimeout(() =>
    {
        document.getElementById(id).style.visibility = 'hidden';
    }, 6000);
}

// Animação para quando um botão for clicado
function clicou(id){
    let botao = document.getElementById(id);
    botao.style.animation = '';
    setTimeout(() => botao.style.animation = 'click 0.3s', 5);
}

function entrarNome(c)
{
    let putName = document.getElementById('entraNome');
    setTimeout(() =>
    {
        putName.style.visibility = 'visible';
        putName.style.animation = 'aparecer 1s';
        if (c == 0)
        {
            document.getElementById('txtrec').style.color = 'black';
            document.getElementById('txtrec').innerHTML = 'WOW<br />Você bateu o recorde de todos.<br />Coloque seu nome:';
            document.getElementById('fnome').focus();
        }
        else
        {
            document.getElementById('txtrec').style.color = 'black';
            document.getElementById('txtrec').innerHTML = 'Você está entre os recordistas.<br />Coloque seu nome:';
            document.getElementById('fnome').focus();
        }
    }, 1500);
}

function okNome()
{
    let putName = document.getElementById('entraNome');
    setTimeout(() =>
    {
        putName.style.animation = 'sair 0.3s';
        putName.style.visibility = 'hidden';
    }, 500);

    let name = document.getElementById('fnome').value;
    if(name == ''){name = 'AAA'};

    if(pontos > recordes[0])
    {
        recordes.unshift(pontos);
        recordista.unshift(name);
        recordes.pop;
        recordista.pop;
    }
    else
    {
        if (pontos > recordes[1])
        {
            recordista[4] = recordista[3];
            recordes[4] = recordes[3];
            recordista[3] = recordista[2];
            recordes[3] = recordes[2];
            recordista[2] = recordista[1];
            recordes[2] = recordes[1];
            recordista[1] = name;
            recordes[1] = pontos;
        }
        else if (pontos > recordes[2])
        {
            recordista[4] = recordista[3];
            recordes[4] = recordes[3];
            recordista[3] = recordista[2];
            recordes[3] = recordes[2];
            recordista[2] = name;
            recordes[2] = pontos;
        }
        else if (pontos > recordes[3])
        {
            recordista[4] = recordista[3];
            recordes[4] = recordes[3];
            recordista[3] = name;
            recordes[3] = pontos;
        }
        else if (pontos > recordes[4])
        {
            recordista[4] = name;
            recordes[4] = pontos;
        }
    }
    // Salvando dados dos recordistas
    for (let i = 0; i <= 4; i++)
    {
        localStorage.setItem(`recordista${i}`, recordista[i]);
        localStorage.setItem(`recordes${i}`, recordes[i]);
    }
    enviarRec();
}