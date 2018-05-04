'use babel';

import { CompositeDisposable } from 'atom';

export default {
  config: {
    foldAbove: {
      title: "Fold nearest line above matching text",
      description: "Enable to fold the nearest line above a text match instead of only folding lines containing a match",
      type: "boolean",
      default: false
    }
  },

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fold-on-match:fold-all': () => foldAll()
    }))
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fold-on-match:unfold-all': () => unfoldAll()
    }))

    function foldAll() {
      applyAction(foldRow)
    }

    function unfoldAll() {
      applyAction(unfoldRow)
    }

    function applyAction(action) {
      let editor
      if (editor = atom.workspace.getActiveTextEditor()) {
        let selection = editor.getSelectedText() !== '' ? editor.getSelectedText() : editor.getWordUnderCursor()

        if (selection === '') {
          return
        }

        var rowCount = editor.getLastBufferRow()
        for (var row = 0; row < rowCount; ++row) {
          if (editor.lineTextForBufferRow(row).indexOf(selection) !== -1) {
            action(editor, row)
          }
        }
      }
    }

    function foldRow(editor, row) {
      if (atom.config.get('fold-on-match.foldAbove') || editor.isFoldableAtBufferRow(row)) {
        editor.foldBufferRow(row)
      }
    }

    function unfoldRow(editor, row) {
      if (atom.config.get('fold-on-match.foldAbove') || editor.isFoldableAtBufferRow(row)) {
        editor.unfoldBufferRow(row)
      }
    }
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  }
}
