(function(){
  var Map, identity, LinkProto, LinkingModel;
  Map = require('immutable').Map;
  identity = function(it){
    return it;
  };
  LinkProto = {
    extend: function(it){
      return Object.assign({}, this, it);
    }
  };
  LinkingModel = (function(){
    LinkingModel.displayName = 'LinkingModel';
    var prototype = LinkingModel.prototype, constructor = LinkingModel;
    LinkingModel.native = {
      i: {
        value: identity
      },
      o: {
        onChange: function(it){
          return it.target.value;
        }
      },
      d: ''
    };
    LinkingModel.defaultDef = {
      i: {
        value: identity
      },
      o: {
        onChange: identity
      },
      d: null
    };
    function LinkingModel(definitions){
      var this$ = this;
      this._ob_observers = Map().asMutable();
      this._lastUuid = 0;
      this.links = Object.create(null);
      this._data = Map().withMutations(function(data){
        var key, ref$, definition, template, that, k, v, results$ = [];
        for (key in ref$ = definitions) {
          definition = ref$[key];
          if (!(definition != null && typeof definition === 'object')) {
            definition = Object.assign({}, constructor.defaultDef, {
              d: definition
            });
          }
          data.set(key, definition.d);
          template = Object.create(LinkProto);
          if (that = definition.o) {
            for (k in that) {
              v = that[k];
              template[k] = fn$(fn1$);
            }
          }
          results$.push(Object.defineProperty(this$.links, key, {
            set: fn2$(fn3$),
            get: fn4$(fn5$)
          }));
        }
        return results$;
        function fn$(it){
          return it.bind(this$, key, v);
        }
        function fn1$(key, pipe, v){
          return this.data = this.data.update(key, function(old){
            return pipe(v, old);
          });
        }
        function fn2$(it){
          return it.bind(this$, key);
        }
        function fn3$(key, value){
          this.data = this.data.set(key, value);
        }
        function fn4$(it){
          return it.bind(this$, key, template, definition);
        }
        function fn5$(key, template, definition){
          var x$, value, that, k, v;
          x$ = template;
          value = this.data.get(key);
          if (that = definition.i) {
            for (k in that) {
              v = that[k];
              x$[k] = v(value);
            }
          }
          return x$;
        }
      });
      Object.defineProperty(this, 'data', {
        set: function(data){
          var this$ = this;
          if (data === this._data) {
            return;
          }
          this._data = data;
          return this._ob_observers.map((function(it){
            return it(data);
          }));
        },
        get: function(){
          return this._data;
        }
      });
    }
    LinkingModel.prototype.sub = function(fn){
      var id;
      while (this._ob_observers.has(this._lastUuid)) {
        this._lastUuid = (this._lastUuid + 1) % (Number.MAX_SAFE_INTEGER - 1);
      }
      id = this._lastUuid;
      this._ob_observers.set(id, fn);
      return this._ob_observers.remove.bind(this._ob_observers, id);
    };
    return LinkingModel;
  }());
  module.exports = LinkingModel;
}).call(this);
