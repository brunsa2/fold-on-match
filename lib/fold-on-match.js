'use babel';

import FoldOnMatchView from './fold-on-match-view';
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

  //foldOnMatchView: null,
  //modalPanel: null,
  subscriptions: null,

  activate(state) {
  //this.foldOnMatchView = new FoldOnMatchView(/*state.foldOnMatchViewState*/);
    /*this.foldOnMatchPanel = atom.workspace.addBottomPanel({
      item: this.foldOnMatchView,
      visible: false,
      className: 'tool-panel panel-bottom'
    })*/

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    /*this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fold-on-match:toggle': () => this.toggle()
    }));*/

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fold-on-match:fold-all': () => this.foldAll()
    }))

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fold-on-match:unfold-all': () => this.unfoldAll()
    }))




    //@findPanel = atom.workspace.addBottomPanel(item: @findView, visible: false, className: 'tool-panel panel-bottom')
  },

  deactivate() {
    //this.foldOnMatchPanel.destroy();
    this.subscriptions.dispose();
    //this.foldOnMatchView.destroy();
  },

  serialize() {
    return {
      //foldOnMatchViewState: this.foldOnMatchView.serialize()
    };
  },

  toggle() {
    console.log('FoldOnMatch was toggled!');
    /*return (
      this.foldOnMatchPanel.isVisible() ?
      this.foldOnMatchPanel.hide() :
      this.foldOnMatchPanel.show()
    );*/
  },

  foldAll() {
    applyAction(foldRow)
  },

  unfoldAll() {
    applyAction(unfoldRow)
  }
};

function applyAction(action) {
  let editor
  if (editor = atom.workspace.getActiveTextEditor()) {
    let selection = editor.getSelectedText() !== '' ? editor.getSelectedText() : editor.getWordUnderCursor()

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
