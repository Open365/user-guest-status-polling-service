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

var sinon = require('sinon');

var VDIServiceUserEventProvider = require('../lib/VDIServiceUserEventProvider');
var Client = require('eyeos-consume-service').Client;
var TIDHeader = require('httptobusserver').TIDHeader;

suite('VDIServiceUserEventProvider', function(){
    var sut;
    var client, clientMock, clientPostExpectation;
    var card, signature, url, username;
    var persistence, persistenceMock;
    var tidHeader;

    setup(function(){
        tidHeader = new TIDHeader();
        url = 'amqp.exchange://vdi.user.events/v1/userEvent/';
        username = 'fake.user';
        var expectedUrl = url + '/disconnect';
        var settings = {url: url};

        client = new Client();
        clientMock = sinon.mock(client);
        persistence = {
            setUserStatusToDelete: function () {}
        };
        persistenceMock = sinon.mock(persistence);

        card = 'a user card';
        signature = 'a signature';
        var headers = {
            "card": card,
            "signature": signature
        };
        headers[tidHeader.getHeaderName()] = tidHeader.getHeaderValue();

        clientPostExpectation = clientMock.expects('post')
            .once().withExactArgs(expectedUrl, headers, '');

        sut = new VDIServiceUserEventProvider(client, settings, persistence);
    });


    suite('disconnect', function(){

        test('when called should call client.post', function(){
            sut.disconnect(card, signature, username, tidHeader);
            clientPostExpectation.verify();
        });

        test('should call to persistence.setUserStatusToDelete', function () {
            var exp = persistenceMock
                .expects('setUserStatusToDelete')
                .once()
                .withExactArgs(username);
            sut.disconnect(card, signature, username, tidHeader);
            exp.verify();
        });
    });

});
