var Velocidad = 100;
var Min = 1;
var Seg = 0;
var Score = 0;
var Movimiento = 0;

$(document).ready(function(){
  original($(".main-titulo"),1000);

  $(".btn-reinicio").click(function(){
    restart();
    limpiar();
    iniciar();
    $(this).html("Reiniciar")
    start=setInterval(function(){iniciar()},50)
    reloj=setInterval(function(){cronometro()},1000)
  })
})
// ****************************************************************************
// Reinicio de variables
function restart(){
  Min = 2;
  Seg = 0;
  Score = 0;
  Movimiento = 0;
  $('.main-titulo').remove("h2")
  $("#timer").html("02:00")
  $("#score-text").html(Score)
  $("#movimientos-text").html(Movimiento)
  $(".panel-score").css("width","25%");
  $(".panel-tablero").show();
  $(".time").show();
}
// Reloj
// ****************************************************************************
function cronometro(){
  if(Seg != 0){
    Seg = Seg - 1;
  }
  if(Seg == 0){
    if(Min == 0){
      $("#timer").html("00:00")
      clearInterval(reloj);
      clearInterval(start);
      // alert('Se acabó el tiempo')
      limpiar();
      $( ".panel-tablero" ).hide("drop","slow",finalizar);
      $( ".time" ).hide();
    }

    Seg = 59;
    Min = Min - 1;
  }
  if(Min == 0 && Seg == 0){
      $("#timer").html("00:00")
  } else {
    if(Seg < 10){
      $("#timer").html("0"+Min+":0"+Seg)
    } else {
      $("#timer").html("0"+Min+":"+Seg)
    }
  }

}
// ****************************************************************************
// Finaliza juego
function finalizar(){
  var html =$("<h2 align='center'>Juego Terminado</h2>").attr({
    class: "main-titulo"
      });
    $('.panel-score').prepend(html)
    $( ".panel-score" ).animate({width:'100%'},3000);
}
// ****************************************************************************
//Animación que cambia de color el titulo
function original(elemento, velocidad){
  $(elemento).animate(
    {
      color: "yellow"
    }, velocidad, function(){
      nuevo(elemento, velocidad)
    }
  )
}

function nuevo(elemento, velocidad){
  $(elemento).animate(
    {
      color: "white"
    }, velocidad, function(){
      original(elemento, velocidad)
    }
  )
}
// ****************************************************************************
//Crear dulces aleatorios
function candyRandom(){
  var number = 1 + Math.floor(Math.random() * 4);
  var newSrc = "image/" + number + ".png"
  return newSrc;
}
// Borrar dulces
function limpiar(){
  for(var j=1;j<8;j++)
  {
    $(".col-"+j).children("img").detach();
  }
}
// ****************************************************************************
// Inicio de cascada de dulces
function iniciar(){
  var elementos = lector($(".elemento"));
  if(elementos <= 48){
    for (var i = 1; i < 8; i++) {
      var col = ".col-"+ i
      // var items = $(col)
      var items = $(col +" .elemento")
      var colId = i

      // setTimeout(function(){ blanks(items,col,colId); }, 100);
      blanks(items,col,colId);
    }
  } else {
      setTimeout(function(){ removible(); }, 500);
      // removible();

  }
}

// Validador de cantidad de items
function lector(item){
  var cantidad = item.length
  return cantidad;
}

// ****************************************************************************
// Completa espacios en blanco
function blanks(items, col, colId){
  var index = 1

    for (var i = 0; i < 49; i++) {
        cantidad = lector($(".elemento"));
        if(cantidad <= 49){
            creaGota(col, colId, index);
        }
        index++;
  }
  filas();
  columnas();
}
// ****************************************************************************
// Remueve dulces continuos
function removible(){
  var remover = lector($(".removible"))

  $(".elemento").draggable({ disabled: true });
  $("div[class^='col']").css("justify-content","flex-end")
  $(".removible").hide("pulsate",500,function(){
    $(".removible").remove("img")
    Score= Score + remover;
    $("#score-text").html(Score)
  })
  validacion();
}

// Valida movimientos
function validacion(){
  $(".elemento").draggable({
    disabled: false,
    containment: ".panel-tablero",
    revert: true,
    revertDuration: 0,
    snap: ".elemento",
    snapMode: "inner",
    snapTolerance: 40,
    start: function(event, ui){
      Movimiento = Movimiento + 1;
      $("#movimientos-text").html(Movimiento)
    }
  });


$(".elemento").droppable({
  drop: function (event, ui) {
    var dropped = ui.draggable;
    var droppedOn = this;
    espera=0;
    do{
      espera=dropped.swap($(droppedOn));
    }while(espera==0)
    vFila = filas()
    vCol = columnas()
    if(vFila == 0 && vCol == 0)
    {
      dropped.swap($(droppedOn));
    }
  },
});
}
//*****************************************************************************
// Funcion de jquery para intercambio
jQuery.fn.swap = function(b)
{
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};
//******************************************************************************
// Crea efecto de cascada
function creaGota(elemento, div, id){

  var clase = ".elemento"
  var html = '<img class="elemento" src="' + candyRandom() + '" id="'+ id +'"/>'

  $(clase).draggable({ disabled: true });
  $(elemento).css("justify-content","flex-start")
  .animate({
      queue: true,
      complete: function(){
      }
    },Velocidad,function(){
      var contador = 0;
      var lectura = lector($(".elemento"));
      if(lectura <= 48){
        $(elemento).children().each(function(){
          contador = contador + 1
        })
        if(contador < 7){
          $(elemento).prepend(html).css("justify-content","flex-start")
          gravedad(clase)
        }
      }
    }
  )
}

function gravedad(elemento){
  $(elemento).show( 'slide', {
      easing: "linear",
      direction : 'up',
      distance: 800
  }, Velocidad);
}
// *****************************************************************************
//Analiza filas y columnas
function filas(){
  var vfila = 0;
  for(var a = 1;a < 8; a++){
    for(var b = 1; b < 8; b++){

      var dulce1= $(".col-" + b).children("img:nth-last-child("+ a +")").attr("src")
      var dulce2= $(".col-" + (b+1)).children("img:nth-last-child("+ a +")").attr("src")
      var dulce3= $(".col-" + (b+2)).children("img:nth-last-child("+ a +")").attr("src")
      if((dulce1 == dulce2) && (dulce2 == dulce3) && (dulce1 != null) && (dulce2 != null) && (dulce3 != null)){

          $(".col-" + b).children("img:nth-last-child("+ a +")").attr("class","elemento removible")
          $(".col-" + (b+1)).children("img:nth-last-child("+ a +")").attr("class","elemento removible")
          $(".col-" + (b+2)).children("img:nth-last-child("+ a +")").attr("class","elemento removible")
          vfila = 1;
      }
    }
  }
  return vfila;
}

function columnas(){
  var vCol = 0;
  for(var a = 1; a < 8; a++){
    for(var b = 1; b < 8; b++){

      var dulce1 = $(".col-" + b).children("img:nth-child("+ a +")").attr("src")
      var dulce2 = $(".col-" + b).children("img:nth-child("+ ( a + 1) +")").attr("src")
      var dulce3 = $(".col-" + b).children("img:nth-child("+ ( a + 2) +")").attr("src")

      if((dulce1 == dulce2) && (dulce2 == dulce3) && (dulce1 != null) && (dulce2 != null) && (dulce3 != null)){

          $(".col-" + b).children("img:nth-child("+(a)+")").attr("class","elemento removible")
          $(".col-" + b).children("img:nth-child("+(a+1)+")").attr("class","elemento removible")
          $(".col-" + b).children("img:nth-child("+(a+2)+")").attr("class","elemento removible")
          vCol=1;
      }
    }
  }
  return vCol;
}
