const vendors = [
  ["V001", "Midwest Packaging Co.", "Net 30"],
  ["V002", "Buckeye Janitorial Supply", "Net 15"],
];

for (const vendor of vendors) {
  const id = vendor[0];
  const name = vendor[1];
  const terms = vendor[2];
  console.log(id + "  " + name + "  (" + terms + ")");
}
