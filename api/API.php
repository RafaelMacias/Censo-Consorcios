<?php
session_start();
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
date_default_timezone_set("America/Tegucigalpa");
require_once('../controllers/consorcioController.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $action = $_POST['action'] ?? '';
        switch ($action) {
            case 'nueva-multa':
                //MultaController::nuevaMulta();
                break;
            case 'anular-multa':
                //MultaController::anularMulta();
                break;
            // ...
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Acción POST no válida']);
                break;
        }
        break;
    case 'GET':
        $action = $_GET['action'] ?? '';
        switch ($action) {
            case 'get-certificados-consorcio':
                consorcioController::getCertificadosXConsorcio($_GET);
                break;
        }
        break;
    case 'PUT':
        $input = json_decode(file_get_contents("php://input"), true);
        $action = $input['action'] ?? '';
        switch ($action) {
            case 'prueba-put':

                //MultaController::nuevaMulta();
                break;
        }
        break;
    case 'DELETE':
        $input = json_decode(file_get_contents("php://input"), true);
        $action = $input['action'] ?? '';
        switch ($action) {
            case 'prueba-delete':
                echo "aqui-delete";
                //MultaController::nuevaMulta();
                break;
        }
        break;
}