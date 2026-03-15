<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'event_type', 'author_id',
        'start_date', 'end_date', 'location', 'max_participants',
        'registered_count', 'price', 'image', 'is_active'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function getAvailableSeatsAttribute()
    {
        if (!$this->max_participants) {
            return null; // без ограничений
        }
        return $this->max_participants - $this->registered_count;
    }

    public function getIsFullAttribute()
    {
        if (!$this->max_participants) {
            return false;
        }
        return $this->registered_count >= $this->max_participants;
    }
}