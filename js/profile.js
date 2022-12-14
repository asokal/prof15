"use strict"

o2.profile =
{
	savePersonal: function(instance)
	{
		$.ajax({
			url      : '/profile/savePersonal',
			type     :'POST',
			dataType :'json',
			data     : $(instance).serialize()
		}).done(function(e)
		{
			if(typeof e.success != 'undefined' && e.success == true)
			{
				alert('Данные успешно сохранены.');
				return false;
			}
			alert(e.msg);
		});
		return false;
	},

	updatePassword: function(instance)
	{
		$.ajax({
			url      : '/profile/updatePassword',
			type     :'POST',
			dataType :'json',
			data     : $(instance).serialize()
		}).done(function(e)
		{
			if(typeof e.success != 'undefined' && e.success == true)
			{
				alert('Данные успешно сохранены.');
				return false;
			}
			alert(e.msg);
		});
		return false;
	},

	logOut: function()
	{
		$.ajax({
			url      : '/auth/logOut',
			type     :'POST',
			dataType :'json',
			success: function(data)
			{
				window.location = data.url;
			}
		});
	},
};