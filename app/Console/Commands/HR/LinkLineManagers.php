<?php

namespace App\Console\Commands\HR;

use App\Models\Employee;
use App\Models\HrProfile;
use Illuminate\Console\Command;

class LinkLineManagers extends Command
{
    protected $signature = 'hr:link-managers
        {--reset : Clear all existing reports_to_employee_id links before re-linking}';

    protected $description = 'Resolve line_manager_name to reports_to_employee_id for all HR profiles';

    public function handle(): int
    {
        if ($this->option('reset')) {
            HrProfile::withoutEvents(fn () => HrProfile::query()->update(['reports_to_employee_id' => null]));
            $this->line('Cleared existing links.');
        }

        // Normalise whitespace and lowercase
        $normalise = fn (string $s): string => mb_strtolower(preg_replace('/\s+/', ' ', trim($s)));
        $stripTitle = fn (string $s): string => preg_replace(
            '/^(dr|mr|mrs|ms|prof|engr?|arc|alh|alhaja|barrister|ag|alhaji)\.\s*/i', '', $s
        );

        $employees = Employee::query()->whereNotNull('name')->select(['id', 'name'])->get();

        // Primary: full normalised name → id
        $nameMap = [];
        // Secondary: "first last" (dropping middle parts) → id, for names with ≥3 parts
        $firstLastMap = [];

        // word-set map: sorted words joined → id (for reordered 3-word names)
        $wordSetMap = [];
        // prefix map: first N words joined → id (for truncated names like "Abubakar Diggi" → "Abubakar Diggi Alhaji")
        $prefixMap = [];

        foreach ($employees as $emp) {
            $norm = $normalise($emp->name);
            $nameMap[$norm] = $emp->id;

            // Also index with leading title stripped (e.g. "dr. mamudu abubakar" → "mamudu abubakar")
            $noTitle = $normalise($stripTitle($norm));
            if ($noTitle !== $norm) {
                $nameMap[$noTitle] ??= $emp->id;
            }

            $parts = explode(' ', $noTitle !== $norm ? $noTitle : $norm);
            $n = count($parts);

            if ($n >= 3) {
                // first + last (forward)
                $fl = $parts[0].' '.$parts[$n - 1];
                $firstLastMap[$fl] ??= $emp->id;

                // last + first (reversed)
                $firstLastMap[$parts[$n - 1].' '.$parts[0]] ??= $emp->id;

                // word-set (sorted) for 3-word names exactly (avoids ambiguity with 2-word sets)
                $sorted = $parts;
                sort($sorted);
                $setKey = implode('|', $sorted);
                $wordSetMap[$setKey] ??= $emp->id;

                // prefix maps: first 2 words, first 3 words (if 4+)
                $prefixMap[implode(' ', array_slice($parts, 0, 2))] ??= $emp->id;
                if ($n >= 4) {
                    $prefixMap[implode(' ', array_slice($parts, 0, 3))] ??= $emp->id;
                }
            }
        }

        $linked = 0;
        $alreadyLinked = 0;
        $selfLink = 0;
        $unresolved = [];

        $profiles = HrProfile::query()
            ->whereNotNull('line_manager_name')
            ->where('line_manager_name', '!=', '')
            ->select(['id', 'employee_id', 'line_manager_name', 'reports_to_employee_id'])
            ->get();

        HrProfile::withoutEvents(function () use ($profiles, $nameMap, $firstLastMap, $wordSetMap, $prefixMap, $normalise, $stripTitle, &$linked, &$alreadyLinked, &$selfLink, &$unresolved) {
            foreach ($profiles as $profile) {
                $key = $normalise($profile->line_manager_name);
                $managerId = null;

                // 1. Exact normalised match
                if (isset($nameMap[$key])) {
                    $managerId = $nameMap[$key];
                }

                // 2. Strip leading honorific from lookup key
                if (! $managerId) {
                    $noTitle = $normalise($stripTitle($key));
                    if ($noTitle !== $key && isset($nameMap[$noTitle])) {
                        $managerId = $nameMap[$noTitle];
                    }
                }

                // 3. Strip middle initials (e.g. "Abdulrahman A. Zayyad" → "Abdulrahman Zayyad")
                if (! $managerId) {
                    $noInitial = trim(preg_replace('/\s+/', ' ', preg_replace('/\s+[a-z]\.\s*/i', ' ', $key)));
                    if ($noInitial !== $key && isset($nameMap[$noInitial])) {
                        $managerId = $nameMap[$noInitial];
                    }
                }

                // 4. First + last word (handles middle-name differences and reversed-name entries)
                if (! $managerId) {
                    $parts = explode(' ', $key);
                    if (count($parts) >= 2) {
                        $fl = $parts[0].' '.$parts[count($parts) - 1];
                        if (isset($firstLastMap[$fl])) {
                            $managerId = $firstLastMap[$fl];
                        }
                    }
                }

                // 5. Reversed two-word name (e.g. "ibrahim dankano" → match "dankano ibrahim")
                if (! $managerId) {
                    $parts = explode(' ', $key);
                    if (count($parts) === 2) {
                        $reversed = $parts[1].' '.$parts[0];
                        if (isset($nameMap[$reversed])) {
                            $managerId = $nameMap[$reversed];
                        }
                    }
                }

                // 6. Prefix match (lookup key is the first N words of a longer stored name)
                if (! $managerId) {
                    $parts = explode(' ', $key);
                    if (count($parts) >= 2 && isset($prefixMap[$key])) {
                        $managerId = $prefixMap[$key];
                    }
                }

                // 7. Word-set match for 3-word names (handles reordered names)
                if (! $managerId) {
                    $parts = explode(' ', $key);
                    if (count($parts) === 3) {
                        $sorted = $parts;
                        sort($sorted);
                        $setKey = implode('|', $sorted);
                        if (isset($wordSetMap[$setKey])) {
                            $managerId = $wordSetMap[$setKey];
                        }
                    }
                }

                if (! $managerId) {
                    $unresolved[] = $profile->line_manager_name;

                    continue;
                }

                // Don't link an employee to themselves
                if ($managerId === $profile->employee_id) {
                    $selfLink++;

                    continue;
                }

                if ($profile->reports_to_employee_id === $managerId) {
                    $alreadyLinked++;

                    continue;
                }

                HrProfile::where('id', $profile->id)->update(['reports_to_employee_id' => $managerId]);
                $linked++;
            }
        });

        $this->info("Linked:   {$linked}");
        $this->info("Already:  {$alreadyLinked}");
        $this->info("Self:     {$selfLink}");
        $this->info('Unresolved: '.count($unresolved));

        if (count($unresolved) > 0) {
            $unique = array_unique($unresolved);
            sort($unique);
            $this->newLine();
            $this->line('<fg=yellow>Unresolved line manager names:</>');
            foreach ($unique as $name) {
                $this->line("  • {$name}");
            }
        }

        return self::SUCCESS;
    }
}
