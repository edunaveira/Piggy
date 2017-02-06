config = {
	audio: true,
	acelerometro:  true,
	tactil: true,
	teclado: true,
	comprobar: function(){
		this.audio = this.comprobarCampo('audio');
		this.acelerometro = this.comprobarCampo('acelerometro');
		this.tactil = this.comprobarCampo('tactil');
		this.teclado = this.comprobarCampo('teclado');
	},
	comprobarCampo: function(c){
		if(!localStorage.getItem(c)){
			localStorage.setItem(c,'true');//Por defecto activamos
			return true;
		}else{
			return (localStorage.getItem(c)=='true'?true:false);
		}
	},
	cambiar: function(campo, valor){
		localStorage.setItem(campo, valor);
	}
};

config.comprobar();