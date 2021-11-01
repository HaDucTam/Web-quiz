// TODO(you): Write the JavaScript necessary to complete the assignment.
const submit = document.querySelector('#submit');
const resultbox = document.querySelector('.resultbox');
const resultcontainer = document.querySelector('#review-quiz');
const startquiz = document.querySelector('.startbutton');
const question = document.querySelector('#attempt-quiz');
const startbox = document.querySelector('#quizstart');
const inputbox = document.querySelectorAll('input');
const optionbar = document.querySelector('.option');

let answerList = {};
let ques_id = null;
let optionNumber = 0;
let apiUrl = "https://wpr-quiz-api.herokuapp.com/attempts";
async function fetchData(quesid, quesans) {
    const postMethod = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }
    }
    if(quesans) {
        postMethod.body = JSON.stringify({answers: answerList});

    }
    if(quesid) {
        apiUrl = `https://wpr-quiz-api.herokuapp.com/attempts/${quesid}/submit`;
    }
    let onResponse = await fetch(apiUrl, postMethod);
    let dataResource = await onResponse.json();
    return dataResource;
    }

function quizbegin(event) {
    question.hidden = false;
    startbox.hidden = true;
    const intro = document.getElementById("introduction");

    intro.hidden= true;
    quesDesign();

    question.scrollIntoView();
    

}
startquiz.addEventListener('click', quizbegin);




/**
 * print out question and submit button
 * 
 * <div class = "submit">
 *      <button class = "submitbutton">Submit your answers > </button>
 * </div>
 *  
 *  Add event for submit button when user want to end the quiz    
 * 
 */
async function quesDesign() {
    
    const data = await fetchData();
    ques_id = data._id;
    
    let leng = data.questions.length;
    let quesNumber = 1;
    for(let i = 0; i < leng;i++) {
        question.appendChild(quesCreate(leng, data.questions[i], quesNumber));
        quesNumber++;
    }


    const submitContainer = document.createElement('div');
    submitContainer.classList.add('submit');
    const submitBut = document.createElement('button');
    submitBut.classList.add('submitbutton');
    submitBut.textContent = "Submit your answers ❯";
    submitContainer.appendChild(submitBut);
    question.appendChild(submitContainer);
    
    submitBut.addEventListener('click', function() {
        if(confirm('Are you sure to finish the quiz ?')) {
            submitContainer.hidden = true;
            checkAnswer();           
            resultcontainer.scrollIntoView();
        }
    })



}

/**
 * <div class = "question-container">
 *      <h2 id ="questionListNumber">...</h2>
 *      <p  id = "quesText">...</p>
 */

function quesCreate(len, ques, ind) {
    let quesContainer = document.createElement('div');
    quesContainer.classList.add('question-container');

    let questionListNumber = document.createElement('h2');
    questionListNumber.id = 'questionListNumber';
    questionListNumber.textContent = `Question ${ind} of ${len}`;

    quesContainer.appendChild(questionListNumber);

    let quesText = document.createElement('p');

    quesText.id = 'quesText';
    quesText.textContent = `${ques.text}`;
    quesContainer.appendChild(quesText);

    let optionList = document.createElement('div');
    optionList.classList.add('option');
    quesContainer.appendChild(optionList);

    for(let i = 0; i < ques.answers.length; i++) {
        optionList.appendChild(answerCreate(ques,i)); 
    }

    return quesContainer;
}

/**
 * 
 *        
 * <div class="option">
 *    <div class = "answer">
 *   
 *      <input type="radio" id="..." name="..." />
 *      
 * 
 *      <label for="${option}">
 *      <span class = "optionlists">...</span>
 *      </label>
 *     </div>
 *  </div>       
 * 
 */
function answerCreate(ques,ind) {
    answerList[ques._id] = null;
    let answerContainer = document.createElement('div');
    answerContainer.classList.add('answer');

    let answerLabel = document.createElement('label');
    answerLabel.htmlFor = `option${optionNumber}`;

    let answerType = document.createElement('input');
    answerType.type = 'radio';
    answerType.name = `${ques._id}`;
    answerType.id = `option${optionNumber}`;
    answerType.value = `${ind}`;

    let answerSpan = document.createElement('span');
    answerSpan.classList.add('optionlists');
    answerSpan.textContent = ques.answers[ind];

    answerContainer.appendChild(answerType);
    answerContainer.appendChild(answerLabel);
    
    answerLabel.appendChild(answerSpan);


    answerType.addEventListener('click', function(AnswerReceived) {
        answerList[AnswerReceived.target.name] = AnswerReceived.target.value;        
        console.log("clicked");
    });
    
    optionNumber++;
    return answerContainer;

}

    



function printResult(ques_id, correctAnswer) {


    let wrongans = document.createElement('div');
    wrongans.classList.add('wrongans');
    wrongans.textContent = "Wrong Answer";

    
    let correctans = document.createElement('div');
    correctans.classList.add('correctans');
    correctans.textContent = "Correct Answer";




    let optionselected = document.querySelectorAll(`input[name='${ques_id}']`)[answerList[ques_id]];
    let correct = document.querySelectorAll(`input[name='${ques_id}']`)[correctAnswer[ques_id]];

    correct.nextElementSibling.appendChild(correctans);
    correct.nextElementSibling.style.backgroundColor = '#ddd';
    if(answerList[ques_id] != null) {
        if(answerList[ques_id] == correctAnswer[ques_id]) {
            optionselected.nextElementSibling.style.backgroundColor = '#d4edda';
        } else {
            optionselected.nextElementSibling.style.backgroundColor = '#f8d7da';
            optionselected.nextElementSibling.appendChild(wrongans);
        }
    }


}
async function checkAnswer() {
    const data = await fetchData(ques_id, answerList);
    for(let i = 0; i < optionNumber;i++) {
        document.querySelector(`#option${i}`).disabled = true;
    }
    for(let i in answerList) {
        printResult(i, data.correctAnswers);
        
    }
    console.log(data.score);
    resultcontainer.appendChild(createResult(data.score));
    

}
/**
 *   <!-- <div class="resultbox">
        <strong>RESULT</strong>
        <p class="score">.../10</p>
        <span> " " %</span>
        <p>Practice more to improve it :D</p>
        <button class="tryagainbutton">Try again</button>
        </div> -->
 */
function createResult(score) {
    const finalresult = document.createElement('div');
    finalresult.classList.add('resultbox');

    const introresultword = document.createElement('strong');
    introresultword.textContent = "RESULT";
    finalresult.appendChild(introresultword);

    const scorenum = document.createElement('p');
    scorenum.classList.add('score');
    scorenum.textContent = `${score}/10`;
    finalresult.appendChild(scorenum);

    const percentagescore = document.createElement('span');
    percentagescore.textContent = `${score*10}%`;
    finalresult.appendChild(percentagescore);

    
    const inovatetext = document.createElement('p');
    inovatetext.textContent = "Practice more to improve it :D";
    finalresult.appendChild(inovatetext);

    const tryagainbut = document.createElement('button');
    tryagainbut.classList.add('tryagainbutton');
    tryagainbut.textContent = "Try again";
    tryagainbut.addEventListener('click', tryAgain);
    
    finalresult.appendChild(tryagainbut);
    return finalresult;

}
function tryAgain() {
    window.location.reload();
}