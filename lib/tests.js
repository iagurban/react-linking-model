(function(){
  var LinkingModel, _, expect;
  LinkingModel = require('./index');
  _ = require('lodash');
  expect = require('chai').expect;
  describe('main', function(___){
    it('numeric', function(){
      var model, x$;
      model = new LinkingModel({
        test: 1
      });
      x$ = model.links.test;
      expect(_.size(x$)).equal(2);
      expect(x$.value).equal(1);
      expect(x$.onChange).to.be['instanceof'](Function);
      x$.onChange(5);
      expect(model.links.test.value).equal(5);
    });
    it('changing definition', function(){
      var inPassed, outPassed, model, x$;
      inPassed = false;
      outPassed = false;
      model = new LinkingModel({
        test: {
          i: {
            valueName: function(it){
              inPassed = true;
              return it + 1;
            }
          },
          o: {
            onChangeName: function(it){
              outPassed = true;
              return it + 1;
            }
          },
          d: 123
        }
      });
      x$ = model.links.test;
      expect(_.size(x$)).equal(2);
      expect(x$.valueName).equal(124);
      expect(x$.onChangeName).to.be['instanceof'](Function);
      x$.onChangeName(5);
      expect(model.data.get('test')).equal(6);
      expect(model.links.test.valueName).equal(7);
      model.links.test = 20;
      expect(model.data.get('test')).equal(20);
      expect(model.links.test.valueName).equal(21);
      expect(inPassed).equal(true);
      expect(outPassed).equal(true);
    });
    it('no-out', function(){
      var model, x$;
      model = new LinkingModel({
        test: {
          i: {
            value: function(it){
              return it + 1;
            }
          },
          d: 123
        }
      });
      x$ = model.links.test;
      expect(_.size(x$)).equal(1);
      expect(model.data.get('test')).equal(123);
      expect(x$.value).equal(124);
    });
    it('no-in-out', function(){
      var model, x$;
      model = new LinkingModel({
        test: {
          d: 123
        }
      });
      x$ = model.links.test;
      expect(_.size(x$)).equal(0);
    });
    it('native', function(){
      var model, x$;
      model = new LinkingModel({
        test: LinkingModel.native
      });
      x$ = model.links.test.extend({
        type: 'text'
      });
      expect(_.size(x$)).equal(3);
      expect(x$.type).equal('text');
      expect(x$.value).equal('');
      expect(x$.onChange).to.be['instanceof'](Function);
      x$.onChange({
        target: {
          value: 'abc'
        }
      });
      expect(model.links.test.type != null).equal(false);
      expect(model.data.get('test')).equal('abc');
      expect(model.links.test.value).equal('abc');
      expect(function(){
        return model.links.test.onChange(null);
      }).to['throw']();
    });
    it('subscription', function(){
      var model, subCalled, unsub;
      model = new LinkingModel({
        test: 1
      });
      subCalled = false;
      unsub = model.sub(function(it){
        subCalled = true;
        expect(it.get('test')).equal(10);
      });
      subCalled = false;
      model.links.test.onChange(10);
      expect(subCalled).equal(true);
      subCalled = false;
      model.links.test.onChange(10);
      expect(subCalled).equal(false);
      unsub();
      expect(model._ob_observers.size).equal(0);
    });
    return it('many subscriptions', function(){
      var model, unsub1, unsub2;
      model = new LinkingModel({
        test: 1
      });
      unsub1 = model.sub(function(){});
      model._lastUuid = 0;
      unsub2 = model.sub(function(){});
      unsub1();
      unsub2();
      expect(model._ob_observers.size).equal(0);
    });
  });
}).call(this);
