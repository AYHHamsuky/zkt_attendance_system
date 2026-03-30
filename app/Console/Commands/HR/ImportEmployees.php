<?php

namespace App\Console\Commands\HR;

use App\Models\Employee;
use App\Models\HrProfile;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ImportEmployees extends Command
{
    protected $signature = 'hr:import-employees {file? : Path to the CSV file}';

    protected $description = 'Import employees from the Kaduna Electric nominal roll CSV';

    public function handle(): int
    {
        $path = $this->argument('file')
            ?? base_path('Employee Record - Sheet1.csv');

        if (! file_exists($path)) {
            $this->error("File not found: {$path}");

            return self::FAILURE;
        }

        $handle = fopen($path, 'r');

        if (! $handle) {
            $this->error('Could not open file.');

            return self::FAILURE;
        }

        // Skip the header row (fgetcsv handles multi-line quoted fields automatically)
        fgetcsv($handle);

        $created = 0;
        $updated = 0;
        $skipped = 0;

        $this->info('Importing employees...');
        $bar = $this->output->createProgressBar();
        $bar->start();

        while (($cols = fgetcsv($handle)) !== false) {
            // Skip empty or malformed rows
            if (count($cols) < 15 || empty(trim($cols[1] ?? ''))) {
                $skipped++;
                $bar->advance();

                continue;
            }

            $payrollId = trim($cols[2] ?? '');
            $fullName = trim($cols[1] ?? '');

            if (empty($payrollId) || empty($fullName)) {
                $skipped++;
                $bar->advance();

                continue;
            }

            $email = trim($cols[18] ?? '');
            if ($email === '#ERROR!' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $email = null;
            }

            $startDate = null;
            $rawDate = trim($cols[12] ?? '');
            if (! empty($rawDate)) {
                try {
                    $startDate = Carbon::createFromFormat('n/j/Y', $rawDate)->toDateString();
                } catch (\Exception) {
                    try {
                        $startDate = Carbon::parse($rawDate)->toDateString();
                    } catch (\Exception) {
                        $startDate = null;
                    }
                }
            }

            // Normalise multiline department/unit values
            $department = preg_replace('/\s*\n\s*/', ' ', trim($cols[7] ?? ''));
            $unit = preg_replace('/\s*\n\s*/', ' ', trim($cols[8] ?? ''));

            $isNew = ! Employee::where('user_id', $payrollId)->exists();

            $employee = Employee::withoutEvents(fn () => Employee::updateOrCreate(
                ['user_id' => $payrollId],
                [
                    'uid' => (int) $payrollId,
                    'name' => $fullName,
                    'email' => $email,
                    'phone' => trim($cols[19] ?? '') ?: null,
                    'department' => $department ?: null,
                    'unit' => $unit ?: null,
                    'position' => trim($cols[9] ?? '') ?: null,
                    'role' => 'user',
                    'card_number' => 0,
                    'has_fingerprint' => false,
                    'is_active' => true,
                    'region' => trim($cols[13] ?? '') ?: null,
                    'location' => trim($cols[14] ?? '') ?: null,
                ]
            ));

            HrProfile::updateOrCreate(
                ['employee_id' => $employee->id],
                [
                    'payroll_id' => $payrollId,
                    'title' => trim($cols[3] ?? '') ?: null,
                    'last_name' => trim($cols[4] ?? '') ?: null,
                    'middle_name' => trim($cols[5] ?? '') ?: null,
                    'first_name' => trim($cols[6] ?? '') ?: null,
                    'job_grade' => trim($cols[10] ?? '') ?: null,
                    'job_level' => trim($cols[11] ?? '') ?: null,
                    'division' => trim($cols[15] ?? '') ?: null,
                    'line_manager_name' => trim($cols[16] ?? '') ?: null,
                    'line_manager_phone' => trim($cols[17] ?? '') ?: null,
                    'start_date' => $startDate,
                    'marital_status' => $this->normaliseMaritalStatus(trim($cols[20] ?? '')),
                ]
            );

            $isNew ? $created++ : $updated++;
            $bar->advance();
        }

        fclose($handle);
        $bar->finish();
        $this->newLine();

        $this->info("Done! Created: {$created} | Updated: {$updated} | Skipped: {$skipped}");

        return self::SUCCESS;
    }

    private function normaliseMaritalStatus(string $value): ?string
    {
        $lower = strtolower(trim($value));

        return match (true) {
            str_starts_with($lower, 'married') => 'married',
            str_starts_with($lower, 'single') => 'single',
            str_starts_with($lower, 'divorced') => 'divorced',
            str_starts_with($lower, 'widow') => 'widowed',
            default => null,
        };
    }
}
