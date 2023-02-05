function geoFindMe(clickEvent) {
	clickEvent.preventDefault();
	const status = document.querySelector('#status');
	const locationInput = document.querySelector('#location');
	function success(position) {
		const longitude = position.coords.longitude;
		const latitude = position.coords.latitude;
		status.textContent = '';
		locationInput.value = `[${longitude}, ${latitude}]`;
	}
	function error() {
        status.classList.add("text-danger");
        status.classList.remove("text-success", "text-warning");
		status.textContent = 'Unable to retrieve your location';
	}
	if (!navigator.geolocation) {
        status.classList.add("text-warning");
        status.classList.remove("text-success", "text-danger");
		status.textContent = 'Geolocation is not supported in your browser';
	} else {
        status.classList.add("text-success");
        status.classList.remove("text-warning", "text-danger");
        status.textContent = 'Locating...';
		navigator.geolocation.getCurrentPosition(success, error);
	}
}

document.querySelector('#use-my-location').addEventListener('click', geoFindMe);