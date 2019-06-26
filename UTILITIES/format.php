<?php 

$j = json_decode(file_get_contents("tt0076759.json"));

$output = [];
$output['id'] = (int) $j->id;
$output['tt_id'] = $j->tt_id;
$output['title'] = $j->title;
$output['year'] = (int) $j->year;
$output['runtime'] = parseTimeBasic($j->runtime);
$output['prefacts'] = $j->prefacts;
$output['chapters'] = $j->chapters;

$allSubs = [];

function parseTimeBasic($t) {
	if (gettype($t) === 'integer') {
		return $t;
	}

	if (gettype($t) === 'string') {
		if (is_numeric($t)) {
			return (int) $t;
		}
		//Remove white space
		$t = preg_replace('/\s+/', '', $t);

		if (strlen($t) === 8) {
			//00:00:00
			sscanf($t, "%d:%d:%d", $hours, $minutes, $seconds);
			return isset($hours) ? $hours * 3600 + $minutes * 60 + $seconds : $minutes * 60 + $seconds;
		}
		else if (strlen($t) === 17) {
			//00:00:00-00:00:00
			sscanf($t, "%d:%d:%d-%d:%d:%d", $hours, $minutes, $seconds, $h2, $m2, $s2);
			return isset($hours) ? $hours * 3600 + $minutes * 60 + $seconds : $minutes * 60 + $seconds;
		}
		else {
			echo "Time Error: ".$t." assigning null<br>";
			return null;
		}
	}
}

function parseTime($sub, $i) {
	$t = $sub->time;
	if (!isset($sub->time)) {
		echo "Missing Time Error: (type ".$sub->type.") #".$i.": (skipping)<br>";
		$sub->time = null;
		return false;
	}
	if (gettype($t) === 'integer') {
		$sub->time = $t;
		return true;
	}

	if (gettype($t) === 'string') {
		if (is_numeric($t)) {
			$sub->time = (int) $t;
			return true;
		}
		//Remove white space
		$t = preg_replace('/\s+/', '', $t);

		if (strlen($t) === 8) {
			//00:00:00
			sscanf($t, "%d:%d:%d", $hours, $minutes, $seconds);
			$sub->time = isset($hours) ? $hours * 3600 + $minutes * 60 + $seconds : $minutes * 60 + $seconds;
			return true;
		}
		else if (strlen($t) === 17) {
			//00:00:00-00:00:00
			sscanf($t, "%d:%d:%d-%d:%d:%d", $hours, $minutes, $seconds, $h2, $m2, $s2);
			$sub->time = isset($hours) ? $hours * 3600 + $minutes * 60 + $seconds : $minutes * 60 + $seconds;
			return true;
		}
		else {
			echo "Time Parse Error: (type ".$sub->type.") #".$i.": ".$t." (skipping)<br>";
			$sub->time = null;
			return false;
		}
	}
}

for ($i = 0; $i < count($j->facts); $i++) {
	$sub = $j->facts[$i];
	$sub->type = 'f';

	parseTime($sub, $i);

	if ($sub->time !== null) {
		array_push($allSubs, $sub);
	}
}

for ($i = 0; $i < count($j->questions); $i++) {
	$sub = $j->questions[$i];
	$sub->type = 'q';

	parseTime($sub, $i);

	if ($sub->time !== null) {
		array_push($allSubs, $sub);
	}
}

for ($i = 0; $i < count($j->polls); $i++) {
	$sub = $j->polls[$i];
	$sub->type = 'p';

	parseTime($sub, $i);

	if ($sub->time !== null) {
		array_push($allSubs, $sub);
	}
}

for ($i = 0; $i < count($j->mistakes); $i++) {
	$sub = $j->mistakes[$i];
	$sub->type = 'm';

	parseTime($sub, $i);

	if ($sub->time !== null) {
		array_push($allSubs, $sub);
	}
}

//Pics/Images
/*
for ($i = 0; $i < count($j->pics); $i++) {
	$sub = $j->pics[$i];
	$sub->type = 'i';

	parseTime($sub, $i);

	if ($sub->time !== null) {
		array_push($allSubs, $sub);
	}
}
*/


function cmp($a, $b) {
    return $a->time > $b->time;
}

usort($allSubs, "cmp");

$output['subs'] = $allSubs;

$json = json_encode($output);
file_put_contents('formatted.json', $json);

?>
