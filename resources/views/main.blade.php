<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />

	<title>TriviaSubs</title>

	<!-- Fonts -->
	<link rel="stylesheet" href="{{ url('css/app.css') }}">
	<!--<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">-->
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

	{{-- CSRF Token --}}
	<meta name="csrf-token" content="{{ csrf_token() }}">

	<script type="text/javascript">
		window.__INITIAL_STATE__ = '@json($initial_state)';
	</script>

</head>
<body class="splash">
	<div id="app"></div>

	<script src="{{ url('js/app.js') }}"></script>
	<script>
		/*// Menu Toggling
		// Toggle if user clicks on the hamburger-menu icon
		document.querySelector("#navToggle").addEventListener("click", function(event) {
			document.querySelector("nav").classList.toggle("showing");
		});
		// Remove class if user clicks on either #main or #footer (basically anything except the header menu)
		document.getElementById("content").addEventListener("click", function(event) {
			document.querySelector("nav").classList.remove("showing");
		});
		document.getElementById("footer").addEventListener("click", function(event) {
			document.querySelector("nav").classList.remove("showing");
		});
*/
	</script>
</body>
</html>
