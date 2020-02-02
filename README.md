# SimplyNote
Simply Note: it is simple implimentation web Notes with TypeScript and JQuery, it's project created for interview
for run:

```bash
npm i
npm run start
```

# Key: features
1. Create a new note of the specified size at the specified position.
2. Move a note by dragging.
3. Remove a note by dragging it over a predefined "trash" zone.
4. Entering/editing note text.
5. Moving notes to front (in case of overlapping notes).
6. Saving notes to local storage (restoring them on page load).
7. Different note colors.

# Architecture Description:

aap.ts: App class that directly interacts with the template index.html page is used to implement an instance of Notes SimlyNote

simply-note.ts: it assumed that SimplyNotes class is designed as an external library, and encapsulates all logic regarding the interaction Notes

urtils.ts: auxiliary static class that implements utilitnye function, since the data mapping or transformation type
