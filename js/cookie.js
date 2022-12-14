// работа с куками
o2.cookie =
{
	set: function(name, value, options)
	{
		options = options || {};
		var updatedCookie = name + "=" + value;
		for (var propName in options)
		{
			updatedCookie += "; " + propName;
			var propValue = options[propName];
			if (propValue !== true)
			{
				updatedCookie += "=" + propValue;
			}
		}
		var date = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);

		document.cookie = updatedCookie + '=; Path=/; Expires=' + date.toUTCString();
	},

	get: function(name)
	{
		var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	delete: function(name)
	{
		document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
};