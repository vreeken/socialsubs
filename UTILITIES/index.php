<?php 
define("URL", 'https://www.moviemistakes.com/film1226');
//https://www.moviemistakes.com/film1226/page2

function getUrlContent($url){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	$data = curl_exec($ch);
	$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	return ($httpcode>=200 && $httpcode<300) ? $data : false;
}

$d = getUrlContent("https://www.moviemistakes.com/film1226");

$finalArray = [];

parseHTML($d, $finalArray);


$pi = 2;
while(true) {
	//echo URL . '/page' . $pi.'<br>';
	$d = getUrlContent(URL . '/page' . $pi, $finalArray);
	if ($d === false) {
		break;
	}
	$pi++;

	parseHTML($d, $finalArray);
}

//Sort array (null -> 00:00:00 -> END)
function cmp($a, $b) {
    return strcmp($a['time'], $b['time']);
}

usort($finalArray, "cmp");

$json = json_encode($finalArray);
file_put_contents('output.json', $json);


function parseHTML($html, &$finalArray) {
	$ar = explode('"entrytext"', $html);



	for ($i=1; $i<count($ar); $i++) {
		$s = substr($ar[$i], strpos($ar[$i], '>')+1);
		
		$c = substr($s, 0, strpos($s, ':')-4);
		$c = substr($s, strrpos($c, '>')+1);		
		$o['cat'] = trim(substr($c, 0, strpos($c, '<')));
		
		$s = substr($s, strpos($s, ':'), strpos($s, '</p') + 100);
		$s = substr($s, 0, strrpos($s, '</p'));
		if (strpos($s, 'entrytimecode') !== false) {
			

			$t = substr($s, strrpos($s, '</span>')-25);

			$p = strpos($t, '(')+1;
			$o['time'] = substr($t, $p, strpos($t, ')') - $p);
			$s = substr($s, 9, strpos($s, '<span class=\'entry')-9);
			$o['text'] =  trim(preg_replace('/<[^>]+>/', '', $s));
		}
		else {
			$o['time'] = null;

			$s = substr($s, 9);

			$o['text'] = trim(preg_replace('/<[^>]+>/', '', $s));
		}

		array_push($finalArray, $o);
	}



	//preg_match('((?:<span class="post-title" itemprop="headline">)([^<]+))', $html, $matches);
	//$title = $matches[1];

	/*
	preg_match('((?:var randomStrings = \[)([^\];]+))', $html, $matches);

	$commas = preg_replace("/\r|\n/", "", substr($matches[1], 0, -2));
	$data_array = explode('",', $commas);
	for($i=0; $i<count($data_array); $i++) {
		$data_array[$i] = str_replace('"', "", $data_array[$i]);
	}
	*/
	
	//echo $commas;

	//$title = substr($html, strpos($html, '"post-title"') + )
	/*
	$cat = substr($html, strpos($html, '<span class="term-badge'));
	$cat = substr($cat, strpos($cat, '<a'));
	$cat = substr($cat, strpos($cat, '>'));
	$cat = substr($cat, 1, strpos($cat, '<')-1);
	*/


	/*
	$h = substr($html, strpos($html, 'var randomStrings = ['));
	$h = substr($h, 0, strpos($h, '];'));

	$hs = explode('",', $h);

	$hs[0] = '.'.substr($hs[0], strpos($hs[0], '"'));

	
	for ($i=0; $i<count($hs); $i++) {
		$hs[$i] = substr($hs[$i], 2);
	}

	array_pop($hs);
	
	$output['name']=$title;
	$output['category']=$cat;
	$output['source']=$link;
	$output['data']=['name'=> "", "data" => $hs ];

	$json = json_encode($output);

	$json = str_replace('&#8217;', "'", $json);
	$json = str_replace('\u2019', "'", $json);
	$json = str_replace('’', "'", $json);
	$json = str_replace("\/", "/", $json);

	file_put_contents(strtolower(str_replace(' ', '_', $title)).'.json', $json);

	return $json;
	*/

}


//echo parseHTML(getUrlContent());



//$reddit = getUrlContent('https://www.reddit.com/r/d100/comments/axb8g9/the_official_dndspeak_list_index/');

/*
echo '<pre>' . $reddit . '</pre>';

$links = explode('<a href="http://dndspeak.com"', $reddit);
for ($i=1; $i<count($links); $i++) {
	//echo $links[$i] . '<br>';
}
*/

//$r = substr($reddit, strpos($reddit, '<a href="http://dndspeak.com'));

//echo $r;

//$cat = "Characters and NPCs";

//$links = [];
/*
while(strpos($r, '<a href="http://dndspeak.com')!==false) {
	if (strpos($r, '<h3>')<5) {
		$cat = substr($r, strpos($r, '<h3>')+4, strpos($r, '</h3>'));
	}
	preg_match('/((?:<a href=")(http:\/\/dndspeak.com[^"]+)(?:\">)(.[^<]+))/', $r, $match);

	$link = $match[2];
	$title = $match[3];
	$title = substr($title, strpos($title, ' ')+1);
	$title = preg_replace("/\r|\n/", "", $title);
	$title = str_replace('&#39;', '', $title);
	$title = str_replace('/', '', $title);
	$title = str_replace('&quot;', '', $title);
	$title = str_replace('“', '', $title);
	$title = str_replace('”', '', $title);
	$title = str_replace(',', '', $title);


	parseHTML(getUrlContent($link), $link, $title, $cat);

	//echo $title . '<br>';

	//array_push($links, ['cat'=>$cat, 'link'=>$match[2], 'title'=>$match[1]]);

	$r = substr($r, strpos($r, '</a>')+9);
}
*/
/*
preg_match_all('/((?:<a href=")(http:\/\/dndspeak.com[^"]+)(?:\">)(.[^<]+))/', $reddit, $matches);

echo $matches[0][1];
for ($i=0; $i<count($matches[1]); $i++) {

}
echo $matches[0][2];
echo '<br>';
echo $matches[1][0];
echo '<br>';
echo $matches[3];
*/

//<a href="http://dndspeak.com
?>
