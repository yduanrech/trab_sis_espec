var currentStep = 1;

function updateProgressBar() {
    var progressPercentage = ((currentStep - 1) / 3) * 100;
    $(".progress-bar").css("width", progressPercentage + "%");
}

function validateStep(step) {
    var $step = $(`.step-${step}`);
    var isValid = true;
    $step.find('input:required, select:required').each(function () {
        if (!this.checkValidity()) {
            $(this).addClass('is-invalid');
            isValid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    // Validação específica para checkboxes nos passos 3 e 4
    if (step === 3 || step === 4) {
        var checkedCount = $step.find('.form-check-input:checked').length;
        var errorMessageDiv = $step.find('.text-danger');
        if (checkedCount === 0) {
            errorMessageDiv.show();
            isValid = false;
        } else {
            errorMessageDiv.hide();
        }
    }

    return isValid;
}

function transitionStep(fromStep, toStep) {
    $(".step-" + fromStep).fadeOut(400, function() {
        $(".step-" + toStep).fadeIn(400);
    });
    currentStep = toStep;
    updateProgressBar();
}

$(document).ready(function () {
    $('.step').hide(); // Esconde todos os passos inicialmente
    $('.step-1').show(); // Mostra apenas o primeiro passo

    $(".next-step").click(function () {
        var nextStep = currentStep + 1;
        if (nextStep <= 4 && validateStep(currentStep)) {
            transitionStep(currentStep, nextStep);
        }
    });

    $(".prev-step").click(function () {
        var prevStep = currentStep - 1;
        if (prevStep >= 1 && validateStep(currentStep)) {
            transitionStep(currentStep, prevStep);
        }
    });

    $('#multi-step-form').on('submit', function (event) {
        event.preventDefault();
        if (validateStep(currentStep)) {
            calcularConsumo();
            window.location.href = 'resultado.html'; // Redireciona para a página de resultados
        }
    });
});

function calcularConsumo() {
    var adultos = parseInt($('#adultosQuantidade').val()) || 0;
    var criancas = parseInt($('#criancasQuantidade').val()) || 0;
    var duracao = parseInt($('#duracaoHoras').val());

    var selecoesCarnes = $('.step-3 .form-check-input:checked').map(function () {
        return $(this).val();
    }).get();

    var selecoesBebidas = $('.step-4 .form-check-input:checked').map(function () {
        return $(this).val();
    }).get();

    var quantCarnes = selecoesCarnes.length;

    var carnePorAdulto, carnePorCrianca;
    if (duracao === 1) {
        carnePorAdulto = 500;
    } else if (duracao === 2) {
        carnePorAdulto = 700;
    } else if (duracao === 3) {
        carnePorAdulto = 850;
    }

    carnePorCrianca = carnePorAdulto * 0.4;  // Assume crianças consomem 40% do adulto

    var carnePorTipoAdulto = carnePorAdulto / quantCarnes;
    var carnePorTipoCrianca = carnePorCrianca / quantCarnes;

    var resultadoCarnes = {};
    selecoesCarnes.forEach(function (tipo) {
        resultadoCarnes[tipo] = {
            'adultos': parseFloat(carnePorTipoAdulto.toFixed(0)) * adultos + 'g',
            'criancas': parseFloat(carnePorTipoCrianca.toFixed(0)) * criancas + 'g'
        };
    });

    // Cálculo de bebidas
    var bebidas = {
        Cerveja: selecoesBebidas.includes("Cerveja") ? 6 * adultos + ' latas' : "0 latas",
        Refrigerante: selecoesBebidas.includes("Refrigerante") ? {
            adultos: 3 * adultos + ' latas',
            criancas: 2 * criancas + ' latas'
        } : { adultos: "0 latas", criancas: "0 latas" },
        Vodka: selecoesBebidas.includes("Vodka") ? adultos + ' garrafas' : "0 garrafas"
    };

    localStorage.setItem('resultadoCarnes', JSON.stringify(resultadoCarnes));
    localStorage.setItem('bebidas', JSON.stringify(bebidas));

    console.log('Cálculo realizado com sucesso!');
}
