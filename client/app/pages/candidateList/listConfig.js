const formatScreeningData = function(obj, details){
	if(details){
		return "( "+details.screening_date+" ) " + details.screening_feedback;
	}
};

const formatTechnicalRoundData = function(obj, details){
	if(details){
		return "( "+details.technical_date+" ) " + details.technical_feedback;
	}
};

const formatManagementRoundData = function(obj, details){
	if(details){
		return "( "+details.management_date+" ) " + details.management_feedback;
	}
};

let headers = {
	'firstName' : {
		"id" : "firstName",
		"label" : "First Name",
		"sort" : true,
		"sorted" : true,
		"isHidden" : false,
		"width" : "10%"
	},
	'lastName' : {
		"id" : "lastName",
		"label" : "Last Name",
		"sort" : true,
		"isHidden" : false,
		"width" : "9%"
	},
	'skill' : {
		"id" : "skill",
		"label" : "Skill",
		"sort" : true,
		"isHidden" : false,
		"width" : "10%"
	},
	'position' : {
		"id" : "position",
		"label" : "Position",
		"sort" : true,
		"isHidden" : false,
		"width" : "10%"
	},
	'email' : {
		"id" : "email",
		"label" : "Email",
		"sort" : true,
		"isHidden" : false,
		"width" : "15%"
	},
	'mobile' : {
		"id" : "mobile",
		"label" : "Mobile",
		"sort" : true,
		"isHidden" : false,
		"width" : "10%"
	},
	'status' : {
		"id" : "status",
		"label" : "Status",
		"sort" : true,
		"isHidden" : false,
		"width" : "6%"
	},
	'screening' : {
		"id" : "screening",
		"label" : "Screening",
		"format" : formatScreeningData,
		"sort" : true,
		"isHidden" : false,
		"width" : "10%"
	},
	'technical' : {
		"id" : "technical",
		"label" : "Technical Round",
		"format" : formatTechnicalRoundData,
		"sort" : true,
		"isHidden" : false,
		"width" : "10%"
	},
	'management' : {
		"id" : "management",
		"label" : "Management Round",
		"format" : formatManagementRoundData,
		"sort" : true,
		"isHidden" : false,
		"width" : "10%"
	}
}

export {headers};