<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasUuids;

class Status extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'type'];
}
