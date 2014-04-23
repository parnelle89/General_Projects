module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  concat: {
    options: {
      separator: ';'
    },
    dist: {
      src: [
      'jspdf/jspdf.js',
      'jspdf/jspdf.plugin.addimage.js',
      'jspdf/jspdf.plugin.cell.js',
      'jspdf/jspdf.plugin.split_text_to_size.js',
      'jspdf/jspdf.plugin.standard_fonts_metrics.js',
      'jspdf/FileSaver.js'
      ],
      dest: 'TestFolder/jspdf.concat.min.js'
    }
  },
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    },
    dist: {
      files: {
        'TestFolder/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
      }
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.registerTask('default', ['concat', 'uglify']);

}