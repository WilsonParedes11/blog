<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['user:id,name', 'categories:id,name'])
                     ->withCount('comments')
                     ->latest();

        // Filtrar por categoría si se proporciona
        if ($request->has('category')) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }

        $posts = $query->paginate(10);

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'categories' => 'sometimes|array'
        ]);

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        if ($request->has('categories')) {
            $post->categories()->attach($request->categories);
        }

        return response()->json($post, 201);
    }

    public function show(Post $post)
    {
        $post->load(['user:id,name', 'comments.user:id,name', 'categories:id,name']);

        return response()->json($post);
    }

    public function update(Request $request, Post $post)
    {
        // Verificar si el usuario autenticado es el dueño del post
        if ($post->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'categories' => 'sometimes|array'
        ]);

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        if ($request->has('categories')) {
            $post->categories()->sync($request->categories);
        }

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        // Verificar si el usuario autenticado es el dueño del post
        if ($post->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post eliminado correctamente']);
    }
}
