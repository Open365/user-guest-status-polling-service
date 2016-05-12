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
    settings = require('./utils/fake-settings.js'),
    PollingProvider = require('../lib/polling-provider.js');

suite('PollingProvider', function() {
    var sut, persistenceProvider, persistenceProviderMock, limit, pollingInterval, maxLockedInactivityPeriod, successCallback, errorCallback;

    setup(function() {
        limit = settings.maxUserGuestAssignations;
        successCallback = function() {};
        errorCallback = function() {};
        pollingInterval = settings.pollingInterval;
        maxLockedInactivityPeriod = settings.lockedDocumentsExpirationTime;
        persistenceProvider = {
            getIdleGuestsUsername: function() {}
        };
        persistenceProviderMock = sinon.mock(persistenceProvider);
        sut = new PollingProvider(persistenceProvider, settings);
    });

    suite('#getIdleGuestsUsername', function() {
        var exp;

        setup(function() {
            exp = persistenceProviderMock.expects('getIdleGuestsUsername').once().withExactArgs(limit, pollingInterval,
                maxLockedInactivityPeriod, successCallback, errorCallback);
        });

        test('Should call provider getIdleGuestsUsername', function() {
            sut.getIdleGuestsUsername(limit, pollingInterval, maxLockedInactivityPeriod, successCallback, errorCallback);
            exp.verify();
        });
    });
});
