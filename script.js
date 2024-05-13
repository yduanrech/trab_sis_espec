var currentStep = 1;
var updateProgressBar;

function displayStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= 4) {
        if (!validateStep(currentStep)) return; // Adiciona validação aqui
        $(".step-" + currentStep).hide();
        $(".step-" + stepNumber).show();
        currentStep = stepNumber;
        updateProgressBar();
    }
}

function validateStep(step) {
  var $step = $(`.step-${currentStep}`);
  var isValid = true;
  $step.find('input:required, select:required').each(function() {
    if (!this.checkValidity()) {
      $(this).addClass('is-invalid');
      isValid = false;
    } else {
      $(this).removeClass('is-invalid');
    }
  });
  return isValid;
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

    var totalCerveja = selecoesBebidas.includes("Cerveja") ? 6 * adultos + ' latas' : "0 latas";
    var totalRefri = selecoesBebidas.includes("Refrigerante") ? (3 * adultos + criancas) + ' latas' : "0 latas";
    var totalVodka = selecoesBebidas.includes("Vodka") ? adultos + ' garrafas' : "0 garrafas";

    localStorage.setItem('resultadoCarnes', JSON.stringify(resultadoCarnes));
    localStorage.setItem('totalCerveja', totalCerveja);
    localStorage.setItem('totalRefri', totalRefri);
    localStorage.setItem('totalVodka', totalVodka);

    console.log('Cálculo realizado com sucesso!');
}

$(document).ready(function() {
    $('#multi-step-form').find('.step').slice(1).hide();

    $(".next-step").click(function() {
        if (currentStep < 4) {
            if (!validateStep(currentStep)) return;  // Verifica a validade antes de ir para o próximo passo
            $(".step-" + currentStep).addClass("animate__animated animate__fadeOutLeft");
            currentStep++;
            setTimeout(function() {
                $(".step").removeClass("animate__animated animate__fadeOutLeft").hide();
                $(".step-" + currentStep).show().addClass("animate__animated animate__fadeInRight");
                updateProgressBar();
            }, 500);
        }
    });

    $(".prev-step").click(function() {
        if (currentStep > 1) {
            if (!validateStep(currentStep)) return;  // Verifica a validade antes de voltar para o passo anterior
            $(".step-" + currentStep).addClass("animate__animated animate__fadeOutRight");
            currentStep--;
            setTimeout(function() {
                $(".step").removeClass("animate__animated animate__fadeOutRight").hide();
                $(".step-" + currentStep).show().addClass("animate__animated animate__fadeInLeft");
                updateProgressBar();
            }, 500);
        }
    });

    updateProgressBar = function() {
        var progressPercentage = ((currentStep - 1) / 3) * 100;
        $(".progress-bar").css("width", progressPercentage + "%");
    };

    $('#multi-step-form').on('submit', function(event) {
        event.preventDefault(); // Evita o envio do formulário
        if (!validateStep(currentStep)) return; // Verifica o passo atual antes de enviar
        calcularConsumo();
        window.location.href = 'resultado.html';
    });
});
