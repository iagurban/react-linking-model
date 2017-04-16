require! {
  immutable: {Map}
}

identity = -> it

LinkProto =
  extend: -> Object.assign {}, @, it

class LinkingModel
  @native =
    i: value: identity
    o: on-change: (.target.value)
    d: ''

  @default-def =
    i: value: identity
    o: on-change: identity
    d: null

  (definitions) ->
    @_ob_observers = Map!as-mutable!
    @_last-uuid = 0

    @links = Object.create null
    @_data = Map!with-mutations (data) ~>
      for key, definition of definitions
        unless definition? and typeof definition == \object =>
          definition = Object.assign {}, @@default-def, d: definition

        data.set key, definition.d

        template = Object.create LinkProto

        if definition.o
          for k, v of that => template[k] = (.bind @, key, v) (key, pipe, v) -> @data .= update key, (old) -> pipe v, old

        Object.define-property @links, key,
          set: (.bind @, key) (key, value) !-> @data .= set key, value
          get: (.bind @, key, template, definition) (key, template, definition) -> with template
            value = @data.get key
            if definition.i
              for k, v of that => ..[k] = v value

    Object.define-property @, \data,
      set: (data) ->
        return if data == @_data
        @_data = data
        @_ob_observers.map (data |>)

      get: -> @_data

  sub: (fn) ->
    while @_ob_observers.has @_last-uuid => @_last-uuid = (@_last-uuid + 1) % (Number.MAX_SAFE_INTEGER - 1)
    id = @_last-uuid
    @_ob_observers.set id, fn
    @_ob_observers.remove.bind @_ob_observers, id

module.exports = LinkingModel
