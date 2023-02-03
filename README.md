# Descrição
Projeto criado com o intuito de conhecer e aprimorar 
conhecimentos sobre web-sockets, visando aprimorar o 
serviço criado acrescentando novas camadas como DB, compartilhamento de arquivos, etc.

# Requisitos
$ Node: https://nodejs.org/en/download/ <br />
$ Mysql: https://dev.mysql.com/downloads/installer/ <br />
$ Npm : É instalado junto com o Node <br />
$ Obs: Qualquer dúvida sobre a instalação do node
e do npm acesse: https://dicasdejavascript.com.br/instalacao-do-nodejs-e-npm-no-windows-passo-a-passo/

# Instalação execução
$ npm install  /* Instalar Dependências */ <br />
$ No MySQL cole este código:

CREATE DATABASE chat;
USE chat;

CREATE TABLE  users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(50) NOT NULL,
PRIMARY KEY  (id)) ENGINE = InnoDB;

CREATE TABLE rooms
 (id INT NOT NULL AUTO_INCREMENT, room VARCHAR(20) NOT NULL , message VARCHAR(500) NOT NULL ,
 usersid INT NOT NULL , date DATETIME NOT NULL , PRIMARY KEY (id),
FOREIGN KEY (usersid) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE = InnoDB;

# Executando App
$ Vá no prompt de comando e localize a pasta do projeto então execute o comando:  npm run dev
<br />
$acesse: http://localhost:3000/

