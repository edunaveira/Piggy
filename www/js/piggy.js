var game;

var app={
    init: function(){

        nivel = 1;
        puntuacion = 0;

        alto  = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        //Audios, archivos extraidos de freesound.org
        audioMoneda = new Audio('audio/213979__fenrirfangs__coin.mp3');
        audioFallo = new Audio('audio/171497__fins__error.mp3');

        app.sensorMovimiento();
        app.inicioJuego();
        document.body.addEventListener("keydown", app.eventoTeclado, false);
        document.addEventListener("touchmove", app.touchMove, false);


    },
    inicioJuego: function(){

        function preload(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.stage.backgroundColor = '#67d0ff';
            game.load.image('cerdito', 'img/cerdito-mini.png');
            game.load.image('moneda', 'img/moneda-mini.png');
            game.load.image('billete', 'img/billete-mini.png')
        }

        function create(){

            
            moneda = game.add.sprite(0,0, 'moneda');
            billete = game.add.sprite(0, 120, 'billete');
            cerdito = game.add.sprite(0,app.porcentajeAltura()*90, 'cerdito');
            scoreText = game.add.text(16, 16, puntuacion+"$", { fontSize: '36px', fill: 'white' });
            ;
            lifeText = game.add.text(ancho-150, 20, "♥♥♥  ‖", { fontSize: '24px', fill: 'red' });
            ;
            //floor = new Phaser.Rectangle(0, app.porcentajeAltura()*80, app.porcentajeAltura()*100, app.porcentajeAltura()*100);

            game.physics.arcade.enable(moneda);
            game.phusics.arcade.enable(billete);
            game.physics.arcade.enable(cerdito);

            moneda.body.collideWorldBounds = true;
            cerdito.body.collideWorldBounds = true;
            billete.body.collideWorldBounds = true;

            moneda.body.onWorldBounds = new Phaser.Signal();
            moneda.body.onWorldBounds.add(app.actualizarMarcador, this);
            //moneda.outOfBoundsKill = true;

            moneda.x = app.posicionAleatoria();

            

            //app.sensorMovimiento();

        }

        function update(){
            moneda.body.velocity.y = 900;
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
            X = dato.x ;
            Y = dato.y ;

            if(X > 1){
                cerdito.body.velocity.x = -100 * X;
            }
            if(X < -1){
                cerdito.body.velocity.x = -100 * X;
            }
            if(X > -1 && X < 1) cerdito.body.velocity.x = 0;

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
        //return ancho;
        return Math.round(Math.random() * ancho);
    },
    actualizarMarcador: function(){

        //Si el cerdito se encuentra en el rango de la moneda aumentamos...

        if(cerdito.x < moneda.x && cerdito.x+57 > moneda.x){
            if(moneda.visible) {
                audioMoneda.play();
                puntuacion++;
            }
        }else{
            audioFallo.play();
            puntuacion-=3;//podemos ir variando en función del nivel...
        }

        moneda.y = 0;
        moneda.x = app.posicionAleatoria();

        scoreText.text = puntuacion + "$";
    },
    eventoTeclado: function(e){
        var test;

        //TODO: restar la medida del cerdito...
        switch(e.code){
            case "ArrowRight":
                if(cerdito.x-15<=ancho) cerdito.x += 15;
            break;
            case "ArrowLeft":

                if(cerdito.x-15>=0) cerdito.x -= 15;
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
                game.paused = !game.paused;
            break;
        }
        //console.log(test);
        console.log(e.code);
    },
    touchMove: function(e){

        var touchobj = e.changedTouches[0]; 
        cerdito.x = parseInt(touchobj.clientX) - (game.cache.getImage('cerdito').width /2);
        e.preventDefault();
    },
    sacarBillete: function(frecuencia){
        if(parseInt(Math.random()*frecuencia) == 1) return true;
        return false;
    }
}

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.init();
    }, false);
}