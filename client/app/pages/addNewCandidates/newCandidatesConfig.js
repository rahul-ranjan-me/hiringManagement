export default [
	{
		'id' : 'firstName',
		'label' : 'First name',
		'type' : 'text',
		'placeholder' : 'First Name'
	},
	{
		'id' : 'lastName',
		'label' : 'Last name',
		'type' : 'text'
	},
	{
		'id' : 'skill',
		'label' : 'Skills',
		'type' : 'textarea'
	},
	{
		'id' : 'position',
		'label' : 'Position',
		'type' : 'text'
	},
	{
		'id' : 'email',
		'label' : 'Email',
		'type' : 'text',
		'placeholder' : 'xyz@email.com'
	},
	{
		'id' : 'mobile',
		'label' : 'Mobile',
		'type' : 'text'
	},
	{
		'id' : 'recruiterName',
		'label' : 'Recruiter Name',
		'type' : 'text'
	},
	{
		'id' : 'dob',
		'label' : 'Date of birth',
		'type' : 'text'
	},
	{
		'id' : 'status',
		'label' : 'Status',
		'type' : 'select',
		'options' : [
			{
				'label' : 'Please select',
				'value' : ''
			},
			{
				'label' : 'Pending',
				'value' : 'Pending'
			},
			{
				'label' : 'Hold',
				'value' : 'Hold'
			},
			{
				'label' : 'Rejected',
				'value' : 'Rejected'
			},
			{
				'label' : 'Selected',
				'value' : 'Selected'
			}
		]
	},
	{
		'id' : 'screening',
		'label' : 'Screening',
		'type' : 'subForm',
		'formField' : [
			{
				'id' : 'screening_date',
				'label' : 'Date',
				'type' : 'text'
			},
			{
				'id' : 'screening_feedback',
				'label' : 'Feedback',
				'type' : 'text'
			}
		]
	},
	{
		'id' : 'technical',
		'label' : 'Technical Round',
		'type' : 'subForm',
		'formField' : [
			{
				'id' : 'technical_date',
				'label' : 'Date',
				'type' : 'text'
			},
			{
				'id' : 'technical_feedback',
				'label' : 'Feedback',
				'type' : 'text'
			}
		]
	},
	{
		'id' : 'management',
		'label' : 'Management Round',
		'type' : 'subForm',
		'formField' : [
			{
				'id' : 'management_date',
				'label' : 'Date',
				'type' : 'text'
			},
			{
				'id' : 'management_feedback',
				'label' : 'Feedback',
				'type' : 'text'
			}
		]
	}
];