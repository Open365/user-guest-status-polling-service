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

var log2out = require('log2out');
var settings = require('./settings');
var Client = require('eyeos-consume-service').Client;
var PersistenceFactory = require('./persistence/persistence-factory.js');


var VDIServiceUserEventProvider = function(client, vdiSettings, persistence) {
    this.logger = log2out.getLogger('VDIServiceUserEventProvider');
    this.vdiEventsSettings = vdiSettings || settings.vdiEventsQueue;
    this.client = client || new Client(this.vdiEventsSettings);
    this.persistence = persistence || new PersistenceFactory().getPersistence(settings.persistence.collection);
};

VDIServiceUserEventProvider.prototype.disconnect = function(userCard, signature, username, tidHeader) {
    this.logger.debug('disconnect', userCard, signature);

    var headers = {
        "card": userCard,
        "signature": signature
    };
    headers[tidHeader.getHeaderName()] = tidHeader.getHeaderValue();

    this.client.post(this.vdiEventsSettings.url + '/disconnect', headers, '');
    this.persistence.setUserStatusToDelete(username);
};


module.exports = VDIServiceUserEventProvider;
