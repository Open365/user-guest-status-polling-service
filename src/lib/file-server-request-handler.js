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

var log2out = require('log2out'),
	HttpLib = require('eyeos-http-wrapper');

var FileServerRequestHandler = function(http, settings) {
	this.logger = log2out.getLogger('FileServerRequestHandler');
	this.http = http || new HttpLib();
	this.settings = settings || require('./settings');
};

FileServerRequestHandler.prototype.sendDeleteFolder = function (card, signature, path) {
	var options = {
		hostname: this.settings.fileServerQueue.busAdapterHost,
		path: this.settings.fileServerQueue.busAdapterDeleteQueue + '/?checknum=checknum&message=__FileSystemClientService_delete',
		port: this.settings.fileServerQueue.busAdapterPort,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			card: card,
			signature: signature
		}
	};

	this.logger.trace('About to send delete request to file-server @ ' + options.path + ' via httpToBus');

	var body = {
		params : {
			data: {
				path: path,
				type: "directory"
			}
		}
	};

	var self = this;
	this.http.request(JSON.stringify(body), options, function (res) {
		var resObj = JSON.parse(res);
		if (!resObj.success) {
			self.logger.warn('Could not delete folder. Could mean it was not created: ' , res);
		}
		else self.logger.debug('Request to file-server via camel sent ok');
	}, function (err) {
		self.logger.error('Error sending request to file-server via camel: ' , err);
	});
};

module.exports = FileServerRequestHandler;
