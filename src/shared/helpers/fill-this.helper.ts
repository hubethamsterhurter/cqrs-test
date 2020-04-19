
export function fillThis<T>(this: T, props: T) {
  if (props) {
    Object
      .entries(props)
      .forEach(([k, v]) => { (this as any)[k] = v; });
  }
}