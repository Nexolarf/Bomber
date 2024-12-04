<?php
ini_set('display_errors','Off');

$score = '';

if (isset($_GET['score']) && $_GET['score']) {
    $score = trim(urldecode($_GET['score']));
}

if (isset($_GET['name']) && $_GET['name']) {
    if (!$score) {
        $score = 0;
    }
    $name = urldecode($_GET['name']);
    writeToLog($score, $name);
} elseif ($score) {
    $log = getParsedLog();
    echo json_encode($log);
}

/**
 * @return array
 */
function getParsedLog()
{
    $parsed_log  = array();
    $data        = file_get_contents('log.txt');
    $data_strings = explode(PHP_EOL, $data);

    $i = 0;

    foreach ($data_strings as $string) {
        $fields                = explode('|', $string);
        $parsed_log[$i]['score']  = $fields[0];
        $formaated_text = trim($fields[1]);
        if($formaated_text != ''){
            $parsed_log[$i]['name'] = $formaated_text;
        }else{
            $parsed_log[$i]['name'] = 'Unnamed';
        }
        $i++;
    }

    return $parsed_log;
}

/**
 * @param $score  string
 * @param $name string
 *
 * @throws Exception
 */
function writeToLog($score, $name)
{
    $new_string = $score . '|' . $name . PHP_EOL;
    $got_it = false;
    $record_table = getParsedLog();
    for($i = 0; $i < 10; $i++){
      if($score >= $record_table[$i]['score'] && !$got_it){
        array_splice($record_table, $i, 0, $new_string);
        $got_it = true;
      }
      else{
        $record_table[$i] = $record_table[$i]['score']."|".$record_table[$i]['name'].PHP_EOL;
      }
    }

    if ($result = file_put_contents('log.txt', $record_table)) {
        echo('Saved');
    } else {
        throw new Exception('Error writing to file');
    }
}
?>