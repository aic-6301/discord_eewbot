# Discord-EEWBot
Discordへ地震情報を即時に送る「DiscordEEWBot」プロジェクト

## 必須モジュール
Eris,fs,http,os
なおeris以外はシステムに初期から搭載されているためNPMでのインストールの必要は無し。

## はじめに
このDiscordBotのソースコードの所有者はhideki_0403にありますが、ソースコードの改変を
加えないという条件の元、二次利用の許可をしています。

まずダウンロード後に、同梱されている`初回起動時に実行してください.bat`ファイルを実行することで
このBotが動作するための必要最低限のモジュール群がダウンロードされます。
なお、バッチファイルを実行するのが怖い、という方は手動で`npm i eris`を実行していただいても
構いません。

## 次に
必要モジュール群のダウンロードが完了したらconfig.iniを開いてください。
テキストエディタであれば何を使っても構いません。
config.ini内、`'token': ''`にトークンを貼り付けてから実行してください。
そうしないと当たり前ですがBotが動きません。

## 最後に
`run.bat`を開くことで実行できます。
なお、`node eew.js`でも実行できますが、このやり方だと**Botがエラーを吐いたときに再起動が出来ず停止**してしまいます。

***
## config.iniについて
`config.ini`ファイル内には`token`、`channel`、`version`、`updatelog`、`period`、`cacheclean`の設定について
記述してあります。

`token` : Botのtokenを貼り付ける
`channel` : 地震速報を投げるチャンネルIDを貼り付ける
`version` : Botのバージョンを記述
`updatelog` : Botのアップデートログを記述
`period` : 新規地震情報取得の周期を記述。なお単位はmsのため注意が必要。
`cacheclean` : 未実装。jsonファイルのキャッシュを起動時に削除するかを設定。

***
### 連絡先
このBotについて不明な点などありましたら、Twitter [@hideki_0403](https://twitter.com/hideki_0403/)か
Discord hideki0403#7963宛てにDMなどをよろしくお願いします。


(C) 2018 hideki_0403 All right reserved
