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

var FakeSettings = {
    pollingInterval: 65000, // 1 minute 5 seconds
    expirationTime:  65000,
    lockedDocumentsExpirationTime: 30000,
    maxUserGuestAssignations: 10,
    persistence: {
        type: 'mongo',
        collection: 'userPresence'
    },
    mongoInfo: {
        type: "mongo",
        host: 'fakelocalhost',
        port: 27017,
        db: 'userPersistence'
    },
    vdiEventsQueue: {
        type: "amqp",
        hosts:'fakelocalhost:5672',
        queue: {
            name: "queue",
            durable: true,
            exclusive: false,
            autoDelete:false
        }
    },
	fileServerQueue: {
		// busAdapter = camel
		busAdapterHost: "host",
		busAdapterDeleteQueue: "path",
		busAdapterPort: 8888,
		printFolderPath: 'print://'
	}
};

module.exports = FakeSettings;
