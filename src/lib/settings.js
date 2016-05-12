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

var environment = process.env;

var settings = {
    pollingInterval: environment.EYEOS_USER_GUEST_STATUS_SERVICE_POLLING_INTERVAL || 65000, // 1 minute 5 seconds
    expirationTime:  environment.EYEOS_USER_GUEST_STATUS_SERVICE_EXP_TIME || 65000,
    lockedDocumentsExpirationTime: environment.EYEOS_USER_GUEST_STATUS_SERVICE_LOCKED_EXP_TIME || 30000, // 30 seconds
    // the following param allows to have a certain amount of control of how many persistence registers ara blocked per
    // transaction.
    maxUserGuestAssignations: environment.EYEOS_USER_GUEST_STATUS_SERVICE_POLLING_MAX_ASSIGNATIONS || 10,
    persistence: {
        type: environment.EYEOS_USER_GUEST_STATUS_SERVICE_POLLING_PERSIST_TYPE || 'mongo',
        collection: environment.EYEOS_USER_GUEST_STATUS_SERVICE_POLLING_DB_COLLCTN || 'userPresence'
    },
    mongoInfo: {
        type: environment.EYEOS_USER_GUEST_STATUS_SERVICE_MONGOINFO_TYPE || "mongo",
        host: environment.EYEOS_USER_GUEST_STATUS_SERVICE_MONGOINFO_HOST || 'mongo.service.consul',
        port: environment.EYEOS_USER_GUEST_STATUS_SERVICE_MONGOINFO_PORT || 27017,
        db: environment.EYEOS_USER_GUEST_STATUS_SERVICE_MONGOINFO_DB || 'eyeos'
    },
    userGuestPollingQueue: {
        type: environment.EYEOS_USER_GUEST_STATUS_SERVICE_VDIQUEUE_TYPE || "amqp",
        hosts: environment.EYEOS_USER_GUEST_STATUS_SERVICE_VDIEVENTSQUEUE_HOSTS || 'rabbit.service.consul:5672',
        login: environment.EYEOS_BUS_MASTER_USER || 'guest',
        password: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword',
        queue: {
            name: environment.EYEOS_USER_GUEST_STATUS_SERVICE_POLLING_QUEUE_NAME || "vdi.user.persistence.polling.v1",
            durable: true,
            exclusive: false,
            autoDelete: false
        }
    },
    vdiEventsQueue: {
        url: environment.EYEOS_VDI_SERVICE_POLLING_TYPE || "amqp.exchange://vdi.user.events/v1/userEvent",
        host: environment.EYEOS_VDI_SERVICE_POLLING_HOST || 'rabbit.service.consul',
        port: environment.EYEOS_VDI_SERVICE_POLLING_PORT || 5672,
        login: environment.EYEOS_BUS_MASTER_USER || 'guest',
        password: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword'
    },
	fileServerQueue: {
		// busAdapter = httpToBus (and camel before that )
		busAdapterHost: environment.EYEOS_FILE_SERVER_URL || "localhost",
		busAdapterDeleteQueue: environment.EYEOS_CAMEL_SERVER_URL || "/files/v1",
		busAdapterPort: environment.EYEOS_CAMEL_SERVER_PORT || 8196,
		printFolderPath: 'print://'
	}
};

module.exports = settings;
