"use strict"
// объект для работы с авторизацией

o2.auth = {
	signIn(e, instance)
	{
		e.preventDefault();
		const validator = new O2Validator(instance);

		if (!validator.validate())
			return false;

		$.post('/auth/signIn/', this.getFormData(instance)).then((data, textStatus)=>
		{
			data = JSON.parse(data);
			if (data.success)
				window.location.href = data.redirect;
		});
	},
	signUp(e, instance)
	{
		e.preventDefault();
		const validator = new O2Validator(instance);
		validator.callbacks.password = this.validation.password;
		validator.callbacks.repassword = this.validation.repassword;

		if (!validator.validate())
			return false;

		$.post('/auth/signUp/', this.getFormData(instance)).then((data, textStatus)=>
		{
			data = JSON.parse(data);
			if (data.success)
				window.location.href = data.redirect;
			else
			{
				this.setErrors(instance, data.msg);
				console.log(data.msg, res);
			}
		});
	},
	recoverPassword(e, instance)
	{
		e.preventDefault();
		console.log('recoverPassword', e);
	},
	setErrors(instance, errors)
	{
		let errorsHtml = '',
			$errorsBlock = $(instance).find('._global-errors'),
			allErrors = [];
		for (let key in errors)
			allErrors.push(...errors[key]);

		$errorsBlock.html(`<ul><li>${allErrors.join('</li><li>')}</li></ul>`);
	},
	validation:
	{
		password(field)
		{
			let $input = $(field).find('input');
			if ($input.val().length >= 6)
				return true;
			this.setMessage(field,'Ненадежный пароль, минимальная длина 6 символов');
			return false;
		},
		repassword(field)
		{
			let $password = $(field).siblings('._field[data-call="empty password"]').find('input'),
				$input    = $(field).find('input');
			if ($password.val() === $input.val())
				return true;
			this.setMessage(field,'Пароли не совпадают');
			return false;
		},
	},
};