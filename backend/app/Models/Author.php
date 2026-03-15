<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'bio', 'birth_date', 'death_date', 'photo'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'death_date' => 'date',
    ];

    public function books()
    {
        return $this->belongsToMany(Book::class, 'book_author');
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}