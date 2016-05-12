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

var sinon = require('sinon');
var assert = require('chai').assert;
var Server = require('../lib/server.js');
var settings = require('./utils/fake-settings.js');
var mongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton;

suite('Server', function(){
    var sut;
    var serverStarter;
    var mongoDriverSingletonMock;

    setup(function(){
        serverStarter = 'server starter';
        mongoDriverSingletonMock = sinon.mock(mongoDriverSingleton);
        sut = new Server(serverStarter, settings);
    });

    suite('#start', function(){
        var exp;

        setup(function() {
            exp = mongoDriverSingletonMock.expects('connect').once().withExactArgs(serverStarter, settings);
        });

        test('Should call mongoDriverSingleton.start', function () {
            sut.start();
            exp.verify();
        });
    });
});
