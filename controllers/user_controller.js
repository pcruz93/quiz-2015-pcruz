var users = {
	admin: { id: 1, username: 'admin', password: '1234' },
	pepe:  { id: 2, username: 'pepe', password: '5678' }
};

// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error).
// El callback es la función (tercer parámetro) en la llamada.

exports.autenticar = function(login, password, callback){
	if(users[login]){
		if(password === users[login].password){
			callback(null, users[login]); 
		}else{
			callback(new Error('Password incorrecto'));
		}
	}else{
		callback(new Error('No existe el usuario'));
	}
}