<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Migrations\FreshCommand;

class RebuildDatabaseSchema extends Command
{
    protected $signature = 'db:rebuild-schema {--seed : Run seeders after rebuilding}';

    protected $description = 'Rebuild the complete database schema from scratch, fixing all migration dependencies';

    public function handle(): int
    {
        $this->info('🔨 Starting comprehensive database rebuild...');

        try {
            // Step 1: Disable foreign key checks
            $this->info('📋 Disabling foreign key checks...');
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            // Step 2: Get all tables
            $tables = DB::select('SHOW TABLES');
            $tableColumn = 'Tables_in_' . DB::getDatabaseName();

            // Step 3: Drop all tables in correct order
            $this->info('🗑️  Dropping all tables...');
            foreach ($tables as $table) {
                $tableName = $table->$tableColumn;
                DB::statement("DROP TABLE IF EXISTS `{$tableName}`");
                $this->line("  ✓ Dropped: {$tableName}");
            }

            // Step 4: Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
            $this->info('✅ Foreign key checks re-enabled');

            // Step 5: Run all migrations
            $this->info('🔄 Running migrations in correct order...');
            $this->call('migrate', ['--force' => true]);

            $this->info('✅ All migrations completed successfully!');

            // Step 6: Optional seeding
            if ($this->option('seed')) {
                $this->info('🌱 Running seeders...');
                $this->call('db:seed', ['--force' => true]);
                $this->info('✅ Seeders completed!');
            }

            $this->newLine();
            $this->info('🎉 Database rebuild complete!');
            $this->info('Your database schema is now fresh and ready to use.');

            return self::SUCCESS;

        } catch (\Exception $e) {
            $this->error('❌ Database rebuild failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
