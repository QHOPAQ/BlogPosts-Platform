<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController as Api;

Route::prefix('articles')->group(function () {

    Route::get('/', [Api::class, 'index']);
    Route::get('{article}', [Api::class, 'show']);

    Route::post('/', [Api::class, 'store']);
    Route::match(['put', 'patch'], '{article}', [Api::class, 'update']);
    Route::delete('{article}', [Api::class, 'destroy']);

    Route::post('{article}/comments', [Api::class, 'addComment']);
});