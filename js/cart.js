"use strict"
// объект для работы с корзиной
// добавление, удаление, редактирование
o2.cart =
{
	cartObj:[],
	// добавляет в корзину товар
	add: function(item)
	{
		var unicId       = item.unicId;
		var count        = item.count;
		var indexInArray = this.getIndex(unicId);

		if(indexInArray === false)
			this.cartObj.push(item);
		else
			this.cartObj[indexInArray].count = Number(this.cartObj[indexInArray].count) + Number(item.count);

		this.write();
		this.updateCountInIcon();
		this.recalc();
	},

	// обновление количества в иконке корзины
	updateCountInIcon: function()
	{
		var productsCount = 0;

		for(let key in this.cartObj)
			productsCount += Number(this.cartObj[key]['count']);

		$('._header-cart-count').text(productsCount);
		$('._header-cart-count').css('display','block');
	},
	//включает кнопку "показать результат"
	btnActive: function()
		{
			$('.g-btn-grey').addClass("g-btn--active");
		},

	// удаляет товар из корзины
	itemRemove: function(unicId)
	{
		var index = this.getIndex(unicId);
		if (index !== false)
			this.cartObj.splice(index, 1);

		this.write();
		this.updateCountInIcon();
		if(this.cartObj.length == 0)
			location.reload();
	},

	// инициализация объекта
	init: function(argument)
	{
		// если кук нет то корзина = []
		// если есть то JSON.parse
		var cart = o2.cookie.get('cart');
		this.cartObj = (typeof cart != 'undefined') ? JSON.parse(cart):[];
		Number.prototype.formatMoney = function(c, d, t)
		{
			var n = this,
			c = isNaN(c = Math.abs(c)) ? 2 : c,
			d = d == undefined ? "." : d,
			t = t == undefined ? "," : t,
			s = n < 0 ? "-" : "",
			i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
			j = (j = i.length) > 3 ? j % 3 : 0;
			return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		};
		this.initOrderMask();
	},

	// записывает в куки корзину
	write: function()
	{
		o2.cookie.set('cart',JSON.stringify(this.cartObj),{path:'/'});
	},


	// проверка на наличие такого товара в корзине
	// если есть, то возвращает номер ячейки массива, в которой лежит этот товар
	getIndex: function(unicId)
	{
		var cartLength = this.cartObj.length;
		for (var i = 0; i < cartLength; i++)
		{
			if (this.cartObj[i].productId == unicId)
				return i;
		};
		return false;
	},

	/**
	 * Перерасчет элемента в корзине
	 */
	recalcElement: function(instance)
	{
		var itemWrapp    = $(instance).parents('.cart-product');
		var unicId       = $(itemWrapp).data('unic-id');
		var price        = $(itemWrapp).data('price');
		var type 		 = $(instance).data('type');
		var count 		 = this.cartObj[this.getIndex(unicId)]['count'];

		if(type == 'minus')
			count--;
		else
			count++;
		if (!count)
			count = 1;

		var currentPrice = price * count;
		$(itemWrapp).find('.counter__count').text(count);

		this.updateCount(unicId, count);
		$(itemWrapp).find('.cart-product__price').text(currentPrice.formatMoney(0, '.', ' ') + ' ₽');
		this.recalc();
	},

	// перерасчет стоимости всех товаров в корзине
	// в итоге меняется только сумма на странице корзины
	recalc: function()
	{
		let self = this;
		let summ = 0;
		$('.cart-product').each(function(i,el)
		{
			var unicId       = $(el).data('unic-id');
			var price        = $(el).data('price');
			var count 		 = self.cartObj[self.getIndex(unicId)]['count'];
			summ += price * count;
		});
		$('._totalPrice').text(summ.formatMoney(0, '.', ' ') + ' ₽');
	},

	// удаление элемента из корзины
	deleteItem: function(instance)
	{
		var item =  $(instance).parents('.cart-product');
		var unicId = item.data('unic-id');

		item.slideUp(300,function()
		{
			o2.cart.itemRemove(unicId);
			item.remove();
			o2.cart.recalc();
		});
	},

	// обновляет количество в корзине
	updateCount: function(id, count)
	{
		var indexInArray = this.getIndex(id);
		this.cartObj[indexInArray]['count'] = count;
		this.write();
		this.updateCountInIcon();
	},

	disablebtn: function()
	{
		if ($('.checkbox').is(':checked')){
			$(".order-summary__btn").removeAttr('disabled').addClass("order-summart__btn-disabled");
		}
		else {
  			$(".order-summary__btn").attr('disabled', true).removeClass("order-summart__btn-disabled");
  }
	},

	/**
	 * Обработка формы создания заказа
	 */
	makeOrder: function()
	{
		let form = document.getElementById('order-customer-data'),
			data = o2.getFormData(form);

		const validator = new O2Validator(form);

		if (!validator.validate())
			return false;

		$.post('/cart/makeorder/', data).then((data, textStatus)=>
		{
			console.log(data);
			data = JSON.parse(data);
			if (data.success)
			{
				window.location = "/cart/";
				alert("Заказ создан успешно!");
			}
			else
			{
				window.location = "/cart/";
				alert(e.msg);
			}
		});
	},
	initOrderMask: function()
	{
		let patternMask = IMask(document.getElementById('order-user-phone'), {
			mask: '+{7}(000)000-00-00',
		});
	},

};
o2.cart.init();