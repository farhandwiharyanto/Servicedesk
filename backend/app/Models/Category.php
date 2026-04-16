<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class Category extends Model
{
    use HasUuids;
    protected $guarded = [];
}
