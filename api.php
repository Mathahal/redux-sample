<?php 
if ( $_POST["param"] || $_GET["param"] ) {
    $param = empty( $_POST["param"] ) ? $_GET["param"] : $_POST["param"];
} else {
    return false;
}
$params = explode(",", $param);
foreach ($params as $key => $value) {
    $obj[] = [
        "id" => $key + 1,
        "message" => $value
    ];
}
$json = [ "param" => $obj ];
echo json_encode($json);