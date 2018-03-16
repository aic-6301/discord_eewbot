// (C) 2018 hideki_0403 All right reserved
// @要求モジュール => eris,fs,http,os
// 同フォルダ内、config.iniでいろいろ設定とか変えられます。
// なおeris以外はシステムに初期から搭載されているため
// npmによるインストールは必要なし。

//  _____  _                       _   ______ ________          ______        _     _____           _           _
// |  __ \(_)                     | | |  ____|  ____\ \        / /  _ \      | |   |  __ \         (_)         | |
// | |  | |_ ___  ___ ___  _ __ __| | | |__  | |__   \ \  /\  / /| |_) | ___ | |_  | |__) | __ ___  _  ___  ___| |_
// | |  | | / __|/ __/ _ \| '__/ _` | |  __| |  __|   \ \/  \/ / |  _ < / _ \| __| |  ___/ '__/ _ \| |/ _ \/ __| __|
// | |__| | \__ \ (_| (_) | | | (_| | | |____| |____   \  /\  /  | |_) | (_) | |_  | |   | | | (_) | |  __/ (__| |_
// |_____/|_|___/\___\___/|_|  \__,_| |______|______|   \/  \/   |____/ \___/ \__| |_|   |_|  \___/| |\___|\___|\__|
//                                                                                               _/ |

const Eris = require('eris')
const fs = require('fs')
const http = require('http')
const os = require('os')
const token = require('./config.ini')['token']
const eqres = require('./config.ini')['channel']
const period = require('./config.ini')['period']
const updatever = require('./config.ini')['version']
const updatelog = require('./config.ini')['updatelog']
const createcache = require('./config.ini')['createcache']
const cacheclean = require('./config.ini')['cacheclean']
const bot = new Eris(token)

// botの準備が完了したらコンソールへ投げるメッセージ（変更可能）
bot.on('ready', () => {
  console.log('Botの準備ができたよ！')
  bot.editStatus({ name: '/eq help' })
  console.log('config.iniの読み込み完了。\n地震発生時に投稿するチャンネルID:' + eqres + '\n新規地震確認の周期時間:' + period + 'ms' + '\n本体バージョン:' + updatever)
})

// jsonを吐かせて落とす

setInterval(function () {
// URLを指定
  var dljson = 'http://svir.jp/eew/data.json'

// 出力ファイル名を指定
  var outFile = fs.createWriteStream('eq-after.json')

// ダウンロード開始
  var req = http.get(dljson, function (res) {
    // ダウンロードした内容をそのまま、ファイル書き出し。
    res.pipe(outFile)

    // 終わったらファイルストリームをクローズ。
    res.on('end', function () {
      outFile.close()
    //  console.log('ファイル取得は正常に終了しました。')
    })
  })

// エラーがあれば扱う。
  req.on('error', function (err) {
    console.log('地震情報ファイルをダウンロード中にエラーが発生しました。\nError:', err)
  })

  setTimeout(function () {
    // 比較のためにjsonからデータ吐き出させる
    var comaf = JSON.parse(fs.readFileSync('./eq-after.json', 'utf-8'))
    var comafter = comaf.Head.EventID
    var comafter2 = comaf.Head.Serial
    var combe = JSON.parse(fs.readFileSync('./eq-before.json', 'utf-8'))
    var combefore = combe.Head.EventID
    var combefore2 = combe.Head.Serial

    // rename
    var eqtimevars = new Date()
    var fullyear = eqtimevars.getFullYear()
    var month = ('0' + eqtimevars.getMonth() + 1).slice(-2)
    var date = ('0' + eqtimevars.getDate()).slice(-2)
    var hours = ('0' + eqtimevars.getHours()).slice(-2)
    var minutes = ('0' + eqtimevars.getMinutes()).slice(-2)
    var seconds = ('0' + eqtimevars.getSeconds()).slice(-2)
    var timedata = '' + fullyear + month + date + hours + minutes + seconds // ex.)20180117174403
    var datedata = '' + fullyear + month + date // ex.)20180117

    if (createcache === 'true') {
      fs.renameSync('./eq-before.json', './eq-temp/eq-temp-' + timedata + '.json')
    }

    fs.renameSync('./eq-after.json', './eq-before.json')
    // 比較
    // なおcombefore(after)では地震IDで比較、combefore2(after2)は電文の配信数で比較。
    // 新規地震はSerial値がリセットされるためこのように対処。
    if (combefore < comafter || combefore2 < comafter2) {
      
      // jsonからデータ吐かせる
      var eq = JSON.parse(fs.readFileSync('./eq-before.json', 'utf-8'))
      var eqsindo = eq.Body.Intensity.MaxInt
      var eqchimei = eq.Body.Earthquake.Hypocenter.Name
      var eqzikoku = eq.Body.Earthquake.OriginTime
      var eqhukasa = eq.Body.Earthquake.Hypocenter.Depth
      var eqmagnitude = eq.Body.Earthquake.Magnitude
      var eqserial = eq.Head.Serial
      var eqflag = eq.Body.EndFlag
      var eqido = eq.Body.Earthquake.Hypocenter.Lat
      var eqkeido = eq.Body.Earthquake.Hypocenter.Lon

      // 最終報判定フラグ
      // 震度によりcolor変更、icon変更のあれ
      if (eqsindo === '7') {
        var embedcolor = 0xf40004
        var embedthumbnail = 'http://toriho-dai.com/img/number/number3_7.png'
      } else {
        if (eqsindo === '6+') {
          var embedcolor = 0xff352b
          var embedthumbnail = 'http://toriho-dai.com/img/number/number3_6.png'
        } else {
          if (eqsindo === '6-') {
            var embedcolor = 0xff4f1e
            var embedthumbnail = 'http://toriho-dai.com/img/number/number3_6.png'
          } else {
            if (eqsindo === '5+') {
              var embedcolor = 0xff691e
              var embedthumbnail = 'http://toriho-dai.com/img/number/number3_5.png'
            } else {
              if (eqsindo === '5-') {
                var embedcolor = 0xff9d1e
                var embedthumbnail = 'http://toriho-dai.com/img/number/number3_5.png'
              } else {
                if (eqsindo === '4') {
                  var embedcolor = 0xffb01e
                  var embedthumbnail = 'http://toriho-dai.com/img/number/number3_4.png'
                } else {
                  if (eqsindo === '3') {
                    var embedcolor = 0xffe11e
                    var embedthumbnail = 'http://toriho-dai.com/img/number/number3_3.png'
                  } else {
                    if (eqsindo === '2') {
                      var embedcolor = 0xacff1e
                      var embedthumbnail = 'http://toriho-dai.com/img/number/number3_2.png'
                    } else {
                      if (eqsindo === '1') {
                        var embedcolor = 0xc1fcff
                        var embedthumbnail = 'http://toriho-dai.com/img/number/number3_1.png'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // 新規地震検知でなげるやつ
      bot.createMessage(eqres, {
        embed: {
          description: '新しい地震データを受信しました。しっかりとご自身で身の安全を確認し、行動するよう心掛けてください。',
          author: {
            name: '地震速報 [第' + eqserial + '報]',
            icon_url: 'http://icooon-mono.com/i/icon_15889/icon_158890_256.png',
            url: 'http://www.kmoni.bosai.go.jp/new/'
          },
          title: '\n地震がありました。地震の内容については以下の通りです。',
          color: embedcolor,
          image: {'url': 'http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/' + datedata + '/' + timedata + '.jma_s.gif'},
          thumbnail: {'url': embedthumbnail},
          fields: [
            {
              name: '**最大震度**',
              value: '震度' + eqsindo,
              inline: true
            }, {
              name: '**震央地名**',
              value: eqchimei,
              inline: true
            }, {
              name: '**発生時刻**',
              value: eqzikoku,
              inline: true
            }, {
              name: '**深さ**',
              value: eqhukasa + 'km',
              inline: true
            }, {
              name: '**マグニチュード**',
              value: 'M' + eqmagnitude,
              inline: true
            }, {
              name: '**最終報判定フラグ**',
              value: eqflag + '（0で続報,1で最終報）',
              inline: true
            }, {
              name: '**震源位置の緯度**',
              value: '緯度' + eqido + '度',
              inline: true
            }, {
              name: '**震源位置の経度**',
              value: '経度' + eqkeido + '度',
              inline: true
            }
          ],

          timestamp: new Date(),
          footer: {
            text: 'Powerd by svir.jp (https://svir.jp/eew/data.json)'
          }
        }
      })
    }
  }, 5000)
}, period)

// 手動で最終地震情報取得
bot.on('messageCreate', (msg) => {
  if (msg.content === '/eq') {
    console.log('手動で最終地震情報取得が実行されました。\nチャンネルID:' + msg.channel.id + '\n実行したユーザー:' + msg.member.user)
    console.log('情報の出力を行います。')

    // jsonパース関連の宣言

    var eqm = JSON.parse(fs.readFileSync('./eq-before.json', 'utf-8'))
    var eqmsindo = eqm.Body.Intensity.MaxInt
    var eqmchimei = eqm.Body.Earthquake.Hypocenter.Name
    var eqmzikoku = eqm.Body.Earthquake.OriginTime
    var eqmhukasa = eqm.Body.Earthquake.Hypocenter.Depth
    var eqmmagnitude = eqm.Body.Earthquake.Magnitude
    var eqmserial = eqm.Head.Serial
    var eqmido = eqm.Body.Earthquake.Hypocenter.Lat
    var eqmkeido = eqm.Body.Earthquake.Hypocenter.Lon
    var eqmeventid = eqm.Head.EventID

    // 震度によりcolor変更、icon変更のあれ
    if (eqmsindo === '7') {
      var embed2color = 0xf40004
      var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_7.png'
    } else {
      if (eqmsindo === '6+') {
        var embed2color = 0xff352b
        var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_6.png'
      } else {
        if (eqmsindo === '6-') {
          var embed2color = 0xff4f1e
          var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_6.png'
        } else {
          if (eqmsindo === '5+') {
            var embed2color = 0xff691e
            var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_5.png'
          } else {
            if (eqmsindo === '5-') {
              var embed2color = 0xff9d1e
              var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_5.png'
            } else {
              if (eqmsindo === '4') {
                var embed2color = 0xffb01e
                var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_4.png'
              } else {
                if (eqmsindo === '3') {
                  var embed2color = 0xffe11e
                  var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_3.png'
                } else {
                  if (eqmsindo === '2') {
                    var embed2color = 0xacff1e
                    var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_2.png'
                  } else {
                    if (eqmsindo === '1') {
                      var embed2color = 0xc1fcff
                      var embed2thumbnail = 'http://toriho-dai.com/img/number/number3_1.png'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log('出力完了')

    // 時刻取得関連の宣言
    var eqtimevars = new Date()
    var fullyear = eqtimevars.getFullYear()
    var month = ('0' + eqtimevars.getMonth() + 1).slice(-2)
    var date = ('0' + eqtimevars.getDate()).slice(-2)
    var datedata = '' + fullyear + month + date
    // メッセージ作成
    bot.createMessage(msg.channel.id, {
      embed: {
        description: '※なお6時間以上前の地震についてはNIED新強震モニタの仕様上画像取得は行えません。',
        author: {
          name: '最終地震速報 [最終報]',
          icon_url: 'http://icooon-mono.com/i/icon_15889/icon_158890_256.png',
          url: 'http://www.kmoni.bosai.go.jp/new/'
        },
        title: '\n過去の地震の内容については以下の通りです。',
        color: embed2color,
        thumbnail: {'url': embed2thumbnail},
        image: {'url': 'http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/' + datedata + '/' + eqmeventid + '.jma_s.gif'},
        fields: [
          {
            name: '**最大震度**',
            value: '震度' + eqmsindo,
            inline: true
          }, {
            name: '**震央地名**',
            value: eqmchimei,
            inline: true
          }, {
            name: '**深さ**',
            value: eqmhukasa + 'km',
            inline: true
          }, {
            name: '**発生時刻**',
            value: eqmzikoku,
            inline: true
          }, {
            name: '**マグニチュード**',
            value: 'M' + eqmmagnitude,
            inline: true
          }, {
            name: '**合計電文数**',
            value: '計' + eqmserial + '報',
            inline: true
          }, {
            name: '**震源位置の緯度**',
            value: '緯度' + eqmido + '度',
            inline: true
          }, {
            name: '**震源位置の経度**',
            value: '経度' + eqmkeido + '度',
            inline: true
          }
        ],

        footer: {
          text: 'Powerd by svir.jp (https://svir.jp/eew/data.json)'
        }
      }
    })
  }
})

bot.on('messageCreate', (msg) => {
  if (msg.content === '/eq pga') {
    // 時刻取得
    var eqtimevars = new Date()
    var fullyear = eqtimevars.getFullYear()
    var month = ('0' + eqtimevars.getMonth() + 1).slice(-2)
    var date = ('0' + eqtimevars.getDate()).slice(-2)
    var hours = ('0' + eqtimevars.getHours()).slice(-2)
    var minutes = ('0' + eqtimevars.getMinutes()).slice(-2)
    var seconds = ('0' + eqtimevars.getSeconds()).slice(-2)
    var timedata = '' + fullyear + month + date + hours + minutes + seconds // ex.)20180117174403
    var datedata = '' + fullyear + month + date // ex.)20180117

    console.log('手動でPGA画像取得が実行されました。\nチャンネルID:' + msg.channel.id + '\n実行したユーザー:' + msg.member.user)
    bot.createMessage(msg.channel.id, {
      embed: {
        description: fullyear + '年' + month + '月' + date + '日' + hours + '時' + minutes + '分' + seconds + '秒取得',
        author: {
          name: 'リアルタイムPGA画像',
          icon_url: 'http://icooon-mono.com/i/icon_15889/icon_158890_256.png',
          url: 'http://www.kmoni.bosai.go.jp/new/'
        },
        color: 0xff9d1e,
        thumbnail: {'url': 'https://pbs.twimg.com/profile_images/580951911337050112/-wD1RBUK.png'},
        image: {'url': 'http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/acmap_s/' + datedata + '/' + timedata + '.acmap_s.gif'},
        timestamp: new Date(),
        footer: {
          text: 'Powerd by NIED (www.bosai.go.jp/)'
        }
      }
    })
  }
})

// 手動で震度画像取得
bot.on('messageCreate', (msg) => {
  if (msg.content === '/eq sindo') {
    // 時刻取得
    var eqtimevars = new Date()
    var fullyear = eqtimevars.getFullYear()
    var month = ('0' + eqtimevars.getMonth() + 1).slice(-2)
    var date = ('0' + eqtimevars.getDate()).slice(-2)
    var hours = ('0' + eqtimevars.getHours()).slice(-2)
    var minutes = ('0' + eqtimevars.getMinutes()).slice(-2)
    var seconds = ('0' + eqtimevars.getSeconds()).slice(-2)
    var timedata = '' + fullyear + month + date + hours + minutes + seconds // ex.)20180117174403
    var datedata = '' + fullyear + month + date // ex.)20180117

    console.log('手動でRealTimeSindo画像取得が実行されました。\nチャンネルID:' + msg.channel.id + '\n実行したユーザー:' + msg.member.user)
    bot.createMessage(msg.channel.id, {
      embed: {
        description: fullyear + '年' + month + '月' + date + '日' + hours + '時' + minutes + '分' + seconds + '秒取得',
        author: {
          name: 'リアルタイム震度画像',
          icon_url: 'http://icooon-mono.com/i/icon_15889/icon_158890_256.png',
          url: 'http://www.kmoni.bosai.go.jp/new/'
        },
        color: 0xff9d1e,
        thumbnail: {'url': 'https://pbs.twimg.com/profile_images/580951911337050112/-wD1RBUK.png'},
        image: {'url': 'http://www.kmoni.bosai.go.jp/new/data/map_img/RealTimeImg/jma_s/' + datedata + '/' + timedata + '.jma_s.gif'},
        timestamp: new Date(),
        footer: {
          text: 'Powerd by NIED (www.bosai.go.jp/)'
        }
      }
    })
  }
})

    // コマンド /eq stats
bot.on('messageCreate', (msg) => {
  if (msg.content === '/eq stats') {
    var qtotalmem = os.totalmem() / 1000000
    var qfreemem = os.freemem() / 1000000
    var totalmem = Math.round(qtotalmem)
    var freemem = Math.round(qfreemem)
    bot.createMessage(msg.channel.id, {
      embed: {
        description: '-------------------------------------------------------------------',
        author: {
          name: 'EEWBot -> Stats'
        },
        title: '\nホストサーバーのステータスを表示します。',
        color: 0x5fabfc,
        fields: [
          {
            name: '**トータルメモリ**',
            value: totalmem + 'MB',
            inline: true
          }, {
            name: '**使用可能メモリ**',
            value: freemem + 'MB',
            inline: true
          }
        ]
      }
    })
  }
})

bot.on('messageCreate', (msg) => {
  if (msg.content === '/eq restert') {
    bot.createMessage(msg.channel.id, 'DiscordEEWBotの再起動を実行します')
    console.log('EEWBotの再起動を実行します')
    setTimeout(function () {
      process.exit()
    }, 1000)
  }
})
// botの稼働時間計測処理ここまで

// コマンド /eq help
bot.on('messageCreate', (msg) => {
  if (msg.content === '/eq help') {
    bot.createMessage(msg.channel.id, {
      embed: {
        description: '-------------------------------------------------------------------',
        author: {
          name: 'EEWBot -> help'
        },
        title: '\nコマンドヘルプメニュー',
        color: 0x5fabfc,
        fields: [
          {
            name: '**/eq**',
            value: '最後にあった地震の情報を表示します。', // 実装済み
            inline: false
          }, {
            name: '**/eq sindo**',
            value: '最新の震度画像をNIDEから取得、表示します。', // 実装済み
            inline: false
          }, {
            name: '**/eq pga**',
            value: '最新のPGA画像をNIDEから取得、表示します。', // 実装済み
            inline: false
          }, {
            name: '**/eq regist**',
            value: '地震速報を自動的に投稿するチャンネルを設定できます。', // 未実装
            inline: false
          }, {
            name: '**/eq stats**',
            value: 'このBotをホストしているサーバーのステータスを表示します。', // 実装済み
            inline: false
          }, {
            name: '**/eq update**',
            value: 'このBotのアップデートログを表示します。', // 実装済み
            inline: false
          }, {
            name: '**/eq dev <key> <commands>**',
            value: 'Devチームのみ実行可能。キーが無いと実行できません。\nなおキーは毎回再発行のため再利用はできません。', // 未実装
            inline: false
          }, {
            name: '**/eq help**',
            value: 'このヘルプメニューです。', // 実装済み
            inline: false
          }
        ],
        footer: {
          text: 'Created by hideki0403#7963'
        }
      }
    })
  }
})

// /eq update
bot.on('messageCreate', (msg) => {
  if (msg.content === '/eq update') {
    bot.createMessage(msg.channel.id, {
      embed: {
        description: updatelog,
        author: {
          name: 'EEWBot -> Update'
        },
        title: '\n :outbox_tray: アップデートログ [EEWBot Ver.' + updatever + ']',
        color: 0x5fabfc
      }
    })
  }
})

// discordへ接続
bot.connect()
