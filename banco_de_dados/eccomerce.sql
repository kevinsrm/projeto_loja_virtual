DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS avaliacoes;
DROP TABLE IF EXISTS imagens;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS carrinho;
DROP TABLE IF EXISTS vendas;
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS vendas_itens;


CREATE TABLE produtos (
produto_id INT(8) PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
nome_produto VARCHAR(255) NOT NULL,
descricao TEXT(5000) NOT NULL,
preco DECIMAL(10,2) NOT NULL,
categoria VARCHAR(255) NOT NULL,
data_cadastro DATETIME NOT NULL,
download_link VARCHAR(255) NOT NULL UNIQUE,
ativo_inativo BOOLEAN NOT NULL);

CREATE TABLE avaliacoes (
produto_id INT(8) NOT NULL,
stars INT(11),
comentario VARCHAR(255) NOT NULL);

CREATE TABLE imagens (
produto_id INT(8) NOT NULL,
caminho_imagem VARCHAR(255) NOT NULL);

CREATE TABLE usuarios (
user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
google_id VARCHAR(255) UNIQUE,
nome VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
senha VARCHAR(255) NOT NULL,
salt VARCHAR(255) NOT NULL,
two_factor_secret VARCHAR(6),
two_factor_enabled BOOLEAN NOT NULL DEFAULT 0,
status ENUM ("ativo", "suspenso") DEFAULT "ativo",
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ultimo_login DATETIME);

CREATE TABLE carrinho (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
user_id INT NOT NULL,
produto_id INT(8) NOT NULL,
data_adicao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE vendas (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
user_id INT NOT NULL,
valor_pago DECIMAL(10,2) NOT NULL,
status_pagamento ENUM ("pendente", "aprovado", "reembolsado") NOT NULL,
transacao_id VARCHAR(255) NOT NULL UNIQUE,
data_venda TIMESTAMP NOT NULL);

CREATE TABLE downloads (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
user_id INT NOT NULL,
produto_id INT(8) NOT NULL,
venda_id INT NOT NULL);

CREATE TABLE vendas_itens (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,
venda_id INT NOT NULL,
produto_id INT(8) NOT NULL,
preco_unitario DECIMAL(10,2) NOT NULL,
status_item ENUM ("ativo", "cancelado", "reembolsado") NOT NULL);

ALTER TABLE avaliacoes ADD CONSTRAINT avaliacoes_produto_id_produtos_produto_id FOREIGN KEY (produto_id) REFERENCES produtos(produto_id);
ALTER TABLE imagens ADD CONSTRAINT imagens_produto_id_produtos_produto_id FOREIGN KEY (produto_id) REFERENCES produtos(produto_id);
ALTER TABLE carrinho ADD CONSTRAINT carrinho_user_id_usuarios_user_id FOREIGN KEY (user_id) REFERENCES usuarios(user_id);
ALTER TABLE carrinho ADD CONSTRAINT carrinho_produto_id_produtos_produto_id FOREIGN KEY (produto_id) REFERENCES produtos(produto_id);
ALTER TABLE vendas ADD CONSTRAINT vendas_user_id_usuarios_user_id FOREIGN KEY (user_id) REFERENCES usuarios(user_id);
ALTER TABLE downloads ADD CONSTRAINT downloads_user_id_usuarios_user_id FOREIGN KEY (user_id) REFERENCES usuarios(user_id);
ALTER TABLE downloads ADD CONSTRAINT downloads_produto_id_produtos_produto_id FOREIGN KEY (produto_id) REFERENCES produtos(produto_id);
ALTER TABLE downloads ADD CONSTRAINT downloads_venda_id_vendas_id FOREIGN KEY (venda_id) REFERENCES vendas(id);
ALTER TABLE vendas_itens ADD CONSTRAINT vendas_itens_venda_id_vendas_id FOREIGN KEY (venda_id) REFERENCES vendas(id);
ALTER TABLE vendas_itens ADD CONSTRAINT vendas_itens_produto_id_produtos_produto_id FOREIGN KEY (produto_id) REFERENCES produtos(produto_id);
