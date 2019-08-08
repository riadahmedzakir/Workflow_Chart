(function () {
    'use strict';
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://172.16.0.13:27017/";
    angular.module('app').service('mongoService', constructor);
    constructor.$inject = ["$q"];
    function constructor($q) {
        return {
            get: get,
            newGuid: newGuid
        };

        function newGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function get(entity, query) {
            var deferred = $q.defer();
            MongoClient.connect(url, function (err, client) {
                var db = client.db("600DE79B-DCCD-4965-BC93-0A6A8E6AE388");
                db.collection(entity).find(query).toArray(function (err, items) {
                    client.close();
                    deferred.resolve(items);
                });
            });
            return deferred.promise;
        }
    }
})();
