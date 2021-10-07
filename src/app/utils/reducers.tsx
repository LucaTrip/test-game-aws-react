export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload?: M[Key];
      };
};

export enum Types {
  saveUserList = "save_user_list",
  handleError = "handle_error",
  clearErrorMessage = "clear_error_message",
  clearAll = "clear_all",
  saveCurrentUserDetail = "save_current_user",
}
