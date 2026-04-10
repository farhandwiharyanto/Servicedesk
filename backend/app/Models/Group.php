<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasUuids;

class Group extends Model
{
    use HasUuids;

    protected $fillable = ['name'];
}
