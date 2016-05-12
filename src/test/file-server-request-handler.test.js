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
	Http = require('eyeos-http-wrapper'),
	FakeSettings = require('./utils/fake-settings'),
	FileServerRequestHandler = require('../lib/file-server-request-handler');

suite('FileServerRequestHandler', function () {
	var sut;
	var http, httpMock;
	var pathToDelete;
	var userData;
	var body;
	var options;
	var card;
	var signature;

	setup(function () {
		card = 'card';
		signature = 'signature';
		body = {
			params : {
				data: {
					path: FakeSettings.fileServerQueue.printFolderPath,
					type: "directory"
				}
			}
		};
		options = {
			hostname: FakeSettings.fileServerQueue.busAdapterHost,
			path: FakeSettings.fileServerQueue.busAdapterDeleteQueue + '/?checknum=checknum&message=__FileSystemClientService_delete',
			port: FakeSettings.fileServerQueue.busAdapterPort,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				card: card,
				signature: signature
			}
		};
		userData = {
			card: card,
			signature: signature,
			username: 'username'
		};
		pathToDelete = FakeSettings.fileServerQueue.printFolderPath;
		http = new Http();
		httpMock = sinon.mock(http);
		sut = new FileServerRequestHandler(http, FakeSettings);
	});

    suite('#sendDeleteFolder', function () {
        test('should call http request', function () {
			var exp = httpMock
				.expects('request')
				.once()
				.withExactArgs(JSON.stringify(body), options, sinon.match.func, sinon.match.func);
			sut.sendDeleteFolder(userData.card, userData.signature, pathToDelete);
			exp.verify();
        });
    });
});
