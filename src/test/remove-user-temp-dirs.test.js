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
	RemoveUserTempDirs = require('../lib/remove-user-temp-dirs'),
	FakeSettings = require('./utils/fake-settings'),
	FileServerRequestHandler = require('../lib/file-server-request-handler');

suite('RemoveUserTempDirs', function () {
	var sut;
	var userData;
	var fileServerRequestHandler, fileServerRequestHandlerMock;

	setup(function () {
		fileServerRequestHandler = new FileServerRequestHandler();
		fileServerRequestHandlerMock = sinon.mock(fileServerRequestHandler);
		userData = {
			card: 'aceofspades',
			signature: 'signature',
			username: 'username'
		};
		sut = new RemoveUserTempDirs(fileServerRequestHandler, FakeSettings);
	});

    suite('#removeFolders', function () {
        test('should call fileServerRequestHandlerMock ', function () {
			var exp = fileServerRequestHandlerMock
				.expects('sendDeleteFolder')
				.once()
				.withExactArgs(userData.card, userData.signature, FakeSettings.fileServerQueue.printFolderPath);
			sut.removePrintFolder(userData.card, userData.signature);
			exp.verify();
        });
    });
});
