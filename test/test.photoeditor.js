define([
  'jquery',
  'backbone',
  'chai',
  'lib/photoeditor'
], function($, Backbone, chai, Photoeditor) {
  'use strict';

  var expect = chai.expect;

  describe('Photoeditor', function() {
    it('should have a name attribute by default', function() {
      expect(new Photoeditor().get('name')).to.equal('');
    });
  });
});
