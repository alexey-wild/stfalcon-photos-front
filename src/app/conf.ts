let config:any = {};

config.backend_host = 'http://127.0.0.1:8000';

config.photos_url = config.backend_host +'/uploads/photos/';
config.api_url = config.backend_host + '/api/';

export default config;
