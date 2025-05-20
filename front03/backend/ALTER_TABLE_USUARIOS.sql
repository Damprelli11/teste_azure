ALTER TABLE usuarios
  ADD COLUMN tipo ENUM('admin','voluntario','participante','doador','instrutor') NOT NULL DEFAULT 'participante',
  ADD COLUMN telefone VARCHAR(20),
  ADD COLUMN rg VARCHAR(20),
  ADD COLUMN dataCadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN status TINYINT(1) NOT NULL DEFAULT 1;
