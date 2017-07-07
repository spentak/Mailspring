import Category from '../models/category';
import ChangeMailTask from './change-mail-task';

// Public: Create a new task to apply labels to a message or thread.
//
// Takes an options object of the form:
//   - folder: The {Folder} or {Folder} IDs to move to
//   - threads: An array of {Thread}s or {Thread} IDs
//   - threads: An array of {Message}s or {Message} IDs
//   - undoData: Since changing the folder is a destructive action,
//   undo tasks need to store the configuration of what folders messages
//   were in. When creating an undo task, we fill this parameter with
//   that configuration
//
export default class ChangeFolderTask extends ChangeMailTask {

  constructor(options = {}) {
    super(options);
    this.source = options.source
    this.taskDescription = options.taskDescription;
    this.folder = options.folder;
  }

  label() {
    if (this.folder) {
      return `Moving to ${this.folder.displayName}`;
    }
    return "Moving to folder";
  }

  description() {
    if (this.taskDescription) {
      return this.taskDescription;
    }

    let folderText = " to folder";
    if (this.folder instanceof Category) {
      folderText = ` to ${this.folder.displayName}`;
    }

    if (this.threadIds.length > 1) {
      return `Moved ${this.threadIds.length} threads${folderText}`;
    } else if (this.messageIds.length > 1) {
      return `Moved ${this.messageIds.length} messages${folderText}`;
    }
    return `Moved${folderText}`;
  }

  validate() {
    if (!this.folder) {
      throw new Error("Must specify a `folder`");
    }
    if (this.threadIds.length > 0 && this.messageIds.length > 0) {
      throw new Error("ChangeFolderTask: You can move `threads` or `messages` but not both")
    }
    if (this.threadIds.length === 0 && this.messageIds.length === 0) {
      throw new Error("ChangeFolderTask: You must provide a `threads` or `messages` Array of models or IDs.")
    }

    super.validate();
  }

  _isArchive() {
    return this.folder.name === "archive" || this.folder.name === "all"
  }
}