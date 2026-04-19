<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuids;

class Report extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $casts = [
        'config' => 'array',
    ];

    public function folder()
    {
        return $this->belongsTo(ReportFolder::class, 'folder_id');
    }
}
