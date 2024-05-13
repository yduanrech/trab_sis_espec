$(document).ready(function() {
    let currentStep = 0;
    const steps = ["#step1", "#step2", "#step3"];
    const maxSteps = steps.length;

    // Inicia com o botão de voltar escondido
    $("#prevBtn").hide();

    // Lógica para o botão "Próximo"
    $("#nextBtn").click(function() {
        // Se não estamos no último passo, avançamos
        if (currentStep < maxSteps - 1) {
            $(steps[currentStep]).hide();
            currentStep++;
            $(steps[currentStep]).fadeIn();
            $("#prevBtn").show(); // Mostra o botão de voltar ao avançar

            // Se chegarmos ao último passo, alteramos o texto do botão para "Enviar"
            if (currentStep === maxSteps - 1) {
                $("#nextBtn").text("Submit");
            }
        } else {
            // No último passo, chama a função para armazenar os dados
            storeData();
        }
    });

    // Lógica para o botão "Voltar"
    $("#prevBtn").click(function() {
        if (currentStep > 0) {
            $(steps[currentStep]).hide();
            currentStep--;
            $(steps[currentStep]).fadeIn();

            // Se voltamos ao primeiro passo, esconde o botão de voltar
            if (currentStep === 0) {
                $("#prevBtn").hide();
            }

            // Certifica-se de que o texto do botão "Próximo" esteja correto
            $("#nextBtn").text("Next Step");
        }
    });

    // Função para armazenar dados no localStorage
    function storeData() {
        const formData = {
            // Aqui você pode adicionar todos os dados que deseja armazenar
            step1Data: $("#step1 input, #step1 select").serializeArray(),
            step2Data: $("#step2 input, #step2 select").serializeArray(),
            step3Data: $("#step3 input, #step3 select").serializeArray()
        };
        localStorage.setItem("formData", JSON.stringify(formData));
        alert("Dados armazenados com sucesso!");

        // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de confirmação
    }
});
