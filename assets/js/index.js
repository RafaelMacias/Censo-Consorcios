$(document).ready(() => {
    busqueda(0);
});

var last = 0;
var anter = 0;

function nextPagetit() {
    var suma = parseInt(1) + parseInt(last);
    busqueda(suma);

}
function backPagetit() {
    busqueda(anter - 101);
}

function busqueda(le) {

    $("#result").html('<tr><td colspan="13" style="text-align:center">Buscando...<br><span class="loader"></span></td></tr>');

    var parametro = document.getElementById('parametro_bsq').value;

    fetch(`https://satt.transporte.gob.hn:96/Censo_Consorcios/api/API.php?action=get-certificados-consorcio&Next=${le}&parametro=${parametro}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(dataserver => {
            console.log(dataserver);
            var result = '';
            var pagination = '';
            var info = dataserver[0];
            var pagin = dataserver[1];
            last = info.last;
            var data = dataserver[2];
            for (let i = 0; i < data.length; i++) {
                result += '<tr><th>' + data[i]["ROWNUMBER"] + '</th><td>' + validarCampo(data[i]["Certificado_Operacion"]) + '</td><td>' + validarCampo(data[i]["Permiso_Explotacion"]) + '</td><td>' + validarCampo(data[i]["N_Registro"]) + '</td><td>' + validarCampo(data[i]["Nombre_Transportista"]) + '</td><td>' + validarCampo(data[i]["Nombre_Transportista"]) + '</td><td>' + data[i]["Empresa"] + '</td><td>' + data[i]["Siglas"] + '</td><td>' + data[i]["Observacion"] + '</td><td>' + data[i]["Desc_Estado"] + '</td><td>' + data[i]["Sistema_Usuario"] + '</td><td>' + data[i]["Sistema_Fecha"] + '</td><td><button class="btn btn-outline-info btn_n_op" data-bs-toggle="modal"data-bs-target="#modalEdicion" onclick="infoXverificar(\'' + JSON.stringify(data[i]) + '\')"><i class="fa-solid fa-gears"></i></button></td></tr>'
            }
            var ultima = "";
            for (var i = 0; i < pagin.length; i++) {
                pagination += '<li class="page-item ' + pagin[i].Activo + ' "><a class="page-link" href="javascript:busqueda(\'' + pagin[i].Paginas + '\');">' + pagin[i].Nun + '</a></li>';
                ultima = pagin[i].Paginas;
                anter = pagin[0].Paginas;
            }
            var anterior = ' <li id="anterior" class="page-item"><a class="page-link" href="javascript:backPagetit();">Anterior</a></li><li class="page-item"><a class="page-link" href="javascript:busqueda(0);">Inicio</a></li> ';



            var Siguiente = '<li class="page-item"><a class="page-link" href="javascript:nextPagetit();" >Siguiente</a></li>';

            if (ultima <= info.last) {
                Siguiente = '<li class="page-item disabled"><a class="page-link">Siguiente</a></li>';
            }

            if (info.last <= 100) {
                anterior = '<li id="anterior" class="page-item disabled"><a class="page-link">Anterior</a></li>';
            }
            var total = info.Total;
            total = total.toLocaleString();

            $("#result").html(result);
            $("#paginacion").html(anterior + pagination + Siguiente);
            $("#total").html(total);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function validarCampo(campo) {
    var res = campo;
    if (campo == '') {
        res = '<span class="s-datos">Sin Datos</span>';
    }
    return res;
}


function busquedaDGT(le) {

    var tabla = document.getElementById('table_dgt');

    tabla.style.display = "";

    $("#result_dgt").html('<tr><td colspan="13" style="text-align:center">Buscando...<br><span class="loader"></span></td></tr>');

    var parametro = document.getElementById('parametro_bsq_dgt').value;
    console.log("parametro", parametro);
    fetch(`https://satt.transporte.gob.hn/api_satt.php?action=search-certificado-dgt&Next=${le}&col_name=${parametro}`, {
        method: 'GET',
        credentials: 'include' // ← IMPORTANTE: esto hace que se envíen las cookies de sesión
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(dataserver => {
            console.log(dataserver);
            var resultcertdgt = '';
            var pagination = '';
            var info = dataserver[0];
            var pagin = dataserver[1];
            last = info.last;
            var data = dataserver[2];

            for (var i = 0; i < data.length; i++) {
                resultcertdgt += '<tr>   <td>' + data[i].ROWNUMBER + '</td> <td><a target="_blank" style="cursor:pointer;color: #538999;font-weight:bold;" href="https://satt.transporte.gob.hn/Certificado_Pasajeros.php?Certificado=' + data[i].n_certificado + '">' + data[i].n_certificado +
                    '</a></td> <td class="hide-on-med-and-down">' + data[i].n_registro + '</td> <td>' + data[i].n_empresa + '</td> <td class="hide-on-med-and-down">' + data[i].n_propietario + '</td> <td>' + data[i].n_placa + '</td><td padding-right: 5px;"><!--a class="btn-floating btn-flat waves-effect waves-light pink accent-2 white-text"><i class="mdi-content-create"></i></a--> <a style="margin-left: 10px;border-radius: 25px;color: white;" class="btn bg-info" data-toggle="tooltip" data-placement="top" title="Ver detalle del Certificado" onclick="detalleExpedienteDGT(\'' +
                    data[i].n_certificado + '\')" ><i class="fa-solid fa-eye"></i></a> </td> </tr>';

            }
            var ultima = "";
            for (var i = 0; i < pagin.length; i++) {
                pagination += '<li class="page-item ' + pagin[i].Activo + ' "><a class="page-link" href="javascript:busquedaDGT(\'' + pagin[i].Paginas + '\');">' + pagin[i].Nun + '</a></li>';
                ultima = pagin[i].Paginas;
                anter = pagin[0].Paginas;
            }
            //console.log('ultima linea '+ultima);
            var anterior =
                '<li id="anterior" class="waves-effect"><a href="javascript:backPagecertdgt();"><i class="material-icons">chevron_left</i>Anterior</a></li> <li class="waves-effect"><a href="javascript:busquedaDGT(0);">Inicio</a></li>';

            var Siguiente = '<li class="waves-effect"><a href="javascript:nextPagecertdgt();" >Siguiente<i class="material-icons">chevron_right</i></a></li>';

            if (ultima <= info.last) {
                Siguiente = '<li class="waves-effect disabled"><a >Siguiente<i class="material-icons">chevron_right</i></a></li>';
            }

            if (info.last <= 10) {
                anterior = '<li id="anterior" class="waves-effect disabled"><a ><i class="material-icons">chevron_left</i>Anterior</a></li>';
            }

            $("#resultMsg_CertDGT").html("Resultados de búsqueda: " + info.Total);
            $("#result_dgt").html(resultcertdgt);
            $("#paginascertdgt").html(anterior + pagination + Siguiente);
            $('.tooltipped').tooltip({
                delay: 0
            });

            if (data.length == 0) {
                $("#result_dgt").html('<tr> <td colspan="9" style="text-align:center">El parametro no existe en la base de datos.</td></tr>');
            }
        })
        .catch(error => {
            console.error('Error->', error);
        });
}


function detalleExpedienteDGT(n_certificado) {

    const modal2 = new bootstrap.Modal(document.getElementById('modalConsulta'));
    modal2.show();

    $("#modal-title").html("Detalle del Certificado <br><span style='font-size: 15px;margin-left: -46px;'>Certificado: " + n_certificado);

    $("#modal-content").html(
        '<tr><td class="text-secondary" colspan=6 style="text-align:center;font-weight:900;">Obteniendo Información...<br><div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"> <div class="indeterminate" style="background:#09a5c0;"></div> </div></td></tr>'
    );
    var parameters = "&ncrt=" + n_certificado;

    $.ajax({
        dataType: "json",
        url: "https://satt.transporte.gob.hn/api_satt.php?action=get-detalle-certificado-dgt" + parameters,
        timeout: 5000,
        success: function (datos) {
            var content =
                '<tr> <td class="bg-secondary text-center" colspan="3"><strong><font color="white">DATOS DEL CERTIFICADO</strong></font></td> </tr> <tr> <td style="background-color:#eeeeee" colspan="2"><strong>Expediente</strong></td><td style="background-color:#eeeeee" colspan="3"><strong>Número de Referencia</strong></td></tr> <tr><td colspan="2">' +
                datos[0].idExpediente + '</td><td colspan="3">' + datos[0].n_carton +
                '</td></tr> <td width="37%" style="background-color:#eeeeee"><strong>Permiso de Explotacíon</strong></td> <td width="27%" style="background-color:#eeeeee"><strong>Certificado de Operacíon</strong></td> <td width="36%" style="background-color:#eeeeee"><strong>Número de Registro</strong></td> </tr> <tr> <td><a target="_blank" style="cursor:pointer;color: #538999;font-weight:bold;" href="https://satt.transporte.gob.hn/Permiso_Explotacion.php?Permiso=' +
                datos[0].n_permiso + '">' + datos[0].n_permiso + '</a></td> <td><a target="_blank" style="cursor:pointer;color: #538999;font-weight:bold;" href="https://satt.transporte.gob.hn/Certificado_Pasajeros.php?Certificado=' + datos[0].n_certificado + '">' + datos[0].n_certificado +
                '</a></td> <td>' + datos[0].n_registro +
                '</td> </tr>  <tr> <td style="background-color:#eeeeee"><strong>Nombre del Titular</strong></td> <td style="background-color:#eeeeee"><strong>Nombre del Propietario</strong></td> <td style="background-color:#eeeeee"><strong>Ruta Autorizada</strong></td> </tr> <tr> <td>' +
                datos[0].n_empresa + '</td> <td>' + datos[0].n_propietario + '</td><td>' + datos[0].n_ruta +
                '</td> </tr> <tr> <td style="background-color:#eeeeee" colspan="2"><strong>Dirección</strong></td><td style="background-color:#eeeeee" colspan="2"><strong>Área de Operación</strong></td></tr> <tr><td colspan ="2">' + datos[0].n_area +
                '</td><td colspan="2">' + datos[0].n_area +
                '</td></tr> <tr> <td class="bg-secondary text-center" colspan="3"><font color="white" style="background-color: transparent"><strong>DATOS DEL VEHICULO</strong></font></td> </tr> <td style="background-color:#eeeeee"><strong>Placa</strong></td><td style="background-color:#eeeeee"><strong>Motor</strong></td><td style="background-color:#eeeeee"><strong>Serie</strong></td></strong></td></tr> <tr> <td><a target="_blank" style="cursor:pointer;color: #538999;font-weight:bold;" href="https://satt.transporte.gob.hn:122/PV/index.php?Placa=' + datos[0].n_placa + '">' + datos[0].n_placa +
                '</a></td><td>' + datos[0].n_motor + '</td><td>' + datos[0].n_serie +
                '</td> <tr> <td style="background-color:#eeeeee"><strong>Marca</strong></td> <td style="background-color:#eeeeee"><strong>Tipo</strong></td> <td style="background-color:#eeeeee"><strong>Color</strong></td> </tr><tr> <td>' + datos[0].n_marca +
                '</td><td>' + datos[0].t_vehiculo + '</td><td>' + datos[0].n_color +
                '</td><tr><td style="background-color:#eeeeee"><strong>Año</strong></td><td style="background-color:#eeeeee"><strong>Combustible</strong></td><td style="background-color:#eeeeee"><strong>Capacidad</strong></td></tr><tr> <td>' + datos[
                    0].n_year + '</td><td>' + datos[0].n_combustible + '</td><td>' + datos[0].n_capacidad +
                '</td><tr><td class="bg-secondary text-center" colspan="3"><strong><font color="white">DATOS DEL SERVICIO</strong></font></td></tr> <tr><td style="background-color:#eeeeee"><strong>Clase</strong></td><td style="background-color:#eeeeee"><strong>Modo</strong></td><td style="background-color:#eeeeee"><strong>Tipo</strong></td></tr> <tr><td>' +
                datos[0].c_servicio + '</td><td>' + datos[0].m_servicio + '</td><td>' + datos[0].t_servicio +
                '</td></tr> <tr> <td style="background-color:#eeeeee"><strong>Categoria</strong></td><td style="background-color:#eeeeee"><strong>Forma</strong></td><td style="background-color:#eeeeee"><strong>Frecuencia</strong></td><tr> <td>' +
                datos[0].ct_servicio + '</td><td>' + datos[0].f_servicio + '</td><td>' + datos[0].fr_servicio +
                '</td> </tr> <tr> <td style="background-color:#eeeeee"><strong>Fecha Expedición</strong></td> <td style="background-color:#eeeeee"><strong>Fecha Elaboración</strong></td><td style="background-color:#eeeeee"><strong>Fecha Vencimiento</strong></td><tr><td>' +
                datos[0].f_expedicion + '</td><td>' + datos[0].f_elaboracion + '</td><td>' + datos[0].f_vencimiento + '</td></tr>';
            content +=
                '<tr><td colspan="3" style=" border: none;"><div class=" bg-info text-center" style="font-weight:600;padding:0"><font color="white">EXPEDIENTE PRIMARIO</font></div></td></tr> <tr> <td style="background-color:#eeeeee" colspan="3"><strong>Expediente Primario</strong></td> </tr><tr> <td colspan="3">' +
                datos[0].n_ExpPrimario + '</td> </tr>';

            $("#modal-content").html(content);

        }
    }).fail(function () {
        $("#modal-content").html('<tr> <td colspan="2" class="text-danger text-center">OCURRIO UN ERROR DURANTE LA BUSQUEDA, POR FAVOR INTENTA NUEVAMENTE.</td></tr>');
    });
}

function infoXverificar(data) {
console.log("Data a Verificar==>>",data)
}