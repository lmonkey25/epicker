<?php

/**
 * MyEpicier API
 * @version 1.0.0
 */
ini_set('display_errors', 1);
require_once __DIR__ . '/lib/FirePHPCore/fb.php';
require_once __DIR__ . '/lib/rb.php';
require_once __DIR__ . '/vendor/autoload.php';

$app = new Slim\App();

/**
 * GET findCommentsById
 * Summary: 
 * Notes: Returns comments based on store id
 * Output-Formats: [application/json, application/xml, text/xml, text/html]
 */
$app->GET('/comments/{store_id}', function($request, $response, $args) {
    // Validate input parameters
    $store_id = $request->getAttribute('store_id');
    if (!is_numeric($store_id)) {
        return $response->withJson(array("code" => 400, "message" => "store_id must be a numeric value"), 400);
    }

    R::setup();
    $comments = R::find('commentobject', ' store_id = ? ', array($store_id));

    if (count($comments) == 0) {
        return $response->withJson(array(), 200);
    }
    return $response->withJson(json_encode($comments), 200);
});


/**
 * GET findStoreById
 * Summary: 
 * Notes: Returns a store based on id
 * Output-Formats: [application/json, application/xml, text/xml, text/html]
 */
$app->GET('/stores/{id}', function($request, $response, $args) {
    // Validate input parameters
    $id = $request->getAttribute('id');
    if (!is_numeric($id)) {
        return $response->withJson(array("code" => 400, "message" => "store_id must be a numeric value"), 400);
    }
    R::setup();
    $store = R::find('storeobject', ' id = ? ', array($id));

    if (count($store) == 0) {
        return $response->withJson(array(), 200);
    }
    return $response->withJson(json_encode($store), 200);
});


/**
 * GET getCoupons
 * Summary: 
 * Notes: Get list of coupons
 * Output-Formats: [application/json, application/xml, text/xml, text/html]
 */
$app->GET('/coupons/{store_id}', function($request, $response, $args) {
    // Validate input parameters
    $store_id = $request->getAttribute('store_id');
    if (!is_numeric($store_id)) {
        return $response->withJson(array("code" => 400, "message" => "store_id must be a numeric value"), 400);
    }
    R::setup();

    $couponobject = R::find('couponobject', ' store_id = ? ', array($store_id));
    $queryParams = $request->getQueryParams();
    $tags = $queryParams['tags'];

    if (count($couponobject) == 0) {
        return $response->withJson(array(), 200);
    }
    return $response->withJson(json_encode($couponobject), 200);
});


/**
 * GET getStores
 * Summary: 
 * Notes: Returns all stores the user can access to
 * Output-Formats: [application/json, application/xml, text/xml, text/html]
 */
$app->GET('/stores', function($request, $response, $args) {
    R::setup();

    $queryParams = $request->getQueryParams();
    $tags = $queryParams['tags'];
    $limit = $queryParams['limit'];

    $stores = R::findAll('storeobject');
    return $response->withJson(json_encode($stores), 200);
});


/**
 * POST postCommentById
 * Summary: 
 * Notes: Inserts a comment based on store id
 * Output-Formats: [application/json, application/xml, text/xml, text/html]
 */
$app->POST('/comments/{store_id}', function($request, $response, $args) {
    $store_id = $request->getAttribute('store_id');
    $allPostPutVars = $request->getParsedBody();

    if (!is_numeric($store_id)) {
        return $response->withJson(array("code" => 400, "message" => "store_id must be a numeric value"), 400);
    }

    $username = $allPostPutVars['username'];
    $comment = $allPostPutVars['comment'];
    $rating = $allPostPutVars['rating'];

    if (!strlen($username)) {
        return $response->withJson(array("code" => 400, "message" => "username must not be empty"), 400);
    }
    if (!strlen($comment)) {
        return $response->withJson(array("code" => 400, "message" => "you must enter a comment"), 400);
    }

    R::setup();
    try {
        $result = R::exec('INSERT INTO commentobject(object_class, store_id, username, contents, rating) VALUES(?,?,?,?,?)', array('CommentObject', $store_id, $username, $comment, $rating));
    } catch (Exception $e) {
        return $response->withJson(array("code" => 400, "message" => $e->getMessage()), 400);
    }
    $id = R::getInsertID();
    return $response->withJson(array("code" => 200, "id" => $id, "message" => "comment inserted with success"), 200);
});


/**
 * POST postOpenedStatus
 * Summary: 
 * Notes: Inserts opened or closed status
 * Output-Formats: [application/json, application/xml, text/xml, text/html]
 */
$app->POST('/opened_status/{store_id}', function($request, $response, $args) {
    $store_id = $request->getAttribute('store_id');
    $allPostPutVars = $request->getParsedBody();
    if (!is_numeric($store_id)) {
        return $response->withJson(array("code" => 400, "message" => "store_id must be a numeric value"), 400);
    }
    $timestamp = time();
    $value = $allPostPutVars['value'];
    if (!is_numeric($value) || !in_array($value, array(0, 1))) {
        return $response->withJson(array("code" => 400, "message" => "value must be equals to 1 or 0"), 400);
    }

    R::setup();
    try {
        $result = R::exec('INSERT INTO opened_status(store_id, timestamp, value) VALUES(?,?,?)', array($store_id, $timestamp, $value));
    } catch (Exception $e) {
        return $response->withJson(array("code" => 400, "message" => $e->getMessage()), 400);
    }
    $id = R::getInsertID();
    return $response->withJson(array("code" => 200, "id" => $id, "message" => "Comment inserted with success"), 200);
});


$app->run();
