class Component {
  static bindHandlers(component, handlers) {
    for (let handler of handlers) {
      component[handler] = component[handler].bind(component);
    }
  }
}

export default Component