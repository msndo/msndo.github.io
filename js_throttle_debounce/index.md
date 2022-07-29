# Throttle, Debounce


## もの！
### debounce, throttle（codepen）
<a href="https://codepen.io/msndo/pen/GRxOZwN" target="_blank">https://codepen.io/msndo/pen/GRxOZwN</a>


4行目付近を1個ずつ試してみてください！

```
    // 間引きなし
    window.addEventListener('scroll', bindCycleColor);

    // 間引き - debounce
    // window.addEventListener('scroll', debounce(500, bindCycleColor));

    // 間引き - throttle
    // window.addEventListener('scroll', throttle(500, bindCycleColor));
```



## debounce
100個だったら100個のイベントのカタマリがあるとして、
カタマリが途切れてから1秒経ったら処理を実行するとかできる！

```
[001][002][003]…[100] 〜（1秒空いた）〜 ＜実行！＞
```

## throttle
100個のイベントのカタマリがあるとして、カタマリが途切れてない間、一定時間ごとにやりたい処理を実行

```
[001][002][003][004][005][006][007][008][009][010]…[100]
〜（1秒開ける）〜 ＜実行！＞ 〜 （1秒空ける）〜 ＜実行！＞ 
```

## どんな時に使う？
スクロールとリサイズが多いです！
イベントに引っ掛けてやる感じです。
そのほか、キーボードの打鍵（keyup や keypress）で使うケースもあります。

（ブラウザのイベント（待ち受け）の例。知られざるものも相当ある

<a href="https://web-designer.cman.jp/javascript_ref/event_list/" target="_blank">https://web-designer.cman.jp/javascript_ref/event_list/</a>




## 準備
JS上で関数を書いておきます。検索してコピペでもいいですが汗、上のcodepenのでいいかなと
nodeのthrottle-debounceが導入されていればそちらを使いましょう：

<a href="https://www.npmjs.com/package/throttle-debounce" target="_blank">https://www.npmjs.com/package/throttle-debounce</a>


## 使い方！

```
windw.addEventListener('scroll', debounce(1000, nameOfFunction));
```

特にthrottleのほうはどのライブラリやスニペットも設定項目がいくつかある場合が多いですが基本は以下：

```
windw.addEventListener('scroll', throttle(1000, nameOfFunction));
```


## （時間あれば）イベント待受けを解除したい （removeEventListener() したい）場合など

さて、、基本的には上の記法をまる覚えで使っていただいてもいいですが、、

状況によっては一度登録したイベントリスナを解除したい場合もあるわけです。
で
addEventListener() を解除する removeEventListener() がありますがうまくいかないというご経験ある方もいらっしゃると思います。

答えから書いてしまうと以下のようにすると：

```
const debounceLocal = debounce(500, nameOfFunction);
window.addEventListener('scroll', debounceLocal);
```

removeEventListener() が可能になります：

```
window.removeEventListener('scroll', debounceLocal);
```

イベントハンドラは関数なのですが、()つきで記述すると関数を呼び出して動かすという挙動になり、
動かした後はその場で蒸発してしまってremove側に引き継ぐ手がかりが失われるという結果になります。。
関数名だけ指定すると手がかりが残るのでremove側で扱えます。

日頃使っているaddEventListener() ですがハンドラは function() {} の形ではなく名前付き関数・引数なしの形で
定義しておくのが無難となります！
