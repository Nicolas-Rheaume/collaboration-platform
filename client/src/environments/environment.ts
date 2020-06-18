// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { writeFile } from 'fs';
// dotenv.config({ path: '../.env'});

const host_ip_address = '192.168.0.183';
const server_port = 3000;

export const environment = {
	production: false,
	host_ip_address: host_ip_address,
	server_port: server_port,
	api: `ws://` + host_ip_address + `:` + server_port,
};
