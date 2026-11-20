import records from 'virtual:travel';

// The owner edits newest-first; map paths and visit numbers remain chronological.
export const travelStops = [...records].reverse();
