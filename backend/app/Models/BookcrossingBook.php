<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookcrossingBook extends Model
{
    use HasFactory;

    protected $table = 'bookcrossing_books';

    protected $fillable = [
        'title', 'author', 'description', 'owner_id', 'status',
        'location', 'image', 'taken_by', 'taken_at', 'released_at'
    ];

    protected $casts = [
        'taken_at' => 'datetime',
        'released_at' => 'datetime',
    ];

    const STATUS_AVAILABLE = 'available';
    const STATUS_RESERVED = 'reserved';
    const STATUS_TAKEN = 'taken';

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function takenBy()
    {
        return $this->belongsTo(User::class, 'taken_by');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', self::STATUS_AVAILABLE);
    }
}