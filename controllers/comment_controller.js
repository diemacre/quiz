var models = require('../models');
var Sequelize = require('sequelize');

//GET /quizzes/:quizId/comments/new
exports.new = function (req, res, next){
    var comment = models.Comment.build({text: ""});
    res.render('comments/new', {comment: comment,
        quiz: req.quiz});
};

// POST /quizzes/:quizId/comments
exports.create = function(req, res, next){
    var comment = models.Comment.build(
        { text: req.body.comment.text,
        QuizId: req.quiz.id
        });

    //Guarda en DB los campos pregunta y respuesta de quiz
    comment.save()
        .then(function (comment) {
            req.flash('success', "Comentario creado con exito");
            res.redirect('/quizzes/'+ req.quiz.id); //res.redirect: Redireccion HTTP a lista de preguntas
        })
        .catch( Sequelize.ValidationError, function(error){
            req.flash('error','Errores en el formulario');
            for( var i in error.errors){
                req.flash('error', error.errors[i].value);
            };
            res.render('comments/new', {comment: comment,
                quiz: req.quiz});
        })
        .catch(function (error) {
            req.flash('error', 'Error al crear un Comentario: ' + errror.message);
            next(error);
        });
};