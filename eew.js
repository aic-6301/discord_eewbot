// (C) 2018 hideki_0403 All right reserved
//@要求モジュール => eris

const Eris = require("eris"); //Erisモジュールの呼び出し
const fs = require("fs") //fsモジュールの呼び出し

//変数定義
var bot = new Eris("NDAwNTE4NDY3MjM4ODg3NDQ1.DTdfyA.Ml6oOujsWBNUZZXKO5XXwYf1BDY"); //BotToken

//botの準備が完了したらコンソールへ投げるメッセージ（変更可能）
bot.on("ready", () => {
    console.log("Ready");
});

//jsonを吐かせる
let http = require('http');
const URL = 'http://svir.jp/eew/data.json';

http.get(URL, (res) => {
  let body = '';
  res.setEncoding('utf8');

  res.on('data', (chunk) => {
      body += chunk;
  });

  res.on('end', (res) => {
      res = JSON.parse(body);
      fs.writeFile("earthquake.json", head.EventID, utf8, function(err){ //吐かせたjsonをearthquake.jsonに保存
  console.log("イベントIDを保存しました。\nエラー:" + err)
      })
    });
  res.on('error', (e) => {
  console.log(e.message); //エラー時
});

//tmp.txtから情報抜き出し
//変数宣言（なおjsonファイル内のレスポンス関連の変数宣言）
//レスポンス関連の変数宣言は他の宣言と被らないようにするため大文字必須。
var json = fs.readFileSync("earthquake.json", "utf-8");
var obj = JSON.parse(json);
var Bodys = obj.Body; //これメイン？
var i;
var Body;
var Earthquake;
var Magnitude;

    for (i in Bodys) {
      Body = Bodys[i];
      Earthquake = Body.Earthquake;
      Magnitude = Body.Eathquake.Magnitude;
    }

//コマンドで最終の地震情報を表示

bot.on("messageCreate", () => {
  if(chat.content.startsWith("/lastquake")
);

//jsonから整形、Embedとして吐き出し
//なお、JFNの#earth-quakeチャンネルIdは「400604996443570176」
bot.createMessage("400593766366576640", { embed : {
    title: "地震がありました。地震の内容については以下の通りです。",
    description: "----------------------------------------------------------------------------------",
    color: 0xef1f1f,
    author: {
     name: "地震速報 (ここをクリックすると強震モニタにアクセスできます)",
     icon_url: "http://icooon-mono.com/i/icon_15890/icon_158900_256.png"
   },
    url: "http://www.kmoni.bosai.go.jp/new/",
    type: "rich",
    fields: [
        {
            name : "最大震度",
            value:"field1Value",
            inline:true
        }, {
            name : "震央地名",
            value : "field1Value",
            inline : false
        }, {
            name : "発生時刻",
            value : "field1Value",
            inline : false
        }, {
            name : "深さ",
            value : "field1Value",
            inline : false
        }, {
            name : "マグニチュード",
            value : Magnitude,
            inline : false
        }, {
            name : "震源情報",
            value : "field1Value",
            inline : false
        }, {
            name : "震源位置の緯度",
            value : "field1Value",
            inline : false
        }, {
            name : "震源位置の経度",
            value : "field1Value",
            inline : false
        }
    ],
    footer : {
        text : "Powerd by svir.jp (https://svir.jp/eew/data.json)"
    }
}});

//discordへ接続
bot.connect();
