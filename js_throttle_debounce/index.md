# Throttle, Debounce


## もの！
### debounce, throttle（codepen）
https://codepen.io/msndo/pen/GRxOZwN

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

## 準備
JS上で関数を書いておきます。検索してコピペでもいいですが汗、上のcodepenのでいいかなと

CONNECTでは「検索してコピペ」は不要！yarnでプリインストールされてます（はず！）。

## 使い方！

```
windw.addEventListener('scroll', debounce(1000, nameOfFunction));
```

```
windw.addEventListener('scroll', throttle(1000, nameOfFunction));
```





## 「関数を渡す」ということについて

さて、、上の記法をまる覚えで使っていただいてもいいですが、、

addEventListener() は
addEventListener(stringForNameOfEvent, function)

で、第2引数は「イベントハンドラ」でこれは処理を束にした「関数」なんですわ。

よく出る書式は：

### 1.

```
button.addEventListener('click', function() {
  container.style.backgroundColor = '#FF0000';
});
```

あるいは

### 2.

```
button.addEventListener('click', paintRed);

function paintRed() {
  container.style.backgroundColor = '#FF0000';
}
```

2つめの方の

```
button.addEventListener('click', paintRed);
```

は関数を渡しているのに括弧がなくて気持ち悪かったりするんですが
VanillaJSだと2つめの方がいいかなと思います。イベントハンドラはベタがきせず独立関数にした方がいい。
なんでかというと removeEventListener をやりやすくできるから、です。

```
button.removeEventListener('click', paintRed);
```

こっちだと取り消しコマンド removeEventListener() が書けない

```
button.addEventListener('click', function() {
  container.style.backgroundColor = '#FF0000';
});
```

```
button.removeEventListener('click', ぐぬぬ);
```

処理が名前の元にまとまってて一意特定ができる状態が必要なのです。
function() {} の形で書くとその場で蒸発してしまい取り消しの手がかりがなくなってしまう。


さて、debounceとthrottle に立ち戻ると：

```
windw.addEventListener('scroll', debounce(1000, nameOfFunction));
```

```
windw.addEventListener('scroll', throttle(1000, nameOfFunction));
```


