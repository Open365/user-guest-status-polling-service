/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var sinon = require('sinon'),
    assert = require('chai').assert,
    MongoPersistence = require('../lib/persistence/mongo/mongodb.js'),
    MongoDriver = require('eyeos-mongo').MongoDriver;

suite('MongoPersistence', function(){
    var sut, fakeMongoDriverSingleton, collectionName, mongoDriver, mongoDriverMock, mongoDriverGetExpectation,
        collection, collectionError, fakeLimit, maxInactivityPeriod, maxLockedInactivityPeriod, fakeSuccessCallback, errorCallback, callbackWrapper,
        usernameFromMongo, collectionEmptyData;
    var username, removeQuery;

    setup(function() {
        username = 'fake.user';
        usernameFromMongo = 'inactive user';
        removeQuery = {status: 'delete'};

        collection = {
            findAndModify: function(query, order, options, callback) {
                callback(null, usernameFromMongo);
            },
            update: function (query, update, callback) {
                callback(null, usernameFromMongo);
            }
        };
        collectionEmptyData = {
            findAndModify: function(query, order, options, callback) {
                callback(null, null);
            },
            remove: function(query, callback) {

            }
        };
        collectionError = {
            findAndModify: function(query, order, options, callback) {
                callback('Oops', []);
            },
            update: function (query, update, callback) {
            }
        };
        collectionName = 'some collection';
        fakeLimit = 2;
        maxInactivityPeriod = 50;
        maxLockedInactivityPeriod = 50;
        callbackWrapper = {
            fakeSuccessCallback: function() {},
            errorCallback: function() {}
        };

        mongoDriver = new MongoDriver();
        mongoDriverMock = sinon.mock(mongoDriver);

        fakeMongoDriverSingleton = {
            getMongoDriver: function() {
                return mongoDriver;
            }
        };
        sut = new MongoPersistence(collectionName, fakeMongoDriverSingleton);
    });

    suite('#getIdleGuestsUsername', function() {
        setup(function() {
        });

        function execute() {
            sut.getIdleGuestsUsername(fakeLimit, maxInactivityPeriod, maxLockedInactivityPeriod, callbackWrapper.fakeSuccessCallback, callbackWrapper.errorCallback);
        }

        test('should call mongoDriver.getCollection', function() {
            mongoDriverGetExpectation = mongoDriverMock.expects('getCollection').once()
                                                                                .withExactArgs(collectionName)
                                                                                .returns(collectionEmptyData);
            execute();
            mongoDriverGetExpectation.verify();
        });

        test('should call success callback if no error', function() {
            mongoDriverGetExpectation = mongoDriverMock.expects('getCollection').twice()
                                                                                .withExactArgs(collectionName)
                                                                                .onFirstCall().returns(collection)
                                                                                .onSecondCall().returns(collectionEmptyData);
            var exp = sinon.mock(callbackWrapper).expects("fakeSuccessCallback").once();
            execute();
            exp.verify();
        });

        test('should call success callback when error', function() {
            mongoDriverGetExpectation = mongoDriverMock.expects('getCollection').once()
                                                                                .withExactArgs(collectionName)
                                                                                .returns(collectionError);
            var exp = sinon.mock(callbackWrapper).expects("errorCallback").once();
            execute();
            exp.verify();
        });

        test('should call collection remove', function() {
            mongoDriverGetExpectation = mongoDriverMock.expects('getCollection').once()
                                                                                .withExactArgs(collectionName)
                                                                                .returns(collectionEmptyData);

            var exp = sinon.mock(collectionEmptyData).expects("remove")
                                                        .once()
                                                        .withExactArgs(removeQuery, sinon.match.func);
            execute();
            exp.verify();
        });
    });

    suite('#setUserStatusToDelete', function () {
        setup(function () {
            mongoDriverGetExpectation = mongoDriverMock.expects('getCollection').once()
                                        .withExactArgs(collectionName)
                                        .returns(collection);
        });
        test('should call mongoDriver.getCollection', function() {
            sut.setUserStatusToDelete(username);
            mongoDriverGetExpectation.verify();
        });

        test('should call to collection.update', function () {
            var exp = sinon.mock(collection)
                .expects('update')
                .once();
            sut.setUserStatusToDelete(username);
            exp.verify();
        });
    });
});
