"use strict"

/**
 * инициализация всех инициализаций
 */
$(document).ready(function()
{
	o2.init();
});

/**
 * основной объект
 * @type {object}
 */
var o2 =
{
	getFormData(instance)
	{
		let data = {};
		for (let element of instance.elements)
			if (element.name)
				data[element.name] = element.value;
		return data;
	},
	articles:
	{
		loadMore: function (instance)
		{
			var sectionName = $(instance).attr('sectionName');
			var page = +$(instance).attr('page');

			page += 1;

			$.post({
			dataType : 'json',
			url      : '/articles/section/' + sectionName,
			data     : {page: page},
			/**
			 * Ответ на запрос "Оформление заказа"
			 */
			success: function(data)
			{
				if (!data.success)
					return false;

				$(instance).attr('page', page);
				$(instance).prev().after(data.html);

				if (data.pagination.total_pages <= page)
					$(instance).css('display', 'none');
			}
			});
		}
	},
	/**
	 * вызов функций, которые должны запускаться при загрузке страницы
	 */
	init: function()
	{
		this.stickNavCall();
		this.sliders.productSlider();
		this.sliders.brandSlider();
		this.sliders.filterRangeSlider();
		this.selects.filterSelect();
		this.catalog.init();
	},

	changeTab: function(instance)
	{
		$(instance).siblings().removeClass('active');
		$(instance).addClass('active');

		$(instance).parent().siblings('._tab').removeClass('active').eq($(instance).index()).addClass('active');
	},

	stickNav: function(instance)
	{
		if($(instance).scrollTop() != 0 && $('._headerNav').hasClass('header-nav--fixed'))
			return;

		if($(instance).scrollTop() != 0)
		{
			$('._headerNav').addClass('header-nav--fixed');
			$('body').addClass('nav-is-fixed');
		}
		else
		{
			$('._headerNav').removeClass('header-nav--fixed');
			$('body').removeClass('nav-is-fixed');
		}
	},

	stickNavCall: function()
	{
		o2.stickNav(window);

		$(window).scroll(function()
		{
			o2.stickNav(this);
		});
	},

	forms:
	{
		sendSubscribe: function(instance)
		{
			instance = $(instance);

			if(!this.validate(instance))
				return false;

			$.ajax({
				url      : instance.attr('action'),
				type     : 'POST',
				dataType : 'json',
				data     : instance.serialize()
			}).done(function(e)
			{
				if(typeof e.success == 'undefined' || !e.success)
					return false;

				$('.subscribe-form').children().remove();
				$('.subscribe-form').text('Вы подписаны!');

				alert('Вы подписались на рассылку');
			});

			return false;
		},
		validate: function(instance)
		{
			var error        = false,
				emailRegular = /^\w.+@\w+\.\w{2,4}$/i,
				errorMassage = '';

			$(instance).find('._requier').each(function()
			{
				var select = $(this);
				if(select.val() == '')
				{
					errorMassage += 'Введите ' + select.attr('placeholder');
					select.addClass('error');
					error = true;
				}
				else if(select.hasClass('_phone-mask') && !select.inputmask('isComplete'))
				{
					errorMassage += 'Не корректный номер';
					select.addClass('error');
					error = true;
				}
				else if(select.hasClass('_email') && !emailRegular.test(select.val()))
				{
					errorMassage += 'Не корректный електронный адрес';
					select.addClass('error');
					error = true;
				}
				else
					select.removeClass('error');
			});
			return !error;
		}
	},
	catalog:
	{
		nextPage     : 2,
		basePath     : '',
		filterString : '',
		sectionId    : false,
		init: function()
		{
			if(!/^\/catalog/.test(location.pathname))
				return;

			this.basePath     = location.pathname.replace(/filter\/.*/, '');
			this.sectionId    = this.basePath.match(/\d+/);
			this.filterString = location.pathname.match(/filter\/(.*)/);

			if(!this.sectionId)
				this.sectionId = false;
			else
				this.sectionId = this.sectionId[0];

			if(!this.filterString)
				this.filterString = '';
			else
				this.filterString = this.filterString[1]
		},
		showMore: function(instance, replace)
		{
			var self = this;

			instance = $(instance);

			$.ajax({
				url      : '/ajax/showMore/' + this.nextPage,
				type     : 'POST',
				dataType : 'json',
				data:{
					sectionId    : this.sectionId,
					filterString : this.filterString
				}
			}).done(function(e)
			{
				if(typeof e.success == 'undefined' || !e.success)
					return false;

				self.nextPage = e.nextPage;

				if(self.nextPage >= e.lastPage)
					instance.hide();
				else
					instance.show();

				if(replace)
					instance.siblings('.row').html('').append(e.data);
				else
					instance.siblings('.row').append(e.data);
			});
		},
		filter: function(instance)
		{
			instance = $(instance);

			var filterWraper = instance.parent(),
				filters = {};

			filterWraper.find('._filterRange').each(function(index, element)
			{
				element = $(element);

				var name = element.attr('name'),
					value = element[0].noUiSlider.get();

				if(typeof name == 'undefined')
					return true;

				filters[name] = value;
			});

			filterWraper.find('._filterSelect').each(function(index, element)
			{
				element = $(element);

				var name  = element.attr('name'),
					value = element.val();

				if(typeof name == 'undefined' || value.length == 0)
					return true;

				filters[name] = value;
			});

			var filterString = '';

			for(var index in filters)
			{
				var value = filters[index];

				filterString += index + '/';

				if(typeof value == 'object')
					filterString += value.join(':') + '/';
				else
					filterString += value + '/';
			}

			if(filterString == '')
				return false;

			this.filterString = filterString;
			window.history.pushState('forward', null, this.basePath + 'filter/' + filterString);

			this.nextPage = 1;
			this.showMore($('._show-more'), true);
		},
		cleanFilter: function(instance)
		{
			location = this.basePath;
		}
	},

	sliders:
	{
		productSlider: function()
		{
			$('._product-slider').slick({
				infinite: true,
				slidesToShow: 4,
				slidesToScroll: 1,
				responsive: [
				{
					breakpoint: 1280,
					settings: {
						slidesToShow: 3,
					}
				},
				{
					breakpoint: 992,
					settings: {
						arrows: false,
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 480,
					settings: {
						arrows: false,
						slidesToShow: 1,
					}
				}
			]
			});
		},

		brandSlider: function()
		{
			$('._brand-slider').slick({
				infinite: true,
				slidesToShow: 6,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 3000,
				responsive: [
				{
					breakpoint: 1280,
					settings: {
						slidesToShow: 5,
					}
				},
				{
					breakpoint: 992,
					settings: {
						// arrows: false,
						slidesToShow: 3,
					}
				},
				{
					breakpoint: 767,
					settings: {
						// arrows: false,
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 480,
					settings: {
						// arrows: false,
						slidesToShow: 1,
					}
				}
			]
			});
		},

		filterRangeSlider: function()
		{
			var filterRangeSliders = document.querySelectorAll('._filterRange');

			if(filterRangeSliders.length <= 0)
				return false;

			for(var index = 0; index < filterRangeSliders.length; index++)
			{
				var filterRangeSlider = filterRangeSliders[index],
					min               = filterRangeSlider.getAttribute('data-min'),
					max               = filterRangeSlider.getAttribute('data-max'),
					selectMin         = filterRangeSlider.getAttribute('data-select-min'),
					selectMax         = filterRangeSlider.getAttribute('data-select-max');

				min       = (min) ? +min : 200;
				max       = (max) ? +max : 1000;
				selectMin = (selectMin) ? +selectMin : min;
				selectMax = (selectMax) ? +selectMax : max;

				noUiSlider.create(filterRangeSlider, {
					start: [selectMin, selectMax],
					step: 1,
					behaviour: 'tap-drag',
					connect: true,
					tooltips: true,
					range: {
						'min': min,
						'max': max
					},

					format:
					{
						to: function(value)
						{
							value = Math.floor(value);
							// value = value.toLocaleString();
							return value;
						},

						from: function(value)
						{
							return value;
						}
					}
				});
			}


		}
	},

	selects:
	{
		filterSelect: function()
		{
			if($('._filterSelect').length == 0)
				return;

			var multipleCancelButton = new Choices('._filterSelect', {
				removeItemButton: true,
				classNames: {
					containerOuter: 'filter-select choices',
				}
			});
		}
	},

	toggleFilter: function(instance)
	{
		if($('._toggleFilter').is(":hidden"))
		{
			$('._toggleFilter').show();
			$(instance).text('Скрыть фильтрацию');
			$('.filter-content__descr').hide();
		}
		else
		{
			$('._toggleFilter').hide();
			$(instance).text('Фильтровать результаты');
			$('.filter-content__descr').show();
		}
	}
}