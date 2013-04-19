module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["build"],
    concat: {
      dist: {
        src: ['src/js/main.js', 'src/js/util.js'],
        dest: 'build/js/app.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/js/app.js',
        dest: 'build/js/app.min.js'
      }
    },
    watch: {
      files: ['src/**/*'],
      tasks: ['rebuild'],
      options: {
        nospawn: true
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'build',
          keepalive: true
        }
      }
    },
    shell: {
      jetty: {
        command: 'java -jar start.jar ../../jetty-static.xml',
        options: {
          stdout: true,
          execOptions: {
            cwd: 'lib/jetty-9.0.2'
          }
        }
      }
    },
    copy: {
      main: {
        files: [
          {src: ['src/*.html'], dest: 'build/', flatten: true, expand: true},
          {src: ['src/css/*.css'], dest: 'build/css/', flatten: true, expand: true}
        ]
      }
    },
    parallel: { /* renamed task to connect-with-watch */
      connect_and_watch: {
        grunt: true,
        tasks: ['watch', 'connect']
      },
      jetty_and_watch: {
        grunt: true,
        tasks: ['watch', 'shell:jetty']
      }
    }
  });


  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-shell');

  // Tasks
  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['clean', 'rebuild']);
  grunt.registerTask('rebuild', ['copy:main', 'concat', 'uglify']);
  grunt.registerTask('server', ['build', 'parallel:connect_and_watch']);
  grunt.registerTask('server-jetty', ['build', 'parallel:jetty_and_watch']);

  // Custom Tasks


};