/*
Creaited by @hideki_0403 (C)2018 hideki_0403 All right reserved

@要求モジュール
eris,websocket

*/

//変数定義
var bot = new Eris("NDAwNTE4NDY3MjM4ODg3NDQ1.DTczZg.NdjAuutbjqD-AtVh3oTLKB66XaM"); //BotTokenをここに入れる
var ws = new WebSocket("wss://localhost:443");
var output = document.getElementById('output');

//Botの準備が出来たらコンソールに表示（メッセージの変更可能）
bot.on("ready", () => {
    console.log("Ready...");
});

//websocket

(function() {
  // websocketサーバアドレスおよびポートを指定

  function logStr(eventStr, msg) {
    return '<div>' + eventStr + ':' + msg + '</div>';
  }

  // websoket接続確立イベント処理
  ws.onopen = function() {
    output.innerHTML += logStr('connect', 'success');

    // websocket認証メッセージ
    var auth_message = {
      version: {
        common_version:   "1",                                   // commonセクションバージョン
        details_version:  "1"                                    // detailsセクションバージョン
      },
      common: {
        datatype:     "authentication",                          // データタイプ:認証(authenticaion指定)
        msgid:        "*",                                       // *を設定(認証では利用しない)
        sendid:       "*",                                       // *を設定(認証では利用しない)
        senddatetime: "*"                                        // *を設定(認証では利用しない)
      },
      details:      {
        password:     "trialpass"                                // ユーザパスワードを設定(利用申請時に発行)
      },
      sender: {
        version:      "1",                                       // senderセクションバージョン
        userid:       "trialuser",                               // ユーザＩＤを設定(利用申請時に発行)
        termid:       "000000001"                                // 接続端末識別ＩＤを設定(ユーザがユニークな値となるよう任意に採番)
      },
      receiver: {
        version:      "1",                                       // receiverセクションバージョン
        userid:       "*",                                       // *を設定(認証では利用しない)
        termid:       "*"                                        // *を設定(認証では利用しない)
      }
    };
    // JSON形式に変換し、websocketサーバに送信
    ws.send(JSON.stringify(auth_message));
  };

  // メッセージ受信イベント処理
  ws.onmessage = function(e) {
    // JSON形式からオブジェクトに変換
    var parse = JSON.parse(e.data);

    if( parse.common.datatype === 'authentication' ) {
      // 認証メッセージ受信処理
      output.innerHTML += logStr('recieved', 'authentication result');
      if( parse.details.resultcode === '200' ) {
        // 認証成功
        output.innerHTML += logStr('authentication', 'success');
      } else {
        // 認証失敗
        output.innerHTML += logStr('authentication', 'failed');
      }
    } else {
      // 各データタイプ処理
      output.innerHTML += logStr('message', parse.details.data1 + ' - ' + parse.details.data2 + '- ' + parse.details.data3);
    }
  };

  // 切断イベント処理
  ws.onclose = function (e) {
    output.innerHTML += logStr('disconnect', e.code + ' - ' + e.type);
  };
}());


//接続
bot.connect();
