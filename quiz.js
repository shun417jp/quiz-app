'use strict';

/**/
const data = [
    {question: "日本で一番面積の大きい都道府県は？",
     answers: ["北海道","東京都","沖縄県","福岡県"],
     correct:"北海道"
    },
    {question: "日本で一番人口の多い都道府県は？",
     answers: ["北海道","東京都","沖縄県","福岡県"],
     correct:"東京都"
    },
    {question: "日本で一番人口密度の高い都道府県は？",
     answers: ["北海道","東京都","沖縄県","福岡県"],
     correct:"東京都"
    }
   
]
//出題する門段数
const QUESTION_LENGTH = 3;
//回答時間
const ANSWERS_TIME_MS = 10000;
//インターバル時間
const INTERVAL_TIME_MS = 10;

//出題する問題データ
// let questions = data.slice(0,QUESTION_LENGTH);
// const questions = [data[0]];
let questions =getRandomQuestions();
//出題する問題のインデックス
let questionIndex = 0;
//正解数
let correctCount = 0;
//インターバルID
let intervalId = null;
//回答中の経過時間
let elapsedTime = 0;
let startTime = null;

/*要素一覧*/

const startPage = document.getElementById("startPage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");
const startButton = document.getElementById(`startButton`)
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionButtons = document.querySelectorAll("#questionPage button");
const questionProgress = document.getElementById("questionProgress");
const resultMassage = document.getElementById("resultMassage");
//console.log(startPage,questionPage,resultPage,startButton)
const backButton = document.getElementById("backButton");
const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");
console.log(dialog,questionResult,nextButton);

/*処理*/ 
startButton.addEventListener('click',clickStartButtion);

optionButtons.forEach((button) => {
    button.addEventListener("click", clickOptionButtion);
});

nextButton.addEventListener("click", clickNextButton);

backButton.addEventListener("click",clickNextButton);

/*関数*/

function questionTimeOver(){
    questionResult.innerText = "×";
    if(isQuestionEnd()){
        nextButton.innerText = "結果を見る";
    }else{
        nextButton.innerText = "次の問題へ";
    }
    //ダイヤログを表示する
    dialog.showModal();
}

function startProgress(){
    startTime = Date.now();
    intervalId = setInterval(()=>{
        const currentTime = Date.now();
        //経過時間を計算する
        const progress = ((currentTime - startTime)/ ANSWERS_TIME_MS) * 100;
        //progressバーに経過時間を反映(表示)する
        questionProgress.value = progress;
        //経過時間が回答時間を超えた場合、インターバルを停止する
        if(startTime + ANSWERS_TIME_MS <= currentTime){
            stopProgress();
            questionTimeOver();
            return;
        }
        //経過時間を更新(加算)する
        elapsedTime += INTERVAL_TIME_MS;
    }, INTERVAL_TIME_MS);
}

function stopProgress(){
    //インターバルを停止する
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
}


function reset(){
    questions = getRandomQuestions();
    questionIndex = 0;
    correctCount = 0;
    //インターバルIDを初期化
    intervalId = null;
    //解答中の経過時間を初期化する
    elapsedTime = 0;
    for (let i = 0; i < optionButtons.length; i++){
        optionButtons[i].removeAttribute("bisabled");
    }
}

function isQuestionEnd(){
    //問題が最後かどうかを判定する
    return questionIndex + 1 === QUESTION_LENGTH;
}

function getRandomQuestions(){
    const questionIndexList = [];
    while(questionIndexList.length !== QUESTION_LENGTH){
        //出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        //インデックスリストに含まれていない場合、インデックスリストに追加する
        if(!questionIndexList.includes(index)){
            questionIndexList.push(index);
        }
    }
    //出題する問題リストを取得する
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;
}

function setResult(){
    //正解率を表示する
    console.log();
const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
//正解率を表示する
resultMassage.innerText = `正解率:${accuracy}%`;
}

function setQuestion(){
//問題を取得する
const question = questions[questionIndex];
//問題番号を表示する
questionNumber.innerText = `第 ${questionIndex + 1} 問`;
//問題文を表示する
questionText.innerText = question.question;
//選択肢を表示する
for (let i = 0; i < optionButtons.length; i++){
    optionButtons[i].innerText = question.answers[i];
}
}

/*イベント関連の関数*/

function clickOptionButtion(event){
    //解答中の経過時間を停止する
    stopProgress();
    //すべての選択肢を無効化する
    // optionButtons.forEach((button) => {
    //     button.disabled = true;
    // });

    //選択した選択肢をテキストで取得する
    const optionText = event.target.innerText;
    //正解のテキストを取得する
    const correctText = questions[questionIndex].correct;

    if(optionText === correctText){
        correctCount++;
        questionResult.innerText="○";
        //alert("正解");
    }else{
        //alert("不正解");
        questionResult.innerText="✖";
    }

    if(isQuestionEnd()){
        nextButton.innerText= "結果を見る";
    }else{
        nextButton.innerText= "次の問題へ";
    }

    dialog.showModal();
}




function clickStartButtion(){
    
    //問題画面に問題を設定する
    setQuestion();
    //解答の計測を開始する
    startProgress();
    /*スタート画面を非表示にする*/
    startPage.classList.add("hidden");
    /*問題画面を表示する*/
    questionPage.classList.remove("hidden");
    /*結果画面を非表示にする*/
    resultPage.classList.add("hidden");
}

function clickNextButton(){

    if(isQuestionEnd()){
        setResult();
        //ダイヤログを閉じる
        dialog.close()
        //
        startPage.classList.add("hidden");
     /*問題画面を非表示する*/
     questionPage.classList
     .add("hidden");
     /*結果画面を表示にする*/
     resultPage.classList.remove("hidden");
    }else{
        questionIndex++;
        //
        setQuestion();
        intervalId = null;
        elapsedTime = 0;
        console.log(questionIndex);
        //
        for(let i = 0; i < optionButtons.length; i++){
            optionButtons[i].removeAttribute("disabled");
        }
      dialog.close();
      startProgress();
    }
}

function clickBackButton(){
     /*スタート画面を非表示にする*/
     startPage.classList.add("hidden");
     /*問題画面を表示する*/
     questionPage.classList.remove("hidden");
     /*結果画面を非表示にする*/
     resultPage.classList.add("hidden");

}