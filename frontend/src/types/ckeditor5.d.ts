// Type definitions for CKEditor 5 React component
// This file extends the CKEditor types to support the 'data' prop
declare module '@ckeditor/ckeditor5-react' {
  import { Component } from 'react';
  import { Editor } from '@ckeditor/ckeditor5-core';

  export interface CKEditorProps<T = any> {
    editor: typeof Editor;
    data?: string;
    config?: any;
    onChange?: (event: any, editor: any) => void;
    onReady?: (editor: any) => void;
    onBlur?: (event: any, editor: any) => void;
    onFocus?: (event: any, editor: any) => void;
    disabled?: boolean;
  }

  export class CKEditor<T = any> extends Component<CKEditorProps<T>> {}
}

declare module '@ckeditor/ckeditor5-build-classic' {
  import { Editor } from '@ckeditor/ckeditor5-core';
  const ClassicEditor: typeof Editor;
  export default ClassicEditor;
}
