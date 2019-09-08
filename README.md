![yrexpert-logo.png](./images/yrexpert-logo.png)

# Terminal mode navigateur pour yrexpert-js...

[![npm downloads][downloads-image]][downloads-url]

Ce dépot contient :
* un module back-end de Node.js fournisant une interface Web Sockets pour YRexpert.
* un terminal JavaScript émulant VT-100 qui fonctionne dans la plupart des navigateurs.

Ce dépot est basé sur [l'émulateur term.js de Christopher Jeffrey's ](https://github.com/chjj/term.js/),
avec des modifications apportées [par Rob Tweed pour le fonctionnement sous Internet Explorer](https://github.com/robtweed/ewdVistATerm).

## 1. Installer Node.js et Npm

Si vous êtes sur un système Linux type Debian, vous pouvez taper :

	~$ sudo apt-get install nodejs nodejs-legacy npm

### Installation du serveur sur les autres distributions Linux

Installer les dépendances que l'on aura besoin pour l’installation :
yrelay/yrexpert-Term
	~$ sudo apt-get install curl build-essential openssl libssl-dev

Télécharger la dernière version de Node.js, la version v4.2.4 à ce jour ( [http://nodejs.org/download/](http://nodejs.org/download/) ) :

	~$ wget http://nodejs.org/dist/latest-v4.x/node-v4.2.4.tar.gz

Extraction de l'archive :

	~$ tar xzvf node-v4.2.4.tar.gz

On se positionne dans le dossier :

	~$ cd node-v4.2.4/

Configuration des sources :

	~$ ./configure

Compilation des sources :

	~$ make

Installation de Node.js :

	~$ make install

Si vous souhaitez désinstaller Node.js :

	~$ make uninstall

## 2. Installer le module Node.js yrexpert-term et ses dépendences

	~$ mkdir ~/test
	~$ cd ~/test	
	~$ npm install yrexpert-term

Réponder au questions suivantes :

* Installer yrexpert-term vers le répertoire (/home/hamid/Yrelay/bas/yrexpert-term):
* Voulez-vous installer des ressources supplémentaires à partir du répertoire /extras ?
* Si vous êtes nouveau sur yrexpert-term ou voulez créer un environnement de test, entrer Y
* Si vous êtes un utilisateur expérimenté ou ceci est un environnement de production, entrer N
* Entrer Y/N: 

Lancer le serveur :

	~$ cd yrexpert-term
	~$ node yrexpert-termStart

## 3. Démarrage de l'émulateur de terminal

[http://localhost:8081/yrelay/yrexpert-term/index.html](http://localhost:8081/yrelay/yrexpert-term/index.html)

Remarque : spécifier l'adresse appropriée/IP et le port tel que configuré dans
le fichier de démarrage `yrexpert-termStart.js`.

## 4. Fonctionnement de yrexpert-term

### 4.1. Coté Serveur :

	var term = require('yrexpert-term');

	term.start({
	...

### 4.2. Coté Client :

	<script src="/socket.io/socket.io.js"></script>
	<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<script src="index.js"></script>
	<script>
	;(function() {
	  $(document).ready(function() {
	    var socket = io.connect();
	    socket.on('connect', function() {
	      console.log("connected");
	      var term = new Terminal({
		cols: 80,
		rows: 24,
		useStyle: true,
		screenKeys: true
	      });

	      term.on('data', function(data) {
		if (data === '£') data = '#';
		console.log("sending " + JSON.stringify(data));
		socket.emit('data', data);
	      });

	      term.on('title', function(title) {
		document.title = title;
	      });

	      term.open(document.body);

	      term.write('\x1b[31mBienvenue sur le terminal YRexpert !\x1b[m\r\n');

	      socket.on('data', function(data) {
		console.log("received " + JSON.stringify(data));
		term.write(data);
	      });

	      socket.on('disconnect', function() {
		console.log("socket disconnected");
		term.destroy();
	      });
	    });
	  });
	}).call(this);
	</script>

## 5. Comment contribuer ?

* Dupliquer le dépôt (utiliser Fork)
* Créer un nouvelle branche (git checkout -b ma-branche)
* Commit(er) votre proposition d'évolution (git commit -am 'Ajouter mon évolution')
* Push(er) la branche (git push origin ma-branche)
* Créer une demande d'évolution (utiliser Pull Requests)

Pour remonter un bug : [https://github.com/yrelay/yrexpert-term/issues](https://github.com/yrelay/yrexpert-term/issues)

## 6. Liens

* Yrelay Page d'accueil : [https://www.yrelay.fr/](http://www.yrelay.fr/)
* Yrelay Référentiels : [https://code.yrelay.fr/](http://code.yrelay.fr/)
* Yrelay Github : [https://github.com/Yrelay/](https://github.com/Yrelay/)


[downloads-image]: https://img.shields.io/npm/dm/yrexpert-term.svg
[downloads-url]: https://npmjs.org/package/yrexpert-term



