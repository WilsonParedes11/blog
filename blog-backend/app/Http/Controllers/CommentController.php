<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Post $post)
    {
        $comments = $post->comments()->with('user:id,name')->latest()->get();

        return response()->json($comments);
    }

    public function store(Request $request, Post $post)
    {
        $request->validate([
            'content' => 'required|string'
        ]);

        $comment = $post->comments()->create([
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        $comment->load('user:id,name');

        return response()->json($comment, 201);
    }

    public function destroy(Comment $comment)
    {
        // Verificar si el usuario autenticado es el dueño del comentario
        if ($comment->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comentario eliminado correctamente']);
    }
}
