<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class CI extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function type()
    {
        return $this->belongsTo(CIType::class, 'type_id');
    }
}
