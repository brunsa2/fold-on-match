'use babel';

import FoldOnMatchView from './fold-on-match-view';
import { CompositeDisposable } from 'atom';

export default {

  foldOnMatchView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.foldOnMatchView = new FoldOnMatchView(/*state.foldOnMatchViewState*/);
    this.foldOnMatchPanel = atom.workspace.addBottomPanel({
      item: this.foldOnMatchView,
      visible: false,
      className: 'tool-panel panel-bottom'
    })

    // TODO: Add a keystroke to fold or unfold all lines matching current selection

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fold-on-match:toggle': () => this.toggle()
    }));



    //@findPanel = atom.workspace.addBottomPanel(item: @findView, visible: false, className: 'tool-panel panel-bottom')
  },

  deactivate() {
    this.foldOnMatchPanel.destroy();
    this.subscriptions.dispose();
    this.foldOnMatchView.destroy();
  },

  serialize() {
    return {
      foldOnMatchViewState: this.foldOnMatchView.serialize()
    };
  },

  toggle() {
    console.log('FoldOnMatch was toggled!');
    return (
      this.foldOnMatchPanel.isVisible() ?
      this.foldOnMatchPanel.hide() :
      this.foldOnMatchPanel.show()
    );
  }

};
