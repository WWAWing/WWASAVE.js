<?php
declare(strict_types=1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Illuminate\Database\Eloquent\Model;
require './vendor/autoload.php';

$app = new \Slim\App();

// ワンタイムトークン生成
function oneTimeToken(){
	return bin2hex( openssl_random_pseudo_bytes(255) );
}
// sha512で暗号化
function sha512_hash(string $pass):string {
	return hash("sha512", $pass);
}
// 入IDとトークンをhmacで暗号化して返す
function sha512_hmac(int $id, string $token):string {
	return hash_hmac("sha512", $token, (string)$id);
}

$app->get('/',function(){
	
});

// ユーザ新規登録
$app->post('/user_reg/',function(Request $request, Response $response){
	// DB情報取得
	require './conf/dbconfig.php';
	// Content-type:application/json指定
	$response = $response->withHeader('Content-type', 'application/json');
	// 送信チェックリスト
	$registrations =  $request->getParsedBody();
	$check_list = array('id', 'password');
	try{
		for($i=0; $i<count( $check_list ); $i++){
			if( !array_key_exists($check_list[$i], $registrations) ){
				throw new Exception($check_list[$i]." is nothing", 1);
			}
		}
		// パスワードの長さをチェックする
		if( strlen($registrations['password']) < 6 ){
			throw new Exception("password must be at least 6 characters", 2);
		}
		// IDが既に登録されているか確認
		if( count( $capsule::table('user')->where('id', '=', $registrations["id"])->get() ) !== 0 ){
			throw new Exception("ID already exists", 3);
		}
		// パスワードをsha512でハッシュ化
		$sha512_pass = sha512_hash($registrations["password"]);
		// ワンタイムトークンを生成
		$oneTimeToken = oneTimeToken();
		// DBに登録
		$capsule::table('user')->insert([
			'id' => $registrations["id"],
			'password' => $sha512_pass,
			'token' => $oneTimeToken
		]);
		// response
		$res = array(
			"token" => $oneTimeToken
		);
		$res_json = json_encode($res);
		$response->getBody()->write( $res_json );
	} catch(Exception $e){
		// 400を返す
		$response = $response->withStatus(400);
		$res = array(
			"code" => $e->getCode(),
			"message" => $e->getMessage(),
		);
		$res_json = json_encode($res);
		$response->getBody()->write( $res_json );
	}
	return $response;
});

// ユーザログイン
$app->post('/login/',function(Request $request, Response $response){
	// DB情報取得
	require './conf/dbconfig.php';
	// Content-type:application/json指定
	$response = $response->withHeader('Content-type', 'application/json');
	// 送信チェックリスト
	$registrations =  $request->getParsedBody();
	$check_list = array('id', 'password');
	try{
		for($i=0; $i<count( $check_list ); $i++){
			if( !array_key_exists($check_list[$i], $registrations) ){
				throw new Exception($check_list[$i]." is nothing", 1);
			}
		}
		// IDが既に登録されているか確認
		$user = $capsule::table('user')->where('id', '=', $registrations["id"])->get();
		if( count( $user ) === 0 ){
			throw new Exception("ID is not exists", 2);
		}
		// パスワードをsha512でハッシュ化
		$sha512_pass = sha512_hash($registrations["password"]);
		// パスワードが一致するかチェック
		if( $user['0']->password !== $sha512_pass ){
			throw new Exception("Password is incorrect", 3);
		}
		// 新しいワンタイムトークンの生成
        $new_token = oneTimeToken();
        // one time token , login_count , last login timeの更新
        // TODO : fillメソッドを使って書き直す
        $capsule::table('user')->where([
			['id', '=', $user['0']->id ]
        ])->update([
			'token' => $new_token,
			'login_count' => $user['0']->login_count + 1,
			'last_login' => new DateTime()
		]);
		$response = $response->withStatus(200);
		$res = array(
			"token" => $new_token
		);
		$res_json = json_encode($res);
		$response->getBody()->write( $res_json );
	} catch(Exception $e){
		// 400を返す
		$response = $response->withStatus(400);
		$res = array(
			"code" => $e->getCode(),
			"message" => $e->getMessage(),
		);
		$res_json = json_encode($res);
		$response->getBody()->write( $res_json );
	}
	return $response;
});

// ユーザログアウト
// TODO : ワンタイムトークンを更新する

// セーブ

// ロード

// セーブ削除

// ユーザ削除

$app->run();
