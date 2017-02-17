
var game;


var app={
    diametroMoneda: 33,
    init: function(){

        nivel = 1;
        puntuacion = 0;
        monedasCaidas = 1;
        vidas = 3;

        alto  = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        //Audios, archivos extraidos de freesound.org
        audioMoneda = new Audio('audio/213979__fenrirfangs__coin.mp3');
        audioFallo = new Audio('audio/171497__fins__error.mp3');

        //app.sensorMovimiento();
        app.esEscritorio();
        app.inicioJuego();
        document.body.addEventListener("keydown", app.eventoTeclado, false);
        document.addEventListener("touchstart", app.touchStart, false);
        document.addEventListener("touchmove", app.touchMove, false);
        document.addEventListener("touchend", app.touchEnd, false);


    },
    inicioJuego: function(){

        function preload(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.stage.backgroundColor = '#67d0ff';
            game.load.image('cerdito', 'img/cerdito-mini.png');
            game.load.image('moneda', 'img/moneda-mini.png');
            game.load.image('billete', 'img/billete-mini.png')
            game.load.atlasJSONHash('cerditos', 'img/sprite/cerdito.png', 'img/sprite/cerdito.json');
        }

        function create(){

            
            moneda = game.add.sprite(0,0, 'moneda');
            billete = game.add.sprite(0, 120, 'billete');
            cerdito = game.add.sprite(0,alto-55, 'cerditos');
            scoreText = game.add.text(16, 16, puntuacion+"$", { fontSize: '36px', fill: 'white' });
            ;
            lifeText = game.add.text(ancho-120, 20, "♥♥♥", { fontSize: '24px', fill: '#ff3399' });
            ;
            //floor = new Phaser.Rectangle(0, app.porcentajeAltura()*80, app.porcentajeAltura()*100, app.porcentajeAltura()*100);

            game.physics.arcade.enable(moneda);
            game.physics.arcade.enable(billete);
            game.physics.arcade.enable(cerdito);

            moneda.body.collideWorldBounds = true;
            cerdito.body.collideWorldBounds = true;
            billete.body.collideWorldBounds = true;

            moneda.body.onWorldBounds = new Phaser.Signal();
            moneda.body.onWorldBounds.add(app.actualizarMarcador, this);
            //moneda.outOfBoundsKill = true;

            //lifeText.visible = true;//TODO:...
            billete.visible = false;

            moneda.x = app.posicionAleatoria();

            cerdito.animations.add('run');
            cerdito.animations.play('run', 10, true);

            

            app.sensorMovimiento();

        }

        function update(){
            moneda.body.velocity.y = 300 + monedasCaidas*5;
        }

        function render() {
            //game.debug.geom(floor,'green');
        }

        var estados = { preload: preload, create: create, update: update, render: render };
        game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);

    },
    sensorMovimiento: function(){

        function onError(){
            console.log('onError - sensorMovimiento');
        }

        function onSuccess(dato){
            if(!config.acelerometro) return true;
            X = dato.x ;
            Y = dato.y ;

            if(X > 1){
                cerdito.body.velocity.x = -100 * X;
                cerdito.animations.paused =false;
            }
            if(X < -1){
                cerdito.body.velocity.x = -100 * X;
                cerdito.animations.paused =false;
            }
            if(X > -1 && X < 1) {
                cerdito.body.velocity.x = 0;
                cerdito.animations.paused =true;
            }

        }

        var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 100 });
    },
    detectarDireccion: function(dato){
        X = dato.x ;
        Y = dato.y ;

        document.getElementById('test').innerHTML= "X "+X+" - Y "+Y;
    },
    porcentajeAltura: function(){
        return Math.round(alto/100);
    },
    posicionAleatoria: function(){
        //return 0;
        return Math.round(Math.random() * (ancho-this.diametroMoneda) );
    },
    actualizarMarcador: function(){

        //Si el cerdito se encuentra en el rango de la moneda aumentamos...

        if(cerdito.x <= moneda.x && cerdito.x+58 > moneda.x){
            if(moneda.visible) {
                if(config.audio) audioMoneda.play();
                puntuacion++;
            }
        }else{
            if(config.audio) audioFallo.play();
            app.quitarVida();
        }

        monedasCaidas++;

        moneda.y = 0;
        moneda.x = app.posicionAleatoria();

        scoreText.text = puntuacion + "$";
    },
    eventoTeclado: function(e){
        var test;
        if(!config.teclado) return true;
        //TODO: restar la medida del cerdito...
        switch(e.code){
            case "ArrowRight":
                if(cerdito.x+game.cache.getImage('cerdito').width<ancho) cerdito.x += 15;
            break;
            case "ArrowLeft":
                if(cerdito.x>0) cerdito.x -= 15;
            break;
            case "ArrowUp":
                test = "arriba";
            break;
            case "ArrowDown":
                test = "abajo";
            break;
            case "KeyR":
                test = "reset";
            break;
            case "KeyP":
                if(vidas>-1) game.paused = !game.paused;
            break;
        }
        //console.log(test);
        console.log(e.code);
        //document.getElementById('marcador').innerHTML = e.code;
    },
    touchMove: function(e){
        if(!config.tactil) return true;
        var touchobj = e.changedTouches[0]; 

        var toqueX = parseInt(touchobj.clientX);
        var anchuraCerdito = game.cache.getImage('cerdito').width;
        var centroCerdito = anchuraCerdito / 2;

        //revisar en pantallas tactiles
        if((toqueX  >= 0) && (toqueX <= ancho)){
            cerdito.x =  toqueX - centroCerdito;
        }                         
            
        e.preventDefault();
    },
    touchStart: function(e){
        cerdito.animations.paused =false;
    },
    touchEnd: function(e){
        //cerdito.animations.paused =true;
    },
    sacarBillete: function(frecuencia){
        if(parseInt(Math.random()*frecuencia) == 1) return true;
        return false;
    },
    esEscritorio: function(){
        if(alto<ancho){//Forzamos a crear una vista 16:9 en vertical
            ancho = parseInt(alto * 0.5625);
        }
    },
    quitarVida: function(){
        vidas--;
        console.log(vidas);
        if(vidas==2) lifeText.text = "♥♥";
        if(vidas==1) lifeText.text = "♥";
        if(vidas==0) lifeText.text = "";
        if(vidas==-1){
            lifeText.text = "";
            //En este caso ya paramos el juego y sacamos el POP-UP Game Over
            moneda.visible = false;
            game.paused = true;
            document.getElementById('game-over').style.display = "block";
            app.enviarPuntuacion();
        } 
    },
    reiniciar: function(){
        document.getElementById('game-over').style.display = "none";
        document.getElementById('pausa').style.display = "none";
        puntuacion = 0;
        monedasCaidas = 1;
        moneda.visible = true;
        game.paused = false;
        vidas = 4;//Quita una vida al reiniciar
        lifeText.text = "♥♥♥";

    },
    enviarPuntuacion: function(){
        $('#puntuacion-obtenida').text(puntuacion+"$");
        $('#puntos').val(puntuacion);
    },
    pausar: function(){
        document.getElementById('pausa').style.display = "block";
        game.paused = true;
    },
    reanudar: function(){
        document.getElementById('pausa').style.display = "none";
        game.paused = false;
    }
}

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.init();
    }, false);
}