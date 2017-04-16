# react-linking-model [![Build Status](https://travis-ci.org/iagurban/react-linking-model.svg?branch=master)](https://travis-ci.org/iagurban/react-linking-model)
> Immutable observable data model with generating shorthand bindings for react components

## Install

```shell
npm install react-linking-model
```

## Usage

```livescript
LinkingModel = require 'react-linking-model'

# Manipulates
CustomCheckbox = react.create-factory react.create-class do
  should-component-update: (p) -> p.value != @props.value
  render: ->
    DOM.div do
      on-click: !~> @props.on-change !@props.value
      if @props.checked => 'v' else 'o'

Root = react.create-factory react.create-class do
  get-initial-state: ->
    @model = new LinkingModel do
      # template which accepts event with 'target.value' for change
      i: LinkingModel.native

      # simple component definition (see cb2)
      cb1: true

      # custom simple component definition (same thing as cb1)
      cb2:
        i: checked: -> it # model-value to component-value
        o: on-change: -> it # component-value to model-value
        d: false

    # you can set values like this, internal value will be changed
    @model.links.i = 'default input value'

    # store immutable data in state, use it for triggering render
    # on change and restricting updates in 'should-component-update'
    # with by-value-comparation
    model-data: @model.data

  should-component-update: (p, s) -> s.model-data != @state.model-data

  component-will-mount: !->
    # subscribe for getting updates in model (when it changes, of course)
    # and save unsubscribe-functor
    @unsub = @model.sub (model-data) !~> @set-state {model-data}

  component-will-unmount: !-> @unsub?! # cleanup

  render: ->
    DOM.div do
      null
      CustomCheckbox @model.links.cb1
      CustomCheckbox @model.links.cb2
      # add other props (shorthand for Object.assign {}, @model.links.i, type: 'text')
      DOM.input @model.links.i.extend type: 'text'
```
