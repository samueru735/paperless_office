
Template.homeIndex.helpers({
	featured: function(){
		return Documents.featured();
	}
});
Template.labelSelector.helpers({
  labels: function(){
    return Labels.labelsAvailable();
  }  
});
Template.labelSelector.rendered = function(){
  $("#labelSelector").select2({
    placeholder:"select some labels",
    allowClear:"true"    
  });
}
Template.labelSelector.events({
  'click': function(){
    console.log("selected labels: ", $("#labelSelector").val());
  }
})
Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find();
  }
});
Template.file.helpers({
  imageFile: function () {
    return Images.findOne();
  }
});

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload = Images.insert({
        file: e.currentTarget.files[0],
        meta: {
          labels: [$("#labelSelector").val()]
        },
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
}); 