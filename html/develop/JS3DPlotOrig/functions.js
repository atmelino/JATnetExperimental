function printMessage(target, message) {
	elementId = document.getElementById(target);
	if (elementId != null) {
		elementId.innerHTML += message;
		elementId.scrollTop = elementId.scrollHeight;
	}
}

function printlnMessage(target, message) {
	elementId = document.getElementById(target);
	if (elementId != null) {
		printMessage(target, message);
		elementId.innerHTML += '\n';
	}
}

function clearMessage(target) {
	document.getElementById(target).innerHTML = '';
}

function printVectorArray(title,a) {
	//printlnMessage('messages', 'Vector Array ' + a);
	printlnMessage('messages', title);
	for ( var i = 0; i < a.length ; i+=3) {
		sindex=sprintf("%2d",i);
		sx=sprintf("%3.2f",a[i]);
		sy=sprintf("%3.2f",a[i+1]);
		sz=sprintf("%3.2f",a[i+2]);
		
		//printlnMessage('messages', i + ' ' + a[i].toFixed(2));
		//printlnMessage('messages', sindex+ ' ' + sprintf("%3.2f",a[i]));
		printlnMessage('messages', sindex+ ' ' + sprintf("%5s",sx) + sprintf("%5s",sy) + sprintf("%5s",sz));
	}
};

function sortByKey(array, key) {
	return array.sort(function(a, b) {
		var x = a[key];
		var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

function MySQLDate(inDate) {
	outDate = inDate.getFullYear() + '-' + ('00' + (inDate.getMonth() + 1)).slice(-2) + '-'
			+ ('00' + inDate.getDate()).slice(-2) + ' ' + ('00' + inDate.getHours()).slice(-2) + ':'
			+ ('00' + inDate.getMinutes()).slice(-2) + ':' + ('00' + inDate.getSeconds()).slice(-2);

	return outDate;
}

function getCookie(c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			return unescape(y);
		}
	}
}

function existCookie(c_name) {
	var myBoolean = new Boolean(false);
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			myBoolean = true;
		}
	}
	return myBoolean;
}

function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
	// printlnMessage('messages', "cookie "+c_name+" set to "+ value);
}
