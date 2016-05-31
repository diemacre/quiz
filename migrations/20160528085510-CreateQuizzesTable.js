'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Quizzes',
      { id:      {type: Sequelize.INTEGER,  allowNull: false,
                  primarykey: true,         autoIncrement: true,
                  unique:true},
        question: {type: Sequelize.INTEGER,
                  validate:{ notEmpty: {msg: "Falta Pregunta"}}},
        answer:   {type: Sequelize.INTEGER,
                  validate:{ notEmpty: {msg: "Falta Respuesta"}}},
        createdAt:      { type: Sequelize.INTEGER,  allowNull: false },
        updatedAt:      { type: Sequelize.INTEGER,  allowNull: false },
      },
      { sync: {force: true}
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Quizzes');
  }
};
