Labels = new Meteor.Collection("labels");

console.log("labels");

if(Meteor.isServer){
	if(Labels.find().count() === 0){	
		console.log("found no labels, inserting standard labels");		
		Labels.insert({
			// type image
			name:"factuur",
			name:"brief",
			name:"notitie",
			name:"betaald",
			name:"te betalen",
			name:"dringend",
			name:"belangrijk",
			// veel voorkomende termen
			name:"Telenet",
			name:"Scarlet",
			name:"Belgacom",
			name:"Touring",
			// maand
			name:"januari",
			name:"februari",
			name:"maart",
			name:"april",
			name:"mei",
			name:"juni",
			name:"juli",
			name:"augustus",
			name:"september",
			name:"oktober",
			name:"november",
			name:"december"		
		});
	console.log("labels created");
	}
}

Labels.labelsAvailable = function(){
	return Labels.find({});
}
if (Meteor.isServer) { 
  Meteor.publish('labels', function () {
    return Labels.find();
  });
}