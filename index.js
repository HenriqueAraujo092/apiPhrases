// Importa os modulos necessarios
const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

// Cria a aplicacao Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cria a conexao com o banco de dados
const sequelize = new Sequelize(`postgres://ovnzejzg:xp9v3AptDEqYqmHUIB3ovFfCJQp5p1uQ@hattie.db.elephantsql.com/ovnzejzg`);

// Cria a tabela no banco de dados
const Frases = sequelize.define('frases', {
    descricao: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    autor: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tipo: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },{
	timestamps: false,
	sync: {
		force: true
	}
});

// Cria a rota para recuperar todas as frases
app.get('/frases', (req, res) => {
  Frases.findAll()
    .then(frases => res.json(frases))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Erro ao recuperar frases.'
      });
    });
});

// Cria a rota para recuperar uma frase específica
app.get('/frases/:id', (req, res) => {
  Frases.findByPk(req.params.id)
    .then(frase => {
      if (frase) {
        res.json(frase);
      } else {
        res.status(404).json({
          error: 'Frase não encontrada.'
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Erro ao recuperar frase.'
      });
    });
});

// Cria a rota para criar uma nova frase
app.post('/frases', (req, res) => {
  Frases.create(req.body)
    .then(frase => res.status(201).json(frase))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Erro ao criar frase.'
      });
    });
});

// Cria a rota para atualizar uma frase
app.put('/frases/:id', (req, res) => {
  Frases.findByPk(req.params.id)
    .then(frase => {
      if (frase) {
        return frase.update(req.body);
      } else {
        res.status(404).json({
          error: 'Frase não encontrada.'
        });
      }
    })
    .then(frase => res.json(frase))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Erro ao atualizar frase.'
      });
    });
});

// Cria a rota para excluir uma frase
app.delete('/frases/:id', (req, res) => {
  Frases.findByPk(req.params.id)
    .then(frase => {
      if (frase) {
        return frase.destroy();
      } else {
        res.status(404).json({
          error: 'Frase não encontrada.'
        });
      }
    })
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Erro ao excluir frase.'
      });
    });
});

// Inicia a aplicacao
app.listen(3000, () => console.log('Aplicacao iniciada na porta 3000'));