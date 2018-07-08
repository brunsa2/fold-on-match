'use babel';

import { CompositeDisposable } from 'atom';

export default {
  config: {
    foldAbove: {
      title: "Fold nearest line above matching text",
      description: "Fold the nearest line above a text match instead of only folding lines the exact lines containing a match",
      type: "boolean",
      default: false
    },
    foldOnCursor: {
      title: "Fold matches on cursor location",
      description: "Fold lines on both the current selection or the word that the cursor is currently located in",
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
        var selection = editor.getSelectedText()
        if (selection === '' && atom.config.get('fold-on-match.foldOnCursor')) {
          selection = editor.getWordUnderCursor()
        }
        if (selection === '') {
          return
        }

        var rowCount = editor.getLastBufferRow()
        // Start at bottom to fold nested matching lines, otherwise folding outer nest first
        // will falsely trigger `isFoldedAtBufferRow` guard
        for (var row = rowCount - 1; row >= 0; --row) {
          if (editor.lineTextForBufferRow(row).indexOf(selection) !== -1) {
            action(editor, row)
          }
        }
      }
    }

    function foldRow(editor, row) {
      if (atom.config.get('fold-on-match.foldAbove') || editor.isFoldableAtBufferRow(row)) {
        if (!editor.isFoldedAtBufferRow(row)) {
          editor.foldBufferRow(row)
        }
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
