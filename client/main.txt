import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

//var oldId = "";
//var newId = "";



/*import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
}); */

if (Meteor.isClient) {
  Meteor.subscribe('docs');    
  Meteor.subscribe('files.images', Meteor.userId());  
  Meteor.subscribe('labels');



Tracker.autorun(function(){
  if(Meteor.userId()){  	
  	//newId = Meteor.userId();
  	Session.setPersistent("newId", Meteor.userId() );
  	console.log("newId: " + Session.get("newId"));
  	console.log("previousId: " + Session.get("oldId"));
  	//if(newId !== oldId && oldId !== ""){
  	//	oldId = newId;
  	if(Session.get("newId") !== Session.get("oldId")){

  		Session.setPersistent("oldId", Session.get("newId"));
  		document.location.reload(true);  		
  	}
    
  }
});
}
