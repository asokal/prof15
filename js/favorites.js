
o2.favorites =
{
	favorites: function (instance)
	{
		var toFavorite = 1;

		if(!$(instance).hasClass('favorite'))
		{
			$(instance).find('span').text('В избранном');
			$(instance).addClass('favorite');
			toFavorite = 1;
		}
		else
		{
			$(instance).find('span').text('В избранное');
			$(instance).removeClass('favorite');
			toFavorite = 0;
		}


		var productId =$(instance).find('input[name="product"]').val();
		$.ajax({
			url      : '/favorites',
			type     :'POST',
			dataType :'json',
			data     : {id : productId},
			success: function(data)
			{
				if(data.type == "noPermission")
					window.location = "/auth";

				$(instance).find('span').text(data.msg);

				if(data.info == "added")
					$(instance).find('svg').addClass('favorite');
				else
					$(instance).find('svg').removeClass('favorite');
			}
		});
	}
};