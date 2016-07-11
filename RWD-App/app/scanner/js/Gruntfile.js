module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            dist: {
                files: {
                    'jsqrcode-combined.min.js': [
                        "src/grid.js",
                        "src/version.js",
                        "src/detector.js",
                        "src/formatinf.js",
                        "src/errorlevel.js",
                        "src/bitmat.js",
                        "src/datablock.js",
                        "src/bmparser.js",
                        "src/datamask.js",
                        "src/rsdecoder.js",
                        "src/gf256poly.js",
                        "src/gf256.js",
                        "src/decoder.js",
                        "src/qrcode.js",
                        "src/findpat.js",
                        "src/alignpat.js",
                        "src/databr.js",
                    ]
                },
                options: {
                    beautify: false,
                    mangle: false,
                    sourceMap: false
                }
            }
        },
        watch: {
            js: {
                files: ['src/*.js']
            }
        }
    });

    // Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', [
        'uglify'
    ]);
};
