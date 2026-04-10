<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasUuids;

class Priority extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'color'];
}
