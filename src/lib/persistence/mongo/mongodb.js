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
    mongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton,
    settings = require('../../settings.js');
var inspect = require('util').inspect;

var MongoPersistence = function(collectionName, injectedMongoDriverSingleton) {
    this.logger = log2out.getLogger('MongoPersistence');
    this.mongoDriverSingleton = injectedMongoDriverSingleton || mongoDriverSingleton;
    this.collectionName = collectionName;
};

MongoPersistence.prototype.getIdleGuestsUsername = function(limit, maxInactivityPeriod, maxLockedPeriod, successCallback, errorCallback) {

    var now = new Date().getTime();
    var timeoutTimestampThreshold = now - maxInactivityPeriod;
    var timeoutTimestampLockedThreshold = now - maxLockedPeriod;
    var self = this;
    var mongoDriver = this.mongoDriverSingleton.getMongoDriver();
    var collection = mongoDriver.getCollection(this.collectionName);
    /**
     * FindAndModify currently only finds and updates a single document, hence the recursivity until we find no results.
     * A possible workaround could be to do updates on the status to mark all registers as 'checking_UUID', which will help us
     * find them afterwards
     */
    this.logger.debug("getIdleGuestsUsername. finding in: ", collection.collectionName, " Users with last ping before",
                        timeoutTimestampThreshold, " OR documents locked before", timeoutTimestampLockedThreshold);
    collection.findAndModify(   {$or: [
                                            {lastPingTs: {$lte: timeoutTimestampThreshold}, status: {$exists: false}},
                                            {lastPingTs: {$lte: timeoutTimestampLockedThreshold}, status: "locked"}]},
                                    ['_id', 'asc'],
                                    {$set: {status: 'locked', lastPingTs: new Date().getTime()}},
        function(err, data) {
            if (err) {
                self.logger.debug('error getting idle guest list: ', err);
                errorCallback(err);
            } else {
                self.logger.debug('success: ', data);
                if (data) {
                    successCallback(data);
                    // if data is not null, we search for more documents..
                    self.getIdleGuestsUsername(limit, maxInactivityPeriod, maxLockedPeriod, successCallback, errorCallback);
                } else {
                    self.logger.debug('No more inactive users found. Sleeping until next cycle');
                    collection.remove({status: 'delete'}, function(err) {
                        if (err) {
                            self.logger.error('Error cleaning users with delete status from mongo');
                        } else {
                            self.logger.debug('User with status delete cleaned up from mongo');
                        }
                    });
                }
            }
    });
};

MongoPersistence.prototype.setUserStatusToDelete = function (username) {
    var self = this;
    var mongoDriver = this.mongoDriverSingleton.getMongoDriver();
    var collection = mongoDriver.getCollection(this.collectionName);

    collection.update({username: username}, {$set: {status: 'delete'}}, function (err, doc) {
        if (err) {
            self.logger.error('error delete user: ', err);
        } else {
            self.logger.debug('success deleting user: ', doc);
        }
    });
};

module.exports = MongoPersistence;
