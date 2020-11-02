function start() { // Inicio da função start()
// A função start() inicializa todo o conteúdo e geri toda lógica do jogo

	$("#inicio").hide(); // Assim que iniciada esconde o "menu" principal e inicial o jogo ...
    
    // ... inicia criando na tela (append) as divs jogador,inimigos,amigos,placar e energia
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    var jogo = {}; //variável principal de jogo (dicionário)
    var TECLA = { //Definição de teclas e refências de seus códigos (Keycodes)
        W: 87,
        S: 83,
        D: 68
    }

    var fimdejogo=false; //Referência para o fim de jogo ou não
    var podeAtirar=true; //Permissão para atirar
    var pontos=0; //contagem de pontos
    var salvos=0; // ...
    var perdidos=0; // ...
    var energiaAtual=3; // energia do jogador

    // Inicialização das variáveis para som
    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");
    var somhelicopter=document.getElementById("enginehelicopter");
    var somtruck=document.getElementById("truckpass");

    jogo.pressionou = [] //Variável que pega a tecla pressionada no Array
    somtruck.play(); //toca o som do caminhão, tem que ser chamado aqui por conta de passar logo de primeira
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false); // Adciona um evento listener de fim (ended) e fica tocando a musica novamente
    musica.play(); //Toca a música de fato
    somhelicopter.addEventListener("ended", function(){ somhelicopter.currentTime = 0; somhelicopter.play();}, false); // mesma coisa com o som do helicoptero
    somhelicopter.play(); // ...

    jogo.timer = setInterval(loop, 30); //Dá a variável principal um timer, um setInterval de a cada (30ms) chama a função (loop())

    $(document).keydown(function(e){ //Aqui o jQuery captura um keydown->(estudar para entender essa função)
        jogo.pressionou[e.which] = true; // trata o array receptor
        });
    
    
    $(document).keyup(function(e){ // ... mesmo só que keyup
        jogo.pressionou[e.which] = false;
    });
    
    function loop() { //Função principal que é chamada por jogo a cada 30ms
	
        movefundo();    //chama movefundo()
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }
    
    function movejogador() {
	
	    if (jogo.pressionou[TECLA.W]) { // Verifica se a tecla W foi pressionada
		    var topo = parseInt($("#jogador").css("top")); // topo recebe um inteiro do valor top  de #jogador
            if(topo > 9){ //só limita o movimento
                $("#jogador").css("top",topo-10); // define o top de jogador passando topo-10 
            }
	    }
	
	    if (jogo.pressionou[TECLA.S]) { //idem ....
		
            var topo = parseInt($("#jogador").css("top"));
            if(topo < 439){
                $("#jogador").css("top",topo+10);
            }
	    }
	
	    if (jogo.pressionou[TECLA.D]) { // pressionado o D atira ....
		
	    	disparo();
        }
    }

    function moveinimigo2() { // Move inimigo
        posicaoX = parseInt($("#inimigo2").css("left")); //pega a posição em X do inimigo2
        $("#inimigo2").css("left",posicaoX-9); //passa novo valor para o X menos 9
                
            if (posicaoX<=0) { //define a posição de reset
            
                $("#inimigo2").css("left",775); //reseta colocando o X em 775
                somtruck.play(); //toca o som do caminhão
                    
            }
    }

    function disparo() {
	
        if (podeAtirar==true) {
            
        podeAtirar=false; //proíbe o tiro 
        somDisparo.play(); //som disparo
        topo = parseInt($("#jogador").css("top")) //pega o top de jogador
        posicaoX= parseInt($("#jogador").css("left")) //pega o left de jogador
        tiroX = posicaoX + 190; //define a posição do tiro para a ponta do helicoptero
        topoTiro=topo+37; // ...
        $("#fundoGame").append("<div id='disparo'></div"); // cria o tiro na tela
        $("#disparo").css("top",topoTiro); // define o top
        $("#disparo").css("left",tiroX); // define o left
        
        var tempoDisparo=window.setInterval(executaDisparo, 30); // depois de criar, chama executadisparo a cada 30ms
        
        } //Fecha podeAtirar
     
        function executaDisparo() { // executa essa função até resetar
            posicaoX = parseInt($("#disparo").css("left")); // pega posição do tiro
            $("#disparo").css("left",posicaoX+35);  // acrescenta no left ...
    
                if (posicaoX>900) { //ponto de reset
                            
                    window.clearInterval(tempoDisparo); //limpa o tempo da variavel
                    tempoDisparo=null; // reseta e para de ser chamada
                    $("#disparo").remove(); // remove o tiro da tela
                    podeAtirar=true; // pode atirar novamente
                        
                }
        } // Fecha executaDisparo()
    }

    function colisao() { //collision é externo, jQuery Collision
        var colisao1 = ($("#jogador").collision($("#inimigo1"))); // assim é o modelo, #jogador colide com #inimigo1
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

	    if (colisao1.length>0) { // se ocorreu a colisão o tamanho é maior que zero

            somExplosao.play();
            energiaAtual--;
            pontos -= 20;
	        inimigo1X = parseInt($("#inimigo1").css("left"));
	        inimigo1Y = parseInt($("#inimigo1").css("top"));
	        explosao1(inimigo1X,inimigo1Y); // chama explosão passando a posição do inimigo no momento da colisão

	        posicaoY = parseInt(Math.random() * 334); // só randomiza a posição do Y (altura)
	        $("#inimigo1").css("left",694);  //o inimigo é reposicionado
        	$("#inimigo1").css("top",posicaoY); // ...
        }
        
        if (colisao2.length>0) { //idem ... com o inimigo 2
            
            somExplosao.play();
            energiaAtual--;
            pontos -= 35;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao1(inimigo2X,inimigo2Y);
                    
            $("#inimigo2").remove(); //na hora de colidir remove a div 
                
            reposicionaInimigo2(); //recria a div
                
        }

        if (colisao3.length>0) { // idem com o disparo e o inimigo1
            
            pontos=pontos+100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            somExplosao.play();
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950);
            podeAtirar = true;
            
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
                
            }

            if (colisao4.length>0) { // idem com o disparo e o inimigo2

                somExplosao.play();
                console.log(pontos=pontos+50);
                inimigo2X = parseInt($("#inimigo2").css("left"));
                inimigo2Y = parseInt($("#inimigo2").css("top"));

                $("#inimigo2").remove();
            
                explosao1(inimigo2X,inimigo2Y);
                $("#disparo").css("left",950);
                podeAtirar = true;
                
                reposicionaInimigo2();
                    
            }

            if (colisao5.length>0) { // regate do amigo
                somResgate.play();
                salvos++;
                reposicionaAmigo();
                $("#amigo").remove();
            }

            if (colisao6.length>0) { // colisão do inimigo2 com o amigo
                somPerdido.play();
                perdidos++;
                amigoX = parseInt($("#amigo").css("left"));
                amigoY = parseInt($("#amigo").css("top"));
                explosao3(amigoX,amigoY); //chama explosao3 passando a posição do amigo no momento da colisão
                $("#amigo").remove();
                        
                reposicionaAmigo();
                        
                }
    
    }

    function reposicionaInimigo2() {
	
        var tempoColisao4=window.setInterval(reposiciona4, 5000); // só chama a reposição após 5seg
            
            function reposiciona4() {
            window.clearInterval(tempoColisao4); //limpa o tempo
            tempoColisao4=null;// não chama mais
                
                if (fimdejogo==false) { //verifica se a var fimdejogo está válida
                
                $("#fundoGame").append("<div id=inimigo2></div"); //recria o inimigo2
                somtruck.play();
                
                }
                
            }	
    }

    function reposicionaAmigo() {//idem com o amigo, só que chama com 6seg
	
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
            function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            if (fimdejogo==false) {
            
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            
            }
            
        }
        
    }

    function placar() { //escreve na div #placar os pontos em h2, essa função é chamada em loop() o que faz com que ela seja atualizada 
	
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
        
    }

    function energia() { //função energia, para cada valor ... seta uma imagem para a div
	
		if (energiaAtual==3) {
			
			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}
	
		if (energiaAtual==2) {
			
			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}
	
		if (energiaAtual==1) {
			
			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}
	
		if (energiaAtual==0) {
			
			$("#energia").css("background-image", "url(imgs/energia0.png)");
			
			gameOver();
		}
	
    }
    
    function gameOver() { //fim de jogo
        fimdejogo=true; //seta o fim de jogo
        musica.pause(); //pausa a musica de fim
        somhelicopter.pause(); //pausa helicoptero
        somGameover.play(); //toca o gameover
        
        window.clearInterval(jogo.timer); //limpa a var jogo.time
        jogo.timer=null;    //reseta a var
        
        //remove as divs de jogo
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#placar").remove();
        $("#energia").remove();
        
        //mostra o "menu" de game over
        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p><p>Você regatou: " + salvos + " amigos</p><p>Perdeu: " + perdidos + " amigos</p><div id='reinicia' onClick=reiniciaJogo()><button>Jogar Novamente</button></div>");
        } // Fim da função gameOver();
    

} // Fim da função start



function movefundo() {
	
	esquerda = parseInt($("#fundoGame").css("background-position"));
	$("#fundoGame").css("background-position",esquerda-4);
	
}

function moveinimigo1() {
    velocidade = 15;
    posicaoX = parseInt($("#inimigo1").css("left"));
    posicaoY = parseInt($("#inimigo1").css("top"));
        
    $("#inimigo1").css("left",posicaoX-velocidade);
	    $("#inimigo1").css("top",posicaoY);
		
		if (posicaoX<=0) {
            posicaoY = (Math.random() * 334);
		    $("#inimigo1").css("left",694);
		    $("#inimigo1").css("top",posicaoY);
		}
}



function moveamigo() {
	
	posicaoX = parseInt($("#amigo").css("left"));
	$("#amigo").css("left",posicaoX+1);
				
		if (posicaoX>906) {
			
		$("#amigo").css("left",0);
					
		}

}

function explosao1(inimigo1X,inimigo1Y) {

    
	$("#fundoGame").append("<div id='explosao1'></div");
	$("#explosao1").css("background-image", "url(imgs/explosao.png)");
	var div=$("#explosao1");
	div.css("top", inimigo1Y);
	div.css("left", inimigo1X);
	div.animate({width:200, opacity:0}, "slow");
	
	var tempoExplosao=window.setInterval(removeExplosao, 1000);
	
		function removeExplosao() {
			
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao=null;
			
		}
		
    }
    
    function explosao3(amigoX,amigoY) {
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3=window.setInterval(resetaExplosao3, 500);
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3=null;   
        }
        
    }

    function reiniciaJogo() {
        somGameover.pause();
        $("#fim").remove();
        start();
        
    }