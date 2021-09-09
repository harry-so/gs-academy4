// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjfCru4dPRNixeoNpXRUh0v4qXbsy2x6w",
    authDomain: "dev21chat-harry.firebaseapp.com",
    databaseURL: "https://dev21chat-harry-default-rtdb.firebaseio.com/",
    projectId: "dev21chat-harry",
    storageBucket: "dev21chat-harry.appspot.com",
    messagingSenderId: "890233017325",
    appId: "1:890233017325:web:0347f6353281d4ceac4de4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//firebaseのデーターベース（保存させる場所）を使いますよ
const newPost = firebase.database();



// 送信ボタンをクリックされたら次の処理をする
$("#thread").on("click", function () {
    // データを登録で送る
    let t = $("#textbox").val();
    // 
    let today = new Date();
    let year = today.getUTCFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hour = today.getHours();
    let minute = today.getMinutes();
    // 
    newPost.ref().push({
        username: $("#username").val(), //名前
        text: $("#textbox").val(),//テキストエリア
        date: `${year}/${month}/${day} ${hour}:${minute}`,
        comment_count: 0, // コメント数を足していく
        message: {}
    })
    $("#textbox").val(""); //空にする
    $("#username").val(""); //空にする
});

// 受信処理
newPost.ref().on("child_added", function (data) {
    let v = data.val(); //ここに保存されたデータが全て入ってくる
    let k = data.key;
    $(".add-card").prepend(
        `<div class="topic-card" id="${k}">
                    <div class="yokonarabi">
                        <i class="fas fa-user-circle fa-2x"></i>
                        <p class="card-name">${v.username}</p>
                    </div>
                    <div class="card-contents">
                        <h2>
                            ${v.text}
                        </h2>
                    </div>
                    <div class="topic-data">
                        <p class="card-text left-comment">${v.comment_count} comments</p>
                        <p class="card-text">${v.date}</p>
                    </div>
                </div>`
    )

})

// Textboxのクリアイベント

$(".clear1").on("click", function () {
    $("#textbox").val("");
});

$(".click2").on("click", function () {
    $("#reply-box").val("");
});

// 左側のポストカードを押したら、右側に内容を反映
$(".add-card").on("click", ".topic-card", function () {
    let k = $(this).attr('id'); // TopicカードのFirebaseのデータにつながるKeyをkに格納
    newPost.ref(k).on('value', function (data) {
        $("#right-card").html(
            `<h2>${data.val().text}</h2>`
        )
        $(".right-name").text(
            data.val().username
        )
        $(".right-comment").text(
            `${data.val().comment_count} comments`
        )
        $(".right-date").text(
            data.val().date
        )

        // 左側のカードを押したら、右のスレッドが表示される
        $("#right").css('display', 'block');


        // 右側のカードが常に選ばれているデータのKeyをクラスを持つようにする
        if ($("#right").hasClass(k)) {
            return;
        } else {
            $("#right").removeClass();
            $("#right").addClass(k);
        }
    })

    // 今までのコメントが右に全て反映される 
    newPost.ref(k).on("value", function (data) {
        let o = Object.keys(data.val());
        // let judge = document.querySelector("comment-box");
        if (document.getElementsByClassName("arrow") != null) {
            $(".comment-box").empty();
            for (let k of o) {
                if (data.val()[k].date) {
                    let date = data.val()[k].date;
                    let reply = data.val()[k].reply;
                    $(".comment-box").append(
                        `<div class="yokonarabi">
                            <i class="far fa-user-circle fa-3x"></i>
                            <div class="arrow">
                            <p class="reply-content">${reply}</p>
                            <p class="reply-date">${date}</p>
                            </div>
                        </div>`
                    )
                }
            }

        } else {
            for (let k of o) {
                if (data.val()[k].date) {
                    let date = data.val()[k].date;
                    let reply = data.val()[k].reply;
                    $(".comment-box").append(
                        `<div class="yokonarabi">
                            <i class="far fa-user-circle fa-3x"></i>
                            <div class="arrow">
                            <p class="reply-content">${reply}</p>
                            <p class="reply-date">${date}</p>
                            </div>
                        </div>`
                    )
                }
            }
        }




    })

})


// 右の返信ボタンを押したら、スレッドとしてコメントが下に追加される
$("#reply").on("click", function () {
    let reply = $("#reply-box").val();
    let keynow = $("#right").attr("class");
    // 
    let today = new Date();
    let year = today.getUTCFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hour = today.getHours();
    let minute = today.getMinutes();
    // 

    $(".comment-box").append(
        `<div class="yokonarabi">
            <i class="far fa-user-circle fa-3x"></i>
            <div class="arrow">
            <p class="reply-content">${reply}</p>
            <p class="reply-date">${year}/${month}/${day} ${hour}:${minute}</p>
            </div>
        </div>`
    )

    newPost.ref(keynow).push({
        date: `${year}/${month}/${day} ${hour}:${minute}`,
        reply: `${reply}`
    })

    $("#reply-box").val("");

    let n = $(".comment-box > div").length;
    newPost.ref(keynow).update({
        comment_count: n
    });
    
    $(document.getElementById(keynow)).find('.left-comment').text(`${n} comments`);
    // el.children(".left-comment").text(`${n} comments`);
    

    // });
    // newPost.ref(keynow).on('value', function (data) {
    //     console.log(data.val());
    //     // data.val().reply({
    //     // reply: $("#reply-box").val(),
    //     //     date: `${year}/${month}/${day} ${hour}:${minute}`
    //     // })

    //     // コメントを足していく
    //     comment = data.val().comment_count;
    //     return comment;

    // });



    // newPost.ref(keynow).update({
    //     comment_count: comment
    // })

});



// 3. コメント数が増えて記録され、Topicカードにも反映される
