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
	VDIServiceUserEventProvider = require('../lib/VDIServiceUserEventProvider'),
	RemoveUserTempDirs = require('../lib/remove-user-temp-dirs'),
    settings = require('./utils/fake-settings.js'),
    PollingManager = require('../lib/polling-manager.js'),
    TIDHeader = require('httptobusserver').TIDHeader,
    log2out = require('log2out');

suite('PollingManager', function() {
    var sut, pollingProvider, pollingProviderMock, limit, pollingInterval, vdiServiceUserEventProvider,
        vdiServiceUserEventProviderMock, maxLockedInactivityPeriod, userData, tracer;
	var removeUserTempDirs, removeUserTempDirsMock;

    setup(function() {
        limit = settings.maxUserGuestAssignations;
        userData = {
            'card': {},
            'signature': {},
            'username': 'fake.username'
        };
        vdiServiceUserEventProvider = new VDIServiceUserEventProvider();
		vdiServiceUserEventProvider = {
			disconnect: function () {

			}
		};
        vdiServiceUserEventProviderMock = sinon.mock(vdiServiceUserEventProvider);

		removeUserTempDirs = new RemoveUserTempDirs();
		removeUserTempDirsMock = sinon.mock(removeUserTempDirs);

        pollingInterval = settings.pollingInterval;
        maxLockedInactivityPeriod = settings.lockedDocumentsExpirationTime;
        pollingProvider = {
            getIdleGuestsUsername: function() {}
        };
        pollingProviderMock = sinon.mock(pollingProvider);
        tracer = log2out.getLogger('LoginResultHandler');
        sut = new PollingManager(pollingProvider, settings, vdiServiceUserEventProvider, removeUserTempDirs, tracer);
    });

    suite('#start', function() {
        var exp;

        setup(function() {
            exp = pollingProviderMock
				.expects('getIdleGuestsUsername')
				.once()
				.withExactArgs(limit, pollingInterval, maxLockedInactivityPeriod, sinon.match.func, sinon.match.func);
        });

        test('Should call pollingProvider getIdleGuestsUsername', function() {
            sut.start();
            exp.verify();
        });
    });


    suite('#processUserList', function() {
        var exp;

        setup(function() {

        });

        test('should call VdiServiceUserEventProfile disconnect', function() {
            var tidHeader = new TIDHeader();
			var exp = vdiServiceUserEventProviderMock
						.expects('disconnect')
						.once()
						.withExactArgs(userData.card, userData.signature, userData.username, tidHeader);
			var st = sinon.stub(removeUserTempDirs, 'removePrintFolder');
            sut.processUserList(userData, tidHeader);
            exp.verify();
			st.restore();
        });

		test('should call VdiServiceUserEventProfile disconnect', function() {
			var exp = removeUserTempDirsMock
					.expects('removePrintFolder')
					.once()
					.withExactArgs(userData.card, userData.signature);
			var st = sinon.stub(vdiServiceUserEventProvider, 'disconnect');
		  	sut.processUserList(userData);
		  	exp.verify();
			st.restore();
		});
        
        test('should log info trace with correct values', function(){
            var tidHeader = new TIDHeader();
            var tracerInfoStub = sinon.stub(tracer, 'info');
            sut.processUserList(userData, tidHeader);
            assert(tracerInfoStub.calledWithExactly('User is not using the platform anymore. Logging out.', tidHeader.getHeaderValue(), userData.signature), 'Tracer not called or called with invalid params');
        });
    });
});
