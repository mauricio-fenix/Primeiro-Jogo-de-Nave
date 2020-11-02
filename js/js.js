function start() { // Inicio da função start()

	$("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    var jogo = {};
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    var fimdejogo=false;
    var podeAtirar=true;
    var pontos=0;
    var salvos=0;
    var perdidos=0;
    var energiaAtual=3;

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");
    var somhelicopter=document.getElementById("enginehelicopter");
    var somtruck=document.getElementById("truckpass");

    jogo.pressionou = []
    somtruck.play();
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();
    somhelicopter.addEventListener("ended", function(){ somhelicopter.currentTime = 0; somhelicopter.play();}, false);
    somhelicopter.play();

    jogo.timer = setInterval(loop, 30);

    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
        });
    
    
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
    
    function loop() {
	
        movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
    }
    
    function movejogador() {
	
	    if (jogo.pressionou[TECLA.W]) {
		    var topo = parseInt($("#jogador").css("top"));
            if(topo > 9){
                $("#jogador").css("top",topo-10);
            }
	    }
	
	    if (jogo.pressionou[TECLA.S]) {
		
            var topo = parseInt($("#jogador").css("top"));
            if(topo < 439){
                $("#jogador").css("top",topo+10);
            }
	    }
	
	    if (jogo.pressionou[TECLA.D]) {
		
	    	disparo();
        }
    }

    function moveinimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",posicaoX-9);
                
            if (posicaoX<=0) {
            
                $("#inimigo2").css("left",775);
                somtruck.play();
                    
            }
    }

    function disparo() {
	
        if (podeAtirar==true) {
            
        podeAtirar=false;
        somDisparo.play();
        topo = parseInt($("#jogador").css("top"))
        posicaoX= parseInt($("#jogador").css("left"))
        tiroX = posicaoX + 190;
        topoTiro=topo+37;
        $("#fundoGame").append("<div id='disparo'></div");
        $("#disparo").css("top",topoTiro);
        $("#disparo").css("left",tiroX);
        
        var tempoDisparo=window.setInterval(executaDisparo, 30);
        
        } //Fecha podeAtirar
     
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX+35); 
    
                if (posicaoX>900) {
                            
                    window.clearInterval(tempoDisparo);
                    tempoDisparo=null;
                    $("#disparo").remove();
                    podeAtirar=true;
                        
                }
        } // Fecha executaDisparo()
    }

    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

	    if (colisao1.length>0) {

            somExplosao.play();
            energiaAtual--;
            pontos -= 20;
	        inimigo1X = parseInt($("#inimigo1").css("left"));
	        inimigo1Y = parseInt($("#inimigo1").css("top"));
	        explosao1(inimigo1X,inimigo1Y);

	        posicaoY = parseInt(Math.random() * 334);
	        $("#inimigo1").css("left",694);
        	$("#inimigo1").css("top",posicaoY);
        }
        
        if (colisao2.length>0) {
            
            somExplosao.play();
            energiaAtual--;
            pontos -= 35;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao1(inimigo2X,inimigo2Y);
                    
            $("#inimigo2").remove();
                
            reposicionaInimigo2();
                
        }

        if (colisao3.length>0) {
            
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

            if (colisao4.length>0) {

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

            if (colisao5.length>0) {
                somResgate.play();
                salvos++;
                reposicionaAmigo();
                $("#amigo").remove();
            }

            if (colisao6.length>0) {
                somPerdido.play();
                perdidos++;
                amigoX = parseInt($("#amigo").css("left"));
                amigoY = parseInt($("#amigo").css("top"));
                explosao3(amigoX,amigoY);
                $("#amigo").remove();
                        
                reposicionaAmigo();
                        
                }
    
    }

    function reposicionaInimigo2() {
	
        var tempoColisao4=window.setInterval(reposiciona4, 5000);
            
            function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4=null;
                
                if (fimdejogo==false) {
                
                $("#fundoGame").append("<div id=inimigo2></div");
                somtruck.play();
                
                }
                
            }	
    }

    function reposicionaAmigo() {
	
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
            function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            if (fimdejogo==false) {
            
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            
            }
            
        }
        
    }

    function placar() {
	
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
        
    }

    function energia() {
	
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
    
    function gameOver() {
        fimdejogo=true;
        musica.pause();
        somhelicopter.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#placar").remove();
        $("#energia").remove();
        
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