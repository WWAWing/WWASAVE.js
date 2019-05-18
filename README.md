# WWASAVE.js
天使の血悪魔の涙さんの[WWA SAVE CGI](http://tenaku.sakura.ne.jp/materia/script/wwa/save.html)のJS移植版スクリプト、互換性はありません

## 特徴
* パスワードをメモする必要がなく、ブラウザを閉じてもそのままゲームに復帰することができます。

## 本家との違い
### メリット
* 1ユーザに対し、複数セーブを保存できる
* 各セーブに対しコメントを残せるため、どのセーブかが一目瞭然
* cgiが使えない環境でも動作する
* パスワードセーブなため、ステータスやアイテムは勿論、イベントによって変更されたマップの状態まで保存できる

### デメリット
* CSSがへぼい
* DBとPHPが使える環境でないと動作しない
* トランザクション考慮してないので不具合が起きそう
* 1つのスクリプトに対し1つのWWAしか対応していない、複数のWWAマップ間でデータを共有するような使い方はできない

## 使い方（Dockerを使う方法）
1. 任意の場所で git cloneする
1. `docker-compose up -d`
1. `http://your_ip_addr:8080/client/` にアクセス

## 使い方（Dockerを使わない方法）
1. /var/www/html上でgit cloneする
1. DBにアクセスして以下のコマンドを入力  
`create database wwasave`
1. /server/sql/内のsavedata.sqlとuser.sqlを実行
```
mysql -u 'Your_user_id' -p < ./server/sql/savedata.sql
mysql -u 'Your_user_id' -p < ./server/sql/user.sql
```
1. `./server/conf/dbconfig.php` の設定をお使いのDBに合わせる
1. /client/index.html にアクセス
