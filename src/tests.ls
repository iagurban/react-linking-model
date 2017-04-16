require! {
  './index': LinkingModel

  lodash: _
  chai: {expect}
}

describe 'main', (___) ->
  it 'numeric', !->
    model = new LinkingModel do
      test: 1

    with model.links.test
      expect (_.size ..) .equal 2
      expect ..value .equal 1
      expect ..on-change .to.be.instanceof Function
      ..on-change 5

    expect model.links.test.value .equal 5

  it 'changing definition', !->
    in-passed = false
    out-passed = false

    model = new LinkingModel do
      test:
        i: value-name: ->
          in-passed := true
          it + 1
        o: on-change-name: ->
          out-passed := true
          it + 1
        d: 123

    with model.links.test
      expect (_.size ..) .equal 2
      expect ..value-name .equal 124
      expect ..on-change-name .to.be.instanceof Function
      ..on-change-name 5

    expect (model.data.get \test) .equal 6
    expect model.links.test.value-name .equal 7

    model.links.test = 20
    expect (model.data.get \test) .equal 20
    expect model.links.test.value-name .equal 21

    expect in-passed .equal true
    expect out-passed .equal true

  it 'no-out', !->
    model = new LinkingModel do
      test:
        i: value: -> it + 1
        d: 123

    with model.links.test
      expect (_.size ..) .equal 1
      expect (model.data.get \test) .equal 123
      expect ..value .equal 124

  it 'no-in-out', !->
    model = new LinkingModel do
      test:
        d: 123

    with model.links.test
      expect (_.size ..) .equal 0

  it 'native', !->
    model = new LinkingModel do
      test: LinkingModel.native

    with model.links.test.extend type: \text
      expect (_.size ..) .equal 3
      expect ..type .equal 'text'
      expect ..value .equal ''
      expect ..on-change .to.be.instanceof Function
      ..on-change target: value: 'abc'

    expect model.links.test.type? .equal false

    expect (model.data.get \test) .equal 'abc'
    expect model.links.test.value .equal 'abc'
    expect ->
      model.links.test.on-change null
    .to.throw!

  it 'subscription', !->
    model = new LinkingModel do
      test: 1

    sub-called = false
    unsub = model.sub !->
      sub-called := true
      expect (it.get \test) .equal 10

    sub-called := false
    model.links.test.on-change 10
    expect sub-called .equal true

    sub-called := false
    model.links.test.on-change 10
    expect sub-called .equal false

    unsub!

    expect model._ob_observers.size .equal 0

  it 'many subscriptions', !->
    model = new LinkingModel do
      test: 1

    unsub1 = model.sub !->
    model._last-uuid = 0 # simulate overflow
    unsub2 = model.sub !->

    unsub1!
    unsub2!

    expect model._ob_observers.size .equal 0
