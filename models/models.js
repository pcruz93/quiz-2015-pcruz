var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// importa la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// importa la definición de la tabla comentarios
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

// sequelize define la relación entre quizes y comentarios en una relacion 1-X
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// exporta la definicion de la tabla quiz y la de comentarios
exports.Quiz = Quiz; // exportar tabla Quiz
exports.Comment = Comment;

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.bulkCreate( 
        [ {pregunta: 'Capital de Italia',   
            respuesta: 'Roma',
            tema: 'otro'},
          {pregunta: 'Capital de Portugal', 
            respuesta: 'Lisboa',
            tema: 'otro'}
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  });
});

// sequelize.sync() crea e inicializa la tabla en la BD
sequelize.sync().then(function(){
	// then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		// la tabla se inicia solo si esta vacia
		// para borrar la bd en heroku recuerda: heroku pg:reset DATABASE o desde el dashboard de la bd ne heroku postgre
		if(count === 0){
			Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma', tema: 'otro'}).then(function(){ process.stdout.write("DEBUG: Base de datos actualizada\n") });
		}
	});
});