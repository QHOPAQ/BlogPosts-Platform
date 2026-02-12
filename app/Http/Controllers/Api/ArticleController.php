<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        return Article::latest()->get();
    }

    public function show(Article $article)
    {
        return $article->load([
            'comments' => fn($q) => $q->oldest()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article = Article::create($data);

        return response()->json($article, 201);
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $article->update($data);

        return response()->json($article);
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return response()->noContent();
    }

    public function addComment(Request $request, Article $article)
    {
        $data = $request->validate([
            'author_name' => 'required|string|max:100',
            'content'     => 'required|string|max:2000',
        ]);

        $comment = $article->comments()->create($data);

        return response()->json($comment, 201);
    }
}