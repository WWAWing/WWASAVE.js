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

## デモ
* https://info.wwawing.com/wwawing-save/WWASAVE.js/client/

## 必要環境例
* Apache(webサーバ)
* PHP
* MySQL

## 使い方
1. Yarnを入れる
1. /var/www/html上でgit cloneする
1. /server/conf/を作成し、以下のサイトのdbconfig.phpを参考にDB接続情報を記述
http://qiita.com/zaburo/items/9b8aa05c975677669142

1. DBにアクセスして以下のコマンドを入力  
`create database wwasave`
1. /server/sql/内のsavedata.sqlとuser.sqlを実行
```
mysql -u 'Your_user_id' -p < ./server/sql/savedata.sql
mysql -u 'Your_user_id' -p < ./server/sql/user.sql
```
1. フロントエンドのパッケージを入れるため以下のコマンドを入力
```
yarn
yarn run webpack
```
1. /client/index.html にアクセス

## 使い方(Docker)
1. YarnとDockerを入れる
2. `docker-compose.yml` のあるディレクトリで `docker-compose up -d` を実行
3. フロントエンドのパッケージを入れるため上記のコマンド(3.)を入力
4. `http://localhost/client/` にアクセス