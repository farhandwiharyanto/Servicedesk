<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class Site extends Model
{
    use HasUuids;
    protected $guarded = [];
}
