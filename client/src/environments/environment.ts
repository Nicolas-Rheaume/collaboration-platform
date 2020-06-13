// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  host_ip_address: '192.168.0.183',
  server_port: 3000,
	api: `ws://` + this.HOST_IP_ADDRESS + `:` + this.SERVER_PORT,
};
