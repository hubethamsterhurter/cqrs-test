export interface IActionableMetadata {
  /**
   * @description
   * Action the metadata
   */
  action(arg: {
    instance: object,
  }): void
}