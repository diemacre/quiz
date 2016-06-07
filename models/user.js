var crypto=require('crypto');
//Definición de la clase User:

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User',
							{ username: {
									type: DataTypes.STRING,
									unique: true,
									validate:{notEmpty: {msg: "Falta username"}}
								},
								password: {
									type: DataTypes.STRING, 
									validate: {notEmpty: {msg: "Falta password"}},
									set: function(password){
										//String aleatorio usado como salt.
										this.salt=Math.round((new Date().valueOf()*Math.random()))+ '';
										this.setDataValue('password',encryptPassword(password, this.salt));
									}},
								salt:{
									type: DataTypes.STRING
								},
								isAdmin:{
									type: DataTypes.BOOLEAN,
									defaultValue: false
								}
							},
      						{ instanceMethods: {
          						verifyPassword: function (password) {
            						return encryptPassword(password, this.salt) === this.password;
         						 }
        					}    
      });
};
/* encripta la password en claro
*Mezcla la password en claro con el salt proporcionado, ejecuta un SHA1 digest,
* y devuelve 40 caracteretes hexadecimales
*/
function encryptPassword(password, salt){
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
};