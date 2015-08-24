var models = require('../models/models.js');

// se inicia
var stats = {
	quizes: 0,
	comments: 0,
	waiting: 0,
	published: 0,
	average: 0,
	commented: 0,
	nonCommented: 0
}

// muestra las estadísticas
exports.show = function(req, res){
	
	models.Quiz.findAll().then(
		function(numQuizes){
			stats.quizes = numQuizes.length;
		}
	).then(
		function(){
			models.Comment.findAndCountAll().then(
				function(result) {
					var esperando = 0, publicado = 0, comentado = [], totalComentado = 0;
					for(k in result.rows){
						(!result.rows[k].publicado) ? esperando++ : publicado++;
						if(typeof(comentado[result.rows[k].QuizId]) === 'undefined'){
							comentado[result.rows[k].QuizId] = 1;
						}
					}
					for(e in comentado){
						totalComentado++;
					}
					
					stats.waiting = esperando;
					stats.published = publicado;
					stats.comments = (Number(esperando) + Number(publicado));
					stats.commented = totalComentado;
					stats.nonCommented = (stats.quizes - stats.commented);
				}
			)
			.then(function(){
			stats.average = (stats.comments*100)/stats.quizes;
			res.render('stats.ejs', {stats: stats, errors: {}});
			});
		}
	);
}