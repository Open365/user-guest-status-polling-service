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
    PersistenceFactory = require('../lib/persistence/persistence-factory.js'),
    settings = require('./settings.js');

var PollingProvider = function(persistenceProvider, settings) {
    this.settings = settings || require('./settings.js');
    this.persistenceProvider = persistenceProvider || new PersistenceFactory().getPersistence(this.settings.persistence.collection);
    this.logger = log2out.getLogger('PollingProvider');
};

PollingProvider.prototype.getIdleGuestsUsername = function(limit, pollingInterval, maxLockedPeriod, successCallback, errorCallback) {
    this.persistenceProvider.getIdleGuestsUsername(limit, pollingInterval, maxLockedPeriod, successCallback, errorCallback);
};

module.exports = PollingProvider;
