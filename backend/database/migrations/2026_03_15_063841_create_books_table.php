<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'author', 'isbn', 'description', 'short_description',
        'publisher', 'publication_year', 'pages', 'language', 'cover_type',
        'format', 'weight', 'price', 'old_price', 'quantity',
        'is_featured', 'is_new', 'is_bestseller', 'is_active', 'genre_id'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_bestseller' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
    ];

    // Связи
    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    public function images()
    {
        return $this->hasMany(BookImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(BookImage::class)->where('is_primary', true);
    }

    public function authors()
    {
        return $this->belongsToMany(Author::class, 'book_author');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Аксессоры
    public function getCoverImageAttribute()
    {
        $primary = $this->primaryImage;
        return $primary ? $primary->image_path : '/images/default-book.jpg';
    }

    public function getDiscountPercentAttribute()
    {
        if ($this->old_price && $this->old_price > $this->price) {
            return round((($this->old_price - $this->price) / $this->old_price) * 100);
        }
        return 0;
    }

    public function getIsInStockAttribute()
    {
        return $this->quantity > 0;
    }

    // Скопы
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('quantity', '>', 0);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    public function scopeBestseller($query)
    {
        return $query->where('is_bestseller', true);
    }

    public function scopeByGenre($query, $genreId)
    {
        return $query->where('genre_id', $genreId);
    }
}