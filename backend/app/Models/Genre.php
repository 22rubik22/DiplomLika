<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'parent_id', 
        'image', 'sort_order', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Связи
    public function books()
    {
        return $this->hasMany(Book::class);
    }

    public function parent()
    {
        return $this->belongsTo(Genre::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Genre::class, 'parent_id');
    }

    // Аксессоры
    public function getFullNameAttribute()
    {
        if ($this->parent) {
            return $this->parent->name . ' → ' . $this->name;
        }
        return $this->name;
    }
}