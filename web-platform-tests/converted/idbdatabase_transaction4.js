require("../../build/global");
const Event = require("../../build/lib/FakeEvent").default;
const {
    add_completion_callback,
    assert_array_equals,
    assert_equals,
    assert_false,
    assert_key_equals,
    assert_not_equals,
    assert_throws,
    assert_true,
    async_test,
    createdb,
    createdb_for_multiple_tests,
    fail,
    format_value,
    indexeddb_test,
    promise_test,
    setup,
    step_timeout,
    test,
} = require("../support-node");

const document = {};
const window = global;


    var db,
      t = async_test(document.title, {timeout: 10000}),
      open_rq = createdb(t);

    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        db.createObjectStore('test');
    };

    open_rq.onsuccess = function(e) {
        assert_throws({ name: 'TypeError' },
            function() { db.transaction('test', 'whatever'); });

        t.done();
    };