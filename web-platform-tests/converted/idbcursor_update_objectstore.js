require("../../build/global.js");
const {
    add_completion_callback,
    assert_array_equals,
    assert_equals,
    assert_false,
    assert_not_equals,
    assert_throws,
    assert_true,
    async_test,
    createdb,
    createdb_for_multiple_tests,
    fail,
    indexeddb_test,
    setup,
    test,
} = require("../support-node.js");

const document = {};
const window = global;



    var db,
      t = async_test(),
      records = [ { pKey: "primaryKey_0" },
                  { pKey: "primaryKey_1" } ];

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("test", { keyPath: "pKey" });

        for (var i = 0; i < records.length; i++)
            objStore.add(records[i]);

        // XXX: Gecko doesn't like this
        //e.target.transaction.oncomplete = t.step_func(CursorUpdateRecord);
    };

    open_rq.onsuccess = CursorUpdateRecord;


    function CursorUpdateRecord(e) {
        var txn = db.transaction("test", "readwrite"),
          cursor_rq = txn.objectStore("test")
                         .openCursor();
        cursor_rq.onsuccess = t.step_func(function(e) {
            var cursor = e.target.result;

            cursor.value.data = "New information!";
            cursor.update(cursor.value);
        });

        txn.oncomplete = t.step_func(VerifyRecordWasUpdated);
    }


    function VerifyRecordWasUpdated(e) {
        var cursor_rq = db.transaction("test")
                          .objectStore("test")
                          .openCursor();

        cursor_rq.onsuccess = t.step_func(function(e) {
            var cursor = e.target.result;

            assert_equals(cursor.value.data, "New information!");
            t.done();
        });
    }
