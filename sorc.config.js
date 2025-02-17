module.exports = {
    basePath: __dirname,
    verbose: 'dev',
    packages: [{
        path: '/src/app',
        env: ['dev', 'prod'],
    	eager: true,
    }, {
        path: '/src/core',
    	eager: true,
    }, {
        path: '/src/lib',
    }, {
        env: 'dev',
        path: '/src/dev',
        eager: true,
        include: {
            Config: () => require('../config/dev.config'),
        },
    }, {
        env: 'prod',
        include: {
            Config: () => require('./config'),
        },
    }, {
        path: '/src/validate',
        eager: true,
    }],
};