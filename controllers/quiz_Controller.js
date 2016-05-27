var models = require('../models');
var Sequelize = require("sequelize/lib/errors.js");



//autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId)
	.then(function(quiz){
		if(quiz) {
			req.quiz=quiz;
			next();
		}
		else{
		next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function(error) { next(error); });
};

//GET / quizzes
exports.index = function(req, res, next){
	if (req.query.search !== undefined) {
  		var searchStr = '%' + req.query.search.replace(' ', '%') + '%';
  		models.Quiz.findAll({ where: ["question like ?", searchStr] })
  		.then(function (quizzes) {
			if(req.params.format==='json'){
				res.json(quizzes);
				}
			else{
				res.render ('quizzes/index', { quizzes: quizzes});
			}
   		})
   		.catch(function(error) { next(error); });
  		}
  	else{
  		models
		.Quiz
		.findAll()	.then(function(quizzes) {
			if(req.params.format==='json'){
				res.json(quizzes);
			}
			else{
				res.render ('quizzes/index', { quizzes: quizzes});
			}
		})
		.catch(function(error) {next(error); });
  	}
};	


//GET /quizzes/:id
exports.show = function(req, res, next){
	models
	.Quiz
	.findById(req.params.quizId)
	.then (function(quiz) {
		if(quiz) {
			var answer = req.query.answer || '';
			if(req.params.format==='json') {
				res.json(quizzes);
			}
			else{
				res.render('quizzes/show', {quiz: req.quiz, answer: answer});
			}
		} else { throw new Error('No existe ese quiz en la BBDD.'); }
	})
	.catch(function(error) {next(error); });
};

//GET /quizzes/:id/check
exports.check = function (req, res, next){
	models
	.Quiz
	.findById(req.params.quizId)
	.then (function(quiz) {
		if(quiz) {
			var answer = req.query.answer || "";
			var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizzes/result', {quiz: req.quiz, result: result, answer: answer});
		} else { throw new Error('No existe ese quiz en la BBDD.'); }	
	})
	.catch( function (error) {next(error); });
};	

//GET /quizzes/new
exports.new = function (req, res, next){
	var quiz = models.Quiz.build({question: "", answer: ""});
	res.render('quizzes/new', {quiz: quiz})
		.catch(function (error) {
			next(error);
		});
};

// POST /quizzes/create
exports.create = function(req, res, next){
	var quiz = models.Quiz.build({  question:	req.body.quiz.question,
									answer: 	req.body.quiz.answer});

	//Guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["question", "answer"]})
		.then(function (quiz) {
			req.flash('success', "Quiz creado con exito");
			res.redirect('/quizzes'); //res.redirect: Redireccion HTTP a lista de preguntas
		})
		.catch( Sequelize.ValidationError, function(error){
			req.flash('error','Errores en el formulario');
			for( var i in error.errors){
				req.flash('error', error.errors[i].value);
			};
			res.render('quizzes/new', {quiz: quiz});
		})
		.catch(function (error) {
			req.flash('error', 'Error al crear un Quiz: ' + errror.message);
			next(error);
		});
};

//GET /quizzes/:id/edit
exports.edit = function ( req, res, next) {
	var quiz = req.quiz;
	res.render('quizzes/edit', {quiz: quiz});
};

// PUT /quizzes/:id
exports.update = function( req, res, next){
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer	  = req.body.quiz.answer;

	req.quiz.save({fields: ["question", "answer"]})
		.then(function(quiz) {
		req.flash('success', 'Quiz editado con exito');
			res.redirect('/quizzes');
		})
		.catch(Sequelize.ValidationError, function(error) {

			req.flash('error', 'Errores en el formulario:');
			for (var i in error.errors){
				req.flash('error', error.errors[i].value);
			};

			res.render('quizzes/edit', { quiz: req.quiz});
		})
		.catch(function (error){
		req.flash('error', 'Error al editar el Quiz: '+error.message);
			next(error);
	});
};

//DELETE /quizzes/:id
exports.destroy = function(req, res, next) {
	req.quiz.destroy()
		.then(function(){
			req.flash('success', 'Quiz borrado con exito.');
			res.redirect('/quizzes');
	})
	.catch(function (error){
		req.flash('error', 'Error al editar el Quiz: '+error.message);
		next(error);
	});
};
