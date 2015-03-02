
module.exports = function (grunt) {

	// Load plugins
	require('load-grunt-tasks')(grunt);

	// ---------- Project configuration
	grunt.initConfig({

		// Global
		pkg: grunt.file.readJSON('package.json'),
		banner: '/* <%= pkg.name %> / <%= pkg.author.name %> on behalf of MSL Group / <%= grunt.template.today("yyyy-mm-dd") %> */\n',

		// Constant
		watch: {
			all: {
				files: [
					'gruntfile.js',
					'src/pullout.js'
				],
				tasks: ['default']
			}
		},

		// Js
		jshint: {
			all: ['src/pullout.js'],
			options: {
				camelcase: true,
				curly: true,
				eqeqeq: true,
				freeze: true,
				indent: 4,
				lastsemic: true,
				latedef: true,
				nonew: true,
				plusplus: false,
				strict: false,
				unused: false,
				globals: {
					jQuery: true
				}
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				warnings: false
			},
			build: {
				files: {
					'dist/pullout.min.js': ['src/pullout.js']
				}
			}
		}
	});


	// ---------- Tasks

	// Default
	grunt.registerTask('default', ['jshint', 'uglify']);
};