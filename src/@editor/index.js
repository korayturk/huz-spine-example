import loadComponents from './components';
import loadBlocks from './blocks';

export default (editor, opts = {}) => {

  // Add components
  loadComponents(editor, opts);

  // Add components
  loadBlocks(editor, opts);
};