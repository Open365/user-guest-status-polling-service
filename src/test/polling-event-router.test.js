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
    PollingEventRouter = require('../lib/polling-event-router.js'),
    settings = require('./utils/fake-settings.js');

suite('PollingEventRouter', function(){
    var sut, fakeRequest, fakeResponse, fakeResponseMock;

    setup(function(){
        fakeResponse = {
            end: function() {

            }
        };
        fakeResponseMock = sinon.mock(fakeResponse);
        sut = new PollingEventRouter();
    });

    suite('#dispatch', function() {
        var exp;

        setup(function() {
            exp = fakeResponseMock.expects('end').once().withExactArgs();
        });

        test('Should call httpResponse end', function() {
            sut.dispatch(fakeRequest, fakeResponse);
            exp.verify();
        });
    });
});
