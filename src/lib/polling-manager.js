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

var VDIServiceUserEventProvider = require('./VDIServiceUserEventProvider.js'),
	RemoveUserTempDirs = require('./remove-user-temp-dirs'),
    PollingProvider = require('./polling-provider.js'),
    TIDHeader = require('httptobusserver').TIDHeader,
    log2out = require('log2out');

var PollingManager = function(pollingProvider, settings, vdiServiceUserEventProvider, removeUserTempDirs, tracer) {
    this.pollingProvider = pollingProvider || new PollingProvider();
	this.removeUserTempDirs = removeUserTempDirs || new RemoveUserTempDirs();
	this.settings = settings || require('./settings.js');
    this.vdiServiceUserEventProvider = vdiServiceUserEventProvider || new VDIServiceUserEventProvider(null, this.settings.vdiEventsQueue);
    this.logger = log2out.getLogger('PollingManager');
    this.tracer = tracer || log2out.getLogger('PollingManager');
    this.tracer.setFormater('TransactionFormater');
};

PollingManager.prototype.start = function() {
    var limit = this.settings.maxUserGuestAssignations;
    var expirationTime = this.settings.expirationTime;
    var lockedExpirationTime = this.settings.lockedDocumentsExpirationTime;
    this.pollingProvider.getIdleGuestsUsername(limit, expirationTime, lockedExpirationTime, this.processUserList.bind(this), this.errorCallback);
};

/**
 * What shall we do with expired platform users: remove all VDI resources assigned to them & clean user
 * workspace removing temp dirs (print folder)
 *
 * @param userData
 */
PollingManager.prototype.processUserList = function(userData, tidHeader) {
    try {
        var tidHeader = tidHeader || new TIDHeader();
        this.tracer.info('User is not using the platform anymore. Logging out.', tidHeader.getHeaderValue(), userData.signature);
        this.vdiServiceUserEventProvider.disconnect(userData.card, userData.signature, userData.username, tidHeader);
		this.removeUserTempDirs.removePrintFolder(userData.card, userData.signature);
    } catch (err) {
        this.logger.error('Error parsing response from persistence provider: ', err);
        throw err;
    }
};

PollingManager.prototype.errorCallback = function() {

};

module.exports = PollingManager;
