<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class ReportFolder extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function reports()
    {
        return $this->hasMany(Report::class, 'folder_id');
    }
}
