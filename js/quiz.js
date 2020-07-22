/*
  Quick quiz bootstrap extension
*/

$(function($) {

// keep track of number of quizes added to page
var quiz_count = 0;

// add jQuery selection method to create
// quiz structure from question json file
// "filename" can be path to question json
// or javascript object
$.fn.quiz = function(filename) {
  if (typeof filename === "string") {
    $.getJSON(filename, render.bind(this));
  } else {
    render.call(this, filename);
  }
};

// create html structure for quiz
// using loaded questions json
function render(quiz_opts) {


  // list of questions to insert into quiz
  var questions = quiz_opts.questions;

  // keep track of the state of correct
  // answers to the quiz so far
  var state = {
    correct : 0,
    total : questions.length
  };

  var $quiz = $(this)
    .attr("class", "carousel slide")
    .attr("data-ride", "carousel");

  // unique ID for container to refer to in carousel
  var name = $quiz.attr("id") || "urban_quiz_" + (++quiz_count);

  $quiz.attr('id', name);

  var height = $quiz.height();


  /*
    Add carousel indicators
  */


  /*
    Slides container div
  */
  var $slides = $("<div>")
    .attr("class", "carousel-inner")
    .attr("role", "listbox")
    .appendTo($quiz);

  /*
    Create title slide
  */
  var $title_slide = $("<div>")
    .attr("class", "item active page-container")
    .attr("height", height + "px")
    .appendTo($slides);

  $('<h2>')
    //.text(quiz_opts.title)
    .text('E se as chances de contrair o novo coronavírus forem proporcionais ao seu conhecimento sobre ele?')
    .attr('class', 'intro animated fadeInDown delay-1s')
    .appendTo($title_slide);

  $('<h3 style="text-align:center; font-weight:normal;">')
    //.text(quiz_opts.title)
    .text('Responda a 14 afirmações sobre a COVID-19, descubra quão seguro você está!   Ao final, ganhe 15 % de desconto nos exames para COVID')
    .attr('class', 'texto animated fadeInDown delay-2s')
    .appendTo($title_slide);

  var $start_button = $("<div>")
    .attr("class", "quiz-answers")
    .appendTo($title_slide);

var $indicators = $('<ol>')
    .attr('class', 'progress-circles')

  $("<button>")
    .attr('class', 'quiz-button btn2 animated fadeInLeft delay-3s')
    .attr('id', 'btn_iniciar')
    .text("Vamos \n começar?")
    .click(function() {
      $quiz.carousel('next');
      $indicators.addClass('show');

    $(".active .quiz-button.btn").each(function(){
      console.log(this.getBoundingClientRect())
      $(this).css("margin-left", function(){
        return ((250 - this.getBoundingClientRect().width) *0.5) + "px"
      })
    })



    })
    .appendTo($start_button);

  $indicators
    .appendTo($quiz);

  $.each(questions, function(question_index, question) {
    $('<li>')
      .attr('class', question_index ? "" : "dark")
      .appendTo($indicators);
  });

  /*
    Add all question slides
  */
  $.each(questions, function(question_index, question) {

    var last_question = (question_index + 1 === state.total);

    var $item = $("<div>")
      .attr("class", "item")
      .attr("height", height + "px")
      .appendTo($slides);
    var $img_div;
    if (question.image) {
      $img_div = $('<div>')
        .attr('class', 'question-image animated bounceIn delay-0.8s')
        .appendTo($item);
      $("<img>")
        .attr("class", "img-responsive")
        .attr("src", question.image)
        .appendTo($img_div);
      $('<p>')
        .text(question.image_credit)
        .attr("class", "image-credit")
        .appendTo($img_div);
    }
    $("<div>")
      .attr("class", "quiz-question page-container")
      .html(question.prompt)
      .appendTo($item);

    var $answers = $("<div>")
      .attr("class", "quiz-answers")
      .appendTo($item);

    // if the question has an image
    // append a container with the image to the item


    // for each possible answer to the question
    // add a button with a click event
    $.each(question.answers, function(answer_index, answer) {

      // create an answer button div
      // and add to the answer container
      var ans_btn = $("<div>")
        .attr('class', 'quiz-button btn animated fadeInUp delay-1s')
        .html(answer)
        .appendTo($answers);

      // This question is correct if it's
      // index is the correct index
      var correct = (question.correct.index === answer_index);

      // default opts for both outcomes
      var opts = {
        allowOutsideClick : true,
        allowEscapeKey : false,
        confirmButtonText: "Próxima pergunta",
        html : true,
        confirmButtonColor: "#505050"
      };

      // set options for correct/incorrect
      // answer dialogue
      if (correct) {
        opts = $.extend(opts, {
          title: "Correto!",
          //text: "Muito bem mesmo!" + (
            text: (question.correct.text ?
            ("<div class=\"correct-text\">" +
              question.correct.text +
              "</div>"
            ) : ""),
          type: "success"
        });
      } else {
        opts = $.extend(opts, {
          title: "Ops...",
          //text: (
           // "Não, está errado!<br/><br/>" +
            text: ("A resposta correta era \"" +
            question.answers[question.correct.index] + "\"." + (
            question.correct.text ?
            ("<div class=\"correct-text\">" +
              question.correct.text +
              "</div>"
            ) : "")
            ),
          type: "error"
        });
      }

      if (last_question) {
        opts.confirmButtonText = "Confira o resultado";
      }

      // bind click event to answer button,
      // using specified sweet alert options
      ans_btn.on('click', function() {

        function next() {
          // if correct answer is selected,
          // keep track in total
          if (correct) state.correct++;
          $quiz.carousel('next');

          // if we've reached the final question
          // set the results text
          if (last_question) {
            $results_title.html(resultsText(state));
            $results_comp.html(resultsTextComp(state));
            $results_ratio.text(
              "Você acertou " + state.correct + " de " + state.total + " (" +
              Math.round(100*(state.correct/state.total)) +
              "%) das perguntas."
            );
            $twitter_link.attr('href', tweet(state, quiz_opts));
            $facebook_link.attr('href', facebook(state, quiz_opts));
            $whatsapp_link.attr('href', whatsapp(state, quiz_opts));
            $indicators.removeClass('show');
            // indicate the question number
            $indicators.find('li')
              .removeClass('dark')
              .eq(0)
              .addClass('dark');

            //TODO: Adicionar estatistica

          } else {
            // indicate the question number
            $indicators.find('li')
              .removeClass('dark')
              .eq(question_index+1)
              .addClass('dark');
          }
          // unbind event handler
          $('.sweet-overlay').off('click', next);
        }

        // advance to next question on OK click or
        // click of overlay
        swal(opts, next);
        $('.sweet-overlay').on('click', next);

      });

    });


  });


  // final results slide
  var $results_slide = $("<div>")
    .attr("class", "item")
    .attr("height", height + "px")
    .appendTo($slides);

  var $results_title = $('<h2>')
    .attr('class', 'quiz-result-title')
    .appendTo($results_slide);

  var $results_ratio = $('<div>')
    .attr('class', 'results-ratio page-container')
    .appendTo($results_slide);

  var $results_comp = $('<div>')
  .attr('class', 'results-message page-container')
  .appendTo($results_slide);

  // Filipe Acréscimo
  var $answers_container = $("<div>")
      .attr('class','m-30 results-ratio page-container animated fadeInLeft delay-1s')
      .appendTo($results_slide);

  var $question_exame = $("<div>")
      .html('<p class="animated fadeInLeft delay-1s">Para terminar :</p><p class="animated fadeInLeft delay-1s">Você já confirmou por algum exame, se teve contato com o vírus ?</p>')
      .appendTo($answers_container);

  var $interest_container = $("<div>")
      .attr('class','hide m-30 results-ratio page-container animated fadeInLeft')
      .html('<p>Você tem interesse de fazer exame do covid ?</p>')
      .appendTo($results_slide);

  $("<a href='https://www.veustlp.com.br' target='_blank' class='btn-outline' style='display: inline-block;'>Sim, claro!</a>")
      .appendTo($interest_container);
  $("<button class='btn-outline'>Não, muito obrigado!</button>")
      .appendTo($interest_container)
      .on('click', function(){
        swal("A VEUS que agradece!", "Nosso muito obrigado, e desejamos que você fique super bem!")
      });

  var json_contato_virus = [
    {
      text: 'Sim, fiz o exame/coleta em um laboratório.',
      value: 'Laboratório'
    },
    {
      text: 'Sim, fiz o exame/coleta em minha empresa.',
      value: 'Empresa'
    },
    {
      text: 'Sim, fiz o exame/coleta em casa.',
      value: 'Casa'
    },
    {
      text: 'Sim, fiz o exame/coleta outra forma.',
      value: 'Outros'
    },
    {
      text: 'Não fiz nenhum exame.',
      value: 'Não fez'
    },
  ];

  $.each(json_contato_virus, function(answer_index, answer) {
    $("<button class='btn-outline'>"+ answer.text +"</button>")
        .appendTo($answers_container)
        .on('click', function(){
          $answers_container.addClass('hide');
          $interest_container.removeClass('hide');
          recordAnswers({
            correct: state.correct,
            total: state.total,
            exam_answer: answer.value
          })
        });
  });

  // $("<hr>")
  //     .attr('style', 'margin-top: 50px;')
  //     .appendTo($results_slide);

  // End Filipe Acréscimo

  // var $cta = $("<div>")
  //   .attr('class','ctardsl')
  //   .html('<div class="cta-text page-container">Faça o seu teste de anticorpos para<br><b>COVID-19</b><br><span>com desconto especial</span></div>')
  //   .appendTo($results_slide);
  //
  // var $ctaActions = $("<div>")
  //   .attr('class', 'cta-actions')
  //   .html('<div><div><span>USE O CUPOM:</span><br>VEUSTFLA</div><div><img src="img-new/VEUS_MASCOTE_2.png"></div></div>')
  //   .appendTo($cta)
  //
  // var $ctaActionsButtons = $("<div>")
  //   .attr('class', 'cta-actions-buttons')
  //   .appendTo($ctaActions)
  //
  // $("<a>")
  //   .attr('class', 'quiz-button btn2 btn-block')
  //   .attr('id', 'btn_compra')
  //   .attr('href', 'https://www.veustlp.com.br/')
  //   .attr('target', '_blank')
  //   .text("Compre Agora")
  //   .appendTo($ctaActionsButtons);
  //
  // $("<p>")
  //   .attr('class', 'legenda-promo page-container')
  //   .html('* Este cupom não é cumulativo com outras promoções.')
  //   .appendTo($results_slide);

  var $social = $("<div>")
    .attr('class', 'results-social page-container')
    //.html('<div id = "social-text">Gostou desse quiz? Desafie seus amigos compartilhando com eles. Assim, todos se divertem ficando bem informados!</div>')
    .html('<div id = "social-text">Desafie seus amigos! Assim todo mundo fica bem informado de uma forma interativa e também ganha cupom. &#128521;</div>')
    .appendTo($results_slide);

  var $compartilhe = $("<div>")
    .attr('class', "share-title")
    .html('<span>COMPARTILHE:</span>')
    .appendTo($social);

  var $twitter_link = $('<a>')
    .attr('class', 'twitter')
    .html('<svg version="1.1" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#icon-twitter"></use></svg>')
    .appendTo($compartilhe);

  var $facebook_link = $('<a>')
    .html('<svg version="1.1" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#icon-facebook"></use></svg>')
    .appendTo($compartilhe);

  var $whatsapp_link = $('<a>')
    .html('<svg version="1.1" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#icon-whatsapp"></use></svg>')
     .appendTo($compartilhe);

  var $link_empresas = $("<a>")
     .attr('class', 'link-empresas')
     .attr('id', 'btn_empresarial')
     .attr('href', 'https://www.veustlp.com.br/empresarial')
     .attr('target', '_blank')
     .html('Solicite a cotação dos testes para os colaboradores de sua empresa.')
     .appendTo($results_slide);

  $quiz.carousel({
    "interval" : false
  });

  $(window).on('resize', function() {
    $quiz.find(".item")
      .attr('height', $quiz.height() + "px");
    $('.container-fluid')
        .attr('height',(($(window).height()))+'px');
  });

}

function resultsText(state) {

  var ratio = state.correct / state.total;
  var text;

  switch (true) {
    case (ratio === 1):
      text = "Deu aula! &#128526;";
      break;
    case (ratio > 0.8):
      text = "Aí sim!";
      break;
    case (ratio > 0.60):
      text = "Bem, pelo menos você acertou mais da metade!";
      break;
    case (ratio >= 0.5):
      text = "Mais ou menos, hein...";
      break;
    case (ratio < 0.5 && ratio !== 0):
      text = "Deu ruim!";
      break;
    case (ratio === 0):
      text = "Deu muito ruim!";
      break;
  }
  return text;

}

function resultsTextComp(state) {

  var ratio = state.correct / state.total;
  var text_comp;

  switch (true) {
    case (ratio === 1):
      text_comp = "A depender deste teste, você está muito bem protegido e se cuidando direitinho nesta pandemia. Parabéns!";
      break;
    case (ratio > 0.8):
      text_comp = "Quase lá! A depender deste teste, você até que está protegido. Mas dá pra melhorar! Que tal jogar de novo para fixar as recomendações e gabaritar?";
      break;
    case (ratio > 0.60):
      text_comp = "A depender deste teste, você até que está protegido. Mas dá pra melhorar! Que tal jogar de novo para fixar as recomendações e gabaritar?";
      break;
    case (ratio >= 0.5):
      text_comp = "A depender deste teste, você não está totalmente protegido. Bom, mas agora que você já sabe as repostas corretas, que tal jogar de novo para fixar as recomendações e melhorar esse resultado?";
      break;
    case (ratio < 0.5 && ratio !== 0):
      text_comp = "Se for depender deste teste... Bom, mas agora que você já sabe as repostas corretas, que tal jogar de novo para fixar as recomendações?";
      break;
    case (ratio === 0):
      text_comp = "E se for depender deste teste... Bom, mas agora que você já sabe as repostas corretas, que tal jogar de novo para fixar as recomendações?";
      break;
  }
  return text_comp;

}


function tweet(state, opts) {

  var body = (
    "Eu acertei " + state.correct +
    " de um total de " + state.total +
    " no Quiz Veus Saúde Covid-19 \"" + opts.title +
    "\" . Teste seu conhecimento aqui => " + "https://site.veusserver.com/quiz/" //opts.url
  );

  return (
    "http://twitter.com/intent/tweet?text=" +
    encodeURIComponent(body)
  );

}

function facebook(state, opts) {
  return "https://www.facebook.com/sharer/sharer.php?u=" + "https://site.veusserver.com/quiz/";
      //opts.url;
}

function whatsapp(state, opts) {

  var body = (
     "Eu acertei " + state.correct +
     " de um total de " + state.total +
     " no Quiz Veus Saúde Covid-19 \"" + opts.title +
     "\". Teste seu conhecimento aqui => " + "https://site.veusserver.com/quiz/" //opts.url
     );

  return (
     "https://api.whatsapp.com/send?text=" +
     encodeURIComponent(body)
     );

}


function recordAnswers(info) {
  // Save answer on another File
  var now = new Date(Date.now());
  var dia  = now.getDate().toString();
  var diaF = (dia.length == 1) ? '0'+dia : dia;
  var mes  = (now.getMonth()+1).toString(); //+1 pois no getMonth Janeiro começa com zero.
  var mesF = (mes.length == 1) ? '0'+mes : mes;
  var anoF = now.getFullYear();
  var hour = now.getHours();
  var hourF = (hour.length == 1) ? '0'+hour : hour;
  var minute = now.getMinutes();
  var minuteF = (minute.length == 1) ? '0'+minute : minute;
  var second = now.getSeconds();
  var secondF = (second.length == 1) ? '0'+second : second;

  $.post(
      'saveAnswer.php',
      {
        data: {
          created_at: `${anoF}-${mesF}-${diaF}T${hourF}:${minuteF}:${secondF}.000Z`,
          correct: info.correct,
          total: info.total,
          exam: info.exam_answer
        }
      },
      function(response){
        // response of insert file
      }
  );
}

/* window.addEventListener('contextmenu', function (e) {
  var d = new Date();
  var n = d.getFullYear();
  alert("Conteúdo protegido. D'Or Consultoria. " + n + ". Todos os direitos reservados.");
  e.preventDefault();
}, false); */

$(document).ready(function() {
    $('#Selector').bind('copy paste', function(e) {
        e.preventDefault();
    });
});


})(jQuery);

