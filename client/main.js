import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


//var oldId = "";
//var newId = "";


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
