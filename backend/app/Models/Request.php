<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class Request extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $casts = [
        'due_at' => 'datetime',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function technician()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function priority()
    {
        return $this->belongsTo(Priority::class);
    }

    public function impact()
    {
        return $this->belongsTo(Impact::class);
    }

    public function urgency()
    {
        return $this->belongsTo(Urgency::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function change()
    {
        return $this->belongsTo(Change::class);
    }

    public function problem()
    {
        return $this->belongsTo(Problem::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
