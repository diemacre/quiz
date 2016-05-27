var path = require('path');

//Cargar modelo ORM
var Sequelize = require ('sequelize');

//Usar BBDD SQLite:
var url, storage;

if(!process.env.DATABASE_URL) {
	url="sqlite:///";
	storage= "quiz.sqlite";
} else {
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize (url,
								{ storage: storage,
								  omitNull: true
								});

//Importar la definicion de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//sequelize.sync() crea e inicializa tabla de preguntas de DB
sequelize.sync()
.then( function(){ //sync() crea la tabla quiz
	return Quiz.count()
		.then(function(c) {
			if (c===0) { //la tabla se inicializa si esta vacia
				return Quiz
					.bulkCreate([ {question: 'Capital de Italia', 	answer: 'Roma' },
								  {question: 'Capital de Portugal', answer: 'Lisboa'},
								  {question: 'Capital de España', answer: 'Madrid'},
								  {question: 'Capital de Francia', answer:'Paris'},
								  {question: 'Capital de Belgica', answer: 'Bruselas'}
								   ])
					.then (function() {
						console.log('Base de datos inicializada con datos');
					});
			}
		});
}).catch(function(error){
	console.log("Error Sincronizando las tablas de la BBDD:", error);
	process.exit(1);
});

exports.Quiz = Quiz; // exportar definición de tabla quiz