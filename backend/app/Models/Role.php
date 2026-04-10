<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasUuids;

class Role extends Model
{
    use HasUuids;

    protected $fillable = ['name'];
}
