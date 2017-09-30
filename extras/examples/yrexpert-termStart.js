var term = require('yrexpert-term');

term.start({
  log: true,
  spawnYRexpert: { // la façon de démarrer une connexion terminal
    command: 'sshpass',
    arguments: ['-p', 'util', 'ssh', '-o', 'StrictHostKeyChecking=no', '-p' , '2222' , 'yrelayutil@127.0.0.1', '-tt']

    //     command: 'ssh', 
    //     arguments: ['-q', 'yrexpert@127.0.0.1', '-tt', '-i', '/home/yrexpert']
    // cet exemple est l'équivalent de ssh -q 'yrexpert@127.0.0.1 -tt -i '/home/yrelay/yrexpert'

    // remarques :
    // StrictHostKeyChecking=no ainsi, vous ne serez pas invité pour savoir si vous faites confiance, 
    // -tt est nécessaire pour forcer l'allocation de terminal (tty),
    // dans l'exemple ci-dessus yrexpert utilise une clé d'authentification.

    // si vous devez utiliser un mot de passe, installer sshpass à la place comme l'exemple ci-dessous :
    //     command: 'sshpass',
    //     arguments: ['-p', 'util', 'ssh', '-o', 'StrictHostKeyChecking=no', 'yrelayutil@127.0.0.1', '-tt']

  },
  webServer: {
    port: 8081,  // port sur lequel le serveur web sera à l'écoute
    rootPath: 'www',   // chemin d'accès physique qui représente le chemin de racine du serveur Web
    ssl: true,  
    options: {
      key: 'ssl/ssl.key',
      cert: 'ssl/ssl.crt'
    }
  },
  addLF: false,  // pour les systèmes Linux, cela devrait être faux
  echo: true,    // pour les systèmes Linux, cela devrait être vrai
  exitString: 'Déconnecté... '  // chaîne qui indique au terminal la déconnexion
});
