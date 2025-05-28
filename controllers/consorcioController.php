<?php

require_once('../config/conexion.php');

$conexion = new conexion;
class consorcioController
{

    public static function getCertificadosXConsorcio($get)
    {

        global $conexion;
        if ($get == '') {
            $condicion = '';
            $p = array();
        } else {
            $condicion = ' WHERE CC.Certificado_Operacion LIKE :PARAM1 OR CC.Empresa LIKE :PARAM2 OR CONS.Nombre_Consorcio LIKE :PARAM3 OR CONS.Siglas LIKE :PARAM4';
            $p = array(":PARAM1" => '%' . $get["parametro"] . '%', ":PARAM2" => '%' . $get["parametro"] . '%', ":PARAM3" => '%' . $get["parametro"] . '%', ":PARAM4" => '%' . $get["parametro"] . '%');
        }


        $query = "SELECT *  FROM ( SELECT CC.ID_Cert_x_Con, CC.Certificado_Operacion, CC.Permiso_Explotacion, CC.N_Registro, CC.Nombre_Transportista, CC.Empresa, CONS.Siglas, CONS.ID_Consorcio, CC.Observacion, EST.Desc_Estado, CC.Sistema_Usuario, CC.Sistema_Fecha, ROW_NUMBER () OVER ( ORDER BY CC.ID DESC ) ROWNUMBER  FROM TB_Certificado_X_Consorcio AS CC INNER JOIN TB_Consorcios AS CONS ON CC.ID_Consorcio = CONS.ID_Consorcio INNER JOIN TB_Estados_Cer_x_Cons AS EST ON CC.ID_Estado = EST.ID_Estado";

        $query .= $condicion . ") AS TABLAFILTRO";

        $Total = "SELECT COUNT(*) AS cantidad FROM TB_Certificado_X_Consorcio AS CC INNER JOIN TB_Consorcios AS CONS ON CC.ID_Consorcio = CONS.ID_Consorcio INNER JOIN TB_Estados_Cer_x_Cons AS EST ON CC.ID_Estado = EST.ID_Estado";
        $Total .= $condicion;
        $datac = $conexion->obtenerDatos($Total, $p);
        $cantidad = $datac[0]["cantidad"];

        if (isset($_GET['Next'])) {
            $hasta = $_GET['Next'] + 100;
            $query .= " WHERE  ROWNUMBER BETWEEN " . $_GET['Next'] . " AND " . $hasta . "";
        }

        $data = $conexion->obtenerDatos($query, $p);

        $datos = array();
        $datos[0] = array();
        $datos[1] = array();
        $datos[2] = array();

        $Con = 1;

        for ($i = 0; $i < count($data); $i++) {
            $datos[2][] = array("ROWNUMBER" => $data[$i]["ROWNUMBER"], "ID_Cert_x_Con" => $data[$i]["ID_Cert_x_Con"], "Certificado_Operacion" => $data[$i]["Certificado_Operacion"], "Permiso_Explotacion" => $data[$i]["Permiso_Explotacion"], "N_Registro" => $data[$i]["N_Registro"], "Nombre_Transportista" => $data[$i]["Nombre_Transportista"], "Empresa" => $data[$i]["Empresa"], "Siglas" => $data[$i]["Siglas"], "ID_Consorcio" => $data[$i]["ID_Consorcio"], "Observacion" => $data[$i]["Observacion"], "Desc_Estado" => $data[$i]["Desc_Estado"], "Sistema_Usuario" => $data[$i]["Sistema_Usuario"], "Sistema_Fecha" => $data[$i]["Sistema_Fecha"]);

            $last = $data[$i]["ROWNUMBER"];
        }

        $con = $_GET['Next'] / 101 + 1;

        if ($cantidad < 1000) {
            $Cant = $cantidad;
        } else {
            $Cant = 1000;
        }


        for ($i = $_GET['Next']; $i < $Cant + $_GET['Next'] && $i <= $cantidad; $i = $i + 101) {
            if ($_GET['Next'] == $i) {
                $activo = 'active';
            } else {
                $activo = '';
            }
            $datos[1][] = array("Paginas" => $i, 'Nun' => $con++, "Activo" => $activo);
        }
        if ($cantidad == 0) {
            $last = 0;
        }
        $datos[0] = array("conteo" => 100, "numPages" => ceil($cantidad / 100), "last" => $last, "Total" => intval($cantidad), 'lastPage' => $PagUlt = $cantidad / 100);

        echo json_encode($datos);
    }
}