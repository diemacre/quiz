var models = require('../models');
var Sequelize = require("sequelize");
var paginate = require('./paginate').paginate;


//autoload el quiz asociado a :userId
exports.load = function(req, res, next, userId) {
    models.User.findById(userId)
        .then(function(user){
            if(user) {
                req.user=user;
                next();
            }
            else{
                req.flash('error', 'No existe el usuario con id= '+id+'.');
                throw new Error('No existe userId= ' + userId);
            }
        })
        .catch(function(error) { next(error); });
};

/// GET /users
exports.index = function(req, res, next) {

    models.User.count()
    .then(function(count) {

        // Paginacion:

        var items_per_page = 6;

        // La pagina a mostrar viene en la query
        var pageno = parseInt(req.query.pageno) || 1;

        // Datos para obtener el rango de datos a buscar en la BBDD.
        var pagination = {
            offset: items_per_page * (pageno - 1),
            limit: items_per_page
        };

        // Crear un string con el HTML que pinta la botonera de paginacion.
        // Lo añado como una variable local de res para que lo pinte el layout de la aplicacion.
        res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);

        return pagination;
    })
    .then(function(pagination) {

        return models.User.findAll({offset: pagination.offset,
                                    limit: pagination.limit,
                                    order: ['username']});
    })
    .then(function(users) {
        res.render('users/index', { users: users });
    })
    .catch(function(error) { next(error); });
};


//GET /users/:id
exports.show = function(req, res, next){
    res.render('users/show', {user: req.user});

};


//GET /users/new
exports.new = function (req, res, next){
    var user = models.User.build({username: "", password: ""});
    res.render('users/new', {user: user});
};


// POST /users
exports.create = function(req, res, next){
    var user = models.User.build({  username:	req.body.quiz.question,
                                    password: 	req.body.quiz.answer
    });

    //el login debe ser unico:
    models.User.find({where:{  username:	req.body.quiz.question}})
        .then(function (exixting_user) {
            if (exixting_user) {
                var emsg = "El usuario\"" + req.bodey.user.username + "\" ya existe.";
                req.flash('error', emsg);
                res.render('users/new', {user: user});
            } else {
                //guardar en la bbdd
                return user.save({fields: ["username", "password", "salt"]})
                    .then(function (user) {//renderizar pagina de usuarios
                        req.flash('success', 'Usuario creado con exito.');
                        res.redirect('/session');
                    })
                    .catch(Sequelize.ValidationError, function (error) {
                        req.flash('error', 'Errores en el formulario');
                        for (var i in error.errors) {
                            req.flash('error', error.errors[i].value);
                        }
                        ;
                        res.render('users/new', {user: user});
                    });
            }
        })
        .catch(function (error) {
            next(error);
        });

};
// GET /users/:id/edit
exports.edit = function(req, res, next) {
    res.render('users/edit', { user: req.user });  // req.user: instancia de user cargada con autoload
};            


// PUT /users/:id
exports.update = function(req, res, next) {

    // req.user.username  = req.body.user.username; // No se permite su edicion
    req.user.password  = req.body.user.password;

    // El password no puede estar vacio
    if ( ! req.body.user.password) { 
        req.flash('error', "El campo Password debe rellenarse.");
        return res.render('users/edit', {user: req.user});
    }

    req.user.save({fields: ["password", "salt"]})
        .then(function(user) {
            req.flash('success', 'Usuario actualizado con éxito.');
            res.redirect('/users');  // Redirección HTTP a /
        })
        .catch(Sequelize.ValidationError, function(error) {

            req.flash('error', 'Errores en el formulario:');
            for (var i in error.errors) {
                req.flash('error', error.errors[i].value);
            };

            res.render('users/edit', {user: req.user});
        })
        .catch(function(error) {
            next(error);
        });
};


// DELETE /users/:id
exports.destroy = function(req, res, next) {
    req.user.destroy()
        .then(function() {

            // Borrando usuario logeado.
            if (req.session.user && req.session.user.id === req.user.id) {
                // borra la sesión y redirige a /
                delete req.session.user;
            }

            req.flash('success', 'Usuario eliminado con éxito.');
            res.redirect('/');
        })
        .catch(function(error){ 
            next(error); 
        });
};
