var vForm = function (containerId) { 

	var _controls = document.getElementById(containerId).querySelectorAll("input[type='hidden'], input[type='password'], input[type='text'], input[type='radio'], input[type='checkbox'], select, textarea");

	var _fields = new Object();

	var _radios = new Object();		

	for (var i = 0; i < _controls.length; i++) {
		switch(_controls[i].type) {
			case "radio":
				if (!_radios.hasOwnProperty(_controls[i].name))
					_radios[_controls[i].name] = [];

				_radios[_controls[i].name].push(_controls[i]);								
				break;
			case "checkbox":
				Object.defineProperty(_fields, _controls[i].id, {
			  		get: function (control) { return function() { return control.checked; } }(_controls[i]),
			  		set: function (control) { return function(newValue) { newValue === "" ? control.checked = false : control.checked = newValue; } }(_controls[i]),
			  		enumerable: true,
			  		configurable: true
				});
				break;
			default:
				Object.defineProperty(_fields, _controls[i].id, {
			  		get: function (control) { return function() { return control.value; } }(_controls[i]),
			  		set: function (control) { return function(newValue) { control.value = newValue; } }(_controls[i]),
			  		focus: function (control) { return function() { control.focus(); } } (_controls[i]),  
			  		enumerable: true,
			  		configurable: true
				});
		}	
	}

	for (var name in _radios) {
		Object.defineProperty(_fields, name, {
	  		get: function (controls) { 
	  			return function() { 
	  				for (var i = 0; i < controls.length; i++) {
	  					if (controls[i].checked)
	  						return controls[i].value;
	  				}
	  			} 
	  		}(_radios[name]),
	  		set: function (controls) { 
	  			return function(newValue) {
	  				for (var i = 0; i < controls.length; i++) {
	  					if (newValue === "")
	  						controls[i].checked = false;

	  					if (controls[i].value === newValue) {
	  						controls[i].checked = true;
	  						break;
	  					}
	  				} 
	  			} 
	  		}(_radios[name]),
	  		enumerable: true,
	  		configurable: true
		});
	}

	var _focus = function (controlId) {
		document.getElementById(controlId).focus();
	}

	var _loadData = function (data) {
		for (var name in data) {
			if (_fields.hasOwnProperty(name))
				_fields[name] = data[name];
		}
	};

	var _clear = function () {
		for (var name in _fields) {
			_fields[name] = "";
		}
	};

	var _removeSelectOptions = function(selectId) {
		var select = document.getElementById(selectId);

		while (select.options.length > 0)
			select.remove(0);
	};

	var _loadSelectOptions = function(selectId, dataSource, valueProp, textProp) {
		var select = document.getElementById(selectId);

		for (var i = 0; i < dataSource.length; i++) {
        	var option = document.createElement("option");
            option.value = dataSource[i][valueProp];
            option.text = dataSource[i][textProp];
            select.add(option);
        }
	};

	return {
		fields: _fields,
		focus: _focus, 
		loadData: _loadData,
		clear: _clear,
		removeSelectOptions: _removeSelectOptions,
		loadSelectOptions: _loadSelectOptions
	}
}