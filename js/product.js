"use strict"
// объект для страницы product-page
o2.product =
{
	// добавление в корзину
	// после добавления кнопка меняет название
	addToCart: function(instance,prodId, event)
	{
		event.preventDefault();
		var productId   = prodId,
		weightId    = 0, // всегда одно значени - нет весов
		size        = 0, // всегда одно значени - нет размеров
		price       = '',//$form.find('input[name="price"]').val(),
		formatprice = 0,
		count       = 1,
		name        = '',//$form.find('input[name="name"]').val(),
		summ        = 0;

		var product = {
			unicId      : productId,
			productId   : productId,
			weightId    : weightId,
			size        : size,
			price       : price,
			formatprice : formatprice,
			count       : Number(count),
			name        : name,
			summ        : summ,
		};

		o2.cart.add(product);
		if($(instance).data('type') != 'smallBut')
			$(instance).html('В корзине');
	},
	showProductShare: function()
	{
		$('#product-share').addClass('active');
		document.addEventListener('click', (e) => {
			if (!document.getElementById('product-share').contains(event.target))
				this.hideProductShare();
		});
	},
	hideProductShare: function()
	{
		$('#product-share').removeClass('active');
	}
};
