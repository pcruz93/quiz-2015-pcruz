var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/author',function(req,res){
  res.render('author',{ title:'Quiz', nombre: 'Pedro Cruz (@pcruz93)'})
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);


module.exports = router;
