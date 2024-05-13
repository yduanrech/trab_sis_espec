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

  $(document).ready(function() {
    $('#multi-step-form').find('.step').slice(1).hide();
  
    $(".next-step").click(function() {
      if (currentStep < 4) {
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
    }

    $('#multi-step-form').on('submit', function(event) {
        event.preventDefault(); // Evita o envio do formulário
        // Captura os valores
        var adultos = $('#adultosQuantidade').val();
        var criancas = $('#criancasQuantidade').val();
        var duracao = $('#duracaoHoras').val();
        var carnes = $('#carnes').val();
        var bebidas = $('#bebidas').val();
        // Salva no localStorage
        localStorage.setItem('adultos', adultos);
        localStorage.setItem('criancas', criancas);
        localStorage.setItem('duracao', duracao);
        localStorage.setItem('carnes', carnes);
        localStorage.setItem('bebidas', bebidas);
        // Redireciona para outra página, por exemplo, resultado.html
        window.location.href = 'resultado.html';
    });
  });