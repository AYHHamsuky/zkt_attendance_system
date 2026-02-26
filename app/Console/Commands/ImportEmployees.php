<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportEmployees extends Command
{
    protected $signature = 'employees:import {file=employees.md : Path to markdown table file (relative to project root)}';

    protected $description = 'Import / update employees from a Markdown table file (payroll data).';

    public function handle(): int
    {
        $filePath = base_path($this->argument('file'));

        if (! file_exists($filePath)) {
            $this->error("File not found: {$filePath}");

            return self::FAILURE;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        $created = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($lines as $line) {
            // Only process table data rows (start with '|', not header/separator)
            if (! str_starts_with(trim($line), '|')) {
                continue;
            }

            // Skip separator rows like |---|---|...
            if (preg_match('/^\|[\s\-:]+\|/', trim($line))) {
                continue;
            }

            $cells = array_map('trim', explode('|', trim($line, '|')));

            // Expecting: Full Name | Payroll ID | Department | Unit | Position | Region | Location
            if (count($cells) < 5) {
                continue;
            }

            $name = $cells[0];
            $payrollId = trim($cells[1]);
            $department = $cells[2] ?? null;
            $unit = $cells[3] ?? null;
            $position = $cells[4] ?? null;
            $region = $cells[5] ?? null;
            $location = $cells[6] ?? null;

            // Payroll ID must be numeric
            if (! is_numeric($payrollId)) {
                $skipped++;

                continue;
            }

            $uid = (int) $payrollId;

            $exists = \App\Models\Employee::where('uid', $uid)->exists();

            \App\Models\Employee::updateOrCreate(
                ['uid' => $uid],
                [
                    'user_id' => (string) $uid,
                    'name' => $name,
                    'department' => $department ?: null,
                    'unit' => $unit ?: null,
                    'position' => $position ?: null,
                    'region' => $region ?: null,
                    'location' => $location ?: null,
                    'role' => 'user',
                    'is_active' => true,
                ]
            );

            $exists ? $updated++ : $created++;
        }

        $this->info("Import complete: {$created} created, {$updated} updated, {$skipped} skipped.");

        return self::SUCCESS;
    }
}
