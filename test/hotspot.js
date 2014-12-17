var hotspot = require('../lib/hotspot.js'),
    net = require('netroute'),
    assert = require('assert');

describe('hotspot', function() {
  describe('.getMAC(iface, ip, callback)', function() {
    it('should return callback with MAC', function(done) {
      
      // Will only work if you're connected to a network
      var netInfo = net.getInfo().IPv4[0] || net.getInfo().IPv6[0];
      hotspot.getMAC(netInfo.interface, '0.0.0.0', './test/assets/arp', function resp(err, mac) {
        assert.equal(err, null);
        assert.equal(typeof mac, 'string');
        done();
      });
    });
  });

  describe('.credFactory(config)', function() {
    it('should parse the config file', function(done) {

      var credFactory = new hotspot.credFactory('test/assets/hotspot.json');
      var config = credFactory.config;

      assert.equal(config.maintainer, 'John Doe');
      assert.equal(config.email, 'john@doe');
      assert.equal(config.phone, '074-111104110');

      done();
    });

    describe('.create(hash, user, callback)', function() {
      it('should return callback with user and server credentials', function(done) {
        var credFactory = new hotspot.credFactory('test/assets/hotspot.json');
        var userData = {
          fullname: 'John Doe',
          email: 'john@doe',
          phone: '074-111104110',
          macaddress: '01:23:45:67:89:ab'
        };

        credFactory.create('123asdzxcqwe456', userData, function(err, userCred, serverCred) {

          assert.equal(err, null);
          assert.equal(typeof userCred, 'string');
          assert.equal(serverCred['01:23:45:67:89:ab'].name, 'John Doe');

          userCred = JSON.parse(userCred);
          assert.equal(userCred.maintainer, 'John Doe');

          done();
        });
      });
    });
  });

  describe('.createHash(bytes, callback)', function() {
    it('should return callback with md5 hash', function(done) {

      hotspot.createHash(50, function(err, hash) {
        assert.equal(err, null);
        assert.equal(typeof hash, 'string');
        assert.equal(hash.length, 32);
        done();
      });
    });
  });
});
