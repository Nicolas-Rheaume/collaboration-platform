const host_ip_address = '192.168.0.183';
const server_port = 18001;

export const environment = {
	production: true,
	host_ip_address: host_ip_address,
	server_port: server_port,
	api: `ws://` + host_ip_address + `:` + server_port,
};
