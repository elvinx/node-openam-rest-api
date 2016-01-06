module.exports = {
    // Configure the Mocha task with the following options:
    // 1: The default reporter, Dot, just shows dots as output, that is not very
    //    informative. The Spec reporter is more verbose and shows all the test
    //    descriptions and results.
    // 2: The test should not start automatically. We will start it manually in
    //    our index.html file.
    options: {
        reporter: 'Spec',         /* [1] */
        run: false                /* [2] */
    },
    // Configure the test target
    // 3: This is the path to the HTML test runner
    test: {
        src: 'test/index.html'    /* [3] */
    }
};