<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\PublicHoliday;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicHolidayController extends Controller
{
    public function index(): Response
    {
        $holidays = PublicHoliday::query()
            ->orderBy('date')
            ->get(['id', 'name', 'date', 'description']);

        $byYear = $holidays
            ->groupBy(fn ($h) => $h->date->year)
            ->sortKeysDesc()
            ->map(fn ($items, $year) => ['year' => $year, 'holidays' => $items->values()])
            ->values();

        return Inertia::render('HR/Leave/PublicHolidays', [
            'byYear' => $byYear,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isHr(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'unique:public_holidays,date'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        PublicHoliday::create($validated);

        return back()->with('success', "Public holiday \"{$validated['name']}\" added.");
    }

    public function update(Request $request, PublicHoliday $publicHoliday): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isHr(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'unique:public_holidays,date,'.$publicHoliday->id],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $publicHoliday->update($validated);

        return back()->with('success', 'Public holiday updated.');
    }

    public function destroy(Request $request, PublicHoliday $publicHoliday): RedirectResponse
    {
        abort_unless($request->user()->isAdmin() || $request->user()->isHr(), 403);

        $name = $publicHoliday->name;
        $publicHoliday->delete();

        return back()->with('success', "Public holiday \"{$name}\" removed.");
    }
}
