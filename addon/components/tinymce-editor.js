import Ember from 'ember';
const {observer, on, run} = Ember;

export default Ember.Component.extend({
  editor: undefined,
  tagName: 'textarea',
  
  // Change the editor content if value changes
  valueChanged: observer('value', function() {
    var id = this.get('id');
    if (id == 'edit') {
       let editor = this.get('editor');
      if (editor && editor.getContent() !== this.get('value')) {
        //console.log(this.get('value'));
        editor.setContent(this.get('value'));
      }
    }
    if (id == 'edit2') {
      let editor = this.get('editor');
      //check and see why editor2 is not able to get data
      if (editor && editor.getContent() !== this.get('value')) {
        //console.log('edit 2 ' + this.get('value'));
        editor.setContent(this.get('value'));
      }
    }
  }),

  // Change de value if editor content changes
  contentChanged(editor) {
    this.set('value', editor.getContent());
  },

  //Bind events to function
  setEvents: observer('editor', function() {
    let editor = this.get('editor');
    editor.on('change keyup keydown keypress mousedown', ()=>{
      run.debounce(this, this.contentChanged, editor, 1);
    });
  }),

  // Initialize tinymce
  initTiny: on('didInsertElement', observer('options', 'options2', function() {
    var id = this.get('id');
    console.log(id);
    if (id == 'edit') {
      let {options, editor} = this.getProperties('options', 'editor');
      let customOptions = {
        inline: true,
        images_upload_base_path: '/some/basepath',
        automatic_uploads: false,
        images_dataimg_filter: function(img) {
          return img.hasAttribute('internal-blob');
        },
        images_upload_credentials: true,
        selector: '.editable', //selector: `#${this.get('elementId')}`,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste"
        ],
        init_instance_callback : (editor) => {
          this.set('editor', editor);
          this.get('editor').setContent(this.get('value') || ''); //Set content with default text
        },
      };
      tinymce.init(Ember.$.extend( customOptions, options ));
    } else {
      let {options, editor} = this.getProperties('options', 'editor');
      let customOptions = {
        inline: true,
        images_upload_base_path: '/some/basepath',
        automatic_uploads: false,
        images_dataimg_filter: function(img) {
          return img.hasAttribute('internal-blob');
        },
        images_upload_credentials: true,
        selector: '.editable2', //selector: `#${this.get('elementId')}`,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste"
        ],
        init_instance_callback : (editor) => {
          this.set('editor', editor);
          this.get('editor').setContent(this.get('value') || ''); //Set content with default text
        },
      };
      tinymce.init(Ember.$.extend( customOptions, options ));
    }
    
  })),
});
