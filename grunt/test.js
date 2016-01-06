module.exports = {
    // Configure the test task with the following options:
    // 1: The name of the HTML template file, this is the file with the
    //    placeholders.
    // 2: This is the filename that is used to write the modified template to, it
    //    is the file that we will run with Mocha.
    // 3: The pattern for the spec files to include in the test runner, you can
    //    use a glob pattern for this.
    options: {
        template: 'test/index.template.html', /* [1] */
        runner: 'test/index.html',            /* [2] */
        files: 'test/spec/**/*.js'            /* [3] */
    },

    // Configure the testonly target
    // 4: This is the path where the JavaScript files to test are located, it is
    //    relative to the /test folder.
    testonly: {
        options: {
            baseUrl: '../lib'                 /* [4] */
        }
    }
};