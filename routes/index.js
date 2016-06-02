var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_Controller');
var commentController= require('../controllers/comment_controller')
//pagina de Entrada
router.get('/', function(req, res) {
	res.render('index', { title: 'Quiz'});
});

//Autoload de rutas que usen :quizId
router.param('quizId', quizController.load); //autoload :quizId


//Definición de rutas de /quizzes
router.get('/quizzes.:format?', 					quizController.index);
router.get('/quizzes/:quizId(\\d+).:format?', 		quizController.show);
router.get('/quizzes/:quizId(\\d+)/check', 			quizController.check);
router.get('/quizzes/new',							quizController.new);
router.post('/quizzes', 							quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',			quizController.edit);
router.put('/quizzes/:quizId(\\d+)',				quizController.update);
router.delete('/quizzes/:quizId(\\d+)', 			quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/comments/new',			commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',			commentController.create);

router.get('/author', function(req, res, next){
	res.render('author', { github:'<a href="https://github.com/diemacre/quiz">Proyecto en github</a>',
		title: 'Quiz', autores: 'David de Andrés y Diego Martín Crespo',
		video1:'<iframe width="560" height="315" src="https://www.youtube.com/embed/jO2ecDT6Vgw" frameborder="0" allowfullscreen></iframe>',
		video2: '<iframe width="560" height="315" src="https://www.youtube.com/embed/iCme0HRgd0U" frameborder="0" allowfullscreen></iframe>',
		foto1: '<img src="/images/Davideandres.jpg" alt="David de Andres">',
		foto2: '<img src="/images/diegomartin.jpg" alt="Diego Martín" style="width:200px; height:200px">'
	})
});

module.exports = router;
