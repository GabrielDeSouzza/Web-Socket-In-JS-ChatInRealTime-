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

# Instalação
$ Vá no prompt de comando localize a pasta do projeto e digite: npm install  /* Instalar Dependências */ <br />
$ No MySQL cole este código:

CREATE DATABASE chat;
USE chat;

CREATE TABLE  users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(50) NOT NULL,
PRIMARY KEY  (id)) ENGINE = InnoDB;

CREATE TABLE rooms
 (id INT NOT NULL AUTO_INCREMENT, room VARCHAR(20) NOT NULL , message VARCHAR(500) NOT NULL ,
 usersid INT NOT NULL , date DATETIME NOT NULL , PRIMARY KEY (id),
FOREIGN KEY (usersid) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE = InnoDB;

$após criar o banco de dados entre na pasta do projeto e crie um arquivo com o nome '.env' e siga 
o modelo de string´s de conexões deixado no arquivo '.env.sample' passando os dados lá requisitados
$Por último será necessário criar um conta no serviço de nuvem da <a href="http://example.com/" target="_blank">Cloudinary </a>
e configurar a sua conexão com o serviço seguindo o modelo do arquivo '.env.sample'

# Executando App
$inicie o servidor no MySql
<br />
$ Vá no prompt de comando e localize a pasta do projeto então execute o comando:  npm run dev
<br /> 
$acesse: http://localhost:3000/
