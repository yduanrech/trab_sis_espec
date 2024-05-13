var currentStep = 1;
var updateProgressBar;

function displayStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= 4) {
        $(".step-" + currentStep).hide();
        $(".step-" + stepNumber).show();
        currentStep = stepNumber;
        updateProgressBar();
    }
}

function calcularConsumo() {
    var adultos = parseInt($('#adultosQuantidade').val());
    var criancas = parseInt($('#criancasQuantidade').val());
    var duracao = parseInt($('#duracaoHoras').val());
    
    var selecoesCarnes = $('.step-3 .form-check-input:checked').map(function() {
      return $(this).val();
    }).get();
    
    var selecoesBebidas = $('.step-4 .form-check-input:checked').map(function() {
      return $(this).val();
    }).get();
    
    var quantCarnes = selecoesCarnes.length;
    
    var carnePorAdulto, carnePorCrianca;
    if (duracao === 1) {  // Menos de 2 horas
      carnePorAdulto = 500;
      carnePorCrianca = 200;
    } else if (duracao === 2) {  // Entre 2 e 5 horas
      carnePorAdulto = 700;
      carnePorCrianca = 300;
    } else if (duracao === 3) {  // Mais que 5 horas
      carnePorAdulto = 850;
      carnePorCrianca = 350;
    }
    
    var carnePorTipoAdulto = carnePorAdulto / quantCarnes;
    var carnePorTipoCrianca = carnePorCrianca / quantCarnes;
  
    var resultadoCarnes = {};
    selecoesCarnes.forEach(function(tipo) {
      resultadoCarnes[tipo] = {
        'adultos': parseFloat(carnePorTipoAdulto.toFixed(0)) * adultos + 'g',
        'criancas': parseFloat(carnePorTipoCrianca.toFixed(0)) * criancas + 'g'
      };
    });
  
    // Bebidas
    var totalCerveja = selecoesBebidas.includes("Cerveja") ? 6 * adultos + ' latas' : "0 latas";
    var totalRefri = selecoesBebidas.includes("Refrigerante") ? (3 * adultos + criancas) + ' latas' : "0 latas";
    var totalVodka = selecoesBebidas.includes("Vodka") ? adultos + ' garrafas' : "0 garrafas";
  
    // Salva os resultados no localStorage
    localStorage.setItem('resultadoCarnes', JSON.stringify(resultadoCarnes));
    localStorage.setItem('totalCerveja', totalCerveja);
    localStorage.setItem('totalRefri', totalRefri);
    localStorage.setItem('totalVodka', totalVodka);
  
    console.log('Cálculo realizado com sucesso!');
}

$(document).ready(function() {
  $('#multi-step-form').find('.step').slice(1).hide();

  $(".next-step, .prev-step").click(function(event) {
      event.preventDefault();
      var direction = $(this).hasClass('next-step');
      
      // Validate current step
      var isValid = true;
      var currentInputs = $(".step-" + currentStep + " :input");
      $(currentInputs).each(function() {
          if ($(this).is('select') && $(this).val() === "") {
              isValid = false;
          } else if ($(this).is(':checkbox')) {
              if ($("[name='" + $(this).attr('name') + "']:checked").length === 0) {
                  isValid = false;
              }
          } else if (!this.checkValidity()) {
              isValid = false;
          }
          $(this).toggleClass('is-invalid', !isValid);
      });

      // Navigate steps
      if (isValid) {
          if (direction && currentStep === 4) {
              calcularConsumo();
          } else if (direction) {
              transitionToStep(currentStep + 1);
          } else if (!direction && currentStep > 1) {
              transitionToStep(currentStep - 1);
          }
      }
  });

  function transitionToStep(newStep) {
      $(".step-" + currentStep).addClass("animate__animated animate__fadeOutLeft");
      setTimeout(function() {
          $(".step-" + currentStep).hide().removeClass("animate__animated animate__fadeOutLeft");
          currentStep = newStep;
          $(".step-" + currentStep).show().addClass("animate__animated animate__fadeInRight");
          updateProgressBar();
      }, 500);
  }

  function calcularConsumo() {
      // Your existing calculation logic here
      console.log('Cálculo realizado com sucesso!');

      // Store results and redirect
      setTimeout(function() {
          window.location.href = 'resultado.html';
      }, 500);
  }

  function updateProgressBar() {
      var progressPercentage = ((currentStep - 1) / 3) * 100;
      $(".progress-bar").css("width", progressPercentage + "%");
  }
});

