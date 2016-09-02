<?php
function parseTextMorph($sentence) {
	$response = file_get_contents('http://jlp.yahooapis.jp/MAService/V1/parse?appid=dj0zaiZpPVF2Snd5UDEzY2h1biZzPWNvbnN1bWVyc2VjcmV0Jng9MmI-' . '&sentence=' . urlencode($sentence) . '&results=ma');

	$listParsedRecord = json_decode(json_encode(simplexml_load_string($response) -> ma_result -> word_list, 256), true);

	return($listParsedRecord['word']);
}

function htmlFragmentedSentence($listParsedRecord) {
	$htmlContSentence = '';
	foreach($listParsedRecord as $parsedRecord) {

		if($parsedRecord['surface'] == '「') { $parsedRecord['pos'] = '鉤括弧'; }
		if($parsedRecord['surface'] == '」') { $parsedRecord['pos'] = '鉤括弧閉じ'; }
		if($parsedRecord['surface'] == '、') { $parsedRecord['pos'] = '読点'; }
		if($parsedRecord['surface'] == '。') { $parsedRecord['pos'] = '句点'; }
	
		$htmlContSentence = $htmlContSentence . '<span class="fragment-word ' . $parsedRecord['pos'] . '">' . $parsedRecord['surface'] . '</span>';
/*/
		$htmlContSentence = preg_replace('/(<span class=\"fragment\-word 鉤括弧\">)(「)(<\/span>)(<span.*?>)(.)(.*)(<\/span>)/u', '${4}${2}${5}</span>${4}${6}', $htmlContSentence);
/*/
		$htmlContSentence = preg_replace('/(<span class=\"fragment\-word 鉤括弧\">)(「)(<\/span>)(<span.*?>)(.)(.*)(<\/span>)/u', '${4}${2}</span>${4}${5}${6}', $htmlContSentence);
		$htmlContSentence = str_replace('</span><span class="fragment-word 鉤括弧閉じ">」', '<span class="fragment-word 鉤括弧閉じ">」</span></span>', $htmlContSentence);
		$htmlContSentence = str_replace('</span><span class="fragment-word 句点">。', '<span class="fragment-word 句点">。</span></span>', $htmlContSentence);
		$htmlContSentence = str_replace('</span><span class="fragment-word 読点">、', '<span class="fragment-word 読点">、</span></span>', $htmlContSentence);	
	}

	return $htmlContSentence;
}

function parseTextDependency($sentence) {
	$response = file_get_contents('http://jlp.yahooapis.jp/DAService/V1/parse?appid=dj0zaiZpPVF2Snd5UDEzY2h1biZzPWNvbnN1bWVyc2VjcmV0Jng9MmI-' . '&sentence=' . urlencode($sentence) . '&results=ma');

	$listParsedRecord = json_decode(json_encode(simplexml_load_string($response) -> Result -> ChunkList, 256), true);

	return($listParsedRecord);
}

function htmlChartOfDependency($listParsedRecord) {
	$htmlContSentence = '';

	foreach($listParsedRecord['Chunk'] as $keyRecord => $valueRecord) {
		$fragment = '';
		$idSelf = $valueRecord['Id'];
		$idDep = $valueRecord['Dependency'];
		if($idDep == -1) { $idDep = $idSelf; }

		foreach($valueRecord['MorphemList']['Morphem'] as $k => $v) {
//			if(!empty($v['Surface'])) {
				$fragment = $fragment . '<span class="morph">' . $v['Surface'] . '</span>';
//			}
		}
		$htmlContSentence = $htmlContSentence . '<span data-iddest="' . $idDep . '" data-idself="' . $idSelf . '" class="fragment-word">[' . $fragment . ']</span>';
	}

	return $htmlContSentence;
}
?>
