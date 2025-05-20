<?php
session_start();
header('Access-Control-Allow-Origin: *');

class index
{
    private $modulo = 14;

    public function __construct()
    {
        if (!isset($_SESSION['usuario']) || !isset($_SESSION["roles"][$this->modulo])) {
            header("Location: https://satt.transporte.gob.hn");
        }
        $this->printHTML();
    }

    function printHTML()
    {   
        $Title = "Inicio";
        $header = file_get_contents("templates/header.html");
        $footer = file_get_contents("templates/footer.html");
        $file = $header . file_get_contents("templates/index.html") . $footer;
        $file = str_replace("@@PAGESCRIPT@@", '<script type="text/javascript" src="@@DIR@@js/index.js"></script> ', $file);
        $file = str_replace("@@PAGESSTYLES@@", '<link rel="stylesheet" href="@@DIR@@css/index.css">', $file);
        $file = str_replace("@@USERNAME@@", $_SESSION["usuario"], $file);
        $file = str_replace("@@DIR@@", "assets/", $file);
        $file = str_replace("@@FOTO@@", $_SESSION['img'], $file);
        $file = str_replace("@@CARGO@@", $_SESSION["Cargo"], $file);
        $file = str_replace("@@VEDA@@", $_SESSION["user_name"], $file);
        $file = str_replace("{{Title}}", $Title, $file);
        
        echo $file;
    }

}
$s = new index();