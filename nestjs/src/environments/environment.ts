// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	server_ip_address: '192.168.0.183',
	server_port: 3000,

	database_ip_address: 'localhost',
	database_port: 3306,
	database_user: 'root',
	database_password: 'password',
	database_name: 'collab-db-dev-1.0',

	bcrypt_saltRounds: 10,
	jwt_secret: 'my_secret',
	admin_password: 'rheaume'
};
