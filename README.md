# TODO

- Create & connect database
- Connect repositories
- Create model representation objects that the client sees
- Create dataloader so client state of a resource is
  ```
    { byId: {
      model: null | model (always coded to model),
      loading: boolean | false,
      refs: number,
    }, },

    1 - send message for the model
    2 - dispatch to data that model is loading
    id ... Promise.then((result) => map.remove(string); data.push(id))
  ```
