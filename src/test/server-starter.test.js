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
    RestUtilsServer = require('eyeos-restutils').Server,
    settings = require('./utils/fake-settings.js'),
    ServerStarter = require('../lib/server-starter.js');

suite('ServerStarter', function(){
    var sut;
    var eventsRestUtilsServer, eventsRestUtilsServerMock, eventsRestUtilsStartExpectation,
        pollingMonitor, pollingMonitorMock;

    setup(function(){
        eventsRestUtilsServer = new RestUtilsServer();
        pollingMonitor = {
            start: function() {}
        };
        pollingMonitorMock = sinon.mock(pollingMonitor);
        eventsRestUtilsServerMock = sinon.mock(eventsRestUtilsServer);
        eventsRestUtilsStartExpectation = eventsRestUtilsServerMock.expects('start').once().withExactArgs();

        sut = new ServerStarter( eventsRestUtilsServer, pollingMonitor, settings);
    });

    suite('#setMongoStarted', function() {
        var pollingMonitorExpectation;

        setup(function() {
            pollingMonitorExpectation = pollingMonitorMock.expects('start').once().withExactArgs();
        });

        test('Should set this.mongoStarted to the argument (true in this case)', function(){
            sut.setMongoStarted(true);
            assert.equal(true, sut.mongoStarted);
        });

        test('Should call eventsRestUtilsServer.start', function () {
            sut.setMongoStarted(true);
            eventsRestUtilsStartExpectation.verify();
        });

        test('Should call pollingMonitor.start', function () {
            sut.setMongoStarted(true);
            pollingMonitorExpectation.verify();
        });
    });
});
